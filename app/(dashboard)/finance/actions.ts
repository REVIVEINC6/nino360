"use server"

import { createClient } from "@/lib/supabase/server"

export async function getFinanceDashboardData() {
  const supabase = await createClient()

  // Get financial metrics
  const { data: metrics } = await supabase.rpc("get_finance_metrics")

  // Get revenue trends
  const { data: revenueTrends } = await supabase
    .from("revenue_tracking")
    .select("*")
    .order("period", { ascending: false })
    .limit(12)

  // Get expense breakdown
  const { data: expenses } = await supabase
    .from("expenses")
    .select("category, amount")
    .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  // Get recent invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return {
    metrics: metrics || {
      totalRevenue: 2450000,
      outstandingAR: 385000,
      outstandingAP: 142000,
      cashFlow: 1923000,
      profitMargin: 28.5,
      burnRate: 125000,
    },
    revenueTrends: revenueTrends || [],
    expenses: expenses || [],
    invoices: invoices || [],
  }
}
