import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
export const dynamic = 'force-dynamic'

// Admin client: use getSupabaseServerClient when keys are available, otherwise fall back to createClient mock
let supabaseAdmin: any = null
function getAdminClient() {
  if (!supabaseAdmin) {
    // Create lazily at request time; createClient will return mock if env missing
    supabaseAdmin = createClient()
  }
  return supabaseAdmin
}

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

    // Fetch user goals with milestones
    const { data: goals, error: goalsError } = await supabase
      .from("user_goals")
      .select(`
        *,
        goal_milestones (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (goalsError) {
      console.error("Goals fetch error:", goalsError)
      return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: goals || [],
    })
  } catch (error) {
    console.error("Goals API error:", error)
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

    // Get user profile for goal generation
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    // Generate AI goals based on profile
    const aiGoals = generateAIGoals(profile)

    // Insert goals and milestones
    for (const goal of aiGoals) {
      const { data: insertedGoal, error: goalError } = await supabase
        .from("user_goals")
        .insert({
          user_id: user.id,
          title: goal.title,
          description: goal.description,
          category: goal.category,
          target_date: goal.target_date,
          progress: 0,
          is_ai_generated: true,
        })
        .select()
        .single()

      if (goalError) {
        console.error("Goal insert error:", goalError)
        continue
      }

      // Insert milestones for this goal
      if (goal.milestones && goal.milestones.length > 0) {
        const milestonesToInsert = goal.milestones.map((milestone: any) => ({
          goal_id: insertedGoal.id,
          title: milestone.title,
          description: milestone.description,
          target_date: milestone.target_date,
          is_completed: false,
        }))

        await supabase.from("goal_milestones").insert(milestonesToInsert)
      }
    }

    // Fetch updated goals
    const { data: updatedGoals } = await supabase
      .from("user_goals")
      .select(`
        *,
        goal_milestones (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return NextResponse.json({
      success: true,
      data: updatedGoals || [],
    })
  } catch (error) {
    console.error("Goals generation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { goalId, progress, milestoneId, completed } = body

    if (goalId && typeof progress === "number") {
      // Update goal progress
      const { error: updateError } = await supabase
        .from("user_goals")
        .update({
          progress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", goalId)
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Goal update error:", updateError)
        return NextResponse.json({ error: "Failed to update goal" }, { status: 500 })
      }
    }

    if (milestoneId && typeof completed === "boolean") {
      // Update milestone completion
      const { error: milestoneError } = await supabase
        .from("goal_milestones")
        .update({
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", milestoneId)

      if (milestoneError) {
        console.error("Milestone update error:", milestoneError)
        return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Goal updated successfully",
    })
  } catch (error) {
    console.error("Goals update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateAIGoals(profile: any) {
  const goals = []
  const currentDate = new Date()

  // Career development goal
  goals.push({
    title: "Professional Development",
    description: "Enhance your professional skills and advance your career",
    category: "career",
    target_date: new Date(currentDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
    milestones: [
      {
        title: "Complete Skills Assessment",
        description: "Identify current skill gaps and areas for improvement",
        target_date: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Enroll in Training Program",
        description: "Sign up for relevant professional development courses",
        target_date: new Date(currentDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Apply New Skills",
        description: "Implement learned skills in current projects",
        target_date: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  // Networking goal
  goals.push({
    title: "Professional Networking",
    description: "Build and expand your professional network",
    category: "networking",
    target_date: new Date(currentDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    milestones: [
      {
        title: "Update LinkedIn Profile",
        description: "Optimize your LinkedIn profile with current information",
        target_date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Attend Industry Events",
        description: "Participate in at least 2 industry networking events",
        target_date: new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "Connect with Peers",
        description: "Make 10 new professional connections",
        target_date: new Date(currentDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  })

  return goals
}
