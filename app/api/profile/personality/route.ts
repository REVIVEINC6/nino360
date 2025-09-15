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

    // Fetch personality analysis
    const { data: personality, error: personalityError } = await supabase
      .from("user_personality_analysis")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (personalityError && personalityError.code !== "PGRST116") {
      console.error("Personality fetch error:", personalityError)
      return NextResponse.json({ error: "Failed to fetch personality analysis" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: personality || null,
    })
  } catch (error) {
    console.error("Personality API error:", error)
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

    // Get user profile and activity data for analysis
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    // Generate personality analysis
    const personalityAnalysis = generatePersonalityAnalysis(profile)

    // Store or update personality analysis
    const { data: insertedAnalysis, error: insertError } = await supabase
      .from("user_personality_analysis")
      .upsert({
        user_id: user.id,
        ...personalityAnalysis,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error("Personality analysis insert error:", insertError)
      return NextResponse.json({ error: "Failed to generate personality analysis" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: insertedAnalysis,
    })
  } catch (error) {
    console.error("Personality analysis API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generatePersonalityAnalysis(profile: any) {
  // Simulate AI personality analysis based on profile data
  const workStyles = ["Collaborative", "Independent", "Detail-oriented", "Big-picture thinker"]
  const communicationStyles = ["Direct", "Diplomatic", "Analytical", "Enthusiastic"]
  const learningPatterns = ["Visual learner", "Hands-on learner", "Theoretical learner", "Social learner"]

  // Generate productivity patterns based on profile
  const productivityPatterns = {
    peak_hours: ["9:00 AM - 11:00 AM", "2:00 PM - 4:00 PM"],
    focus_duration: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
    break_frequency: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
    preferred_environment: ["Quiet space", "Collaborative area", "Home office"][Math.floor(Math.random() * 3)],
  }

  // Generate stress indicators
  const stressIndicators = {
    stress_level: Math.floor(Math.random() * 10) + 1, // 1-10 scale
    stress_triggers: ["Tight deadlines", "Unclear requirements", "Multitasking"],
    coping_strategies: ["Take breaks", "Organize tasks", "Seek clarification"],
    recommended_actions: ["Practice time management", "Improve communication", "Set boundaries"],
  }

  return {
    work_style: workStyles[Math.floor(Math.random() * workStyles.length)],
    communication_style: communicationStyles[Math.floor(Math.random() * communicationStyles.length)],
    learning_pattern: learningPatterns[Math.floor(Math.random() * learningPatterns.length)],
    productivity_patterns: productivityPatterns,
    stress_indicators: stressIndicators,
    personality_traits: {
      openness: Math.floor(Math.random() * 100) + 1,
      conscientiousness: Math.floor(Math.random() * 100) + 1,
      extraversion: Math.floor(Math.random() * 100) + 1,
      agreeableness: Math.floor(Math.random() * 100) + 1,
      neuroticism: Math.floor(Math.random() * 100) + 1,
    },
    recommendations: [
      "Focus on collaborative projects to leverage your team-oriented approach",
      "Consider leadership roles that match your communication style",
      "Explore learning opportunities that align with your preferred learning pattern",
    ],
  }
}
