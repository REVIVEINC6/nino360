import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { z } from "zod"

const updateRoleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  permissions: z.record(z.array(z.string())).optional(),
  field_permissions: z.record(z.any()).optional(),
  is_active: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get role details
    const { data: role, error } = await supabase.from("esg_roles").select("*").eq("id", id).single()

    if (error || !role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    // Get user assignments
    const { data: assignments } = await supabase
      .from("user_role_assignments")
      .select(`
        *,
        users:user_id (
          id,
          email,
          full_name
        )
      `)
      .eq("role_id", id)
      .eq("is_active", true)

    // Get audit logs
    const { data: auditLogs } = await supabase
      .from("role_audit_logs")
      .select("*")
      .eq("role_id", id)
      .order("created_at", { ascending: false })
      .limit(50)

    // Get AI insights
    const { data: aiInsights } = await supabase
      .from("role_ai_insights")
      .select("*")
      .eq("role_id", id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    // Get usage statistics
    const { data: usageStats } = await supabase.rpc("get_role_usage_stats").eq("role_id", id).single()

    // Get audit statistics
    const { data: auditStats } = await supabase.rpc("get_role_audit_stats", { p_role_id: id }).single()

    return NextResponse.json({
      data: {
        role,
        assignments: assignments || [],
        audit_logs: auditLogs || [],
        ai_insights: aiInsights || [],
        usage_stats: usageStats,
        audit_stats: auditStats,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/roles/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params
    const body = await request.json()

    const validatedData = updateRoleSchema.parse(body)

    // Get current role for audit logging
    const { data: currentRole, error: fetchError } = await supabase.from("esg_roles").select("*").eq("id", id).single()

    if (fetchError || !currentRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    // Check if name is being changed and if it conflicts
    if (validatedData.name && validatedData.name !== currentRole.name) {
      const { data: existingRole } = await supabase
        .from("esg_roles")
        .select("id")
        .eq("name", validatedData.name)
        .eq("scope", currentRole.scope)
        .eq("tenant_id", currentRole.tenant_id)
        .neq("id", id)
        .single()

      if (existingRole) {
        return NextResponse.json({ error: "Role with this name already exists in this scope" }, { status: 409 })
      }
    }

    // Update the role
    const { data: updatedRole, error: updateError } = await supabase
      .from("esg_roles")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating role:", updateError)
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
    }

    // Log the update
    await supabase.from("role_audit_logs").insert({
      tenant_id: currentRole.tenant_id,
      role_id: id,
      action: "update",
      resource_type: "role",
      resource_id: id,
      old_values: currentRole,
      new_values: validatedData,
    })

    return NextResponse.json({ data: updatedRole })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error in PUT /api/admin/roles/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { id } = params

    // Get current role for audit logging
    const { data: currentRole, error: fetchError } = await supabase.from("esg_roles").select("*").eq("id", id).single()

    if (fetchError || !currentRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    // Check if role is system-defined
    if (currentRole.is_system_defined) {
      return NextResponse.json({ error: "Cannot delete system-defined roles" }, { status: 403 })
    }

    // Check if role has active assignments
    const { count: activeAssignments } = await supabase
      .from("user_role_assignments")
      .select("*", { count: "exact", head: true })
      .eq("role_id", id)
      .eq("is_active", true)

    if (activeAssignments && activeAssignments > 0) {
      return NextResponse.json(
        { error: "Cannot delete role with active user assignments. Please revoke all assignments first." },
        { status: 409 },
      )
    }

    // Soft delete the role
    const { error: deleteError } = await supabase
      .from("esg_roles")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (deleteError) {
      console.error("Error deleting role:", deleteError)
      return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
    }

    // Log the deletion
    await supabase.from("role_audit_logs").insert({
      tenant_id: currentRole.tenant_id,
      role_id: id,
      action: "delete",
      resource_type: "role",
      resource_id: id,
      old_values: currentRole,
    })

    return NextResponse.json({ message: "Role deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/admin/roles/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
