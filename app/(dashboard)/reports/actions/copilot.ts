"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function askCopilot(prompt: string) {
  // For now, return mock data
  // In production, this would call Edge Functions for SQL generation and execution

  const mockSql = `SELECT d, ar_invoiced, ar_collected FROM rpt.kpi_finance_daily WHERE d >= NOW() - INTERVAL '90 days' ORDER BY d`

  const supabase = await createServerClient()
  const { data } = await supabase
    .from("rpt.kpi_finance_daily")
    .select("d, ar_invoiced, ar_collected")
    .gte("d", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .order("d", { ascending: true })

  return {
    sql: mockSql,
    viz: "line",
    x: "d",
    y: ["ar_invoiced", "ar_collected"],
    rows: data || [],
    cols: ["d", "ar_invoiced", "ar_collected"],
  }
}
