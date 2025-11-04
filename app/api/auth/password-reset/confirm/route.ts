import { type NextRequest, NextResponse } from "next/server"
import { PasswordResetService } from "@/lib/auth/services/password-reset.service"
import { z } from "zod"

const resetConfirmSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = resetConfirmSchema.parse(body)

    const result = await PasswordResetService.resetPassword({ token, newPassword })

    return NextResponse.json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    })
  } catch (error: any) {
    console.error("[v0] Password reset confirm error:", error)

    return NextResponse.json({ error: error.message || "Password reset failed" }, { status: 400 })
  }
}

export const runtime = "nodejs"
