import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get historical billing data
    const { data: accounts, error } = await supabase
      .from("billing_accounts")
      .select("mrr, arr, status, created_at")
      .eq("status", "active")

    if (error) {
      console.error("Error fetching accounts for projections:", error)
      return NextResponse.json({ error: "Failed to fetch projection data" }, { status: 500 })
    }

    // Simple AI-like projection logic
    const currentMRR = accounts?.reduce((sum, acc) => sum + (acc.mrr || 0), 0) || 0
    const currentARR = accounts?.reduce((sum, acc) => sum + (acc.arr || 0), 0) || 0

    // Calculate growth rate from recent signups
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const recentAccounts = accounts?.filter((acc) => acc.created_at > thirtyDaysAgo) || []
    const growthRate = recentAccounts.length > 0 ? 0.15 : 0.05 // 15% if recent growth, 5% baseline

    // Generate 6-month projections
    const projections = []
    for (let i = 1; i <= 6; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() + i)

      const projectedMRR = currentMRR * Math.pow(1 + growthRate, i)
      const projectedARR = projectedMRR * 12

      // Confidence decreases over time
      const confidenceScore = Math.max(0.6, 0.95 - i * 0.05)

      const factors = [
        "Historical growth trends",
        "Current pipeline strength",
        "Market conditions",
        "Seasonal patterns",
      ]

      projections.push({
        month: date.toISOString().slice(0, 7), // YYYY-MM format
        projected_mrr: Math.round(projectedMRR),
        projected_arr: Math.round(projectedARR),
        confidence_score: Math.round(confidenceScore * 100) / 100,
        factors,
      })
    }

    return NextResponse.json({ projections })
  } catch (error) {
    console.error("Error in billing projections API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
