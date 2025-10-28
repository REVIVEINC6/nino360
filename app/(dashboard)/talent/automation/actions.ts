"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getAutomationRules() {
  const supabase = await createServerClient()

  const { data: rules } = await supabase
    .from("talent_automation_rules")
    .select("*")
    .order("created_at", { ascending: false })

  return rules || []
}

export async function createAutomationRule(rule: any) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("talent_automation_rules").insert(rule).select().single()

  if (error) throw error
  return data
}

export async function updateAutomationRule(id: string, updates: any) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("talent_automation_rules").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteAutomationRule(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("talent_automation_rules").delete().eq("id", id)

  if (error) throw error
}
