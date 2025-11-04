"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

/**
 * Check if user has a specific role in a tenant
 */
export async function hasRole(tenantId: string, roleKey: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from("user_roles")
    .select("role:roles(key)")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .single()

  return data?.role?.key === roleKey
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(tenantId: string, roleKeys: string[]): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from("user_roles")
    .select("role:roles(key)")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)

  if (!data || data.length === 0) return false

  const userRoles = data.map((r: any) => r.role?.key).filter(Boolean)
  return roleKeys.some((role) => userRoles.includes(role))
}

/**
 * Require user to have a specific role, redirect if not
 */
export async function requireRole(tenantId: string, roleKey: string, redirectTo = "/dashboard") {
  const hasRequiredRole = await hasRole(tenantId, roleKey)

  if (!hasRequiredRole) {
    redirect(redirectTo)
  }
}

/**
 * Require user to have any of the specified roles, redirect if not
 */
export async function requireAnyRole(tenantId: string, roleKeys: string[], redirectTo = "/dashboard") {
  const hasRequiredRole = await hasAnyRole(tenantId, roleKeys)

  if (!hasRequiredRole) {
    redirect(redirectTo)
  }
}

/**
 * Check if user is a member of a tenant
 */
export async function isTenantMember(tenantId: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  return !!data
}

/**
 * Require user to be a member of a tenant, redirect if not
 */
export async function requireTenantMember(tenantId: string, redirectTo = "/dashboard") {
  const isMember = await isTenantMember(tenantId)

  if (!isMember) {
    redirect(redirectTo)
  }
}

/**
 * Get user's role in a tenant
 */
export async function getUserRole(tenantId: string): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("tenant_members")
    .select("role")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .single()

  return data?.role || null
}

/**
 * Check if user is a tenant admin
 */
export async function isTenantAdmin(tenantId: string): Promise<boolean> {
  const role = await getUserRole(tenantId)
  return role === "tenant_admin"
}

/**
 * Require user to be a tenant admin, redirect if not
 */
export async function requireTenantAdmin(tenantId: string, redirectTo = "/dashboard") {
  const isAdmin = await isTenantAdmin(tenantId)

  if (!isAdmin) {
    redirect(redirectTo)
  }
}
