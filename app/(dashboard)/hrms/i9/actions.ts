"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getI9Records() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("i9_records")
    .select(`
      *,
      employee:employees(id, first_name, last_name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getI9Stats() {
  const supabase = await createServerClient()

  const [compliant, expiring, expired, pending] = await Promise.all([
    supabase.from("i9_records").select("id", { count: "exact" }).eq("status", "compliant"),
    supabase.from("i9_records").select("id", { count: "exact" }).eq("status", "expiring_soon"),
    supabase.from("i9_records").select("id", { count: "exact" }).eq("status", "expired"),
    supabase.from("i9_records").select("id", { count: "exact" }).eq("status", "pending"),
  ])

  return {
    compliant: compliant.count || 0,
    expiring: expiring.count || 0,
    expired: expired.count || 0,
    pending: pending.count || 0,
  }
}
