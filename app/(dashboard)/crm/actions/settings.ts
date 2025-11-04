"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logger } from "@/lib/logger"

async function getUserAndTenantId() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) {
      logger.error("getUser failed", userError)
      return { supabase, user: null, tenantId: null }
    }
    if (!user) {
      return { supabase, user: null, tenantId: null }
    }
    const { data: userTenant, error: tenantError } = await supabase
      .from("user_tenants")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single()
    if (tenantError) {
      logger.warn("user_tenants lookup failed", tenantError)
      return { supabase, user, tenantId: null }
    }
    return { supabase, user, tenantId: userTenant?.tenant_id ?? null }
  } catch (e) {
    logger.error("getUserAndTenantId unexpected error", e)
    return { supabase: await createServerClient(), user: null, tenantId: null }
  }
}

export async function getSettings() {
  const { supabase, user, tenantId } = await getUserAndTenantId()
  if (!user || !tenantId) {
    // Return null to let client fall back to defaults without throwing
    return null
  }
  const { data: settings, error } = await supabase
    .from("crm.settings")
    .select("*")
    .eq("tenant_id", tenantId)
    .single()
  if (error) {
    logger.warn("getSettings query error", error)
  }
  return settings ?? null
}

export async function updateSettings(updates: any) {
  const { supabase, user, tenantId } = await getUserAndTenantId()
  if (!user || !tenantId) {
    return { success: false, error: "unauthorized" }
  }
  const { error } = await supabase.from("crm.settings").upsert({
    tenant_id: tenantId,
    ...updates,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  })
  if (error) {
    logger.error("updateSettings error", error)
    return { success: false, error: "db_error" }
  }
  revalidatePath("/crm/settings")
  return { success: true }
}

export async function getPipelineStages() {
  const { supabase, user, tenantId } = await getUserAndTenantId()
  if (!user || !tenantId) {
    return []
  }
  const { data: stages, error } = await supabase
    .from("crm.pipeline_stages")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .order("display_order")
  if (error) {
    logger.warn("getPipelineStages query error", error)
  }
  return stages || []
}

export async function createPipelineStage(stage: any) {
  const { supabase, user, tenantId } = await getUserAndTenantId()
  if (!user || !tenantId) {
    return { success: false, error: "unauthorized" }
  }
  const { error } = await supabase.from("crm.pipeline_stages").insert({
    tenant_id: tenantId,
    ...stage,
    created_by: user.id,
  })
  if (error) {
    logger.error("createPipelineStage error", error)
    return { success: false, error: "db_error" }
  }
  revalidatePath("/crm/settings")
  return { success: true }
}

export async function updatePipelineStage(id: string, updates: any) {
  const { supabase, user } = await getUserAndTenantId()
  if (!user) {
    return { success: false, error: "unauthorized" }
  }
  const { error } = await supabase
    .from("crm.pipeline_stages")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", id)
  if (error) {
    logger.error("updatePipelineStage error", error)
    return { success: false, error: "db_error" }
  }
  revalidatePath("/crm/settings")
  return { success: true }
}

export async function getSLARules() {
  const { supabase, user, tenantId } = await getUserAndTenantId()
  if (!user || !tenantId) {
    return []
  }
  const { data: rules, error } = await supabase
    .from("crm.sla_rules")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
  if (error) {
    logger.warn("getSLARules query error", error)
  }
  return rules || []
}

export async function updateSLARule(id: string, updates: any) {
  const { supabase, user } = await getUserAndTenantId()
  if (!user) {
    return { success: false, error: "unauthorized" }
  }
  const { error } = await supabase
    .from("crm.sla_rules")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) {
    logger.error("updateSLARule error", error)
    return { success: false, error: "db_error" }
  }
  revalidatePath("/crm/settings")
  return { success: true }
}

export async function getDedupeRules() {
  const { supabase, user, tenantId } = await getUserAndTenantId()
  if (!user || !tenantId) {
    return []
  }
  const { data: rules, error } = await supabase
    .from("crm.dedupe_rules")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
  if (error) {
    logger.warn("getDedupeRules query error", error)
  }
  return rules || []
}

export async function updateDedupeRule(id: string, updates: any) {
  const { supabase, user } = await getUserAndTenantId()
  if (!user) {
    return { success: false, error: "unauthorized" }
  }
  const { error } = await supabase
    .from("crm.dedupe_rules")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
  if (error) {
    logger.error("updateDedupeRule error", error)
    return { success: false, error: "db_error" }
  }
  revalidatePath("/crm/settings")
  return { success: true }
}
