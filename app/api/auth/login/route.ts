import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { LoginService } from "@/lib/auth/services/login.service"
import { RateLimiterService } from "@/lib/auth/security/rate-limiter"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  mfaCode: z.string().optional(),
  deviceFingerprint: z.any().optional(),
  rememberDevice: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Rate limiting
    const { allowed } = await RateLimiterService.checkRateLimit(clientIp, "login")

    if (!allowed) {
      return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Login
    const result = await LoginService.login({
      email: validatedData.email,
      password: validatedData.password,
      deviceFingerprint: validatedData.deviceFingerprint,
      ipAddress: clientIp,
      userAgent,
    })

    // If MFA is required, return minimal info for the client to continue MFA flow
    if (result.requiresMFA) {
      return NextResponse.json({
        success: true,
        requiresMFA: true,
        userId: result.userId,
        message: result.message,
      })
    }

    // Successful login with session: set application cookie so middleware recognizes authenticated user
    try {
      const cookieStore = cookies()
      const isProd = process.env.NODE_ENV === "production"
      const expires = result.session?.expires_at ? new Date(result.session.expires_at) : undefined
      cookieStore.set("nino360-auth", result.session?.session_token || "", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: isProd,
        expires,
      })
    } catch (e) {
      console.warn("Failed to set nino360-auth cookie after login:", e)
    }

    // Successful login with session
    return NextResponse.json({
      success: true,
      requiresMFA: false,
      user: result.user,
      session: result.session,
    })
  } catch (error: any) {
    console.error("[v0] Login error:", error)

    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
