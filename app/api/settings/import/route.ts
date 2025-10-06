import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"
import { settingsSchema } from "@/lib/validations/settings"
import { z } from "zod"

export const dynamic = "force-dynamic"

// POST /api/settings/import - Import settings
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, "settings-import", 2, 60)
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

    const canImport = permissions?.actions?.includes("import") || permissions?.actions?.includes("*")
    if (!canImport) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const importSchema = z.object({
      settings: z.array(settingsSchema),
      overwrite: z.boolean().default(false),
    })

    const { settings, overwrite } = importSchema.parse(body)

    const results = []
    const errors = []

    // Process each setting
    for (const settingData of settings) {
      try {
        // Check if setting already exists
        const { data: existing } = await supabase
          .from("application_settings")
          .select("id")
          .eq("tenant_id", userProfile.tenant_id)
          .eq("category", settingData.category)
          .eq("key", settingData.key)
          .eq("is_active", true)
          .is("deleted_at", null)
          .single()

        if (existing && !overwrite) {
          errors.push({
            category: settingData.category,
            key: settingData.key,
            error: "Setting already exists and overwrite is disabled",
          })
          continue
        }

        if (existing && overwrite) {
          // Update existing setting
          const { data: updated, error } = await supabase
            .from("application_settings")
            .update({
              ...settingData,
              updated_by: user.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id)
            .select()
            .single()

          if (error) {
            errors.push({
              category: settingData.category,
              key: settingData.key,
              error: error.message,
            })
          } else {
            results.push({ ...updated, action: "updated" })
          }
        } else {
          // Create new setting
          const { data: created, error } = await supabase
            .from("application_settings")
            .insert({
              ...settingData,
              tenant_id: userProfile.tenant_id,
              created_by: user.id,
              updated_by: user.id,
            })
            .select()
            .single()

          if (error) {
            errors.push({
              category: settingData.category,
              key: settingData.key,
              error: error.message,
            })
          } else {
            results.push({ ...created, action: "created" })
          }
        }
      } catch (err) {
        errors.push({
          category: settingData.category,
          key: settingData.key,
          error: "Processing failed",
        })
      }
    }

    // Log audit trail
    await supabase.from("audit_logs").insert({
      tenant_id: userProfile.tenant_id,
      user_id: user.id,
      action: "settings.import",
      resource_type: "settings",
      details: {
        total: settings.length,
        imported: results.length,
        failed: errors.length,
        overwrite,
      },
    })

    return NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: settings.length,
        imported: results.length,
        failed: errors.length,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
  return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    console.error("Settings import API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
