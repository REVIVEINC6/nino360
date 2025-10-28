import { createServerClient } from "@/lib/supabase/server"
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

    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const { data: session, error } = await supabase
      .from("user_sessions")
      .insert({
        user_id: input.userId,
        tenant_id: input.tenantId,
        session_token: sessionToken,
        device_fingerprint: input.deviceFingerprint,
        ip_address: input.ipAddress,
        user_agent: input.userAgent,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return session
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
