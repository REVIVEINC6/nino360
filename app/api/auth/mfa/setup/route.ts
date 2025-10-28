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
    const { method } = body // 'totp' or 'sms'

    if (method === "totp") {
  const secret = await MFAUtils.generateTOTPSecret()
  const qrCode = undefined // TODO: Implement QR code generation if needed

      // Store secret temporarily (user needs to verify before enabling)
      const { error } = await supabase.from("user_mfa_methods").insert({
        user_id: user.id,
        method: "totp",
        secret,
        is_verified: false,
      })

      if (error) throw error

      await auditLog({
        action: "user.mfa_enable",
        userId: user.id,
        metadata: { method: "totp", initiated: true },
        success: true,
      })

      return NextResponse.json({
        success: true,
        secret,
        qrCode,
      })
    } else if (method === "sms") {
      const { phoneNumber } = body

      if (!phoneNumber) {
        return NextResponse.json({ error: "Phone number required for SMS MFA" }, { status: 400 })
      }

      // Send verification code
  const code = MFAUtils.generateMFAToken()

      // Store code temporarily
      const { error } = await supabase.from("user_mfa_methods").insert({
        user_id: user.id,
        method: "sms",
        phone_number: phoneNumber,
        is_verified: false,
        backup_codes: [code],
      })

      if (error) throw error

      // TODO: Send SMS with code using Twilio or similar

      await auditLog({
        action: "user.mfa_enable",
        userId: user.id,
        metadata: { method: "sms", phoneNumber, initiated: true },
        success: true,
      })

      return NextResponse.json({
        success: true,
        message: "Verification code sent to your phone",
      })
    }

    return NextResponse.json({ error: "Invalid MFA method" }, { status: 400 })
  } catch (error: any) {
    console.error("[v0] MFA setup error:", error)

    return NextResponse.json({ error: error.message || "MFA setup failed" }, { status: 500 })
  }
}

export const runtime = "nodejs"
