import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { format = "json" } = body

    // Fetch all user data
    const [
      { data: profile },
      { data: skills },
      { data: preferences },
      { data: insights },
      { data: goals },
      { data: personality },
      { data: activities },
    ] = await Promise.all([
      supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("user_skills").select("*").eq("user_id", user.id),
      supabase.from("user_preferences").select("*").eq("user_id", user.id).single(),
      supabase.from("ai_insights").select("*").eq("user_id", user.id),
      supabase.from("user_goals").select("*, goal_milestones(*)").eq("user_id", user.id),
      supabase.from("user_personality_analysis").select("*").eq("user_id", user.id).single(),
      supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100),
    ])

    const exportData = {
      user_info: {
        id: user.id,
        email: user.email,
        export_date: new Date().toISOString(),
      },
      profile: profile || {},
      skills: skills || [],
      preferences: preferences || {},
      goals: goals || [],
      ai_insights: insights || [],
      personality_analysis: personality || {},
      recent_activities: activities || [],
    }

    if (format === "csv") {
      // Convert to CSV format
      const csvData = convertToCSV(exportData)
      return new NextResponse(csvData, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="profile-export-${Date.now()}.csv"`,
        },
      })
    } else {
      // Return JSON format
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="profile-export-${Date.now()}.json"`,
        },
      })
    }
  } catch (error) {
    console.error("Export API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function convertToCSV(data: any): string {
  const csvRows = []

  // Add headers
  csvRows.push("Section,Field,Value")

  // Add profile data
  if (data.profile) {
    Object.entries(data.profile).forEach(([key, value]) => {
      csvRows.push(`Profile,${key},"${String(value).replace(/"/g, '""')}"`)
    })
  }

  // Add skills data
  if (data.skills && Array.isArray(data.skills)) {
    data.skills.forEach((skill: any, index: number) => {
      Object.entries(skill).forEach(([key, value]) => {
        csvRows.push(`Skill ${index + 1},${key},"${String(value).replace(/"/g, '""')}"`)
      })
    })
  }

  // Add preferences data
  if (data.preferences) {
    Object.entries(data.preferences).forEach(([key, value]) => {
      csvRows.push(`Preferences,${key},"${String(value).replace(/"/g, '""')}"`)
    })
  }

  // Add goals data
  if (data.goals && Array.isArray(data.goals)) {
    data.goals.forEach((goal: any, index: number) => {
      Object.entries(goal).forEach(([key, value]) => {
        csvRows.push(`Goal ${index + 1},${key},"${String(value).replace(/"/g, '""')}"`)
      })
    })
  }

  // Add AI insights data
  if (data.ai_insights && Array.isArray(data.ai_insights)) {
    data.ai_insights.forEach((insight: any, index: number) => {
      Object.entries(insight).forEach(([key, value]) => {
        csvRows.push(`AI Insight ${index + 1},${key},"${String(value).replace(/"/g, '""')}"`)
      })
    })
  }

  // Add personality analysis data
  if (data.personality_analysis) {
    Object.entries(data.personality_analysis).forEach(([key, value]) => {
      csvRows.push(`Personality Analysis,${key},"${String(value).replace(/"/g, '""')}"`)
    })
  }

  // Add recent activities data
  if (data.recent_activities && Array.isArray(data.recent_activities)) {
    data.recent_activities.forEach((activity: any, index: number) => {
      Object.entries(activity).forEach(([key, value]) => {
        csvRows.push(`Recent Activity ${index + 1},${key},"${String(value).replace(/"/g, '""')}"`)
      })
    })
  }

  return csvRows.join("\n")
}
