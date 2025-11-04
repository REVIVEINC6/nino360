"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hasFeatures, maskFieldsArray } from "@/lib/fbac"
import { appendAudit } from "@/lib/hash"
import { generateCsv } from "@/lib/export/csv"
import { z } from "zod"

const filterSchema = z.object({
  from: z.string(),
  to: z.string(),
  orgId: z.string().optional(),
  locationId: z.string().optional(),
  employeeType: z.string().optional(),
  band: z.string().optional(),
  grade: z.string().optional(),
  managerId: z.string().optional(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
})

export async function getOverview(input: z.infer<typeof filterSchema>) {
  const parsed = filterSchema.parse(input)
  const supabase = await createServerClient()
  const permissions = await hasFeatures(["analytics.hr", "analytics.finance_adjacent", "hrms.rates.read"])

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get tenant_id
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No tenant found")

  // Fetch overview KPIs
  const { data: headcountData } = await supabase
    .from("fact_headcount")
    .select("active_count, joiners, leavers")
    .gte("date_key", parsed.from)
    .lte("date_key", parsed.to)

  const totalHeadcount = headcountData?.reduce((sum: number, row: any) => sum + (row.active_count || 0), 0) || 0
  const totalJoiners = headcountData?.reduce((sum: number, row: any) => sum + (row.joiners || 0), 0) || 0
  const totalLeavers = headcountData?.reduce((sum: number, row: any) => sum + (row.leavers || 0), 0) || 0
  const attritionPct = totalHeadcount > 0 ? ((totalLeavers / totalHeadcount) * 100).toFixed(2) : "0.00"

  // Fetch timesheets
  const { data: timesheetData } = await supabase
    .from("fact_timesheets")
    .select("on_time, late, missing")
    .gte("week_key", parsed.from)
    .lte("week_key", parsed.to)

  const totalOnTime = timesheetData?.reduce((sum: number, row: any) => sum + (row.on_time || 0), 0) || 0
  const totalLate = timesheetData?.reduce((sum: number, row: any) => sum + (row.late || 0), 0) || 0
  const totalMissing = timesheetData?.reduce((sum: number, row: any) => sum + (row.missing || 0), 0) || 0
  const totalTimesheets = totalOnTime + totalLate + totalMissing
  const timesheetOnTimePct = totalTimesheets > 0 ? ((totalOnTime / totalTimesheets) * 100).toFixed(2) : "0.00"

  // Fetch compliance
  const { data: complianceData } = await supabase
    .from("fact_compliance")
    .select("i9_due, i9_complete, policy_assigned, policy_acked")
    .gte("date_key", parsed.from)
    .lte("date_key", parsed.to)

  const totalI9Due = complianceData?.reduce((sum: number, row: any) => sum + (row.i9_due || 0), 0) || 0
  const totalI9Complete = complianceData?.reduce((sum: number, row: any) => sum + (row.i9_complete || 0), 0) || 0
  const i9OnTimePct = totalI9Due > 0 ? ((totalI9Complete / totalI9Due) * 100).toFixed(2) : "100.00"

  const totalPolicyAssigned = complianceData?.reduce((sum: number, row: any) => sum + (row.policy_assigned || 0), 0) || 0
  const totalPolicyAcked = complianceData?.reduce((sum: number, row: any) => sum + (row.policy_acked || 0), 0) || 0
  const policyAckPct = totalPolicyAssigned > 0 ? ((totalPolicyAcked / totalPolicyAssigned) * 100).toFixed(2) : "100.00"

  // Fetch helpdesk cases
  const { data: casesData } = await supabase
    .from("fact_cases")
    .select("opened, breached")
    .gte("date_key", parsed.from)
    .lte("date_key", parsed.to)

  const totalOpened = casesData?.reduce((sum: number, row: any) => sum + (row.opened || 0), 0) || 0
  const totalBreached = casesData?.reduce((sum: number, row: any) => sum + (row.breached || 0), 0) || 0
  const caseBreachPct = totalOpened > 0 ? ((totalBreached / totalOpened) * 100).toFixed(2) : "0.00"

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "analytics.overview.viewed",
    entity: "analytics",
    entityId: null,
    diff: { filters: parsed },
  })

  return {
    success: true,
    kpis: {
      headcount: totalHeadcount,
      attritionPct,
      timesheetOnTimePct,
      i9OnTimePct,
      policyAckPct,
      caseBreachPct,
    },
    permissions,
  }
}

export async function getDashboard(input: z.infer<typeof filterSchema> & { tab: string }) {
  const parsed = filterSchema.extend({ tab: z.string() }).parse(input)
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get tenant_id
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No tenant found")

  // Fetch data based on tab
  let data: any = {}

  if (parsed.tab === "workforce") {
    const { data: headcountData } = await supabase
      .from("fact_headcount")
      .select("date_key, active_count, joiners, leavers")
      .gte("date_key", parsed.from)
      .lte("date_key", parsed.to)
      .order("date_key", { ascending: true })

    data = { headcountTrend: headcountData || [] }
  } else if (parsed.tab === "timesheets") {
    const { data: timesheetData } = await supabase
      .from("fact_timesheets")
      .select("week_key, on_time, late, missing, overtime_anomalies")
      .gte("week_key", parsed.from)
      .lte("week_key", parsed.to)
      .order("week_key", { ascending: true })

    data = { timesheetTrend: timesheetData || [] }
  } else if (parsed.tab === "compliance") {
    const { data: complianceData } = await supabase
      .from("fact_compliance")
      .select("date_key, i9_due, i9_complete, policy_assigned, policy_acked")
      .gte("date_key", parsed.from)
      .lte("date_key", parsed.to)
      .order("date_key", { ascending: true })

    data = { complianceTrend: complianceData || [] }
  }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: `analytics.${parsed.tab}.viewed`,
    entity: "analytics",
    entityId: null,
    diff: { filters: parsed },
  })

  return {
    success: true,
    data,
  }
}

export async function exportCsv(input: z.infer<typeof filterSchema> & { tab: string; widgetId: string }) {
  const parsed = filterSchema.extend({ tab: z.string(), widgetId: z.string() }).parse(input)
  const supabase = await createServerClient()
  const permissions = await hasFeatures(["exports.allowed", "pii.masking"])

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  if (!permissions["exports.allowed"]) {
    throw new Error("Export feature is not enabled for your tenant")
  }

  // Get tenant_id
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) throw new Error("No tenant found")

  // Fetch data based on tab and widget
  let data: any[] = []
  let headers: string[] = []

  if (parsed.tab === "workforce" && parsed.widgetId === "headcount_trend") {
    const { data: headcountData } = await supabase
      .from("fact_headcount")
      .select("date_key, active_count, joiners, leavers")
      .gte("date_key", parsed.from)
      .lte("date_key", parsed.to)
      .order("date_key", { ascending: true })

    data = headcountData || []
    headers = ["date_key", "active_count", "joiners", "leavers"]
  }

  // Mask PII if required
  if (permissions["pii.masking"]) {
    data = maskFieldsArray(data, permissions, {
      // Add field mappings if needed
    })
  }

  const csv = await generateCsv(data, headers)

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "analytics.export.csv",
    entity: "analytics",
    entityId: null,
    diff: { tab: parsed.tab, widgetId: parsed.widgetId },
  })

  return {
    success: true,
    csv,
  }
}
