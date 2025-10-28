"use server"

import { createClient } from "@/lib/supabase/server"

export async function getAutomationRules() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("talent_automation_rules")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching automation rules:", error)
    return []
  }

  return data || []
}

export async function toggleAutomationRule(ruleId: string, enabled: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("talent_automation_rules")
    .update({ enabled, updated_at: new Date().toISOString() })
    .eq("id", ruleId)

  if (error) {
    console.error("[v0] Error toggling automation rule:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function createAutomationRule(data: {
  name: string
  description: string
  trigger: string
  category: string
  actions: string[]
}) {
  const supabase = await createClient()

  const { error } = await supabase.from("talent_automation_rules").insert({
    ...data,
    enabled: true,
    executions: 0,
    success_rate: 100,
  })

  if (error) {
    console.error("[v0] Error creating automation rule:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
