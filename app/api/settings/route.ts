import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"
import { settingsSchema, bulkSettingsSchema } from "@/lib/validations/settings"
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  rateLimitResponse,
  validationErrorResponse,
  internalServerErrorResponse,
  paginatedResponse,
} from "@/lib/api-response"
import { z } from "zod"

export const dynamic = "force-dynamic"

// GET /api/settings - Retrieve settings
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, "settings-read", 100, 60)
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.retryAfter)
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return unauthorizedResponse()
    }

    // Get user's tenant and permissions
    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return forbiddenResponse("No tenant associated")
    }

    // Check permissions
    const { data: permissions } = await supabase
      .from("user_permissions")
      .select("actions")
      .eq("user_id", user.id)
      .eq("resource", "settings")
      .single()

    const canRead = permissions?.actions?.includes("read") || permissions?.actions?.includes("*")
    const canReadSensitive = permissions?.actions?.includes("read_sensitive")

    if (!canRead) {
      return forbiddenResponse("Insufficient permissions")
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const includeMetadata = searchParams.get("includeMetadata") === "true"
    const includeSensitive = searchParams.get("includeSensitive") === "true" && canReadSensitive
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50"), 100)
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("application_settings")
      .select("*", { count: "exact" })
      .eq("tenant_id", userProfile.tenant_id)
      .eq("is_active", true)
      .is("deleted_at", null)

    if (category) {
      query = query.eq("category", category)
    }

    // Execute query with pagination
    const {
      data: settings,
      error,
      count,
    } = await query
      .range(offset, offset + limit - 1)
      .order("category", { ascending: true })
      .order("key", { ascending: true })

    if (error) {
      console.error("Settings fetch error:", error)
      return internalServerErrorResponse("Failed to fetch settings")
    }

    // Process settings data
    const processedSettings = settings?.map((setting) => {
      const processed = { ...setting }

      // Remove sensitive data if user doesn't have permission
      if (setting.is_sensitive && !includeSensitive) {
        processed.value = "[REDACTED]"
      }

      // Remove metadata if not requested
      if (!includeMetadata) {
        delete processed.validation_rules
        delete processed.default_value
        delete processed.created_by
        delete processed.updated_by
        delete processed.created_at
        delete processed.updated_at
      }

      return processed
    })

    // Log audit trail
    await supabase.from("audit_logs").insert({
      tenant_id: userProfile.tenant_id,
      user_id: user.id,
      action: "settings.read",
      resource_type: "settings",
      details: { category, count: settings?.length || 0 },
    })

    return paginatedResponse(processedSettings || [], {
      page,
      limit,
      total: count || 0,
    })
  } catch (error) {
    console.error("Settings API error:", error)
    return internalServerErrorResponse()
  }
}

// POST /api/settings - Create new setting
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, "settings-write", 20, 60)
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.retryAfter)
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return unauthorizedResponse()
    }

    // Get user's tenant and permissions
    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return forbiddenResponse("No tenant associated")
    }

    // Check permissions
    const { data: permissions } = await supabase
      .from("user_permissions")
      .select("actions")
      .eq("user_id", user.id)
      .eq("resource", "settings")
      .single()

    const canWrite = permissions?.actions?.includes("write") || permissions?.actions?.includes("*")
    if (!canWrite) {
      return forbiddenResponse("Insufficient permissions")
    }

    // Validate request body
    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    // Check for duplicate key
    const { data: existing } = await supabase
      .from("application_settings")
      .select("id")
      .eq("tenant_id", userProfile.tenant_id)
      .eq("category", validatedData.category)
      .eq("key", validatedData.key)
      .eq("is_active", true)
      .is("deleted_at", null)
      .single()

    if (existing) {
      return errorResponse("Setting with this key already exists in category", 409)
    }

    // Create setting
    const { data: newSetting, error } = await supabase
      .from("application_settings")
      .insert({
        ...validatedData,
        tenant_id: userProfile.tenant_id,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Setting creation error:", error)
      return internalServerErrorResponse("Failed to create setting")
    }

    // Log audit trail
    await supabase.from("audit_logs").insert({
      tenant_id: userProfile.tenant_id,
      user_id: user.id,
      action: "settings.create",
      resource_type: "settings",
      resource_id: newSetting.id,
      details: { category: validatedData.category, key: validatedData.key },
    })

    return successResponse(newSetting, "Setting created successfully", 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse("Validation failed", error.errors)
    }
    console.error("Settings API error:", error)
    return internalServerErrorResponse()
  }
}

// PUT /api/settings - Bulk update settings
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, "settings-write", 10, 60)
    if (!rateLimitResult.success) {
      return rateLimitResponse(rateLimitResult.retryAfter)
    }

    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return unauthorizedResponse()
    }

    // Get user's tenant and permissions
    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return forbiddenResponse("No tenant associated")
    }

    // Check permissions
    const { data: permissions } = await supabase
      .from("user_permissions")
      .select("actions")
      .eq("user_id", user.id)
      .eq("resource", "settings")
      .single()

    const canWrite = permissions?.actions?.includes("write") || permissions?.actions?.includes("*")
    if (!canWrite) {
      return forbiddenResponse("Insufficient permissions")
    }

    // Validate request body
    const body = await request.json()
    const validatedData = bulkSettingsSchema.parse(body)

    const results = []
    const errors = []

    // Process each setting update
    for (const settingUpdate of validatedData.settings) {
      try {
        const { data: updated, error } = await supabase
          .from("application_settings")
          .update({
            value: settingUpdate.value,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settingUpdate.id)
          .eq("tenant_id", userProfile.tenant_id)
          .eq("is_active", true)
          .is("deleted_at", null)
          .select()
          .single()

        if (error) {
          errors.push({ id: settingUpdate.id, error: error.message })
        } else {
          results.push(updated)
        }
      } catch (err) {
        errors.push({ id: settingUpdate.id, error: "Update failed" })
      }
    }

    // Log audit trail
    await supabase.from("audit_logs").insert({
      tenant_id: userProfile.tenant_id,
      user_id: user.id,
      action: "settings.bulk_update",
      resource_type: "settings",
      details: {
        updated_count: results.length,
        error_count: errors.length,
        setting_ids: validatedData.settings.map((s) => s.id),
      },
    })

    return NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: validatedData.settings.length,
        updated: results.length,
        failed: errors.length,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse("Validation failed", error.errors)
    }
    console.error("Settings API error:", error)
    return internalServerErrorResponse()
  }
}
