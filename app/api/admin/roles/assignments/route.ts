import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { z } from "zod"

const assignRoleSchema = z.object({
  user_id: z.string().uuid(),
  role_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  expires_at: z.string().datetime().optional(),
  assigned_by: z.string().uuid().optional(),
})

const bulkAssignSchema = z.object({
  user_ids: z.array(z.string().uuid()),
  role_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  expires_at: z.string().datetime().optional(),
  assigned_by: z.string().uuid().optional(),
})

const revokeAssignmentSchema = z.object({
  assignment_id: z.string().uuid(),
  revoked_by: z.string().uuid().optional(),
  reason: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const roleId = searchParams.get("role_id")
    const userId = searchParams.get("user_id")
    const tenantId = searchParams.get("tenant_id")
    const isActive = searchParams.get("is_active")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("user_role_assignments")
      .select(
        `
        *,
        esg_roles:role_id (
          id,
          name,
          description,
          scope
        ),
        users:user_id (
          id,
          email,
          full_name
        )
      `,
        { count: "exact" },
      )
      .order("assigned_at", { ascending: false })

    // Apply filters
    if (roleId) query = query.eq("role_id", roleId)
    if (userId) query = query.eq("user_id", userId)
    if (tenantId) query = query.eq("tenant_id", tenantId)
    if (isActive !== null) query = query.eq("is_active", isActive === "true")

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: assignments, error, count } = await query

    if (error) {
      console.error("Error fetching role assignments:", error)
      return NextResponse.json({ error: "Failed to fetch role assignments" }, { status: 500 })
    }

    return NextResponse.json({
      data: assignments || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/roles/assignments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Check if this is a bulk assignment
    if (body.user_ids) {
      const validatedData = bulkAssignSchema.parse(body)

      const assignments = validatedData.user_ids.map((userId) => ({
        user_id: userId,
        role_id: validatedData.role_id,
        tenant_id: validatedData.tenant_id || null,
        expires_at: validatedData.expires_at || null,
        assigned_by: validatedData.assigned_by || null,
      }))

      // Check for existing active assignments
      const { data: existingAssignments } = await supabase
        .from("user_role_assignments")
        .select("user_id")
        .eq("role_id", validatedData.role_id)
        .eq("is_active", true)
        .in("user_id", validatedData.user_ids)

      const existingUserIds = existingAssignments?.map((a) => a.user_id) || []
      const newAssignments = assignments.filter((a) => !existingUserIds.includes(a.user_id))

      if (newAssignments.length === 0) {
        return NextResponse.json({ error: "All users already have this role assigned" }, { status: 409 })
      }

      // Create bulk assignments
      const { data: createdAssignments, error } = await supabase
        .from("user_role_assignments")
        .insert(newAssignments)
        .select()

      if (error) {
        console.error("Error creating bulk role assignments:", error)
        return NextResponse.json({ error: "Failed to create role assignments" }, { status: 500 })
      }

      // Log the assignments
      for (const assignment of createdAssignments || []) {
        await supabase.from("role_audit_logs").insert({
          tenant_id: assignment.tenant_id,
          role_id: assignment.role_id,
          action: "assign",
          resource_type: "user_assignment",
          resource_id: assignment.id,
          new_values: assignment,
        })
      }

      return NextResponse.json({
        data: createdAssignments,
        message: `Successfully assigned role to ${newAssignments.length} users`,
      })
    } else {
      // Single assignment
      const validatedData = assignRoleSchema.parse(body)

      // Check for existing active assignment
      const { data: existingAssignment } = await supabase
        .from("user_role_assignments")
        .select("id")
        .eq("user_id", validatedData.user_id)
        .eq("role_id", validatedData.role_id)
        .eq("is_active", true)
        .single()

      if (existingAssignment) {
        return NextResponse.json({ error: "User already has this role assigned" }, { status: 409 })
      }

      // Create the assignment
      const { data: assignment, error } = await supabase
        .from("user_role_assignments")
        .insert({
          ...validatedData,
          tenant_id: validatedData.tenant_id || null,
          expires_at: validatedData.expires_at || null,
          assigned_by: validatedData.assigned_by || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating role assignment:", error)
        return NextResponse.json({ error: "Failed to create role assignment" }, { status: 500 })
      }

      // Log the assignment
      await supabase.from("role_audit_logs").insert({
        tenant_id: assignment.tenant_id,
        role_id: assignment.role_id,
        action: "assign",
        resource_type: "user_assignment",
        resource_id: assignment.id,
        new_values: assignment,
      })

      return NextResponse.json({ data: assignment }, { status: 201 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error in POST /api/admin/roles/assignments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const validatedData = revokeAssignmentSchema.parse(body)

    // Get current assignment for audit logging
    const { data: currentAssignment, error: fetchError } = await supabase
      .from("user_role_assignments")
      .select("*")
      .eq("id", validatedData.assignment_id)
      .single()

    if (fetchError || !currentAssignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Revoke the assignment
    const { data: revokedAssignment, error: revokeError } = await supabase
      .from("user_role_assignments")
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: validatedData.revoked_by || null,
        revocation_reason: validatedData.reason || null,
      })
      .eq("id", validatedData.assignment_id)
      .select()
      .single()

    if (revokeError) {
      console.error("Error revoking role assignment:", revokeError)
      return NextResponse.json({ error: "Failed to revoke role assignment" }, { status: 500 })
    }

    // Log the revocation
    await supabase.from("role_audit_logs").insert({
      tenant_id: currentAssignment.tenant_id,
      role_id: currentAssignment.role_id,
      action: "revoke",
      resource_type: "user_assignment",
      resource_id: currentAssignment.id,
      old_values: currentAssignment,
      new_values: { revoked: true, reason: validatedData.reason },
    })

    return NextResponse.json({ data: revokedAssignment })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error in DELETE /api/admin/roles/assignments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
