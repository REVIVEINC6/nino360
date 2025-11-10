import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"
import { generateVerificationToken } from "../utils/crypto"
import { sendVerificationEmail } from "../utils/email"
import { auditLog } from "@/lib/auth/security/audit-logger"
import { checkRateLimit } from "@/lib/auth/security/rate-limiter"
import { detectAnomalies } from "@/lib/auth/security/ai-anomaly-detection"

const registrationSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(12)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  tenantId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
})

export async function registerUser(input: z.infer<typeof registrationSchema>) {
  try {
    const validated = registrationSchema.parse(input)

    const rateLimitKey = `register:${validated.email}`
    const { allowed: isAllowed } = await checkRateLimit(rateLimitKey, "registration")

    if (!isAllowed) {
      throw new Error("Too many registration attempts. Please try again later.")
    }

    const supabase = await createServerClient()

    const { data: existingUser } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", validated.email)
      .single()

    if (existingUser) {
      throw new Error("User already exists")
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          first_name: validated.firstName,
          last_name: validated.lastName,
          tenant_id: validated.tenantId,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error("Failed to create user")

    const verificationToken = await generateVerificationToken()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: authData.user.id,
      tenant_id: validated.tenantId,
      email: validated.email,
      first_name: validated.firstName,
      last_name: validated.lastName,
      email_verified: false,
      email_verification_token: verificationToken,
      email_verification_expires_at: verificationExpiry.toISOString(),
      metadata: validated.metadata || {},
    })

    if (profileError) throw profileError

    // Ensure a minimal record exists in core.users to satisfy foreign keys
    try {
      const fullName = `${validated.firstName} ${validated.lastName}`
      // Use UPSERT semantics to avoid conflicts if record already exists
      const { error: coreUserError } = await supabase
        .from("core.users")
        .upsert({ id: authData.user.id, email: validated.email, full_name: fullName }, { onConflict: "id" })

      if (coreUserError) {
        console.warn("[v0] Warning: failed to upsert core.users record:", coreUserError)
      }
    } catch (e) {
      console.warn("[v0] Warning: unexpected error ensuring core.users record:", e)
    }

    await sendVerificationEmail(validated.email, verificationToken)

    await detectAnomalies({
      userId: authData.user.id,
      eventType: "registration",
      metadata: validated.metadata,
    })

    await auditLog({
      action: "user.register",
      userId: authData.user.id,
      tenantId: validated.tenantId,
      resourceType: "user",
      resourceId: authData.user.id,
      metadata: {
        email: validated.email,
        method: "email_password",
      },
      success: true,
    })

    return {
      success: true,
      userId: authData.user.id,
      message: "Registration successful. Please check your email to verify your account.",
    }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    throw error
  }
}

export async function verifyEmail(token: string) {
  try {
    const supabase = await createServerClient()

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email_verification_token", token)
      .single()

    if (profileError || !profile) {
      throw new Error("Invalid verification token")
    }

    if (new Date(profile.email_verification_expires_at) < new Date()) {
      throw new Error("Verification token has expired")
    }

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        email_verified: true,
        email_verification_token: null,
        email_verification_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    if (updateError) throw updateError

    await auditLog({
      action: "user.email_verify",
      userId: profile.id,
      tenantId: profile.tenant_id ?? undefined,
      resourceType: "user",
      resourceId: profile.id,
      metadata: {},
      success: true,
    })

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("[v0] Email verification error:", error)
    throw error
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    const supabase = await createServerClient()

    const rateLimitKey = `resend_verification:${email}`
    const { allowed: isAllowed } = await checkRateLimit(rateLimitKey, "passwordReset")

    if (!isAllowed) {
      throw new Error("Too many requests. Please try again later.")
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      throw new Error("User not found")
    }

    if (profile.email_verified) {
      throw new Error("Email already verified")
    }

    const verificationToken = await generateVerificationToken()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        email_verification_token: verificationToken,
        email_verification_expires_at: verificationExpiry.toISOString(),
      })
      .eq("id", profile.id)

    if (updateError) throw updateError

    await sendVerificationEmail(email, verificationToken)

    return {
      success: true,
      message: "Verification email sent",
    }
  } catch (error) {
    console.error("[v0] Resend verification error:", error)
    throw error
  }
}

export const RegistrationService = {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
}
