"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Compute SHA-256 hash of audit log entry
 */
async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * Create a hash-chained audit log entry
 */
export async function createAuditLog({
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
  const supabase = await createClient()

  // Get the previous hash from the last audit log entry for this tenant
  const { data: prevLog } = await supabase
    .from("audit_logs")
    .select("hash")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const prevHash = prevLog?.hash || "0".repeat(64) // Genesis hash

  // Create the data string to hash
  const timestamp = new Date().toISOString()
  const dataToHash = JSON.stringify({
    tenant_id: tenantId,
    user_id: userId,
    action,
    entity,
    entity_id: entityId,
    metadata,
    diff,
    prev_hash: prevHash,
    timestamp,
  })

  // Compute the hash
  const hash = await computeHash(dataToHash)

  // Insert the audit log entry
  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      tenant_id: tenantId,
      user_id: userId,
      action,
      entity,
      entity_id: entityId,
      metadata,
      diff,
      prev_hash: prevHash,
      hash,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating audit log:", error)
    throw error
  }

  return data
}

/**
 * Verify the integrity of the audit log chain
 */
export async function verifyAuditChain(tenantId: string) {
  const supabase = await createClient()

  // Get all audit logs for this tenant in chronological order
  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching audit logs:", error)
    throw error
  }

  if (!logs || logs.length === 0) {
    return { valid: true, totalLogs: 0, invalidLogs: [] }
  }

  const invalidLogs: any[] = []
  let expectedPrevHash = "0".repeat(64) // Genesis hash

  for (const log of logs) {
    // Check if prev_hash matches expected
    if (log.prev_hash !== expectedPrevHash) {
      invalidLogs.push({
        id: log.id,
        reason: "prev_hash mismatch",
        expected: expectedPrevHash,
        actual: log.prev_hash,
      })
    }

    // Recompute hash and verify
    const dataToHash = JSON.stringify({
      tenant_id: log.tenant_id,
      user_id: log.user_id,
      action: log.action,
      entity: log.entity,
      entity_id: log.entity_id,
      metadata: log.metadata,
      diff: log.diff,
      prev_hash: log.prev_hash,
      timestamp: log.created_at,
    })

    const computedHash = await computeHash(dataToHash)

    if (computedHash !== log.hash) {
      invalidLogs.push({
        id: log.id,
        reason: "hash mismatch",
        expected: computedHash,
        actual: log.hash,
      })
    }

    // Update expected prev_hash for next iteration
    expectedPrevHash = log.hash
  }

  return {
    valid: invalidLogs.length === 0,
    totalLogs: logs.length,
    invalidLogs,
  }
}

/**
 * Get audit logs with pagination
 */
export async function getAuditLogs({
  tenantId,
  page = 1,
  limit = 50,
  entity,
  action,
}: {
  tenantId: string
  page?: number
  limit?: number
  entity?: string
  action?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("audit_logs")
    .select("*, user:user_id(email)", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (entity) {
    query = query.eq("entity", entity)
  }

  if (action) {
    query = query.eq("action", action)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] Error fetching audit logs:", error)
    throw error
  }

  return {
    logs: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}
