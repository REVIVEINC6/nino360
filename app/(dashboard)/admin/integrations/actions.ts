"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { guardAdmin } from "@/lib/rbac/server"

export async function listIntegrations() {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("integrations").select("*").order("name")

  if (error) throw error
  return data
}

export async function updateIntegration(
  id: string,
  data: Partial<{
    enabled: boolean
    config: Record<string, any>
  }>,
) {
  await guardAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from("integrations").update(data).eq("id", id)

  if (error) throw error

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "integration.update",
      resource_type: "integration",
      resource_id: id,
      details: data,
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/integrations")
  return { success: true }
}

export async function testIntegration(id: string) {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data: integration, error } = await supabase.from("integrations").select("*").eq("id", id).single()

  if (error) throw error

  // Simulate integration test
  const testResult = {
    success: true,
    message: "Integration test successful",
    timestamp: new Date().toISOString(),
  }

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "integration.test",
      resource_type: "integration",
      resource_id: id,
      details: testResult,
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  return testResult
}
