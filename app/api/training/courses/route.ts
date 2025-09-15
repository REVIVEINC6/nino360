import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
      .from("training_programs")
      .select(`
        *,
        training_sessions (
          id,
          session_name,
          start_date,
          end_date,
          current_participants,
          max_participants,
          status
        )
      `)
      .order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (level && level !== "all") {
      query = query.eq("level", level)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,instructor.ilike.%${search}%`)
    }

    const { data: courses, error } = await query

    if (error) {
      console.error("Error fetching courses:", error)
      return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
    }

    return NextResponse.json({ courses })
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
      title,
      description,
      category,
      level,
      duration_hours,
      format,
      instructor,
      max_participants,
      cost,
      currency = "USD",
      prerequisites = [],
      learning_objectives = [],
      certification_available = false,
      status = "draft",
    } = body

    // Validate required fields
    if (!title || !description || !category || !level || !instructor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: course, error } = await supabase
      .from("training_programs")
      .insert({
        title,
        description,
        category,
        level,
        duration_hours,
        format,
        instructor,
        max_participants,
        cost,
        currency,
        prerequisites,
        learning_objectives,
        certification_available,
        status,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating course:", error)
      return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
    }

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
