import { type NextRequest, NextResponse } from "next/server"
import { PasswordResetService } from "@/lib/auth/services/password-reset.service"
import { RateLimiterService } from "@/lib/auth/security/rate-limiter"
import { z } from "zod"

const resetRequestSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Rate limiting
  const { allowed } = await RateLimiterService.checkRateLimit(clientIp, "passwordReset")

  if (!allowed) {
      return NextResponse.json({ error: "Too many password reset attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const { email } = resetRequestSchema.parse(body)

    await PasswordResetService.requestPasswordReset({ email })

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive password reset instructions.",
    })
  } catch (error: any) {
    console.error("[v0] Password reset request error:", error)

    return NextResponse.json({ error: "Password reset request failed" }, { status: 500 })
  }
}

export const runtime = "nodejs"
