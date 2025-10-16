"use server"

import { createClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"

export async function getBillingInfo() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  // Get user's tenant memberships
  const { data: memberships, error: membershipsError } = await supabase
    .from("tenant_users")
    .select(`
      *,
      tenant:tenants(*)
    `)
    .eq("user_id", user.id)

  if (membershipsError) {
    return { error: membershipsError.message }
  }

  return { data: memberships }
}

export async function switchTenant(tenantId: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  // Verify user has access to this tenant
  const { data: membership, error: membershipError } = await supabase
    .from("tenant_users")
    .select("*")
    .eq("user_id", user.id)
    .eq("tenant_id", tenantId)
    .single()

  if (membershipError || !membership) {
    return { error: "Access denied to this tenant" }
  }

  // Update user's current tenant in preferences
  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    current_tenant_id: tenantId,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  await appendAudit(supabase, {
    user_id: user.id,
    action: "switch_tenant",
    resource_type: "tenant",
    resource_id: tenantId,
    details: { tenant_id: tenantId },
  })

  return { success: true }
}

export async function leaveTenant(tenantId: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  // Check if user is the owner
  const { data: tenant } = await supabase.from("tenants").select("owner_id").eq("id", tenantId).single()

  if (tenant?.owner_id === user.id) {
    return { error: "Cannot leave tenant you own. Transfer ownership first." }
  }

  const { error } = await supabase.from("tenant_users").delete().eq("user_id", user.id).eq("tenant_id", tenantId)

  if (error) {
    return { error: error.message }
  }

  await appendAudit(supabase, {
    user_id: user.id,
    action: "leave_tenant",
    resource_type: "tenant",
    resource_id: tenantId,
    details: { tenant_id: tenantId },
  })

  return { success: true }
}
