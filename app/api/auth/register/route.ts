import { type NextRequest, NextResponse } from "next/server"
import { RegistrationService } from "@/lib/auth/services/registration.service"
import { RateLimiterService } from "@/lib/auth/security/rate-limiter"
import { auditLog } from "@/lib/auth/security/audit-logger"
import { registerDevice } from "@/lib/auth/security/device-fingerprint"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  tenantId: z.string().uuid().optional(),
  deviceFingerprint: z.any().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "unknown"

    // Rate limiting
    const { allowed } = await RateLimiterService.checkRateLimit(clientIp, "registration")

    if (!allowed) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 })
    }

    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Register user
    const result = await RegistrationService.registerUser({
      email: validatedData.email,
      password: validatedData.password,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      tenantId: validatedData.tenantId,
    })

    // Optionally register device after user exists
    if (validatedData.deviceFingerprint && typeof validatedData.deviceFingerprint === "string") {
      try {
        await registerDevice(result.userId, { deviceType: "web", fingerprint: validatedData.deviceFingerprint })
      } catch (e) {
        console.warn("[v0] Device registration during signup failed:", e)
      }
    }

    // Audit log
    await auditLog({
      action: "user.register",
      userId: result.userId,
      tenantId: validatedData.tenantId,
      ipAddress: clientIp,
      userAgent: request.headers.get("user-agent") || "unknown",
      metadata: { email: validatedData.email },
    })

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      userId: result.userId,
    })
  } catch (error: any) {
    console.error("[v0] Registration error:", error)

    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 400 })
  }
}

export const runtime = "nodejs"
