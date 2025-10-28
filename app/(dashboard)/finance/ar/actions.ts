"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getARData() {
  const supabase = await createServerClient()

  // Get AR aging data
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, clients(*)")
    .eq("status", "sent")
    .order("due_date", { ascending: true })

  return { invoices: invoices || [] }
}
