import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest, { params }: { params: { roleId: string } }) {
  try {
    const supabase = createClient()
    const { roleId } = params
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const action = searchParams.get("action")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    const offset = (page - 1) * limit

    // Build audit logs query
    let query = supabase
      .from("role_audit_logs")
      .select("*", { count: "exact" })
      .eq("role_id", roleId)
      .order("created_at", { ascending: false })

    // Apply filters
    if (action) {
      query = query.eq("action", action)
    }

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: auditLogs, error, count } = await query

    if (error) {
      console.error("Error fetching audit logs:", error)
      return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
    }

    // Get audit statistics
    const { data: auditStats } = await supabase.rpc("get_role_audit_stats", { p_role_id: roleId }).single()

    // Get role information
    const { data: role } = await supabase.from("esg_roles").select("name, description").eq("id", roleId).single()

    return NextResponse.json({
      data: {
        role,
        audit_logs: auditLogs || [],
        statistics: auditStats,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/roles/audit/[roleId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { roleId: string } }) {
  try {
    const supabase = createClient()
    const { roleId } = params
    const body = await request.json()

    const { action, resource_type, resource_id, old_values, new_values, metadata } = body

    // Create audit log entry
    const { data: auditLog, error } = await supabase
      .from("role_audit_logs")
      .insert({
        role_id: roleId,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        metadata,
        ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
        user_agent: request.headers.get("user-agent"),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating audit log:", error)
      return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 })
    }

    return NextResponse.json({ data: auditLog }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/admin/roles/audit/[roleId]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
