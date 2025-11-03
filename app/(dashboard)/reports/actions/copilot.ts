"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function askCopilot(prompt: string) {
  // Generate a best-effort SQL and return rows from the reporting view.
  // In production this would call an Edge Function or AI-assisted SQL generator.
  const sql = `SELECT d, ar_invoiced, ar_collected FROM rpt.kpi_finance_daily WHERE d >= NOW() - INTERVAL '90 days' ORDER BY d`

  const supabase = await createServerClient()
  const { data } = await supabase
    .from("rpt.kpi_finance_daily")
    .select("d, ar_invoiced, ar_collected")
    .gte("d", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .order("d", { ascending: true })

  return {
    sql,
    viz: "line",
    x: "d",
    y: ["ar_invoiced", "ar_collected"],
    rows: data || [],
    cols: ["d", "ar_invoiced", "ar_collected"],
  }
}
