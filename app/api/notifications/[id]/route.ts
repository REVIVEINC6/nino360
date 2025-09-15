import type { NextRequest } from "next/server"
import { getUserWithTenant, createServerSupabaseClient } from "@/lib/auth-server"
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } from "@/lib/api-response"
import { apiRateLimiter } from "@/lib/rate-limiter"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return errorResponse("Rate limit exceeded", 429)
    }

    const userContext = await getUserWithTenant()
    if (!userContext) {
      return unauthorizedResponse()
    }

    const { user } = userContext
    const body = await request.json()
    const { read } = body

    const supabase = await createServerSupabaseClient()

    // Check if notification exists and belongs to user
    const { data: existingNotification, error: fetchError } = await supabase
      .from("notifications")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingNotification) {
      return notFoundResponse("Notification")
    }

    // Update notification
    const { data: updatedNotification, error: updateError } = await supabase
      .from("notifications")
      .update({
        read: read,
        read_at: read ? new Date().toISOString() : null,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      console.error("Notification update error:", updateError)
      return errorResponse("Failed to update notification", 500)
    }

    return successResponse(updatedNotification, "Notification updated successfully")
  } catch (error) {
    console.error("Update notification error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimiter.checkLimit(request)
    if (!rateLimitResult.allowed) {
      return errorResponse("Rate limit exceeded", 429)
    }

    const userContext = await getUserWithTenant()
    if (!userContext) {
      return unauthorizedResponse()
    }

    const { user } = userContext
    const supabase = await createServerSupabaseClient()

    // Check if notification exists and belongs to user
    const { data: existingNotification, error: fetchError } = await supabase
      .from("notifications")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !existingNotification) {
      return notFoundResponse("Notification")
    }

    // Delete notification
    const { error: deleteError } = await supabase.from("notifications").delete().eq("id", params.id)

    if (deleteError) {
      console.error("Notification deletion error:", deleteError)
      return errorResponse("Failed to delete notification", 500)
    }

    return successResponse(null, "Notification deleted successfully")
  } catch (error) {
    console.error("Delete notification error:", error)
    return errorResponse("Internal server error", 500)
  }
}
