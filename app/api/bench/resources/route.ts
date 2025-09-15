import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get("status")
    const department = searchParams.get("department")
    const location = searchParams.get("location")
    const search = searchParams.get("search")

    let query = supabase
      .from("bench_resources")
      .select(`
        *,
        resource_skills (
          id,
          proficiency_level,
          years_experience,
          skills_matrix (
            id,
            name,
            category
          )
        ),
        project_allocations (
          id,
          project_name,
          client_name,
          start_date,
          end_date,
          status,
          allocation_percentage
        )
      `)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("availability_status", status)
    }

    if (department && department !== "all") {
      query = query.eq("department", department)
    }

    if (location && location !== "all") {
      query = query.eq("location", location)
    }

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,designation.ilike.%${search}%,email.ilike.%${search}%`,
      )
    }

    const { data: resources, error } = await query

    if (error) {
      console.error("Error fetching bench resources:", error)
      return NextResponse.json({ error: "Failed to fetch bench resources" }, { status: 500 })
    }

    return NextResponse.json({ resources })
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
      first_name,
      last_name,
      email,
      phone,
      location,
      department,
      designation,
      experience_years,
      availability_status = "available",
      billing_rate,
      cost_rate,
      skills = [],
      certifications = [],
      notes,
    } = body

    // Validate required fields
    if (!first_name || !last_name || !email || !department || !designation) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: resource, error } = await supabase
      .from("bench_resources")
      .insert({
        first_name,
        last_name,
        email,
        phone,
        location,
        department,
        designation,
        experience_years,
        availability_status,
        billing_rate,
        cost_rate,
        skills,
        certifications,
        notes,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating bench resource:", error)
      return NextResponse.json({ error: "Failed to create bench resource" }, { status: 500 })
    }

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
