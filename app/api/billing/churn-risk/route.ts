import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get billing accounts with usage data - fix the relationship reference
    const { data: accounts, error } = await supabase
      .from("billing_accounts")
      .select(`
        *,
        subscription_plans!subscription_plan_id (name)
      `)
      .in("status", ["active", "trial"])

    if (error) {
      console.error("Error fetching accounts for churn analysis:", error)
      return NextResponse.json({ error: "Failed to fetch churn risk data" }, { status: 500 })
    }

    // Simple churn risk calculation
    const churnRiskTenants =
      accounts
        ?.map((account) => {
          let riskScore = 0
          const factors: string[] = []
          const recommendations: string[] = []

          // Usage-based risk factors
          const usageRatio = (account.usage_current || 0) / (account.usage_limit || 1000)
          if (usageRatio < 0.1) {
            riskScore += 30
            factors.push("Very low usage")
            recommendations.push("Reach out for onboarding support")
          } else if (usageRatio < 0.3) {
            riskScore += 15
            factors.push("Low usage")
            recommendations.push("Provide usage optimization tips")
          }

          // Payment history risk
          if (!account.last_payment_date) {
            riskScore += 25
            factors.push("No payment history")
            recommendations.push("Follow up on payment setup")
          } else {
            const daysSincePayment = Math.floor(
              (Date.now() - new Date(account.last_payment_date).getTime()) / (1000 * 60 * 60 * 24),
            )
            if (daysSincePayment > 45) {
              riskScore += 20
              factors.push("Overdue payment")
              recommendations.push("Send payment reminder")
            }
          }

          // Trial status risk
          if (account.status === "trial") {
            const trialEnd = new Date(account.trial_end || "")
            const daysToExpiry = Math.floor((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            if (daysToExpiry <= 3) {
              riskScore += 40
              factors.push("Trial expiring soon")
              recommendations.push("Urgent: Convert to paid plan")
            } else if (daysToExpiry <= 7) {
              riskScore += 25
              factors.push("Trial ending soon")
              recommendations.push("Schedule conversion call")
            }
          }

          // Credit balance risk
          if ((account.credit_balance || 0) < 0) {
            riskScore += 35
            factors.push("Negative credit balance")
            recommendations.push("Address billing issues immediately")
          }

          // Determine risk level
          let riskLevel: "low" | "medium" | "high" | "critical"
          if (riskScore >= 70) riskLevel = "critical"
          else if (riskScore >= 50) riskLevel = "high"
          else if (riskScore >= 30) riskLevel = "medium"
          else riskLevel = "low"

          return {
            tenant_id: account.tenant_id,
            tenant_name: account.tenant_name || "Unknown Tenant",
            risk_score: Math.min(100, riskScore),
            risk_level: riskLevel,
            factors,
            recommendations,
            last_activity: account.updated_at,
            plan_name: account.subscription_plans?.name || "Unknown",
            mrr: account.mrr || 0,
          }
        })
        .filter((tenant) => tenant.risk_level !== "low") // Only return medium+ risk
        .sort((a, b) => b.risk_score - a.risk_score) || []

    return NextResponse.json({ tenants: churnRiskTenants })
  } catch (error) {
    console.error("Error in churn risk API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
