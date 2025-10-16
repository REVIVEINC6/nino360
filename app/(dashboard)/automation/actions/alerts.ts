"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function listAlerts(filters?: {
  severity?: string
  status?: string
  rule_id?: string
  limit?: number
}) {
  const supabase = await createServerClient()

  let query = supabase.from("auto.alerts").select("*, rule:auto.rules(name)").order("created_at", { ascending: false })

  if (filters?.severity) {
    query = query.eq("severity", filters.severity)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.rule_id) {
    query = query.eq("rule_id", filters.rule_id)
  }

  query = query.limit(filters?.limit || 500)

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data || []
}

export async function muteAlert(id: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("auto.alerts").update({ status: "muted" }).eq("id", id).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/automation/alerts")
  return data
}

export async function snoozeAlert(id: string, hours: number) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("auto.alerts")
    .update({ status: "snoozed" })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/automation/alerts")
  return data
}

export async function bulkMuteAlerts(ids: string[]) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("auto.alerts").update({ status: "muted" }).in("id", ids)

  if (error) throw new Error(error.message)

  revalidatePath("/automation/alerts")
  return { success: true }
}
