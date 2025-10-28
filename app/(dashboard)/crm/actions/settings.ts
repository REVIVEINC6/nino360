"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant) throw new Error("No tenant found")

  const { data: settings } = await supabase
    .from("crm.settings")
    .select("*")
    .eq("tenant_id", userTenant.tenant_id)
    .single()

  return settings
}

export async function updateSettings(updates: any) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant) throw new Error("No tenant found")

  const { error } = await supabase.from("crm.settings").upsert({
    tenant_id: userTenant.tenant_id,
    ...updates,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  })

  if (error) throw error

  revalidatePath("/crm/settings")
  return { success: true }
}

export async function getPipelineStages() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant) throw new Error("No tenant found")

  const { data: stages } = await supabase
    .from("crm.pipeline_stages")
    .select("*")
    .eq("tenant_id", userTenant.tenant_id)
    .eq("is_active", true)
    .order("display_order")

  return stages || []
}

export async function createPipelineStage(stage: any) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant) throw new Error("No tenant found")

  const { error } = await supabase.from("crm.pipeline_stages").insert({
    tenant_id: userTenant.tenant_id,
    ...stage,
    created_by: user.id,
  })

  if (error) throw error

  revalidatePath("/crm/settings")
  return { success: true }
}

export async function updatePipelineStage(id: string, updates: any) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("crm.pipeline_stages")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/crm/settings")
  return { success: true }
}

export async function getSLARules() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant) throw new Error("No tenant found")

  const { data: rules } = await supabase
    .from("crm.sla_rules")
    .select("*")
    .eq("tenant_id", userTenant.tenant_id)
    .eq("is_active", true)

  return rules || []
}

export async function updateSLARule(id: string, updates: any) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("crm.sla_rules")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/crm/settings")
  return { success: true }
}

export async function getDedupeRules() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant) throw new Error("No tenant found")

  const { data: rules } = await supabase
    .from("crm.dedupe_rules")
    .select("*")
    .eq("tenant_id", userTenant.tenant_id)
    .eq("is_active", true)

  return rules || []
}

export async function updateDedupeRule(id: string, updates: any) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("crm.dedupe_rules")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/crm/settings")
  return { success: true }
}
