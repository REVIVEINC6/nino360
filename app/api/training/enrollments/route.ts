import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const courseId = searchParams.get("course_id")
    const userId = searchParams.get("user_id")
    const search = searchParams.get("search")

    let query = supabase
      .from("training_enrollments")
      .select(`
        *,
        training_sessions (
          id,
          session_name,
          start_date,
          end_date,
          instructor,
          training_programs (
            id,
            title,
            category,
            level
          )
        ),
        users (
          id,
          first_name,
          last_name,
          email,
          avatar_url
        )
      `)
      .order("enrollment_date", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (courseId) {
      query = query.eq("training_sessions.program_id", courseId)
    }

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: enrollments, error } = await query

    if (error) {
      console.error("Error fetching enrollments:", error)
      return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
    }

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { session_id, user_id, status = "enrolled" } = body

    // Validate required fields
    if (!session_id || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabase
      .from("training_enrollments")
      .select("id")
      .eq("session_id", session_id)
      .eq("user_id", user_id)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({ error: "User already enrolled in this session" }, { status: 400 })
    }

    // Check session capacity
    const { data: session } = await supabase
      .from("training_sessions")
      .select("max_participants, current_participants")
      .eq("id", session_id)
      .single()

    if (session && session.current_participants >= session.max_participants) {
      return NextResponse.json({ error: "Session is full" }, { status: 400 })
    }

    const { data: enrollment, error } = await supabase
      .from("training_enrollments")
      .insert({
        session_id,
        user_id,
        status,
        enrollment_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating enrollment:", error)
      return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
    }

    // Update session participant count
    await supabase
      .from("training_sessions")
      .update({
        current_participants: (session?.current_participants || 0) + 1,
      })
      .eq("id", session_id)

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
