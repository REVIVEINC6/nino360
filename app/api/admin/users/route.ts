import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    await rateLimit(request, "admin-read")

    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    let query = supabase.from("users").select(`
      *,
      tenant:tenants(name, domain)
    `)

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    if (role && role !== "all") {
      query = query.eq("role", role)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const {
      data: users,
      error,
      count,
    } = await query.range((page - 1) * limit, page * limit - 1).order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await rateLimit(request, "admin-write")

    const supabase = createClient()
    const body = await request.json()

    const { email, first_name, last_name, role, tenant_id } = body

    if (!email || !first_name || !last_name || !role) {
      return NextResponse.json({ error: "Email, name, and role are required" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        first_name,
        last_name,
        role,
        tenant_id,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
