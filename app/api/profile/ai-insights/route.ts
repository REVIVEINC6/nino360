import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch AI insights
    const { data: insights, error: insightsError } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (insightsError) {
      console.error("Insights fetch error:", insightsError)
      return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: insights || [],
    })
  } catch (error) {
    console.error("AI Insights API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile for analysis
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    // Generate AI insights based on profile
    const insights = generateAIInsights(profile)

    // Store insights in database
    const insightsToInsert = insights.map((insight) => ({
      user_id: user.id,
      type: insight.type,
      title: insight.title,
      content: insight.content,
      priority: insight.priority,
      category: insight.category,
    }))

    const { data: insertedInsights, error: insertError } = await supabase
      .from("ai_insights")
      .insert(insightsToInsert)
      .select()

    if (insertError) {
      console.error("Insights insert error:", insertError)
      return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: insertedInsights,
    })
  } catch (error) {
    console.error("AI Insights generation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateAIInsights(profile: any) {
  const insights = []

  // Career development insights
  if (profile?.department) {
    insights.push({
      type: "recommendation",
      title: "Career Development Opportunity",
      content: `Based on your role in ${profile.department}, consider developing skills in data analysis and project management to advance your career.`,
      priority: "medium",
      category: "career",
    })
  }

  // Skill gap analysis
  insights.push({
    type: "warning",
    title: "Skill Gap Identified",
    content:
      "Industry trends show increasing demand for AI/ML skills in your field. Consider upskilling in these areas.",
    priority: "high",
    category: "skills",
  })

  // Performance insights
  insights.push({
    type: "achievement",
    title: "Performance Recognition",
    content: "Your consistent engagement and profile completeness indicate strong professional development habits.",
    priority: "low",
    category: "performance",
  })

  // Learning recommendations
  insights.push({
    type: "recommendation",
    title: "Learning Path Suggestion",
    content: "Based on your current skills, we recommend focusing on advanced communication and leadership training.",
    priority: "medium",
    category: "learning",
  })

  return insights
}
