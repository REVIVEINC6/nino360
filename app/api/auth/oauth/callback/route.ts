import { type NextRequest, NextResponse } from "next/server"
import { OAuthService } from "@/lib/auth/services/oauth.service"
import { auditLog } from "@/lib/auth/security/audit-logger"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const provider = searchParams.get("provider") as "google" | "facebook" | "github"
    const state = searchParams.get("state")

    if (!code || !provider) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
    }

    const result = await OAuthService.handleOAuthCallback(code, provider)

    await auditLog({
      action: "oauth.connect",
      userId: result.user.id,
      metadata: { provider },
    })

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error: any) {
    console.error("[v0] OAuth callback error:", error)

    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"
