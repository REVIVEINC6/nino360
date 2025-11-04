"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getAPData() {
  const supabase = await createServerClient()

  // Get AP aging data
  const { data: bills } = await supabase
    .from("bills")
    .select("*, vendor:vendors(name)")
    .eq("status", "unpaid")
    .order("due_date", { ascending: true })

  return { bills: bills || [] }
}
