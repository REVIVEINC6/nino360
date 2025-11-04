import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { auditLog } from "@/lib/auth/security/audit-logger"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", request.url))
    }

    const supabase = await createServerClient()

    // Verify email with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    })

    if (error || !data.user) {
      return NextResponse.redirect(new URL("/login?error=verification_failed", request.url))
    }

    await auditLog({
      action: "user.email_verify",
      userId: data.user.id,
    })

    return NextResponse.redirect(new URL("/login?verified=true", request.url))
  } catch (error: any) {
    console.error("[v0] Email verification error:", error)

    return NextResponse.redirect(new URL("/login?error=verification_failed", request.url))
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"
