"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { revalidatePath } from "next/cache"

export async function listSessions() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // This is acceptable since we've already authenticated the user with getUser()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get current session
  return [
    {
      id: session?.access_token?.substring(0, 16) || "current",
      device: "Current Device",
      ip: "Unknown",
      last_active: new Date().toISOString(),
      is_current: true,
    },
  ]
}

export async function revokeSession(sessionId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Sign out (revokes current session)
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Failed to revoke session: ${error.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:security:revoke_session",
    entity: "user_settings",
    entityId: user.id,
    diff: { session_id: sessionId },
  })

  revalidatePath("/settings/security")

  return { success: true }
}

export async function getTOTPStatus() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Check if MFA is enabled
  const { data: factors } = await supabase.auth.mfa.listFactors()

  const totpEnabled = factors?.totp && factors.totp.length > 0

  return {
    enabled: totpEnabled,
    factors: factors?.totp || [],
  }
}

export async function enableTOTP() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Enroll TOTP factor
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
  })

  if (error) {
    throw new Error(`Failed to enable TOTP: ${error.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:security:enable_totp",
    entity: "user_settings",
    entityId: user.id,
    diff: {},
  })

  return {
    qr_code: data.totp.qr_code,
    secret: data.totp.secret,
    factor_id: data.id,
  }
}

export async function verifyTOTP(factorId: string, code: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  })

  if (error) {
    throw new Error(`Invalid code: ${error.message}`)
  }

  revalidatePath("/settings/security")

  return { success: true }
}

export async function disableTOTP(factorId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.auth.mfa.unenroll({
    factorId,
  })

  if (error) {
    throw new Error(`Failed to disable TOTP: ${error.message}`)
  }

  await appendAudit({
    tenantId: null,
    actorUserId: user.id,
    action: "settings:security:disable_totp",
    entity: "user_settings",
    entityId: user.id,
    diff: { factor_id: factorId },
  })

  revalidatePath("/settings/security")

  return { success: true }
}
