import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get billing statistics
    const { data: accounts, error: accountsError } = await supabase
      .from("billing_accounts")
      .select("status, mrr, arr, created_at")

    if (accountsError) {
      console.error("Error fetching billing accounts for stats:", accountsError)
      return NextResponse.json({ error: "Failed to fetch billing statistics" }, { status: 500 })
    }

    // Get overdue invoices count
    const { count: overdueCount, error: overdueError } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("status", "overdue")

    if (overdueError) {
      console.error("Error fetching overdue invoices:", overdueError)
    }

    // Get trial expiring today
    const today = new Date().toISOString().split("T")[0]
    const { count: trialExpiringCount, error: trialError } = await supabase
      .from("billing_accounts")
      .select("*", { count: "exact", head: true })
      .eq("status", "trial")
      .gte("trial_end", today)
      .lt("trial_end", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])

    if (trialError) {
      console.error("Error fetching trial expiring accounts:", trialError)
    }

    // Calculate statistics
    const activeAccounts = accounts?.filter((acc) => acc.status === "active") || []
    const trialAccounts = accounts?.filter((acc) => acc.status === "trial") || []

    const totalMRR = activeAccounts.reduce((sum, acc) => sum + (acc.mrr || 0), 0)
    const totalARR = activeAccounts.reduce((sum, acc) => sum + (acc.arr || 0), 0)

    // Calculate growth (simplified - comparing last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const recentAccounts = activeAccounts.filter((acc) => acc.created_at > thirtyDaysAgo)
    const recentMRR = recentAccounts.reduce((sum, acc) => sum + (acc.mrr || 0), 0)
    const revenueGrowth = totalMRR > 0 ? (recentMRR / totalMRR) * 100 : 0

    // Calculate ARPU
    const averageRevenuePerUser = activeAccounts.length > 0 ? totalMRR / activeAccounts.length : 0

    // Calculate churn rate (simplified)
    const churnRate = accounts
      ? (accounts.filter((acc) => acc.status === "canceled").length / accounts.length) * 100
      : 0

    const stats = {
      total_mrr: totalMRR,
      total_arr: totalARR,
      active_tenants: activeAccounts.length,
      trial_tenants: trialAccounts.length,
      overdue_invoices: overdueCount || 0,
      trial_expiring_today: trialExpiringCount || 0,
      revenue_growth: revenueGrowth,
      churn_rate: churnRate,
      average_revenue_per_user: averageRevenuePerUser,
      total_outstanding: 0, // Would need to calculate from invoices
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error in billing stats API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
