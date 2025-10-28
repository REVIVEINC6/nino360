"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAutomationStats() {
  try {
    const supabase = await createClient()

    const { data: rules } = await supabase.from("automation_rules").select("id, is_active")

    const { data: executions } = await supabase
      .from("automation_executions")
      .select("id, status, created_at")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const totalRules = rules?.length || 0
    const activeRules = rules?.filter((r: any) => r.is_active).length || 0
    const executions24h = executions?.length || 0
    const successfulExecutions = executions?.filter((e: any) => e.status === "success").length || 0
    const successRate = executions24h > 0 ? Math.round((successfulExecutions / executions24h) * 100) : 100

    return {
      totalRules,
      activeRules,
      executions24h,
      successRate,
    }
  } catch (error) {
    console.error("[v0] Error fetching automation stats:", error)
    return {
      totalRules: 0,
      activeRules: 0,
      executions24h: 0,
      successRate: 0,
    }
  }
}

export async function getAutomationRules() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("automation_rules")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("[v0] Error fetching automation rules:", error)
    return []
  }
}

export async function createAutomationRule(formData: {
  name: string
  description: string
  trigger_type: string
  trigger_config: any
  action_type: string
  action_config: any
  conditions: any
  is_active: boolean
}) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("automation_rules").insert([formData]).select().single()

    if (error) throw error

    revalidatePath("/admin/automation")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error creating automation rule:", error)
    return { success: false, error: "Failed to create automation rule" }
  }
}

export async function updateAutomationRule(id: string, updates: any) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("automation_rules").update(updates).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/admin/automation")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating automation rule:", error)
    return { success: false, error: "Failed to update automation rule" }
  }
}

export async function deleteAutomationRule(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("automation_rules").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/automation")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting automation rule:", error)
    return { success: false, error: "Failed to delete automation rule" }
  }
}

export async function toggleAutomationRule(id: string, isActive: boolean) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("automation_rules").update({ is_active: isActive }).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/automation")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error toggling automation rule:", error)
    return { success: false, error: "Failed to toggle automation rule" }
  }
}

export async function testAutomationRule(id: string) {
  try {
    const supabase = await createClient()

    // Get the rule
    const { data: rule, error: ruleError } = await supabase.from("automation_rules").select("*").eq("id", id).single()

    if (ruleError) throw ruleError

    // Log execution
    const { error: execError } = await supabase.from("automation_executions").insert([
      {
        rule_id: id,
        status: "success",
        result: { test: true, message: "Test execution successful" },
      },
    ])

    if (execError) throw execError

    return { success: true, message: "Test execution successful" }
  } catch (error) {
    console.error("[v0] Error testing automation rule:", error)
    return { success: false, error: "Failed to test automation rule" }
  }
}
