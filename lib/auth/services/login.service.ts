import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import { checkRateLimit as checkRateLimitService } from "@/lib/auth/security/rate-limiter"
import { auditLog } from "@/lib/auth/security/audit-logger"
import { detectAnomalies } from "@/lib/auth/security/ai-anomaly-detection"
import { createSession } from "./session.service"
import { generateMFAToken } from "../utils/mfa"
import { sendMFACode } from "../utils/email"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceFingerprint: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

const mfaVerifySchema = z.object({
  userId: z.string().uuid(),
  code: z.string().length(6),
  deviceFingerprint: z.string().optional(),
})

export async function login(input: z.infer<typeof loginSchema>) {
  try {
    const validated = loginSchema.parse(input)

    const rateLimitKey = `login:${validated.email}`
    const { allowed } = await checkRateLimitService(rateLimitKey, "login")

    if (!allowed) {
      throw new Error("Too many login attempts. Please try again later.")
    }

    const supabase = await createServerClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (authError) {
      await auditLog({
        action: "user.login",
        tenantId: undefined,
        resourceType: "auth",
        resourceId: validated.email,
        metadata: {
          email: validated.email,
          ipAddress: validated.ipAddress,
        },
        success: false,
        errorMessage: authError.message,
      })
      throw authError
    }

    if (!authData.user) throw new Error("Authentication failed")

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", authData.user.id).single()

    if (!profile) throw new Error("User profile not found")

    if (!profile.email_verified) {
      throw new Error("Please verify your email before logging in")
    }

    if (profile.account_locked) {
      throw new Error("Account is locked. Please contact support.")
    }

    const { data: mfaSettings } = await supabase
      .from("user_mfa_settings")
      .select("*")
      .eq("user_id", authData.user.id)
      .eq("enabled", true)
      .single()

    if (mfaSettings) {
      const mfaCode = generateMFAToken()
      const mfaExpiry = new Date(Date.now() + 10 * 60 * 1000)

      await supabase
        .from("user_mfa_settings")
        .update({
          backup_codes: [mfaCode],
          updated_at: new Date().toISOString(),
        })
        .eq("id", mfaSettings.id)

      await sendMFACode(validated.email, mfaCode)

      return {
        success: true,
        requiresMFA: true,
        userId: authData.user.id,
        message: "MFA code sent to your email",
      }
    }

    const session = await createSession({
      userId: authData.user.id,
      tenantId: profile.tenant_id,
      deviceFingerprint: validated.deviceFingerprint,
      ipAddress: validated.ipAddress,
      userAgent: validated.userAgent,
    })

    await auditLog({
      action: "user.login",
      userId: authData.user.id,
      tenantId: profile.tenant_id ?? undefined,
      resourceType: "auth",
      resourceId: session.id,
      metadata: {
        sessionId: session.id,
        ipAddress: validated.ipAddress,
      },
      success: true,
    })

    await detectAnomalies({
      userId: authData.user.id,
      eventType: "login",
      metadata: {
        ipAddress: validated.ipAddress,
        deviceFingerprint: validated.deviceFingerprint,
      },
    })

    return {
      success: true,
      requiresMFA: false,
      session,
      user: profile,
    }
  } catch (error) {
    console.error("[v0] Login error:", error)
    throw error
  }
}

export async function verifyMFA(input: z.infer<typeof mfaVerifySchema>) {
  try {
    const validated = mfaVerifySchema.parse(input)
    const supabase = await createServerClient()

    const { data: mfaSettings } = await supabase
      .from("user_mfa_settings")
      .select("*")
      .eq("user_id", validated.userId)
      .eq("enabled", true)
      .single()

    if (!mfaSettings) {
      throw new Error("MFA not enabled")
    }

    const isValid = mfaSettings.backup_codes?.includes(validated.code)

    if (!isValid) {
      throw new Error("Invalid MFA code")
    }

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", validated.userId).single()

    if (!profile) throw new Error("User not found")

    const session = await createSession({
      userId: validated.userId,
      tenantId: profile.tenant_id,
      deviceFingerprint: validated.deviceFingerprint,
    })

    await supabase
      .from("user_mfa_settings")
      .update({
        backup_codes: [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", mfaSettings.id)

    await auditLog({
      action: "user.mfa_verify",
      userId: validated.userId,
      tenantId: profile.tenant_id ?? undefined,
      resourceType: "auth",
      resourceId: validated.userId,
      metadata: {},
      success: true,
    })

    return {
      success: true,
      session,
      user: profile,
    }
  } catch (error) {
    console.error("[v0] MFA verification error:", error)
    throw error
  }
}

export async function logout() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

  if (user) {
      await supabase
        .from("user_sessions")
        .update({
          revoked: true,
          revoked_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("revoked", false)

      await auditLog({
        action: "user.logout",
        userId: user.id,
        tenantId: user.user_metadata?.tenant_id ?? undefined,
        resourceType: "auth",
        resourceId: user.id,
        metadata: {},
        success: true,
      })
    }

    await supabase.auth.signOut()

    return { success: true }
  } catch (error) {
    console.error("[v0] Logout error:", error)
    throw error
  }
}

export const LoginService = {
  login,
  verifyMFA,
  logout,
}
