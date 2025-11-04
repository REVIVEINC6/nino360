import { type NextRequest, NextResponse } from "next/server"
import { MFAUtils } from "@/lib/auth/utils/mfa"
import { createServerClient } from "@/lib/supabase/server"
import { auditLog } from "@/lib/auth/security/audit-logger"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code, method } = body

    // Get MFA method
    const { data: mfaMethod, error: mfaError } = await supabase
      .from("user_mfa_methods")
      .select("*")
      .eq("user_id", user.id)
      .eq("method", method)
      .single()

    if (mfaError || !mfaMethod) {
      return NextResponse.json({ error: "MFA method not found" }, { status: 404 })
    }

    let isValid = false

    if (method === "totp") {
      // Using simple token verification placeholder
      isValid = MFAUtils.verifyMFAToken(code, mfaMethod.secret)
    } else if (method === "sms") {
      // Verify SMS code (stored in backup_codes temporarily)
      isValid = mfaMethod.backup_codes?.includes(code)
    }

    if (!isValid) {
      await auditLog({
        action: "security.suspicious_activity",
        userId: user.id,
        metadata: { reason: "mfa.verification_failed", method },
        success: false,
      })

      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Enable MFA
    const { error: updateError } = await supabase
      .from("user_mfa_methods")
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq("id", mfaMethod.id)

    if (updateError) throw updateError

    // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () => MFAUtils.generateMFAToken())

    await supabase.from("user_mfa_methods").update({ backup_codes: backupCodes }).eq("id", mfaMethod.id)

    await auditLog({
      action: "user.mfa_enable",
      userId: user.id,
      metadata: { method },
    })

    return NextResponse.json({
      success: true,
      backupCodes,
    })
  } catch (error: any) {
    console.error("[v0] MFA verification error:", error)

    return NextResponse.json({ error: error.message || "MFA verification failed" }, { status: 500 })
  }
}

export const runtime = "nodejs"
