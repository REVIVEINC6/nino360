import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { advancedAI } from "@/lib/ai/advanced-ai"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get company data for AI analysis
    const { data: company, error } = await supabase
      .from("companies")
      .select(`
        *,
        company_contacts(count),
        company_opportunities(*),
        company_engagements(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    // Generate comprehensive AI insights
    const insights = await advancedAI.optimizeResources(id)

    // Generate additional insights based on company data
    const additionalInsights = {
      expansionProbability: calculateExpansionProbability(company),
      churnRisk: calculateChurnRisk(company),
      nextBestActions: generateNextBestActions(company),
      stakeholderRecommendations: generateStakeholderRecommendations(company),
      competitiveThreats: analyzeCompetitiveThreats(company),
      renewalPrediction: predictRenewal(company),
    }

    // Update company with latest AI insights
    await supabase
      .from("companies")
      .update({
        ai_insights: { ...insights, ...additionalInsights },
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    return NextResponse.json({
      success: true,
      data: {
        ...insights,
        ...additionalInsights,
      },
    })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({ error: "Failed to generate AI insights" }, { status: 500 })
  }
}

function calculateExpansionProbability(company: any): number {
  let probability = 50 // Base probability

  // Increase based on engagement score
  if (company.engagement_score > 80) probability += 30
  else if (company.engagement_score > 60) probability += 15

  // Increase based on deal count
  if (company.deal_count > 2) probability += 20
  else if (company.deal_count > 0) probability += 10

  // Increase based on status
  if (company.status === "customer") probability += 25
  else if (company.status === "strategic") probability += 35

  // Increase based on recent engagement
  const lastEngagement = new Date(company.last_engagement_date)
  const daysSinceLastEngagement = Math.floor((Date.now() - lastEngagement.getTime()) / (1000 * 60 * 60 * 24))
  if (daysSinceLastEngagement < 7) probability += 15
  else if (daysSinceLastEngagement < 30) probability += 5
  else if (daysSinceLastEngagement > 90) probability -= 20

  return Math.min(Math.max(probability, 0), 100)
}

function calculateChurnRisk(company: any): number {
  let risk = 20 // Base risk

  // Increase risk based on low engagement
  if (company.engagement_score < 40) risk += 40
  else if (company.engagement_score < 60) risk += 20

  // Increase risk based on lack of recent engagement
  const lastEngagement = new Date(company.last_engagement_date)
  const daysSinceLastEngagement = Math.floor((Date.now() - lastEngagement.getTime()) / (1000 * 60 * 60 * 24))
  if (daysSinceLastEngagement > 90) risk += 30
  else if (daysSinceLastEngagement > 60) risk += 15

  // Decrease risk for strategic accounts
  if (company.status === "strategic") risk -= 15
  if (company.is_pinned) risk -= 10

  return Math.min(Math.max(risk, 0), 100)
}

function generateNextBestActions(company: any): string[] {
  const actions = []

  if (company.engagement_score < 60) {
    actions.push("Schedule re-engagement call")
    actions.push("Send personalized value proposition")
  }

  if (company.deal_count === 0) {
    actions.push("Identify new opportunity")
    actions.push("Conduct needs assessment")
  }

  const daysSinceLastEngagement = Math.floor(
    (Date.now() - new Date(company.last_engagement_date).getTime()) / (1000 * 60 * 60 * 24),
  )
  if (daysSinceLastEngagement > 30) {
    actions.push("Schedule check-in meeting")
  }

  if (company.status === "prospect") {
    actions.push("Send case study relevant to their industry")
    actions.push("Invite to product demo")
  }

  return actions.slice(0, 3) // Return top 3 actions
}

function generateStakeholderRecommendations(company: any): string[] {
  const recommendations = []

  if (company.contact_count < 3) {
    recommendations.push("Expand stakeholder network - aim for 3+ contacts")
  }

  recommendations.push("Connect with decision makers in IT and Finance")
  recommendations.push("Identify champion within the organization")

  if (company.industry === "Technology") {
    recommendations.push("Engage with Chief Technology Officer")
  }

  return recommendations
}

function analyzeCompetitiveThreats(company: any): string[] {
  const threats = []

  if (company.engagement_score < 70) {
    threats.push("Low engagement may indicate competitor influence")
  }

  if (company.industry === "Technology") {
    threats.push("High competition from established tech vendors")
  }

  threats.push("Monitor for RFP processes that may include competitors")

  return threats
}

function predictRenewal(company: any): { probability: number; timeline: string; factors: string[] } {
  let probability = 70 // Base renewal probability

  const factors = []

  if (company.status === "customer") {
    probability += 20
    factors.push("Existing customer relationship")
  }

  if (company.engagement_score > 80) {
    probability += 15
    factors.push("High engagement score")
  } else if (company.engagement_score < 50) {
    probability -= 25
    factors.push("Low engagement concern")
  }

  if (company.is_pinned) {
    probability += 10
    factors.push("Strategic account status")
  }

  // Estimate timeline based on last engagement and deal patterns
  let timeline = "Q2 2024"
  const lastEngagement = new Date(company.last_engagement_date)
  const monthsSinceEngagement = Math.floor((Date.now() - lastEngagement.getTime()) / (1000 * 60 * 60 * 24 * 30))

  if (monthsSinceEngagement < 3) {
    timeline = "Q1 2024"
  } else if (monthsSinceEngagement > 6) {
    timeline = "Q3 2024"
  }

  return {
    probability: Math.min(Math.max(probability, 0), 100),
    timeline,
    factors,
  }
}
