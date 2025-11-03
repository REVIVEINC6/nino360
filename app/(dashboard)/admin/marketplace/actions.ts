"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { guardAdmin } from "@/lib/rbac/server"

export async function listAddons() {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("marketplace_addons").select("*").order("name")

  if (error) throw error
  return data
}

export async function createAddon(data: {
  name: string
  sku: string
  description?: string
  price: number
  billing_cycle: string
  category: string
}) {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data: addon, error } = await supabase.from("marketplace_addons").insert(data).select().single()

  if (error) throw error

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "addon.create",
      resource_type: "addon",
      resource_id: addon.id,
      details: data,
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/marketplace")
  return addon
}

export async function updateAddon(
  id: string,
  data: Partial<{
    name: string
    description: string
    price: number
    active: boolean
  }>,
) {
  await guardAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from("marketplace_addons").update(data).eq("id", id)

  if (error) throw error

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "addon.update",
      resource_type: "addon",
      resource_id: id,
      details: data,
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/marketplace")
  return { success: true }
}

export async function deleteAddon(id: string) {
  await guardAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from("marketplace_addons").delete().eq("id", id)

  if (error) throw error

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "addon.delete",
      resource_type: "addon",
      resource_id: id,
      details: {},
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/marketplace")
  return { success: true }
}
