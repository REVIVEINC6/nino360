"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const ruleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_enabled: z.boolean().default(true),
  trigger_type: z.enum(["event", "schedule"]),
  event_key: z.string().optional(),
  schedule_rrule: z.string().optional(),
  condition_sql: z.string().min(10, "Condition SQL is required"),
  template_title: z.string().min(2, "Template title is required"),
  template_body_md: z.string().min(2, "Template body is required"),
  severity: z.enum(["info", "warning", "critical"]).default("info"),
  channel_ids: z.array(z.string().uuid()).default([]),
  throttle_seconds: z.number().int().min(0).default(900),
  digest_window_seconds: z.number().int().min(0).default(0),
  escalation_after_seconds: z.number().int().min(0).default(0),
  dedup_key_template: z.string().optional(),
})

export async function upsertRule(input: unknown) {
  const supabase = await createServerClient()
  const body = ruleSchema.parse(input)

  const { data, error } = await supabase.from("auto.rules").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/automation/rules")
  return data
}

export async function listRules() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("auto.rules").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function getRule(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("auto.rules").select("*").eq("id", id).single()

  if (error) throw new Error(error.message)
  return data
}

export async function toggleRule(id: string, enabled: boolean) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("auto.rules")
    .update({ is_enabled: enabled })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/automation/rules")
  return data
}

export async function deleteRule(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("auto.rules").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/automation/rules")
  return { success: true }
}
