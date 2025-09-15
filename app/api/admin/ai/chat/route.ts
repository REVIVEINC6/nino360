import { type NextRequest, NextResponse } from "next/server"
import { aiCopilot } from "@/lib/ai/copilot"
import { validateJWT } from "@/lib/auth/jwt"
import { rateLimit } from "@/lib/middleware/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for AI endpoints
    const rateLimitResult = await rateLimit(request, { maxRequests: 10, windowMs: 60000 })
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    // JWT validation
    const authResult = await validateJWT(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { user } = authResult
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Add user context for personalized responses
    const enhancedContext = {
      ...context,
      userRole: user.role,
      tenantId: user.tenant_id,
      timestamp: new Date().toISOString(),
    }

    const response = await aiCopilot.chatWithCopilot(message, enhancedContext)

    return NextResponse.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 })
  }
}
