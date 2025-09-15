import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { z } from "zod"

const fieldAccessSchema = z.object({
  role_id: z.string().uuid(),
  module: z.string(),
  table_name: z.string(),
  field_name: z.string(),
  access_level: z.enum(["none", "read", "read_write", "admin"]),
})

const bulkUpdateSchema = z.object({
  role_id: z.string().uuid(),
  field_permissions: z.record(z.any()),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const roleId = searchParams.get("role_id")
    const module = searchParams.get("module")

    if (!roleId) {
      return NextResponse.json({ error: "role_id is required" }, { status: 400 })
    }

    // Get role's current field permissions
    const { data: role, error: roleError } = await supabase
      .from("esg_roles")
      .select("id, name, field_permissions")
      .eq("id", roleId)
      .single()

    if (roleError || !role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    // Get field access definitions
    let fieldQuery = supabase
      .from("field_access_definitions")
      .select("*")
      .order("module")
      .order("table_name")
      .order("field_name")

    if (module) {
      fieldQuery = fieldQuery.eq("module", module)
    }

    const { data: fieldDefinitions, error: fieldError } = await fieldQuery

    if (fieldError) {
      console.error("Error fetching field definitions:", fieldError)
      return NextResponse.json({ error: "Failed to fetch field definitions" }, { status: 500 })
    }

    // Combine field definitions with current permissions
    const fieldAccess =
      fieldDefinitions?.map((field) => {
        const currentAccess = role.field_permissions?.[field.module]?.[field.table_name]?.[field.field_name] || "none"

        return {
          ...field,
          current_access: currentAccess,
          recommended_access: getRecommendedAccess(field, role.name),
        }
      }) || []

    // Group by module and table for easier UI consumption
    const groupedAccess = fieldAccess.reduce(
      (acc, field) => {
        if (!acc[field.module]) {
          acc[field.module] = {}
        }
        if (!acc[field.module][field.table_name]) {
          acc[field.module][field.table_name] = []
        }
        acc[field.module][field.table_name].push(field)
        return acc
      },
      {} as Record<string, Record<string, any[]>>,
    )

    return NextResponse.json({
      data: {
        role: role,
        field_access: fieldAccess,
        grouped_access: groupedAccess,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/roles/field-access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Check if this is a bulk update
    if (body.field_permissions) {
      const validatedData = bulkUpdateSchema.parse(body)

      // Get current role
      const { data: role, error: roleError } = await supabase
        .from("esg_roles")
        .select("*")
        .eq("id", validatedData.role_id)
        .single()

      if (roleError || !role) {
        return NextResponse.json({ error: "Role not found" }, { status: 404 })
      }

      // Update field permissions
      const { data: updatedRole, error: updateError } = await supabase
        .from("esg_roles")
        .update({
          field_permissions: validatedData.field_permissions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", validatedData.role_id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating field permissions:", updateError)
        return NextResponse.json({ error: "Failed to update field permissions" }, { status: 500 })
      }

      // Log the change
      await supabase.from("role_audit_logs").insert({
        tenant_id: role.tenant_id,
        role_id: validatedData.role_id,
        action: "update",
        resource_type: "field_permissions",
        resource_id: validatedData.role_id,
        old_values: { field_permissions: role.field_permissions },
        new_values: { field_permissions: validatedData.field_permissions },
      })

      return NextResponse.json({ data: updatedRole })
    } else {
      // Single field access update
      const validatedData = fieldAccessSchema.parse(body)

      // Get current role
      const { data: role, error: roleError } = await supabase
        .from("esg_roles")
        .select("*")
        .eq("id", validatedData.role_id)
        .single()

      if (roleError || !role) {
        return NextResponse.json({ error: "Role not found" }, { status: 404 })
      }

      // Update the specific field permission
      const currentPermissions = role.field_permissions || {}
      if (!currentPermissions[validatedData.module]) {
        currentPermissions[validatedData.module] = {}
      }
      if (!currentPermissions[validatedData.module][validatedData.table_name]) {
        currentPermissions[validatedData.module][validatedData.table_name] = {}
      }

      currentPermissions[validatedData.module][validatedData.table_name][validatedData.field_name] =
        validatedData.access_level

      // Update the role
      const { data: updatedRole, error: updateError } = await supabase
        .from("esg_roles")
        .update({
          field_permissions: currentPermissions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", validatedData.role_id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating field permission:", updateError)
        return NextResponse.json({ error: "Failed to update field permission" }, { status: 500 })
      }

      // Log the change
      await supabase.from("role_audit_logs").insert({
        tenant_id: role.tenant_id,
        role_id: validatedData.role_id,
        action: "update",
        resource_type: "field_permission",
        resource_id: `${validatedData.module}.${validatedData.table_name}.${validatedData.field_name}`,
        old_values: {
          field: validatedData.field_name,
          old_access:
            role.field_permissions?.[validatedData.module]?.[validatedData.table_name]?.[validatedData.field_name] ||
            "none",
        },
        new_values: {
          field: validatedData.field_name,
          new_access: validatedData.access_level,
        },
      })

      return NextResponse.json({ data: updatedRole })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error in POST /api/admin/roles/field-access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to get recommended access level based on field sensitivity and role
function getRecommendedAccess(field: any, roleName: string): string {
  const { sensitivity_level, is_pii, is_financial } = field

  // System roles get different recommendations
  if (roleName === "Super Administrator") {
    return "admin"
  }

  if (roleName === "Tenant Administrator") {
    return sensitivity_level >= 4 ? "read" : "read_write"
  }

  // High sensitivity fields (level 4-5) should be restricted
  if (sensitivity_level >= 4) {
    if (roleName === "Manager") {
      return is_financial ? "read" : "none"
    }
    return "none"
  }

  // PII fields need special handling
  if (is_pii) {
    if (roleName === "Manager") {
      return "read"
    }
    if (roleName === "Employee") {
      return "none"
    }
  }

  // Financial fields
  if (is_financial) {
    if (roleName === "Manager") {
      return "read"
    }
    return "none"
  }

  // Default recommendations
  if (roleName === "Manager") {
    return "read_write"
  }
  if (roleName === "Employee") {
    return "read"
  }

  return "none"
}
