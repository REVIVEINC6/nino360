import type { NextRequest } from "next/server"
import { getUserWithTenant, createServerSupabaseClient } from "@/lib/auth-server"
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response"
import { apiRateLimiter } from "@/lib/rate-limiter"

export async function GET(request: NextRequest) {
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

    const { user, userData } = userContext
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unread") === "true"

    let query = supabase.from("notifications").select("*", { count: "exact" }).eq("user_id", user.id)

    if (unreadOnly) {
      query = query.eq("read", false)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: notifications, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Notifications fetch error:", error)
      return errorResponse("Failed to fetch notifications", 500)
    }

    return successResponse(notifications, "Notifications retrieved successfully", {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(request: NextRequest) {
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

    const { user, userData } = userContext
    const body = await request.json()
    const { action } = body

    const supabase = await createServerSupabaseClient()

    if (action === "mark_all_read") {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("read", false)

      if (error) {
        console.error("Mark all read error:", error)
        return errorResponse("Failed to mark notifications as read", 500)
      }

      return successResponse(null, "All notifications marked as read")
    }

    return errorResponse("Invalid action", 400)
  } catch (error) {
    console.error("Notifications action error:", error)
    return errorResponse("Internal server error", 500)
  }
}
