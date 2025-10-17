"use server"

import { createServerClient } from "@/lib/supabase/server"
import type { Permission, Role } from "./permissions"

export interface UserPermissions {
  permissions: string[]
  roles: Array<{ key: string; label: string }>
}

/**
 * Get current user's permissions for the current tenant
 */
export async function getUserPermissions(): Promise<UserPermissions> {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { permissions: [], roles: [] }
  }

  // Get tenant_id from user metadata (now from authenticated user object)
  const tenantId = user.user_metadata?.tenant_id

  if (!tenantId) {
    return { permissions: [], roles: [] }
  }

  // Get permissions
  const { data: permissions } = await supabase.rpc("get_user_permissions", {
    _user_id: user.id,
    _tenant_id: tenantId,
  })

  // Get roles
  const { data: roles } = await supabase.rpc("get_user_roles", {
    _user_id: user.id,
    _tenant_id: tenantId,
  })

  return {
    permissions: permissions?.map((p: any) => p.permission_key) || [],
    roles: roles || [],
  }
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  const { permissions } = await getUserPermissions()
  return permissions.includes(permission)
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(permissions: Permission[]): Promise<boolean> {
  const userPerms = await getUserPermissions()
  return permissions.some((p) => userPerms.permissions.includes(p))
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(permissions: Permission[]): Promise<boolean> {
  const userPerms = await getUserPermissions()
  return permissions.every((p) => userPerms.permissions.includes(p))
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: Role): Promise<boolean> {
  const { roles } = await getUserPermissions()
  return roles.some((r) => r.key === role)
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(roles: Role[]): Promise<boolean> {
  const userRoles = await getUserPermissions()
  return roles.some((r) => userRoles.roles.some((ur) => ur.key === r))
}

/**
 * Require permission or throw error
 */
export async function requirePermission(permission: Permission): Promise<void> {
  const allowed = await hasPermission(permission)
  if (!allowed) {
    throw new Error(`Permission denied: ${permission}`)
  }
}

/**
 * Require role or throw error
 */
export async function requireRole(role: Role): Promise<void> {
  const allowed = await hasRole(role)
  if (!allowed) {
    throw new Error(`Role required: ${role}`)
  }
}

/**
 * Guard function to ensure user has admin role
 * Throws error if user is not an admin
 */
export async function guardAdmin(): Promise<void> {
  await requireRole("admin")
}
