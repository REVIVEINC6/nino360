"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hasPermission } from "@/lib/rbac/server"
import { verifyHashChain } from "@/lib/hash"
import { generateText } from "ai"
import { z } from "zod"
import { PERMISSIONS } from "@/lib/rbac/permissions" // Fixed import path to use correct location

const DateRangeSchema = z
  .object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  })
  .refine(
    (data) => {
      const from = new Date(data.from)
      const to = new Date(data.to)
      const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
      return diffDays <= 180
    },
    { message: "Date range cannot exceed 180 days" },
  )

const OwnerFilterSchema = z.enum(["me", "team", "all"])

export async function getContext() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single()

  if (!profile?.tenant_id) {
    // Provide a development-only fallback context to keep UI interactive when
    // a tenant isn't present locally. Production remains strict.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[crm dashboard] No tenant found; returning dev fallback context")
      return {
        tenantId: null,
        userId: user.id,
        features: { copilot: false, reports: false, audit: false },
      }
    }
    throw new Error("No tenant found")
  }

  const [copilot, reports, audit] = await Promise.all([
    hasPermission(PERMISSIONS.TENANT_DASHBOARD_VIEW), // Using existing permission
    hasPermission(PERMISSIONS.REPORTS_VIEW),
    hasPermission(PERMISSIONS.ADMIN_AUDIT_READ),
  ])

  return {
    tenantId: profile.tenant_id,
    userId: user.id,
    features: {
      copilot,
      reports,
      audit,
    },
  }
}

export async function getKpis({ from, to }: { from: string; to: string }) {
  const validated = DateRangeSchema.parse({ from, to })
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  // Get current period data
  const { data: opportunities } = await supabase
    .from("crm_opportunities")
    .select("amount, stage, probability, created_at, close_date")
    .eq("tenant_id", tenantId)
    .gte("created_at", validated.from)
    .lte("created_at", validated.to)

  // Get previous period for deltas
  const fromDate = new Date(validated.from)
  const toDate = new Date(validated.to)
  const periodDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  const prevFrom = new Date(fromDate.getTime() - periodDays * 24 * 60 * 60 * 1000).toISOString()
  const prevTo = validated.from

  const { data: prevOpportunities } = await supabase
    .from("crm_opportunities")
    .select("amount, stage, probability, created_at, close_date")
    .eq("tenant_id", tenantId)
    .gte("created_at", prevFrom)
    .lte("created_at", prevTo)

  const pipeline = opportunities?.reduce((sum: number, opp: any) => sum + (opp.amount || 0), 0) || 0
  const prevPipeline = prevOpportunities?.reduce((sum: number, opp: any) => sum + (opp.amount || 0), 0) || 0

  const wonOpps = opportunities?.filter((o: any) => o.stage === "closed_won") || []
  const mtdRevenue = wonOpps.reduce((sum: number, opp: any) => sum + (opp.amount || 0), 0)
  const prevWonOpps = prevOpportunities?.filter((o: any) => o.stage === "closed_won") || []
  const prevRevenue = prevWonOpps.reduce((sum: number, opp: any) => sum + (opp.amount || 0), 0)

  const totalClosed = opportunities?.filter((o: any) => o.stage === "closed_won" || o.stage === "closed_lost").length || 0
  const winRate = totalClosed > 0 ? (wonOpps.length / totalClosed) * 100 : 0
  const prevTotalClosed =
    prevOpportunities?.filter((o: any) => o.stage === "closed_won" || o.stage === "closed_lost").length || 0
  const prevWinRate = prevTotalClosed > 0 ? (prevWonOpps.length / prevTotalClosed) * 100 : 0

  const avgCycleDays =
    wonOpps.length > 0
      ? wonOpps.reduce((sum: number, opp: any) => {
          const created = new Date(opp.created_at).getTime()
          const closed = new Date(opp.close_date || new Date()).getTime()
          return sum + (closed - created) / (1000 * 60 * 60 * 24)
        }, 0) / wonOpps.length
      : 0

  const prevAvgCycleDays =
    prevWonOpps.length > 0
      ? prevWonOpps.reduce((sum: number, opp: any) => {
          const created = new Date(opp.created_at).getTime()
          const closed = new Date(opp.close_date || new Date()).getTime()
          return sum + (closed - created) / (1000 * 60 * 60 * 24)
        }, 0) / prevWonOpps.length
      : 0

  return {
    pipeline,
    mtdRevenue,
    winRate,
    avgCycleDays: Math.round(avgCycleDays),
    deltas: {
      pipeline: prevPipeline > 0 ? ((pipeline - prevPipeline) / prevPipeline) * 100 : 0,
      mtdRevenue: prevRevenue > 0 ? ((mtdRevenue - prevRevenue) / prevRevenue) * 100 : 0,
      winRate: winRate - prevWinRate,
      avgCycleDays: avgCycleDays - prevAvgCycleDays,
    },
  }
}

export async function getPipelineHealth({ from, to }: { from: string; to: string }) {
  const validated = DateRangeSchema.parse({ from, to })
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const { data: opportunities } = await supabase
    .from("crm_opportunities")
    .select("stage, amount, updated_at")
    .eq("tenant_id", tenantId)
    .gte("created_at", validated.from)
    .lte("created_at", validated.to)
    .neq("stage", "closed_won")
    .neq("stage", "closed_lost")

  const byStage =
    opportunities?.reduce(
      (acc: Array<{ stage: string; count: number; amount: number }>, opp: any) => {
        const existing = acc.find((s: { stage: string }) => s.stage === opp.stage)
        if (existing) {
          existing.count++
          existing.amount += opp.amount || 0
        } else {
          acc.push({ stage: opp.stage, count: 1, amount: opp.amount || 0 })
        }
        return acc
      },
      [] as Array<{ stage: string; count: number; amount: number }>,
    ) || []

  const now = Date.now()
  const aging =
    opportunities?.reduce(
      (acc: Array<{ bucket: "0-7" | "8-14" | "15-30" | "30+"; count: number; amount: number }>, opp: any) => {
        const daysSinceUpdate = (now - new Date(opp.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        let bucket: "0-7" | "8-14" | "15-30" | "30+" = "0-7"
        if (daysSinceUpdate > 30) bucket = "30+"
        else if (daysSinceUpdate > 15) bucket = "15-30"
        else if (daysSinceUpdate > 7) bucket = "8-14"

  const existing = acc.find((a: { bucket: string }) => a.bucket === bucket)
        if (existing) {
          existing.count++
          existing.amount += opp.amount || 0
        } else {
          acc.push({ bucket, count: 1, amount: opp.amount || 0 })
        }
        return acc
      },
      [] as Array<{ bucket: "0-7" | "8-14" | "15-30" | "30+"; count: number; amount: number }> ,
    ) || []

  return { byStage, aging }
}

export async function getForecast({ horizonDays = 90 }: { horizonDays?: number }) {
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + horizonDays)

  const { data: opportunities } = await supabase
    .from("crm_opportunities")
    .select("close_date, amount, probability, stage")
    .eq("tenant_id", tenantId)
    .lte("close_date", endDate.toISOString())
    .neq("stage", "closed_won")
    .neq("stage", "closed_lost")

  const series: Array<{ date: string; commit: number; best: number; pipeline: number }> = []
  const confBand: Array<{ date: string; low: number; high: number }> = []

  for (let i = 0; i <= horizonDays; i += 7) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]

    const oppsClosingByDate = opportunities?.filter((o: any) => new Date(o.close_date) <= date) || []

    const commit = oppsClosingByDate
      .filter((o: any) => (o.probability || 0) >= 80)
      .reduce((sum: number, o: any) => sum + (o.amount || 0) * ((o.probability || 0) / 100), 0)

    const best = oppsClosingByDate
      .filter((o: any) => (o.probability || 0) >= 50)
      .reduce((sum: number, o: any) => sum + (o.amount || 0) * ((o.probability || 0) / 100), 0)

  const pipeline = oppsClosingByDate.reduce((sum: number, o: any) => sum + (o.amount || 0), 0)

    series.push({ date: dateStr, commit, best, pipeline })
    confBand.push({
      date: dateStr,
      low: commit * 0.8,
      high: best * 1.2,
    })
  }

  return { series, confBand }
}

export async function getActivities({ limit = 20 }: { limit?: number }) {
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const { data: activities } = await supabase
    .from("crm_activities")
    .select(`
      id,
      type,
      subject,
      created_at,
      owner_id,
      entity_type,
      entity_id,
      profiles:owner_id(full_name)
    `)
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(limit)

  return (
    activities?.map((a: any) => ({
      ts: a.created_at,
      type: a.type,
      subject: a.subject,
      owner: a.profiles?.full_name || "Unknown",
      entity: a.entity_type,
      entity_id: a.entity_id,
    })) || []
  )
}

export async function getTasks({ myOnly = false }: { myOnly?: boolean }) {
  const supabase = await createServerClient()
  const { tenantId, userId } = await getContext()

  let query = supabase
    .from("crm_tasks")
    .select(`
      id,
      title,
      due_date,
      status,
      owner_id,
      profiles:owner_id(full_name)
    `)
    .eq("tenant_id", tenantId)
    .eq("status", "open")
    .order("due_date", { ascending: true })

  if (myOnly) {
    query = query.eq("owner_id", userId)
  }

  const { data: tasks } = await query

  return (
    tasks?.map((t: any) => ({
      id: t.id,
      title: t.title,
      due_date: t.due_date,
      status: t.status,
      owner: t.profiles?.full_name || "Unassigned",
    })) || []
  )
}

export async function getTopDeals({ limit = 10 }: { limit?: number }) {
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const { data: opportunities } = await supabase
    .from("crm_opportunities")
    .select(`
      id,
      name,
      stage,
      amount,
      probability,
      close_date,
      owner_id,
      profiles:owner_id(full_name, avatar_url)
    `)
    .eq("tenant_id", tenantId)
    .neq("stage", "closed_won")
    .neq("stage", "closed_lost")
    .order("amount", { ascending: false })
    .limit(limit)

  return (
    opportunities?.map((o: any) => ({
      id: o.id,
      name: o.name,
      stage: o.stage,
      amount: o.amount || 0,
      probability: o.probability || 0,
      close_date: o.close_date,
      owner: o.profiles?.full_name || "Unassigned",
      avatar: o.profiles?.avatar_url,
    })) || []
  )
}

export async function getAtRisk({ limit = 10 }: { limit?: number }) {
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const { data: opportunities } = await supabase
    .from("crm_opportunities")
    .select(`
      id,
      name,
      amount,
      close_date,
      updated_at,
      probability,
      stage
    `)
    .eq("tenant_id", tenantId)
    .neq("stage", "closed_won")
    .neq("stage", "closed_lost")

  const now = Date.now()
  const atRisk =
    opportunities
      ?.map((o: any) => {
        const daysSinceUpdate = (now - new Date(o.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        const daysToClose = (new Date(o.close_date).getTime() - now) / (1000 * 60 * 60 * 24)

        let reason: "stale" | "pushout" | "low-prob" | "no-activity" = "no-activity"
        if (daysSinceUpdate > 14) reason = "stale"
        else if (daysToClose < 0) reason = "pushout"
        else if ((o.probability || 0) < 30) reason = "low-prob"

        return {
          id: o.id,
          name: o.name,
          reason,
          days_stale: Math.round(daysSinceUpdate),
          amount: o.amount || 0,
        }
      })
      .filter((o: any) => o.days_stale > 7 || o.reason === "pushout" || o.reason === "low-prob")
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, limit) || []

  return atRisk
}

export async function getAuditMini({ limit = 6 }: { limit?: number }) {
  const { features } = await getContext()
  if (!features.audit) return []

  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const { data: audits } = await supabase
    .from("app_audit_log")
    .select("id, created_at, action, entity_type, entity_id, hash")
    .eq("tenant_id", tenantId)
    .like("action", "crm.%")
    .order("created_at", { ascending: false })
    .limit(limit)

  return (
    audits?.map((a: any) => ({
      ts: a.created_at,
      action: a.action,
      entity: a.entity_type,
      id: a.entity_id,
      hash: a.hash,
    })) || []
  )
}

export async function verifyHash(hash: string) {
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const { data: record } = await supabase
    .from("app_audit_log")
    .select("*")
    .eq("hash", hash)
    .eq("tenant_id", tenantId)
    .single()

  if (!record) {
    return { valid: false, error: "Record not found" }
  }

  const { data: prevRecord } = await supabase
    .from("app_audit_log")
    .select("hash")
    .eq("tenant_id", tenantId)
    .lt("created_at", record.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // verifyHashChain expects (prevHash, expectedPrevHash)
  const isValid = verifyHashChain(record.prev_hash || "", prevRecord?.hash || "")

  return {
    valid: isValid,
    record: {
      action: record.action,
      entity: record.entity_type,
      timestamp: record.created_at,
      user: record.user_id,
    },
  }
}

export async function aiDigest({ from, to }: { from: string; to: string }) {
  const { features } = await getContext()
  if (!features.copilot) {
    throw new Error("AI Copilot feature not enabled")
  }

  const validated = DateRangeSchema.parse({ from, to })
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  // Gather data for AI analysis
  const [kpis, pipeline, activities, atRisk] = await Promise.all([
    getKpis({ from: validated.from, to: validated.to }),
    getPipelineHealth({ from: validated.from, to: validated.to }),
    getActivities({ limit: 10 }),
    getAtRisk({ limit: 5 }),
  ])

  const context = `
CRM Performance Summary (${validated.from} to ${validated.to}):
- Pipeline: $${(kpis.pipeline / 1000).toFixed(1)}K (${kpis.deltas.pipeline > 0 ? "+" : ""}${kpis.deltas.pipeline.toFixed(1)}%)
- MTD Revenue: $${(kpis.mtdRevenue / 1000).toFixed(1)}K (${kpis.deltas.mtdRevenue > 0 ? "+" : ""}${kpis.deltas.mtdRevenue.toFixed(1)}%)
- Win Rate: ${kpis.winRate.toFixed(1)}% (${kpis.deltas.winRate > 0 ? "+" : ""}${kpis.deltas.winRate.toFixed(1)}%)
- Avg Cycle: ${kpis.avgCycleDays} days

Pipeline by Stage:
  ${pipeline.byStage.map((s: any) => `- ${s.stage}: ${s.count} deals, $${(s.amount / 1000).toFixed(1)}K`).join("\n")}

Recent Activities: ${activities.length} activities logged
At-Risk Deals: ${atRisk.length} deals need attention

Analyze this data and provide:
1. Key insights (2-3 bullet points)
2. Recommended actions (2-3 specific actions)
3. Overall health assessment
`

  const { text, usage } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt: context,
    maxTokens: 500,
  })

  // Log AI usage to audit
  await supabase.from("app_audit_log").insert({
    tenant_id: tenantId,
    action: "crm.dashboard:digest",
    entity_type: "ai_usage",
    metadata: {
      tokens: usage?.totalTokens || 0,
      model: "gpt-4o-mini",
    },
  })

  return {
    text,
    actions: [
      { label: "Review At-Risk Deals", href: "/crm/opportunities?filter=at-risk" },
      { label: "Update Stale Opportunities", href: "/crm/opportunities?filter=stale" },
      { label: "View Full Pipeline", href: "/crm/opportunities" },
    ],
    tokens: usage?.totalTokens || 0,
    cost: ((usage?.totalTokens || 0) * 0.00015) / 1000, // Approximate cost
  }
}

export async function completeTask(taskId: string) {
  const supabase = await createServerClient()
  const { tenantId } = await getContext()

  const { error } = await supabase
    .from("crm_tasks")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("id", taskId)
    .eq("tenant_id", tenantId)

  if (error) throw error

  return { success: true }
}
