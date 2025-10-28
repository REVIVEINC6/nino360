import { createServerClient } from "@/lib/supabase/server"
import { auditLog } from "@/lib/auth/security/audit-logger"
import { createSession } from "./session.service"

export async function initiateOAuthLogin(provider: "google" | "facebook" | "github") {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        scopes: provider === "google" ? "email profile" : undefined,
      },
    })

    if (error) throw error

    return {
      success: true,
      url: data.url,
    }
  } catch (error) {
    console.error("[v0] OAuth initiation error:", error)
    throw error
  }
}

export async function handleOAuthCallback(code: string, provider: string) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) throw error
    if (!user) throw new Error("No user returned from OAuth")

    const { data: existingProfile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    if (!existingProfile) {
      await supabase.from("user_profiles").insert({
        id: user.id,
        email: user.email!,
        first_name: user.user_metadata?.first_name || user.user_metadata?.name?.split(" ")[0] || "",
        last_name: user.user_metadata?.last_name || user.user_metadata?.name?.split(" ")[1] || "",
        email_verified: true,
        avatar_url: user.user_metadata?.avatar_url,
        metadata: {
          oauth_provider: provider,
        },
      })

      await auditLog({
        action: "oauth.connect",
        userId: user.id,
        tenantId: undefined,
        resourceType: "user",
        resourceId: user.id,
        metadata: { provider, createdProfile: true },
        success: true,
      })
    }

    const session = await createSession({
      userId: user.id,
      tenantId: existingProfile?.tenant_id || null,
    })

    await auditLog({
      action: "user.login",
      userId: user.id,
      tenantId: existingProfile?.tenant_id ?? undefined,
      resourceType: "auth",
      resourceId: session.id,
      metadata: { provider, sessionId: session.id, method: "oauth" },
      success: true,
    })

    return {
      success: true,
      user: existingProfile || { id: user.id, email: user.email },
    }
  } catch (error) {
    console.error("[v0] OAuth callback error:", error)
    throw error
  }
}

export const OAuthService = {
  initiateOAuthLogin,
  handleOAuthCallback,
}
