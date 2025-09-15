import type { NextRequest } from "next/server"
import { getUserWithTenant } from "@/lib/auth-server"
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    const userContext = await getUserWithTenant()
    if (!userContext) {
      return unauthorizedResponse()
    }

    const { userData } = userContext
    const body = await request.json()
    const { channels, events } = body

    if (!channels || !Array.isArray(channels)) {
      return errorResponse("Invalid channels parameter", 400)
    }

    // Validate user has access to requested channels
    const allowedChannels = [`tenant:${userData?.tenant_id}`, `user:${userData?.id}`, `notifications:${userData?.id}`]

    const unauthorizedChannels = channels.filter(
      (channel) => !allowedChannels.some((allowed) => channel.startsWith(allowed)),
    )

    if (unauthorizedChannels.length > 0) {
      return errorResponse("Access denied to some channels", 403)
    }

    // Return subscription configuration
    return successResponse(
      {
        channels: channels,
        events: events || ["*"],
        config: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      },
      "Subscription configuration retrieved",
    )
  } catch (error) {
    console.error("Realtime subscribe error:", error)
    return errorResponse("Internal server error", 500)
  }
}
