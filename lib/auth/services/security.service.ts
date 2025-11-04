import { createServerClient } from "@/lib/supabase/server"

export type SecurityEventType =
  | "login_success"
  | "login_failed"
  | "logout"
  | "user_registered"
  | "email_verified"
  | "password_reset_requested"
  | "password_reset_completed"
  | "mfa_verified"
  | "oauth_login"
  | "oauth_user_created"
  | "session_created"
  | "session_revoked"

export type SecuritySeverity = "info" | "warning" | "error" | "critical"

interface LogSecurityEventInput {
  userId: string | null
  tenantId: string | null
  eventType: SecurityEventType
  severity: SecuritySeverity
  metadata?: Record<string, any>
}

/**
 * Log a security event to the database
 */
export async function logSecurityEvent(input: LogSecurityEventInput): Promise<void> {
  try {
    const supabase = await createServerClient()

    await supabase.from("security_events").insert({
      user_id: input.userId,
      tenant_id: input.tenantId,
      event_type: input.eventType,
      severity: input.severity,
      metadata: input.metadata || {},
      ip_address: input.metadata?.ipAddress,
      user_agent: input.metadata?.userAgent,
    })
  } catch (error) {
    console.error("[v0] Log security event error:", error)
    // Don't throw - logging failures shouldn't break the main flow
  }
}

/**
 * Get security events for a user
 */
export async function getUserSecurityEvents(userId: string, limit = 50) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("security_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error("[v0] Get security events error:", error)
    return []
  }
}
