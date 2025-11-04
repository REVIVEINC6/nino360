import { createServerClient, createAdminServerClient } from "@/lib/supabase/server"
import { generateSessionToken } from "../utils/crypto"

interface CreateSessionInput {
  userId: string
  tenantId: string | null
  deviceFingerprint?: string
  ipAddress?: string
  userAgent?: string
}

export async function createSession(input: CreateSessionInput) {
  try {
    const supabase = await createServerClient()
    const admin = createAdminServerClient()

    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Call the JSONB-wrapper RPC with a single `payload` argument so PostgREST
    // correctly resolves the function signature in the schema cache.
    const payload = {
      p_user_id: input.userId,
      p_tenant_id: input.tenantId,
      p_session_token: sessionToken,
      p_device_fingerprint: input.deviceFingerprint ?? null,
      p_ip_address: input.ipAddress ?? null,
      p_user_agent: input.userAgent ?? null,
      p_expires_at: expiresAt.toISOString(),
    }

    const { data, error } = await admin.rpc("create_user_session", { payload })

    if (error) throw error

    // Supabase-js returns RPC results in `.data`
    return data as any
  } catch (error) {
    console.error("[v0] Create session error:", error)
    throw error
  }
}

export async function validateSession(sessionToken: string) {
  try {
    const supabase = await createServerClient()

    const { data: session } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .eq("revoked", false)
      .single()

    if (!session) return null

    if (new Date(session.expires_at) < new Date()) {
      await supabase
        .from("user_sessions")
        .update({
          revoked: true,
          revoked_at: new Date().toISOString(),
        })
        .eq("id", session.id)
      return null
    }

    await supabase
      .from("user_sessions")
      .update({
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", session.id)

    return session
  } catch (error) {
    console.error("[v0] Validate session error:", error)
    return null
  }
}

export async function revokeSession(sessionId: string) {
  try {
    const supabase = await createServerClient()

    await supabase
      .from("user_sessions")
      .update({
        revoked: true,
        revoked_at: new Date().toISOString(),
      })
      .eq("id", sessionId)

    return { success: true }
  } catch (error) {
    console.error("[v0] Revoke session error:", error)
    throw error
  }
}

export async function revokeAllUserSessions(userId: string) {
  try {
    const supabase = await createServerClient()

    await supabase
      .from("user_sessions")
      .update({
        revoked: true,
        revoked_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("revoked", false)

    return { success: true }
  } catch (error) {
    console.error("[v0] Revoke all sessions error:", error)
    throw error
  }
}

export const SessionService = {
  createSession,
  validateSession,
  revokeSession,
  revokeAllUserSessions,
}
