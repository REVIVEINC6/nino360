"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { createSession } from "@/lib/auth/services/session.service"

export async function logAuthAttempt(data: {
  email: string
  success: boolean
  ipAddress?: string
  userAgent?: string
}) {
  try {
    const supabase = await createServerClient()
    const { data: authData } = await supabase.auth.getUser()

    // Only log if we have a valid user session
    if (!authData?.user) {
      return { success: false }
    }

    const tenantId = authData.user.user_metadata?.tenant_id || null
    const userId = authData.user.id

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: userId,
      action: data.success ? "user.login.success" : "user.login.failed",
      resource_type: "auth",
      resource_id: userId,
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Auth logging failed:", error)
    return { success: false }
  }
}

export async function loginWithPassword(input: { email: string; password: string; userAgent?: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  // If MFA or other intermediate state, surface it
  if (!data?.session) {
    return { ok: false, error: "No active session returned" }
  }

  // Create an application session and set our app cookie so middleware and server routes
  // can detect authenticated requests (some environments may not preserve Supabase auth
  // cookies reliably). Use the session service to persist session and expose a token.
  try {
    // Attempt to load user profile to find tenant_id
    const { data: profileData } = await supabase.from("user_profiles").select("tenant_id").eq("id", data.user.id).single()

    const session = await createSession({
      userId: data.user.id,
      tenantId: profileData?.tenant_id || null,
      userAgent: input.userAgent,
    })

    // Set a secure cookie with the session token. Middleware checks for 'nino360-auth'.
    const cookieStore = cookies()
    const isProd = process.env.NODE_ENV === "production"
    const expires = session.expires_at ? new Date(session.expires_at) : undefined

    cookieStore.set("nino360-auth", session.session_token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: isProd,
      expires,
    })
  } catch (e) {
    // Non-fatal: if session creation fails, continue; at least Supabase auth session may still exist
    console.warn("Failed to persist app session after signInWithPassword:", e)

    // Fallback: if Supabase returned a session object, set a minimal auth cookie so
    // middleware and other server checks can detect an authenticated user. This is
    // a compatibility fallback and does not replace the application session. If you
    // prefer not to set these cookies automatically, remove this block.
    try {
      const cookieStore = cookies()
      const isProd = process.env.NODE_ENV === "production"

      if (data?.session?.access_token) {
        // set a lightweight sb-access-token cookie (checked by middleware)
        cookieStore.set("sb-access-token", data.session.access_token, {
          httpOnly: false,
          path: "/",
          sameSite: "lax",
          secure: isProd,
          // Expires roughly when Supabase session expires if provided
          expires: data.session.expires_at ? new Date(data.session.expires_at) : undefined,
        })
      }

      if (data?.session?.refresh_token) {
        cookieStore.set("sb-refresh-token", data.session.refresh_token, {
          httpOnly: false,
          path: "/",
          sameSite: "lax",
          secure: isProd,
        })
      }
    } catch (cookieErr) {
      console.warn("Failed to set fallback auth cookies:", cookieErr)
    }
  }

  return { ok: true }
}
