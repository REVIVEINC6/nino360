"use server"

import { createAuditLog } from "./hash-chain"

/**
 * Log an audit event with hash-chained integrity
 * This is an alias for createAuditLog to maintain consistent naming across the codebase
 */
export async function logAudit({
  tenantId,
  userId,
  action,
  entity,
  entityId,
  metadata = {},
  diff = {},
}: {
  tenantId: string
  userId: string
  action: string
  entity: string
  entityId: string
  metadata?: Record<string, any>
  diff?: Record<string, any>
}) {
  return createAuditLog({
    tenantId,
    userId,
    action,
    entity,
    entityId,
    metadata,
    diff,
  })
}

// Note: Other audit functions (createAuditLog, verifyAuditChain, getAuditLogs)
// should be imported directly from "@/lib/audit/hash-chain" where needed
