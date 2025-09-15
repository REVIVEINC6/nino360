import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase"
import { rateLimit } from "@/lib/rate-limit"
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  rateLimitResponse,
  validationErrorResponse,
  internalServerErrorResponse,
  notFoundResponse,
} from "@/lib/api-response"
import { z } from "zod"

export const dynamic = "force-dynamic"

// GET /api/settings/[id] - Get specific setting
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return forbiddenResponse("No tenant associated")
    }

    const { data: setting, error } = await supabase
      .from("application_settings")
      .select("*")
      .eq("id", params.id)
      .eq("tenant_id", userProfile.tenant_id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .single()

    if (error || !setting) {
      return notFoundResponse("Setting not found")
    }

    return successResponse(setting)
  } catch (error) {
    console.error("Settings API error:", error)
    return internalServerErrorResponse()
  }
}

// PUT /api/settings/[id] - Update specific setting
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return forbiddenResponse("No tenant associated")
    }

    const body = await request.json()
    const updateData = z
      .object({
        value: z.any(),
        description: z.string().optional(),
      })
      .parse(body)

    const { data: updated, error } = await supabase
      .from("application_settings")
      .update({
        ...updateData,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("tenant_id", userProfile.tenant_id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .select()
      .single()

    if (error) {
      return notFoundResponse("Setting not found or update failed")
    }

    return successResponse(updated, "Setting updated successfully")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return validationErrorResponse("Validation failed", error.errors)
    }
    console.error("Settings API error:", error)
    return internalServerErrorResponse()
  }
}

// DELETE /api/settings/[id] - Delete specific setting
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    const { data: userProfile } = await supabase.from("user_profiles").select("tenant_id").eq("id", user.id).single()

    if (!userProfile?.tenant_id) {
      return forbiddenResponse("No tenant associated")
    }

    const { data: deleted, error } = await supabase
      .from("application_settings")
      .update({
        is_active: false,
        deleted_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq("id", params.id)
      .eq("tenant_id", userProfile.tenant_id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .select()
      .single()

    if (error) {
      return notFoundResponse("Setting not found")
    }

    return successResponse(null, "Setting deleted successfully")
  } catch (error) {
    console.error("Settings API error:", error)
    return internalServerErrorResponse()
  }
}
