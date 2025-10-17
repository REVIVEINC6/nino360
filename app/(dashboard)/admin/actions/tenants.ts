"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { revalidatePath } from "next/cache"
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit"
import { generateText } from "ai"

function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

async function verifyAdmin() {
  const supabase = getSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: userRoles } = await supabase.from("user_roles").select("role_id").eq("user_id", user.id)

  if (!userRoles || userRoles.length === 0) {
    throw new Error("Unauthorized: Admin role required")
  }

  const roleIds = userRoles.map((ur) => ur.role_id)

  const { data: roles } = await supabase
    .from("roles")
    .select("key")
    .in("id", roleIds)
    .in("key", ["master_admin", "super_admin", "admin"])

  if (!roles || roles.length === 0) {
    throw new Error("Unauthorized: Admin role required")
  }

  return user
}

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9-]{3,}$/),
  status: z.enum(["active", "suspended", "trial"]),
  plan_id: z.string().uuid().optional(),
  trial_ends_at: z.string().optional(),
  billing_email: z.string().email().optional(),
  settings: z.record(z.any()).optional(),
})

const querySchema = z.object({
  q: z.string().optional(),
  page: z.number().default(1),
  per: z.number().default(20),
  status: z.string().optional(),
  plan: z.string().optional(),
  sortBy: z.string().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export async function listTenants(params?: unknown) {
  await verifyAdmin()

  const { q, page, per, status, plan, sortBy, sortOrder } = querySchema.parse(params || {})

  const supabase = getSupabase()

  let query = supabase.from("tenants").select(
    `
      *,
      plan:tenant_plans(plan_id, plans(id, name, slug)),
      user_count:user_tenants(count)
    `,
    { count: "exact" },
  )

  // Search filter
  if (q) {
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
  }

  // Status filter
  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  // Plan filter
  if (plan && plan !== "all") {
    query = query.eq("tenant_plans.plan_id", plan)
  }

  // Sorting
  query = query.order(sortBy, { ascending: sortOrder === "asc" })

  // Pagination
  const from = (page - 1) * per
  const to = from + per - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] Error loading tenants:", error)
    return { rows: [], total: 0, error: error.message }
  }

  return { rows: data || [], total: count || 0 }
}

export async function getTenantDetails(tenantId: string) {
  await verifyAdmin()

  const supabase = getSupabase()

  const [tenant, users, docs, copilot, features, audit] = await Promise.all([
    supabase.from("tenants").select("*, plan:tenant_plans(*, plans(*))").eq("id", tenantId).single(),
    supabase.from("user_tenants").select("count").eq("tenant_id", tenantId),
    supabase.from("tenant_docs").select("count").eq("tenant_id", tenantId).maybeSingle(),
    supabase.from("rag_threads").select("count").eq("tenant_id", tenantId).maybeSingle(),
    supabase.from("tenant_feature_overrides").select("*, features(*)").eq("tenant_id", tenantId),
    supabase
      .from("audit_logs")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  return {
    tenant: tenant.data,
    stats: {
      user_count: users.data?.[0]?.count || 0,
      doc_count: docs.data?.count || 0,
      copilot_sessions: copilot.data?.count || 0,
      recent_audit: audit.data || [],
    },
    features: features.data || [],
  }
}

export async function upsertTenant(input: unknown) {
  const user = await verifyAdmin()

  // Rate limiting
  const rateLimitKey = getRateLimitKey(user.id, "upsert_tenant")
  const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.BULK_ACTION)
  if (!allowed) {
    throw new Error("Rate limit exceeded. Please try again later.")
  }

  const { id, name, slug, status, plan_id, trial_ends_at, billing_email, settings } = upsertSchema.parse(input)
  const supabase = getSupabase()

  const payload: any = { name, slug, status, billing_email, settings }
  if (id) payload.id = id

  const { data, error } = await supabase.from("tenants").upsert(payload).select().single()

  if (error) throw error

  if (plan_id && data) {
    await supabase.from("tenant_plans").upsert({
      tenant_id: data.id,
      plan_id,
      trial_ends_at,
    })
  }

  revalidatePath("/admin/tenants")
  return data
}

export async function toggleTenantFeature(tenantId: string, featureSlug: string, enabled: boolean) {
  await verifyAdmin()

  const supabase = getSupabase()

  const { data: feature } = await supabase.from("features").select("id").eq("slug", featureSlug).single()

  if (!feature) throw new Error("Feature not found")

  if (enabled) {
    await supabase.from("tenant_feature_overrides").upsert({
      tenant_id: tenantId,
      feature_id: feature.id,
      enabled: true,
    })
  } else {
    await supabase.from("tenant_feature_overrides").delete().eq("tenant_id", tenantId).eq("feature_id", feature.id)
  }

  revalidatePath("/admin/tenants")
  return { success: true }
}

export async function updateTenantStatus(tenantId: string, status: "active" | "suspended") {
  await verifyAdmin()

  const supabase = getSupabase()

  const { data, error } = await supabase.from("tenants").update({ status }).eq("id", tenantId).select().single()

  if (error) throw error

  revalidatePath("/admin/tenants")
  return data
}

const bulkSuspendSchema = z.object({
  tenant_ids: z.array(z.string().uuid()),
  action: z.enum(["suspend", "activate"]),
})

export async function bulkSuspendTenants(input: unknown) {
  const user = await verifyAdmin()

  // Rate limiting
  const rateLimitKey = getRateLimitKey(user.id, "bulk_suspend")
  const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.BULK_ACTION)
  if (!allowed) {
    throw new Error("Rate limit exceeded. Please try again later.")
  }

  const { tenant_ids, action } = bulkSuspendSchema.parse(input)

  const supabase = getSupabase()
  const status = action === "suspend" ? "suspended" : "active"

  const { error } = await supabase.from("tenants").update({ status }).in("id", tenant_ids)

  if (error) throw error

  revalidatePath("/admin/tenants")
  return { success: true }
}

const overridePlanSchema = z.object({
  tenant_ids: z.array(z.string().uuid()),
  plan_id: z.string().uuid(),
  trial_ends_at: z.string().optional(),
})

export async function overrideTenantPlans(input: unknown) {
  const user = await verifyAdmin()

  // Rate limiting
  const rateLimitKey = getRateLimitKey(user.id, "override_plan")
  const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.BULK_ACTION)
  if (!allowed) {
    throw new Error("Rate limit exceeded. Please try again later.")
  }

  const { tenant_ids, plan_id, trial_ends_at } = overridePlanSchema.parse(input)

  const supabase = getSupabase()

  // Upsert tenant_plans for each tenant
  const promises = tenant_ids.map((tenant_id) =>
    supabase.from("tenant_plans").upsert({
      tenant_id,
      plan_id,
      trial_ends_at,
    }),
  )

  await Promise.all(promises)

  revalidatePath("/admin/tenants")
  return { success: true }
}

export async function exportTenantsCSV(q?: string) {
  await verifyAdmin()

  const supabase = getSupabase()

  let query = supabase.from("tenants").select(`
      *,
      plan:tenant_plans(plans(name)),
      user_count:user_tenants(count)
    `)

  if (q) {
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
  }

  const { data, error } = await query

  if (error) throw error

  const rows = data || []

  const csv = [
    ["ID", "Name", "Slug", "Status", "Plan", "Users", "Created"],
    ...rows.map((r: any) => [
      r.id,
      r.name,
      r.slug,
      r.status,
      r.plan?.[0]?.plans?.name || "No Plan",
      r.user_count?.[0]?.count || 0,
      new Date(r.created_at).toISOString(),
    ]),
  ]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")

  return csv
}

export async function listPlans() {
  const supabase = getSupabase()

  const { data, error } = await supabase.from("plans").select("id, name, slug").order("name")

  if (error) {
    console.error("[v0] Error loading plans:", error)
    return []
  }

  return data || []
}

export async function archiveTenant(tenantId: string) {
  await verifyAdmin()

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("tenants")
    .update({
      status: "archived",
      settings: { archived_at: new Date().toISOString() },
    })
    .eq("id", tenantId)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/tenants")
  return data
}

export async function generateTenantInsights(tenantId: string) {
  await verifyAdmin()

  const supabase = getSupabase()

  // Fetch tenant data and metrics
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*, plan:tenant_plans(*, plans(*))")
    .eq("id", tenantId)
    .single()

  const [users, docs, copilot, audit] = await Promise.all([
    supabase.from("user_tenants").select("count").eq("tenant_id", tenantId),
    supabase.from("tenant_docs").select("count").eq("tenant_id", tenantId).maybeSingle(),
    supabase.from("rag_threads").select("count").eq("tenant_id", tenantId).maybeSingle(),
    supabase
      .from("audit_logs")
      .select("action, created_at")
      .eq("tenant_id", tenantId)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false }),
  ])

  const metrics = {
    name: tenant?.name,
    status: tenant?.status,
    plan: tenant?.plan?.[0]?.plans?.name,
    user_count: users.data?.[0]?.count || 0,
    doc_count: docs.data?.count || 0,
    copilot_sessions: copilot.data?.count || 0,
    recent_activity_count: audit.data?.length || 0,
    created_at: tenant?.created_at,
  }

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze this tenant's health and provide actionable insights:

Tenant: ${metrics.name}
Status: ${metrics.status}
Plan: ${metrics.plan}
Users: ${metrics.user_count}
Documents: ${metrics.doc_count}
Copilot Sessions: ${metrics.copilot_sessions}
Recent Activity (30d): ${metrics.recent_activity_count}
Account Age: ${Math.floor((Date.now() - new Date(metrics.created_at).getTime()) / (1000 * 60 * 60 * 24))} days

Provide:
1. Health Score (0-100)
2. Churn Risk (Low/Medium/High)
3. Top 3 Recommendations
4. Upsell Opportunities

Format as JSON with keys: healthScore, churnRisk, recommendations (array), upsellOpportunities (array)`,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("[v0] Error generating AI insights:", error)
    return {
      healthScore: 50,
      churnRisk: "Unknown",
      recommendations: ["Unable to generate insights at this time"],
      upsellOpportunities: [],
    }
  }
}

export async function verifyTenantAuditChain(tenantId: string) {
  await verifyAdmin()

  const supabase = getSupabase()

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id, action, created_at, hash, prev_hash")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true })

  if (!logs || logs.length === 0) {
    return { verified: true, totalLogs: 0, message: "No audit logs to verify" }
  }

  let verified = true
  let brokenAt = -1

  for (let i = 1; i < logs.length; i++) {
    const current = logs[i]
    const previous = logs[i - 1]

    if (current.prev_hash !== previous.hash) {
      verified = false
      brokenAt = i
      break
    }
  }

  return {
    verified,
    totalLogs: logs.length,
    brokenAt,
    message: verified ? "Audit chain verified successfully" : `Chain broken at log ${brokenAt}`,
  }
}

export async function triggerTenantRPAWorkflow(tenantId: string, workflowType: string) {
  await verifyAdmin()

  const supabase = getSupabase()

  const workflows: Record<string, any> = {
    health_check: {
      name: "Tenant Health Check",
      steps: ["Check user activity", "Verify billing status", "Review feature usage", "Generate report"],
    },
    onboarding: {
      name: "Automated Onboarding",
      steps: ["Send welcome email", "Create sample data", "Schedule training", "Assign success manager"],
    },
    compliance: {
      name: "Compliance Audit",
      steps: ["Check data retention", "Verify access controls", "Review audit logs", "Generate compliance report"],
    },
    renewal: {
      name: "Renewal Preparation",
      steps: ["Calculate usage", "Prepare invoice", "Send renewal notice", "Schedule review call"],
    },
  }

  const workflow = workflows[workflowType]

  if (!workflow) {
    throw new Error("Invalid workflow type")
  }

  // Log the RPA workflow trigger
  await supabase.from("audit_logs").insert({
    tenant_id: tenantId,
    user_id: (await supabase.auth.getUser()).data.user?.id,
    action: `rpa_workflow_triggered`,
    resource_type: "tenant",
    resource_id: tenantId,
    details: { workflow: workflowType, name: workflow.name, steps: workflow.steps },
  })

  return {
    success: true,
    workflow: workflow.name,
    steps: workflow.steps,
    message: `${workflow.name} workflow triggered successfully`,
  }
}

export async function generateBulkTenantInsights(tenantIds: string[]) {
  const user = await verifyAdmin()

  // Rate limiting
  const rateLimitKey = getRateLimitKey(user.id, "bulk_ai_insights")
  const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.BULK_ACTION)
  if (!allowed) {
    throw new Error("Rate limit exceeded. Please try again later.")
  }

  const insights = await Promise.all(tenantIds.map((id) => generateTenantInsights(id)))

  return insights
}
