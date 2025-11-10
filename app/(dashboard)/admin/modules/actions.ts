"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { guardAdmin } from "@/lib/rbac/server"

export async function listModules() {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("modules").select("*").order("name")

  if (error) throw error
  return data
}

export async function listPlans() {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("subscription_plans").select("*").order("name")

  if (error) throw error
  return data
}

export async function listPlanModules() {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("plan_modules").select(`
      *,
      module:modules(*),
      plan:subscription_plans(*)
    `)

  if (error) throw error
  return data
}

export async function updatePlanModule(planId: string, moduleId: string, enabled: boolean) {
  await guardAdmin()
  const supabase = await createServerClient()

  if (enabled) {
    const { error } = await supabase
      .from("plan_modules")
      .upsert({ plan_id: planId, module_id: moduleId, enabled: true })

    if (error) throw error
  } else {
    const { error } = await supabase.from("plan_modules").delete().match({ plan_id: planId, module_id: moduleId })

    if (error) throw error
  }

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: enabled ? "plan_module.enable" : "plan_module.disable",
      resource_type: "plan_module",
      resource_id: `${planId}:${moduleId}`,
      details: { plan_id: planId, module_id: moduleId, enabled },
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/modules")
  return { success: true }
}

export async function createModule(data: { name: string; key: string; description?: string }) {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data: module, error } = await supabase.from("modules").insert(data).select().single()

  if (error) throw error

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "module.create",
      resource_type: "module",
      resource_id: module.id,
      details: data,
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/modules")
  return module
}
