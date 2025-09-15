import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const deleteType = searchParams.get("type") || "ai-only"

    if (deleteType === "ai-only") {
      // Delete only AI-generated data
      await Promise.all([
        supabase.from("ai_insights").delete().eq("user_id", user.id),
        supabase.from("user_personality_analysis").delete().eq("user_id", user.id),
        supabase.from("user_goals").delete().eq("user_id", user.id).eq("is_ai_generated", true),
      ])

      return NextResponse.json({
        success: true,
        message: "AI-generated data deleted successfully",
      })
    } else if (deleteType === "complete") {
      // Delete all profile data
      await Promise.all([
        supabase
          .from("goal_milestones")
          .delete()
          .in("goal_id", supabase.from("user_goals").select("id").eq("user_id", user.id)),
        supabase.from("user_goals").delete().eq("user_id", user.id),
        supabase.from("user_skills").delete().eq("user_id", user.id),
        supabase.from("user_preferences").delete().eq("user_id", user.id),
        supabase.from("ai_insights").delete().eq("user_id", user.id),
        supabase.from("user_personality_analysis").delete().eq("user_id", user.id),
        supabase.from("user_profiles").delete().eq("user_id", user.id),
      ])

      return NextResponse.json({
        success: true,
        message: "Complete profile deleted successfully",
      })
    } else {
      return NextResponse.json({ error: "Invalid delete type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Delete API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
