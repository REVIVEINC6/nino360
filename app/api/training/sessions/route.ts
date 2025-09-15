import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const instructor = searchParams.get("instructor")
    const search = searchParams.get("search")

    let query = supabase
      .from("training_sessions")
      .select(`
        *,
        training_programs (
          id,
          title,
          category,
          level
        ),
        training_enrollments (
          id,
          user_id,
          status,
          progress_percentage
        )
      `)
      .order("start_date", { ascending: true })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (instructor && instructor !== "all") {
      query = query.eq("instructor", instructor)
    }

    if (search) {
      query = query.or(`session_name.ilike.%${search}%,location.ilike.%${search}%,instructor.ilike.%${search}%`)
    }

    const { data: sessions, error } = await query

    if (error) {
      console.error("Error fetching sessions:", error)
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      program_id,
      session_name,
      start_date,
      end_date,
      location,
      virtual_link,
      instructor,
      max_participants,
      materials = [],
      status = "scheduled",
    } = body

    // Validate required fields
    if (!program_id || !session_name || !start_date || !end_date || !instructor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: session, error } = await supabase
      .from("training_sessions")
      .insert({
        program_id,
        session_name,
        start_date,
        end_date,
        location,
        virtual_link,
        instructor,
        max_participants,
        materials,
        status,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating session:", error)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
