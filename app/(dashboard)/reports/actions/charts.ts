"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function executeQuery(sql: string) {
  const supabase = createServerClient()

  // Security: Only allow SELECT from rpt.* views
  if (!sql.trim().toLowerCase().startsWith("select")) {
    throw new Error("Only SELECT queries are allowed")
  }

  if (!sql.includes("rpt.")) {
    throw new Error("Only rpt.* views are allowed")
  }

  const { data, error } = await supabase.rpc("execute_safe_query", { query_sql: sql })

  if (error) throw error

  return {
    rows: data || [],
    cols: data && data.length > 0 ? Object.keys(data[0]) : [],
  }
}

export async function getKpiSeries(view: string, yKeys: string[], days = 30) {
  const supabase = createServerClient()

  const { data } = await supabase
    .from(view)
    .select("*")
    .gte("d", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order("d", { ascending: true })

  return data || []
}
