export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"

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

    // Fetch user profile with related data
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select(`
        *,
        user_skills (
          id,
          skill_name,
          proficiency_level,
          years_experience,
          is_primary
        ),
        user_preferences (
          *
        )
      `)
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      console.error("Profile fetch error:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: profile || {},
        skills: profile?.user_skills || [],
        preferences: profile?.user_preferences?.[0] || {},
      },
    })
  } catch (error) {
    console.error("Profile API error:", error)
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
    const { profile, skills, preferences } = body

    // Update profile
    if (profile) {
      const { error: profileError } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Profile update error:", profileError)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
      }
    }

    // Update skills
    if (skills && Array.isArray(skills)) {
      // Delete existing skills
      await supabase.from("user_skills").delete().eq("user_id", user.id)

      // Insert new skills
      if (skills.length > 0) {
        const skillsToInsert = skills.map((skill) => ({
          user_id: user.id,
          skill_name: skill.skill_name,
          proficiency_level: skill.proficiency_level || "Beginner",
          years_experience: skill.years_experience || 0,
          is_primary: skill.is_primary || false,
        }))

        const { error: skillsError } = await supabase.from("user_skills").insert(skillsToInsert)

        if (skillsError) {
          console.error("Skills update error:", skillsError)
          return NextResponse.json({ error: "Failed to update skills" }, { status: 500 })
        }
      }
    }

    // Update preferences
    if (preferences) {
      const { error: preferencesError } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      })

      if (preferencesError) {
        console.error("Preferences update error:", preferencesError)
        return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
