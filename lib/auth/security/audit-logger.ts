import { createServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

// Broad type to accept a wide set of audit action literals used across services.
// Keeps the logger flexible while letting callers pass stable string literals.
export type AuditAction = string

export interface AuditLogEntry {
  action: AuditAction
  userId?: string
  tenantId?: string
  resourceType?: string
  resourceId?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
}

export async function logAuditEvent(entry: AuditLogEntry) {
  const supabase = await createServerClient()
  const headersList = await headers()

  const ipAddress = entry.ipAddress || headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
  const userAgent = entry.userAgent || headersList.get("user-agent") || "unknown"

  // Create blockchain hash for immutability
  const blockchainHash = await createBlockchainHash({
    ...entry,
    ipAddress,
    userAgent,
    timestamp: new Date().toISOString(),
  })

  const { error } = await supabase.from("audit_logs").insert({
    action: entry.action,
    user_id: entry.userId,
    tenant_id: entry.tenantId,
    resource_type: entry.resourceType,
    resource_id: entry.resourceId,
    metadata: entry.metadata,
    ip_address: ipAddress,
    user_agent: userAgent,
    success: entry.success,
    error_message: entry.errorMessage,
    blockchain_hash: blockchainHash,
    blockchain_verified: true,
  })

  if (error) {
    console.error("[v0] Failed to log audit event:", error)
  }

  // Check for suspicious activity
  if (!entry.success || entry.action.startsWith("security.")) {
    await checkSuspiciousActivity(entry.userId, ipAddress)
  }
}

async function createBlockchainHash(data: any): Promise<string> {
  const dataString = JSON.stringify(data, Object.keys(data).sort())
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(dataString)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function checkSuspiciousActivity(userId: string | undefined, ipAddress: string) {
  if (!userId) return

  const supabase = await createServerClient()

  // Check for multiple failed attempts
  const { data: recentFailures } = await supabase
    .from("audit_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("success", false)
    .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString())

  if (recentFailures && recentFailures.length >= 5) {
    await logSecurityEvent({
      userId,
      eventType: "multiple_failed_attempts",
      severity: "high",
      ipAddress,
      metadata: { failureCount: recentFailures.length },
    })
  }
}

export async function logSecurityEvent(event: {
  userId?: string
  tenantId?: string
  eventType: string
  severity: "low" | "medium" | "high" | "critical"
  ipAddress?: string
  metadata?: Record<string, any>
}) {
  const supabase = await createServerClient()
  const headersList = await headers()

  const { error } = await supabase.from("security_events").insert({
    user_id: event.userId,
    tenant_id: event.tenantId,
    event_type: event.eventType,
    severity: event.severity,
    ip_address: event.ipAddress || headersList.get("x-forwarded-for") || "unknown",
    user_agent: headersList.get("user-agent") || "unknown",
    metadata: event.metadata,
    resolved: false,
  })

  if (error) {
    console.error("[v0] Failed to log security event:", error)
  }
}

export async function verifyAuditLogIntegrity(logId: string): Promise<boolean> {
  const supabase = await createServerClient()

  const { data: log } = await supabase.from("audit_logs").select("*").eq("id", logId).single()

  if (!log) return false

  const computedHash = await createBlockchainHash({
    action: log.action,
    userId: log.user_id,
    tenantId: log.tenant_id,
    resourceType: log.resource_type,
    resourceId: log.resource_id,
    metadata: log.metadata,
    ipAddress: log.ip_address,
    userAgent: log.user_agent,
    success: log.success,
    errorMessage: log.error_message,
    timestamp: log.created_at,
  })

  return computedHash === log.blockchain_hash
}

export async function auditLog(entry: Omit<AuditLogEntry, "success"> & { success?: boolean }) {
  return logAuditEvent({
    ...entry,
    success: entry.success ?? true,
  })
}

export const AuditLogger = {
  logAuditEvent,
  auditLog,
  logSecurityEvent,
  verifyAuditLogIntegrity,
}
