"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { revalidatePath } from "next/cache"
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit"

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
