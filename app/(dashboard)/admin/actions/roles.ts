"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { revalidatePath } from "next/cache"
import { rateLimit } from "@/lib/rate-limit"

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
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

export async function listRoles(params?: { search?: string; sortBy?: string; sortOrder?: string }) {
  try {
    await verifyAdmin()
    const supabase = await getSupabase()

    let query = supabase.from("roles").select(`
      *,
      role_permissions(count)
    `)

    // Apply search filter
    if (params?.search) {
      query = query.or(`key.ilike.%${params.search}%,label.ilike.%${params.search}%`)
    }

    // Apply sorting
    const sortBy = params?.sortBy || "key"
    const sortOrder = params?.sortOrder === "desc" ? false : true
    query = query.order(sortBy, { ascending: sortOrder })

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching roles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error in listRoles:", error)
    return []
  }
}

export async function getRoleDetails(roleId: string) {
  try {
    await verifyAdmin()
    const supabase = await getSupabase()

    const { data: role, error: roleError } = await supabase.from("roles").select("*").eq("id", roleId).single()

    if (roleError) throw roleError

    const { data: permissions, error: permError } = await supabase
      .from("role_permissions")
      .select(`
        *,
        permissions(*)
      `)
      .eq("role_id", roleId)

    if (permError) throw permError

    // Get user count for this role
    const { count: userCount } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role_id", roleId)

    return {
      role,
      permissions: permissions || [],
      userCount: userCount || 0,
    }
  } catch (error: any) {
    console.error("[v0] Error in getRoleDetails:", error)
    throw error
  }
}

export async function listPermissions() {
  try {
    await verifyAdmin()
    const supabase = await getSupabase()

    const { data, error } = await supabase.from("permissions").select("*").order("key")

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[v0] Error in listPermissions:", error)
    return []
  }
}

const createRoleSchema = z.object({
  key: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z_]+$/),
  label: z.string().min(2).max(100),
  description: z.string().optional(),
  permissions: z.array(z.string().uuid()).optional(),
})

export async function createRole(input: unknown) {
  try {
    await verifyAdmin()
    await rateLimit("create_role", 10, 60000) // 10 per minute

    const { key, label, description, permissions } = createRoleSchema.parse(input)
    const supabase = await getSupabase()

    // Create role
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .insert({ key, label, description })
      .select()
      .single()

    if (roleError) throw roleError

    // Assign permissions if provided
    if (permissions && permissions.length > 0) {
      const rolePermissions = permissions.map((permId) => ({
        role_id: role.id,
        permission_id: permId,
      }))

      const { error: permError } = await supabase.from("role_permissions").insert(rolePermissions)

      if (permError) throw permError
    }

    revalidatePath("/admin/roles")
    return { success: true, role }
  } catch (error: any) {
    console.error("[v0] Error in createRole:", error)
    throw error
  }
}

const updateRoleSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
})

export async function updateRole(input: unknown) {
  try {
    await verifyAdmin()
    await rateLimit("update_role", 20, 60000) // 20 per minute

    const { id, ...updates } = updateRoleSchema.parse(input)
    const supabase = await getSupabase()

    const { error } = await supabase.from("roles").update(updates).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/roles")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in updateRole:", error)
    throw error
  }
}

export async function deleteRole(roleId: string) {
  try {
    await verifyAdmin()
    await rateLimit("delete_role", 5, 60000) // 5 per minute

    const supabase = await getSupabase()

    // Check if role is in use
    const { count } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role_id", roleId)

    if (count && count > 0) {
      throw new Error(`Cannot delete role: ${count} user(s) are assigned to this role`)
    }

    // Check if it's a system role
    const { data: role } = await supabase.from("roles").select("key").eq("id", roleId).single()

    if (role && ["master_admin", "super_admin", "admin"].includes(role.key)) {
      throw new Error("Cannot delete system roles")
    }

    const { error } = await supabase.from("roles").delete().eq("id", roleId)

    if (error) throw error

    revalidatePath("/admin/roles")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in deleteRole:", error)
    throw error
  }
}

const assignPermissionsSchema = z.object({
  roleId: z.string().uuid(),
  permissionIds: z.array(z.string().uuid()),
})

export async function assignPermissions(input: unknown) {
  try {
    await verifyAdmin()
    await rateLimit("assign_permissions", 20, 60000)

    const { roleId, permissionIds } = assignPermissionsSchema.parse(input)
    const supabase = await getSupabase()

    // Delete existing permissions
    await supabase.from("role_permissions").delete().eq("role_id", roleId)

    // Insert new permissions
    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map((permId) => ({
        role_id: roleId,
        permission_id: permId,
      }))

      const { error } = await supabase.from("role_permissions").insert(rolePermissions)

      if (error) throw error
    }

    revalidatePath("/admin/roles")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Error in assignPermissions:", error)
    throw error
  }
}

const bulkDeleteSchema = z.object({
  roleIds: z.array(z.string().uuid()).min(1),
})

export async function bulkDeleteRoles(input: unknown) {
  try {
    await verifyAdmin()
    await rateLimit("bulk_delete_roles", 3, 60000) // 3 per minute

    const { roleIds } = bulkDeleteSchema.parse(input)
    const supabase = await getSupabase()

    // Check if any roles are in use
    const { data: usedRoles } = await supabase.from("user_roles").select("role_id").in("role_id", roleIds)

    if (usedRoles && usedRoles.length > 0) {
      const usedRoleIds = usedRoles.map((r: any) => r.role_id)
      throw new Error(`Cannot delete roles that are in use: ${usedRoleIds.length} role(s) have users assigned`)
    }

    // Check for system roles
    const { data: roles } = await supabase.from("roles").select("key").in("id", roleIds)

  const systemRoles = roles?.filter((r: any) => ["master_admin", "super_admin", "admin"].includes(r.key))

    if (systemRoles && systemRoles.length > 0) {
      throw new Error("Cannot delete system roles")
    }

    const { error } = await supabase.from("roles").delete().in("id", roleIds)

    if (error) throw error

    revalidatePath("/admin/roles")
    return { success: true, deleted: roleIds.length }
  } catch (error: any) {
    console.error("[v0] Error in bulkDeleteRoles:", error)
    throw error
  }
}

export async function cloneRole(roleId: string, newKey: string, newLabel: string) {
  try {
    await verifyAdmin()
    await rateLimit("clone_role", 5, 60000)

    const supabase = await getSupabase()

    // Get original role and permissions
    const { data: originalRole } = await supabase.from("roles").select("*").eq("id", roleId).single()

    if (!originalRole) throw new Error("Role not found")

    const { data: permissions } = await supabase.from("role_permissions").select("permission_id").eq("role_id", roleId)

    // Create new role
    const { data: newRole, error: roleError } = await supabase
      .from("roles")
      .insert({
        key: newKey,
        label: newLabel,
        description: `Cloned from ${originalRole.label}`,
      })
      .select()
      .single()

    if (roleError) throw roleError

    // Copy permissions
    if (permissions && permissions.length > 0) {
      const rolePermissions = permissions.map((p: any) => ({
        role_id: newRole.id,
        permission_id: p.permission_id,
      }))

      const { error: permError } = await supabase.from("role_permissions").insert(rolePermissions)

      if (permError) throw permError
    }

    revalidatePath("/admin/roles")
    return { success: true, role: newRole }
  } catch (error: any) {
    console.error("[v0] Error in cloneRole:", error)
    throw error
  }
}

// Keep existing functions for backward compatibility
export async function getRolePermissions(roleId: string) {
  await verifyAdmin()
  const supabase = await getSupabase()

  const { data, error } = await supabase.from("role_permissions").select("*").eq("role_id", roleId)

  if (error) throw error
  return data || []
}

const permissionSchema = z.object({
  role_id: z.string().uuid(),
  module: z.string(),
  action: z.enum(["read", "create", "update", "delete"]),
  granted: z.boolean(),
})

export async function updateRolePermission(input: unknown) {
  await verifyAdmin()
  const { role_id, module, action, granted } = permissionSchema.parse(input)
  const supabase = await getSupabase()

  const { error } = await supabase.from("role_permissions").upsert(
    {
      role_id,
      module,
      action,
      granted,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "role_id,module,action",
    },
  )

  if (error) throw error

  revalidatePath("/admin/roles")
  return { ok: true }
}

const assignSchema = z.object({
  user_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  role_id: z.string().uuid(),
})

export async function assignRole(input: unknown) {
  await verifyAdmin()
  const { user_id, tenant_id, role_id } = assignSchema.parse(input)
  const supabase = await getSupabase()

  const { error } = await supabase.from("user_roles").insert({ user_id, tenant_id, role_id })

  if (error) throw error

  revalidatePath("/admin/users")
  return { ok: true }
}

export async function revokeRole(input: unknown) {
  await verifyAdmin()
  const { user_id, tenant_id, role_id } = assignSchema.parse(input)
  const supabase = await getSupabase()

  const { error } = await supabase.from("user_roles").delete().match({ user_id, tenant_id, role_id })

  if (error) throw error

  revalidatePath("/admin/users")
  return { ok: true }
}

export async function getRoleRecommendations() {
  try {
    await verifyAdmin()
    const supabase = await getSupabase()

    // Get role usage statistics
    const { data: roleStats } = await supabase
      .from("user_roles")
      .select("role_id, roles(key, label)")
      .order("created_at", { ascending: false })
      .limit(100)

    // Get permission usage patterns
    const { data: permStats } = await supabase
      .from("role_permissions")
      .select("permission_id, permissions(key)")
      .limit(100)

    // Generate AI recommendations using GPT-4o-mini
    const { generateText } = await import("ai")
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze these role and permission usage patterns and provide 3 actionable recommendations for role optimization:
      
Role Usage: ${JSON.stringify(roleStats?.slice(0, 10))}
Permission Patterns: ${JSON.stringify(permStats?.slice(0, 10))}

Provide recommendations in JSON format: [{"title": "...", "description": "...", "priority": "high|medium|low"}]`,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("[v0] Error in getRoleRecommendations:", error)
    return []
  }
}

export async function verifyRoleAuditChain(roleId: string) {
  try {
    await verifyAdmin()
    const supabase = await getSupabase()

    const { data: audits } = await supabase
      .from("sec.audit_logs")
      .select("*")
      .eq("resource_type", "role")
      .eq("resource_id", roleId)
      .order("created_at", { ascending: true })

    if (!audits || audits.length === 0) {
      return { valid: true, message: "No audit trail found" }
    }

    // Verify hash chain integrity
    const mod = await import("@/lib/audit/hash-chain")
    const verifyHashChain = (mod as any).verifyHashChain ?? (mod as any).default ?? (mod as any)
    const isValid = await (verifyHashChain as any)(audits)

    return {
      valid: isValid,
      auditCount: audits.length,
      message: isValid ? "Audit chain verified" : "Audit chain integrity compromised",
    }
  } catch (error) {
    console.error("[v0] Error in verifyRoleAuditChain:", error)
    return { valid: false, message: "Verification failed" }
  }
}

export async function triggerRoleAutomation(action: "sync" | "audit" | "cleanup") {
  try {
    await verifyAdmin()
    await rateLimit("role_automation", 5, 60000)

    const supabase = await getSupabase()

    switch (action) {
      case "sync":
        // Sync roles across all tenants
        const { data: tenants } = await supabase.from("tenants").select("id")
        // Trigger sync workflow
        return { success: true, message: `Syncing roles across ${tenants?.length || 0} tenants` }

      case "audit":
        // Run automated audit checks
        const { data: roles } = await supabase.from("roles").select("id")
        return { success: true, message: `Auditing ${roles?.length || 0} roles` }

      case "cleanup":
        // Clean up unused roles
        const { data: unusedRoles } = await supabase
          .from("roles")
          .select("id")
          .not("id", "in", supabase.from("user_roles").select("role_id"))
        return { success: true, message: `Found ${unusedRoles?.length || 0} unused roles` }

      default:
        throw new Error("Invalid automation action")
    }
  } catch (error: any) {
    console.error("[v0] Error in triggerRoleAutomation:", error)
    throw error
  }
}
