import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import { generateVerificationToken } from "../utils/crypto"
import { sendPasswordResetEmail } from "../utils/email"
import { checkRateLimit } from "@/lib/auth/security/rate-limiter"
import { auditLog } from "@/lib/auth/security/audit-logger"

const requestResetSchema = z.object({
  email: z.string().email(),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z
    .string()
    .min(12)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
})

export async function requestPasswordReset(input: z.infer<typeof requestResetSchema>) {
  try {
    const validated = requestResetSchema.parse(input)

    const rateLimitKey = `password_reset:${validated.email}`
  const { allowed: isAllowed } = await checkRateLimit(rateLimitKey, "passwordReset")

    if (!isAllowed) {
      throw new Error("Too many password reset requests. Please try again later.")
    }

    const supabase = await createServerClient()

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("email", validated.email).single()

    if (!profile) {
      return {
        success: true,
        message: "If an account exists, a password reset email has been sent.",
      }
    }

    const resetToken = await generateVerificationToken()
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000)

    await supabase
      .from("user_profiles")
      .update({
        password_reset_token: resetToken,
        password_reset_expires_at: resetExpiry.toISOString(),
      })
      .eq("id", profile.id)

    await sendPasswordResetEmail(validated.email, resetToken)

    await auditLog({
      action: "user.password_reset",
      userId: profile.id,
      tenantId: profile.tenant_id ?? undefined,
      resourceType: "user",
      resourceId: profile.id,
      metadata: { phase: "requested" },
      success: true,
    })

    return {
      success: true,
      message: "If an account exists, a password reset email has been sent.",
    }
  } catch (error) {
    console.error("[v0] Password reset request error:", error)
    throw error
  }
}

export async function resetPassword(input: z.infer<typeof resetPasswordSchema>) {
  try {
    const validated = resetPasswordSchema.parse(input)
    const supabase = await createServerClient()

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("password_reset_token", validated.token)
      .single()

    if (!profile) {
      throw new Error("Invalid reset token")
    }

    if (new Date(profile.password_reset_expires_at) < new Date()) {
      throw new Error("Reset token has expired")
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, {
      password: validated.newPassword,
    })

    if (updateError) throw updateError

    await supabase
      .from("user_profiles")
      .update({
        password_reset_token: null,
        password_reset_expires_at: null,
        password_changed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    await supabase
      .from("user_sessions")
      .update({
        revoked: true,
        revoked_at: new Date().toISOString(),
      })
      .eq("user_id", profile.id)
      .eq("revoked", false)

    await auditLog({
      action: "user.password_reset",
      userId: profile.id,
      tenantId: profile.tenant_id ?? undefined,
      resourceType: "user",
      resourceId: profile.id,
      metadata: { phase: "completed" },
      success: true,
    })

    return {
      success: true,
      message: "Password reset successfully",
    }
  } catch (error) {
    console.error("[v0] Password reset error:", error)
    throw error
  }
}

export const PasswordResetService = {
  requestPasswordReset,
  resetPassword,
}
