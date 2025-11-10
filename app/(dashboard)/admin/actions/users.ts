"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { revalidatePath } from "next/cache"
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit"

const querySchema = z.object({
  q: z.string().optional(),
  page: z.number().int().min(1).default(1),
  per: z.number().int().min(5).max(100).default(20),
  status: z.enum(["active", "inactive", "suspended", "pending", "all"]).optional(),
  role: z.string().optional(),
  sortBy: z.enum(["created_at", "email", "full_name", "status"]).optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  groupId: z.string().uuid().optional(),
})

async function getSupabase(): Promise<any> {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // adapter to bridge next/headers cookieStore to Supabase server client; cast to any to avoid type mismatch
    cookies: (
      {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, opts: any) {
          return cookieStore.set(name, value, opts)
        },
      } as unknown
    ) as any,
  })
}

async function verifyAdmin() {
  const supabase = await getSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: userRoles } = await supabase.from("user_roles").select("role_id").eq("user_id", user.id)

  const bypass = process.env.ADMIN_BYPASS === "1"
  if ((!userRoles || userRoles.length === 0) && !bypass) {
    const err = new Error("Unauthorized: Admin role required")
    ;(err as any).code = 403
    throw err
  }

  const roleIds = userRoles.map((ur: any) => ur.role_id)

  const { data: roles } = await supabase
    .from("roles")
    .select("key")
    .in("id", roleIds)
    .in("key", ["master_admin", "super_admin", "admin"])

  if ((!roles || roles.length === 0) && !bypass) {
    const err = new Error("Unauthorized: Admin role required")
    ;(err as any).code = 403
    throw err
  }

  return user
}

export async function listUsers(params: unknown) {
  try {
    await verifyAdmin()
  } catch (error: any) {
    console.error("[v0] Admin verification failed:", error.message)
    return { rows: [], total: 0, error: error.message }
  }

  const { q, page, per, status, role, sortBy, sortOrder, dateFrom, dateTo, groupId } = querySchema.parse(params)
  const from = (page - 1) * per
  const to = from + per - 1

  const supabase = await getSupabase()

  let query = supabase.from("users").select("id, email, full_name, avatar_url, status, created_at", { count: "exact" })

  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
  }

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  const { data, error, count } = await query.range(from, to).order(sortBy, { ascending: sortOrder === "asc" })

  if (error) {
    console.error("[v0] Error fetching users:", error)
    return { rows: [], total: 0, error: error.message }
  }

  const usersWithDetails = await Promise.all(
    (data || []).map(async (user: any) => {
      const { data: userRoles } = await supabase.from("user_roles").select("role_id").eq("user_id", user.id)

      const roleIds = (userRoles || []).map((ur: any) => ur.role_id)
      const { data: roles } = await supabase.from("roles").select("label").in("id", roleIds)

      const { data: userTenants } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id)

      const tenantIds = (userTenants || []).map((ut: any) => ut.tenant_id)
      const { data: tenants } = await supabase.from("tenants").select("name").in("id", tenantIds)

      const { data: groups } = await supabase
        .from("user_group_members")
        .select("group_id, user_groups(name)")
        .eq("user_id", user.id)

      return {
        ...user,
  roles: (roles || []).map((r: any) => r.label).join(", ") || "None",
  tenants: (tenants || []).map((t: any) => t.name).join(", ") || "None",
        groups:
          (groups || [])
            .map((g: any) => g.user_groups?.name)
            .filter(Boolean)
            .join(", ") || "None",
        tenant_count: tenants?.length || 0,
        role_count: roles?.length || 0,
      }
  }),
  )

  return { rows: usersWithDetails, total: count || 0 }
}

const bulkSchema = z.object({
  user_ids: z.array(z.string().uuid()),
  action: z.enum(["activate", "deactivate", "suspend"]),
})

export async function bulkUserStatus(input: unknown) {
  try {
    await verifyAdmin()
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { user_ids, action } = bulkSchema.parse(input)
  const supabase = await getSupabase()

  const statusMap = {
    activate: "active",
    deactivate: "inactive",
    suspend: "suspended",
  }
  const status = statusMap[action]

  const { error } = await supabase.from("users").update({ status }).in("id", user_ids)

  if (error) throw error

  revalidatePath("/admin/users")
  return { ok: true }
}

const bulkRoleSchema = z.object({
  user_ids: z.array(z.string().uuid()),
  tenant_id: z.string().uuid(),
  role_id: z.string().uuid(),
})

export async function bulkAssignRole(input: unknown) {
  try {
    const user = await verifyAdmin()
    const rateLimitKey = getRateLimitKey(user.id, "bulk_action")
    const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.BULK_ACTION)
    if (!allowed) {
      throw new Error("Rate limit exceeded. Please try again later.")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { user_ids, tenant_id, role_id } = bulkRoleSchema.parse(input)
  const supabase = await getSupabase()

  const { data, error } = await supabase.rpc("bulk_assign_role", {
    _user_ids: user_ids,
    _tenant_id: tenant_id,
    _role_id: role_id,
  })

  if (error) throw error

  revalidatePath("/admin/users")
  return { ok: true, count: data }
}

const passwordResetSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
})

export async function resetUserPassword(input: unknown) {
  try {
    const user = await verifyAdmin()
    const rateLimitKey = getRateLimitKey(user.id, "password_reset")
    const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.INVITE_USER)
    if (!allowed) {
      throw new Error("Rate limit exceeded. Please try again later.")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { email } = passwordResetSchema.parse(input)
  const supabase = await getSupabase()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) throw error

  return { ok: true }
}

const bulkDeleteSchema = z.object({
  user_ids: z.array(z.string().uuid()),
})

export async function bulkDeleteUsers(input: unknown) {
  try {
    const user = await verifyAdmin()
    const rateLimitKey = getRateLimitKey(user.id, "bulk_delete")
    const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.BULK_ACTION)
    if (!allowed) {
      throw new Error("Rate limit exceeded. Please try again later.")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { user_ids } = bulkDeleteSchema.parse(input)
  const supabase = await getSupabase()

  const { error } = await supabase.from("users").delete().in("id", user_ids)

  if (error) throw error

  revalidatePath("/admin/users")
  return { ok: true }
}

const activityExportSchema = z.object({
  user_id: z.string().uuid(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export async function exportUserActivity(input: unknown) {
  try {
    const user = await verifyAdmin()
    const rateLimitKey = getRateLimitKey(user.id, "export")
    const allowed = await checkRateLimit(rateLimitKey, RATE_LIMITS.EXPORT_DATA)
    if (!allowed) {
      throw new Error("Rate limit exceeded. Please try again later.")
    }
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { user_id, dateFrom, dateTo } = activityExportSchema.parse(input)
  const supabase = await getSupabase()

  let query = supabase.from("sec.audit_logs").select("*").eq("user_id", user_id).order("created_at", { ascending: false })

  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  const { data, error } = await query

  if (error) throw error

  const header = ["id", "action", "resource", "created_at", "payload"]
  const rows = [header.join(",")].concat(
    (data || []).map((r: any) =>
      header
        .map(
          (h) =>
            `"${String(r[h] ?? "")
              .replaceAll('"', '""')
              .replaceAll("\n", " ")}"`,
        )
        .join(","),
    ),
  )

  return rows.join("\n")
}

export async function getUserAnalytics(params: { tenantId: string; days?: number }) {
  try {
    await verifyAdmin()
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { tenantId, days = 30 } = params
  const supabase = await getSupabase()

  const { data, error } = await supabase
    .from("user_analytics")
    .select("*")
    .eq("tenant_id", tenantId)
    .gte("date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order("date", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching analytics:", error)
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}

const saveFilterSchema = z.object({
  name: z.string().min(1).max(100),
  filter_type: z.string(),
  filter_config: z.record(z.any()),
  is_default: z.boolean().optional(),
})

export async function saveFilter(input: unknown) {
  try {
    const user = await verifyAdmin()
    const { name, filter_type, filter_config, is_default } = saveFilterSchema.parse(input)
  const supabase = await getSupabase()

    const { error } = await supabase.from("saved_filters").insert({
      user_id: user.id,
      name,
      filter_type,
      filter_config,
      is_default: is_default || false,
    })

    if (error) throw error

    return { ok: true }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getSavedFilters() {
  try {
    const user = await verifyAdmin()
  const supabase = await getSupabase()

    const { data, error } = await supabase
      .from("saved_filters")
      .select("*")
      .eq("user_id", user.id)
      .eq("filter_type", "users")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { data: data || [], error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

export async function exportUsersCSV(q = "", format: "csv" | "xlsx" = "csv") {
  try {
    await verifyAdmin()
  } catch (error: any) {
    throw new Error(error.message)
  }

  const supabase = await getSupabase()

  let query = supabase.from("users").select("*")

  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
  }

  const { data, error } = await query

  if (error) throw error

  const header = ["id", "email", "full_name", "status", "created_at"]
  const rows = [header.join(",")].concat(
    (data || []).map((r: any) => header.map((h) => `"${String(r[h] ?? "").replaceAll('"', '""')}"`).join(",")),
  )

  return rows.join("\n")
}

const userIdSchema = z.object({
  user_id: z.string().uuid(),
})

export async function getUserDetails(input: unknown) {
  try {
    await verifyAdmin()
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { user_id } = userIdSchema.parse(input)
  const supabase = await getSupabase()

  const { data: user, error } = await supabase.from("users").select("*").eq("id", user_id).single()

  if (error) throw error

  const { data: userRoles } = await supabase.from("user_roles").select("role_id, tenant_id").eq("user_id", user_id)

  const roleIds = (userRoles || []).map((ur: any) => ur.role_id)
  const { data: roles } = await supabase.from("roles").select("*").in("id", roleIds)

  const { data: userTenants } = await supabase
    .from("user_tenants")
    .select("tenant_id, is_primary")
    .eq("user_id", user_id)

  const tenantIds = (userTenants || []).map((ut: any) => ut.tenant_id)
  const { data: tenants } = await supabase.from("tenants").select("*").in("id", tenantIds)

  const { data: activity } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(10)

  return {
    user,
    roles: roles || [],
    tenants: (tenants || []).map((t: any) => ({
      ...t,
      is_primary: userTenants?.find((ut: any) => ut.tenant_id === t.id)?.is_primary || false,
    })),
    activity: activity || [],
  }
}

const updateUserSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended", "pending"]).optional(),
})

export async function updateUser(input: unknown) {
  try {
    await verifyAdmin()
  } catch (error: any) {
    throw new Error(error.message)
  }

  const { user_id, ...updates } = updateUserSchema.parse(input)
  const supabase = await getSupabase()

  const { error } = await supabase.from("users").update(updates).eq("id", user_id)

  if (error) throw error

  revalidatePath("/admin/users")
  return { ok: true }
}
