import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

// GET /api/settings/export - Export settings
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, "settings-export", 5, 60)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: rateLimitResult.retryAfter },
        { status: 429 },
      )
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's tenant and permissions
    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return NextResponse.json({ error: "No tenant associated" }, { status: 403 })
    }

    // Check permissions
    const { data: permissions } = await supabase
      .from("user_permissions")
      .select("actions")
      .eq("user_id", user.id)
      .eq("resource", "settings")
      .single()

    const canExport = permissions?.actions?.includes("export") || permissions?.actions?.includes("*")
    if (!canExport) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"
    const category = searchParams.get("category")
    const includeSensitive = searchParams.get("includeSensitive") === "true"

    // Build query
    let query = supabase
      .from("application_settings")
      .select("*")
      .eq("tenant_id", userProfile.tenant_id)
      .eq("is_active", true)
      .is("deleted_at", null)

    if (category) {
      query = query.eq("category", category)
    }

    const { data: settings, error } = await query.order("category").order("key")

    if (error) {
      console.error("Settings export error:", error)
      return NextResponse.json({ error: "Failed to export settings" }, { status: 500 })
    }

    // Process settings data
    const processedSettings = settings?.map((setting) => {
      const processed = { ...setting }

      // Remove sensitive data if not allowed
      if (setting.is_sensitive && !includeSensitive) {
        processed.value = "[REDACTED]"
      }

      // Remove internal fields
      delete processed.tenant_id
      delete processed.created_by
      delete processed.updated_by
      delete processed.deleted_by
      delete processed.deleted_at

      return processed
    })

    // Log audit trail
    await supabase.from("audit_logs").insert({
      tenant_id: userProfile.tenant_id,
      user_id: user.id,
      action: "settings.export",
      resource_type: "settings",
      details: { format, category, count: settings?.length || 0 },
    })

    if (format === "csv") {
      // Convert to CSV
      const headers = ["category", "key", "value", "description", "is_sensitive", "is_system_setting"]
      const csvRows = [headers.join(",")]

      processedSettings?.forEach((setting) => {
        const row = headers.map((header) => {
          const value = setting[header]
          return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
        })
        csvRows.push(row.join(","))
      })

      const csvContent = csvRows.join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="settings-${Date.now()}.csv"`,
        },
      })
    }

    // Default JSON format
    return NextResponse.json({
      success: true,
      data: processedSettings,
      meta: {
        exported_at: new Date().toISOString(),
        format,
        category,
        count: processedSettings?.length || 0,
      },
    })
  } catch (error) {
    console.error("Settings export API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
