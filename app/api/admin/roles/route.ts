import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { z } from "zod"

const createRoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  scope: z.enum(["global", "tenant", "module"]),
  tenant_id: z.string().uuid().optional(),
  permissions: z.record(z.string(), z.array(z.string())).default({}),
  field_permissions: z.record(z.string(), z.any()).default({}),
  is_system_defined: z.boolean().default(false),
})

const updateRoleSchema = createRoleSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const scope = searchParams.get("scope")
    const tenantId = searchParams.get("tenant_id")
    const isActive = searchParams.get("is_active")

    const offset = (page - 1) * limit

    // Build query
    let query = supabase.from("esg_roles").select("*", { count: "exact" }).order("created_at", { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (scope) {
      query = query.eq("scope", scope)
    }

    if (tenantId) {
      query = query.eq("tenant_id", tenantId)
    }

    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true")
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: roles, error, count } = await query

    if (error) {
      console.error("Error fetching roles:", error)
      return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
    }

    // Get additional statistics for each role
    const rolesWithStats = await Promise.all(
      (roles || []).map(async (role) => {
        // Get user count
        const { count: userCount } = await supabase
          .from("user_role_assignments")
          .select("*", { count: "exact", head: true })
          .eq("role_id", role.id)
          .eq("is_active", true)

        // Get audit log count
        const { count: auditCount } = await supabase
          .from("role_audit_logs")
          .select("*", { count: "exact", head: true })
          .eq("role_id", role.id)

        // Get AI insights
        const { data: aiInsights } = await supabase
          .from("role_ai_insights")
          .select("risk_score, insight_type, confidence_score")
          .eq("role_id", role.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        return {
          ...role,
          user_count: userCount || 0,
          audit_count: auditCount || 0,
          ai_insights: aiInsights,
        }
      }),
    )

    return NextResponse.json({
      data: rolesWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in GET /api/admin/roles:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const validatedData = createRoleSchema.parse(body)

    // Check if role name already exists in the same scope
    const { data: existingRole } = await supabase
      .from("esg_roles")
      .select("id")
      .eq("name", validatedData.name)
      .eq("scope", validatedData.scope)
      .eq("tenant_id", validatedData.tenant_id || null)
      .single()

    if (existingRole) {
      return NextResponse.json({ error: "Role with this name already exists in this scope" }, { status: 409 })
    }

    // Create the role
    const { data: role, error } = await supabase
      .from("esg_roles")
      .insert({
        ...validatedData,
        tenant_id: validatedData.tenant_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating role:", error)
      return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
    }

    // Log the creation
    await supabase.from("role_audit_logs").insert({
      tenant_id: validatedData.tenant_id || null,
      role_id: role.id,
      action: "create",
      resource_type: "role",
      resource_id: role.id,
      new_values: validatedData,
    })

    return NextResponse.json({ data: role }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 })
    }

    console.error("Error in POST /api/admin/roles:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
