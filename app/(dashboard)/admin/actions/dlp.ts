"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDlpPolicies() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("dlp.policies")
    .select(`
      *,
      creator:core.users!created_by(email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createDlpPolicy(policy: {
  name: string
  description?: string
  rules: any
  actions?: any
  scope?: any
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: userTenant } = await supabase
    .from("core.user_tenants")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single()

  if (!userTenant) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("dlp.policies")
    .insert({
      tenant_id: userTenant.tenant_id,
      created_by: user.id,
      ...policy,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/dlp")
  return data
}

export async function updateDlpPolicy(id: string, updates: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("dlp.policies")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/dlp")
  return data
}

export async function getDlpFindings(filters?: {
  severity?: string
  status?: string
  limit?: number
}) {
  const supabase = await createClient()

  let query = supabase
    .from("dlp.findings")
    .select(`
      *,
      policy:dlp.policies(name),
      resolver:core.users!resolved_by(email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (filters?.severity) {
    query = query.eq("severity", filters.severity)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function resolveDlpFinding(id: string, resolution: "resolved" | "false_positive") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("dlp.findings")
    .update({
      status: resolution,
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/admin/dlp")
  return data
}

export async function runDlpScan(scope: "storage" | "database" | "all") {
  // This would trigger an edge function
  // For now, return a mock response
  return { ok: true, message: `DLP scan initiated for scope: ${scope}` }
}
