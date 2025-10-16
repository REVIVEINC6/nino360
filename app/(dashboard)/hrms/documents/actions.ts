"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeature } from "@/lib/fbac"
import { revalidatePath } from "next/cache"

// ============================================================================
// SCHEMAS
// ============================================================================

const listDocumentsSchema = z.object({
  folderId: z.string().uuid().optional(),
  q: z.string().optional(),
  filters: z
    .object({
      kind: z.array(z.string()).optional(),
      employeeId: z.string().uuid().optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      notarized: z.boolean().optional(),
      legalHold: z.boolean().optional(),
    })
    .optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sort: z.enum(["name", "uploaded_at", "size_bytes"]).default("uploaded_at"),
})

const getDocumentSchema = z.object({
  id: z.string().uuid(),
})

const uploadDocumentSchema = z.object({
  folderId: z.string().uuid().optional(),
  kind: z.enum(["CONTRACT", "POLICY", "OFFER", "ID", "I9", "VISA", "BENEFIT", "OTHER"]),
  name: z.string().min(1).max(255),
  tags: z.array(z.string()).default([]),
})

const updateDocumentSchema = z.object({
  id: z.string().uuid(),
  patch: z.object({
    name: z.string().min(1).max(255).optional(),
    tags: z.array(z.string()).optional(),
    folderId: z.string().uuid().nullable().optional(),
    retentionCategory: z.string().optional(),
    retentionUntil: z.string().optional(),
    legalHold: z.boolean().optional(),
  }),
})

const deleteDocumentSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().optional(),
})

const notarizeDocumentSchema = z.object({
  id: z.string().uuid(),
})

const createPolicySchema = z.object({
  key: z.string().min(1).max(100),
  title: z.string().min(1).max(255),
  markdown: z.string().min(1),
})

const publishPolicySchema = z.object({
  policyId: z.string().uuid(),
  audience: z.object({
    all: z.boolean().optional(),
    orgIds: z.array(z.string().uuid()).optional(),
    teamIds: z.array(z.string().uuid()).optional(),
  }),
  dueAt: z.string(),
})

const sendAckRemindersSchema = z.object({
  policyId: z.string().uuid(),
})

const acknowledgePolicySchema = z.object({
  policyId: z.string().uuid(),
})

const startEsignSchema = z.object({
  documentId: z.string().uuid(),
  recipients: z.array(
    z.object({
      role: z.enum(["EMPLOYEE", "MANAGER", "HR"]),
      email: z.string().email(),
    }),
  ),
  message: z.string().optional(),
})

const finalizeEsignSchema = z.object({
  documentId: z.string().uuid(),
  signedPdfUrl: z.string().url(),
  signedSha256: z.string(),
})

const exportAcksCsvSchema = z.object({
  policyId: z.string().uuid(),
})

const exportInventoryCsvSchema = z.object({
  filters: z
    .object({
      kind: z.array(z.string()).optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    })
    .optional(),
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function listDocuments(input: z.infer<typeof listDocumentsSchema>) {
  const parsed = listDocumentsSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canRead = await hasFeature("hrms.documents.read")
  if (!canRead) {
    return { error: "Permission denied: hrms.documents.read required" }
  }

  // Build query
  let query = supabase.from("hrms_documents").select("*", { count: "exact" }).order(parsed.sort, { ascending: false })

  if (parsed.folderId) {
    query = query.eq("folder_id", parsed.folderId)
  }

  if (parsed.q) {
    query = query.or(`name.ilike.%${parsed.q}%,tags.cs.{${parsed.q}}`)
  }

  if (parsed.filters?.kind && parsed.filters.kind.length > 0) {
    query = query.in("kind", parsed.filters.kind)
  }

  if (parsed.filters?.employeeId) {
    query = query.eq("employee_id", parsed.filters.employeeId)
  }

  if (parsed.filters?.dateFrom) {
    query = query.gte("uploaded_at", parsed.filters.dateFrom)
  }

  if (parsed.filters?.dateTo) {
    query = query.lte("uploaded_at", parsed.filters.dateTo)
  }

  if (parsed.filters?.notarized !== undefined) {
    if (parsed.filters.notarized) {
      query = query.not("notarized_hash", "is", null)
    } else {
      query = query.is("notarized_hash", null)
    }
  }

  if (parsed.filters?.legalHold !== undefined) {
    query = query.eq("legal_hold", parsed.filters.legalHold)
  }

  // Pagination
  const offset = (parsed.page - 1) * parsed.pageSize
  query = query.range(offset, offset + parsed.pageSize - 1)

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] listDocuments error:", error)
    return { error: error.message }
  }

  return {
    data: data || [],
    count: count || 0,
    page: parsed.page,
    pageSize: parsed.pageSize,
  }
}

export async function getDocument(input: z.infer<typeof getDocumentSchema>) {
  const parsed = getDocumentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canRead = await hasFeature("hrms.documents.read")
  if (!canRead) {
    return { error: "Permission denied: hrms.documents.read required" }
  }

  // Get document
  const { data: doc, error: docError } = await supabase.from("hrms_documents").select("*").eq("id", parsed.id).single()

  if (docError || !doc) {
    return { error: "Document not found" }
  }

  // Get events
  const { data: events } = await supabase
    .from("hrms_document_events")
    .select("*")
    .eq("document_id", parsed.id)
    .order("ts", { ascending: false })

  // Log view event
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.from("hrms_document_events").insert({
      tenant_id: doc.tenant_id,
      document_id: parsed.id,
      kind: "VIEWED",
      actor_id: user.id,
    })
  }

  return {
    document: doc,
    events: events || [],
  }
}

export async function uploadDocument(input: z.infer<typeof uploadDocumentSchema>) {
  const parsed = uploadDocumentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canWrite = await hasFeature("hrms.documents.write")
  if (!canWrite) {
    return { error: "Permission denied: hrms.documents.write required" }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get tenant
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) {
    return { error: "No tenant found" }
  }

  // Generate storage key
  const storageKey = `${member.tenant_id}/${parsed.kind.toLowerCase()}/${Date.now()}-${parsed.name}`

  // Create presigned URL for upload (stub - would use Supabase Storage in production)
  const presignedUrl = `/api/storage/upload?key=${encodeURIComponent(storageKey)}`

  // Insert document record (will be finalized after upload)
  const { data: doc, error: insertError } = await supabase
    .from("hrms_documents")
    .insert({
      tenant_id: member.tenant_id,
      folder_id: parsed.folderId || null,
      name: parsed.name,
      kind: parsed.kind,
      tags: parsed.tags,
      storage_key: storageKey,
      created_by: user.id,
    })
    .select()
    .single()

  if (insertError || !doc) {
    console.error("[v0] uploadDocument error:", insertError)
    return { error: "Failed to create document record" }
  }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "doc:upload",
    entity: "document",
    entityId: doc.id,
    diff: { name: parsed.name, kind: parsed.kind },
  })

  return {
    documentId: doc.id,
    presignedUrl,
    storageKey,
  }
}

export async function updateDocument(input: z.infer<typeof updateDocumentSchema>) {
  const parsed = updateDocumentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canWrite = await hasFeature("hrms.documents.write")
  if (!canWrite) {
    return { error: "Permission denied: hrms.documents.write required" }
  }

  // Get document to check legal hold
  const { data: doc } = await supabase
    .from("hrms_documents")
    .select("legal_hold, tenant_id")
    .eq("id", parsed.id)
    .single()

  if (!doc) {
    return { error: "Document not found" }
  }

  if (doc.legal_hold) {
    return { error: "Cannot update document on legal hold" }
  }

  // Update document
  const { error: updateError } = await supabase
    .from("hrms_documents")
    .update({
      name: parsed.patch.name,
      tags: parsed.patch.tags,
      folder_id: parsed.patch.folderId,
      retention_category: parsed.patch.retentionCategory,
      retention_until: parsed.patch.retentionUntil,
      legal_hold: parsed.patch.legalHold,
    })
    .eq("id", parsed.id)

  if (updateError) {
    console.error("[v0] updateDocument error:", updateError)
    return { error: "Failed to update document" }
  }

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await appendAudit({
    tenantId: doc.tenant_id,
    actorUserId: user?.id,
    action: "doc:update",
    entity: "document",
    entityId: parsed.id,
    diff: parsed.patch,
  })

  revalidatePath("/hrms/documents")
  return { success: true }
}

export async function deleteDocument(input: z.infer<typeof deleteDocumentSchema>) {
  const parsed = deleteDocumentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canDelete = await hasFeature("hrms.documents.delete")
  if (!canDelete) {
    return { error: "Permission denied: hrms.documents.delete required" }
  }

  // Get document to check legal hold
  const { data: doc } = await supabase
    .from("hrms_documents")
    .select("legal_hold, tenant_id")
    .eq("id", parsed.id)
    .single()

  if (!doc) {
    return { error: "Document not found" }
  }

  if (doc.legal_hold) {
    return { error: "Cannot delete document on legal hold" }
  }

  // Soft delete (mark as deleted in metadata)
  const { error: updateError } = await supabase
    .from("hrms_documents")
    .update({
      metadata: { deleted: true, deleted_reason: parsed.reason, deleted_at: new Date().toISOString() },
    })
    .eq("id", parsed.id)

  if (updateError) {
    console.error("[v0] deleteDocument error:", updateError)
    return { error: "Failed to delete document" }
  }

  // Log event
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await supabase.from("hrms_document_events").insert({
    tenant_id: doc.tenant_id,
    document_id: parsed.id,
    kind: "DELETED",
    actor_id: user?.id,
    metadata: { reason: parsed.reason },
  })

  // Audit log
  await appendAudit({
    tenantId: doc.tenant_id,
    actorUserId: user?.id,
    action: "doc:delete",
    entity: "document",
    entityId: parsed.id,
    diff: { reason: parsed.reason },
  })

  revalidatePath("/hrms/documents")
  return { success: true }
}

export async function notarizeDocument(input: z.infer<typeof notarizeDocumentSchema>) {
  const parsed = notarizeDocumentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canNotarize = await hasFeature("ledger.notarize")
  if (!canNotarize) {
    return { error: "Permission denied: ledger.notarize required" }
  }

  // Get document
  const { data: doc } = await supabase.from("hrms_documents").select("sha256, tenant_id").eq("id", parsed.id).single()

  if (!doc || !doc.sha256) {
    return { error: "Document not found or missing hash" }
  }

  // Insert ledger proof (stub - would use actual ledger in production)
  const { error: proofError } = await supabase.from("ledger_proofs").insert({
    object_type: "document",
    object_id: parsed.id,
    hash: doc.sha256,
    block: Math.floor(Date.now() / 1000), // stub block number
    notarized_at: new Date().toISOString(),
  })

  if (proofError) {
    console.error("[v0] notarizeDocument proof error:", proofError)
    return { error: "Failed to create ledger proof" }
  }

  // Update document with notarized hash
  const { error: updateError } = await supabase
    .from("hrms_documents")
    .update({ notarized_hash: doc.sha256 })
    .eq("id", parsed.id)

  if (updateError) {
    console.error("[v0] notarizeDocument update error:", updateError)
    return { error: "Failed to update document" }
  }

  // Log event
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await supabase.from("hrms_document_events").insert({
    tenant_id: doc.tenant_id,
    document_id: parsed.id,
    kind: "NOTARIZED",
    actor_id: user?.id,
  })

  // Audit log
  await appendAudit({
    tenantId: doc.tenant_id,
    actorUserId: user?.id,
    action: "doc:notarize",
    entity: "document",
    entityId: parsed.id,
    diff: { hash: doc.sha256 },
  })

  revalidatePath("/hrms/documents")
  return { success: true, hash: doc.sha256 }
}

export async function createPolicy(input: z.infer<typeof createPolicySchema>) {
  const parsed = createPolicySchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canManage = await hasFeature("hrms.policies.manage")
  if (!canManage) {
    return { error: "Permission denied: hrms.policies.manage required" }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get tenant
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) {
    return { error: "No tenant found" }
  }

  // Get latest version for this key
  const { data: latest } = await supabase
    .from("hrms_policy_defs")
    .select("version")
    .eq("tenant_id", member.tenant_id)
    .eq("key", parsed.key)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersion = (latest?.version || 0) + 1

  // Insert policy
  const { data: policy, error: insertError } = await supabase
    .from("hrms_policy_defs")
    .insert({
      tenant_id: member.tenant_id,
      key: parsed.key,
      title: parsed.title,
      version: nextVersion,
      markdown: parsed.markdown,
      created_by: user.id,
    })
    .select()
    .single()

  if (insertError || !policy) {
    console.error("[v0] createPolicy error:", insertError)
    return { error: "Failed to create policy" }
  }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "policy:create",
    entity: "policy",
    entityId: policy.id,
    diff: { key: parsed.key, title: parsed.title, version: nextVersion },
  })

  revalidatePath("/hrms/documents")
  return { policyId: policy.id, version: nextVersion }
}

export async function publishPolicy(input: z.infer<typeof publishPolicySchema>) {
  const parsed = publishPolicySchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canManage = await hasFeature("hrms.policies.manage")
  if (!canManage) {
    return { error: "Permission denied: hrms.policies.manage required" }
  }

  // Get policy
  const { data: policy } = await supabase
    .from("hrms_policy_defs")
    .select("tenant_id")
    .eq("id", parsed.policyId)
    .single()

  if (!policy) {
    return { error: "Policy not found" }
  }

  // Mark policy as active and published
  await supabase
    .from("hrms_policy_defs")
    .update({ active: true, published_at: new Date().toISOString() })
    .eq("id", parsed.policyId)

  // Get target employees (stub - would query based on audience in production)
  const { data: employees } = await supabase
    .from("hrms_employees")
    .select("id")
    .eq("tenant_id", policy.tenant_id)
    .eq("status", "active")

  if (!employees || employees.length === 0) {
    return { error: "No employees found for assignment" }
  }

  // Create assignments
  const assignments = employees.map((emp) => ({
    tenant_id: policy.tenant_id,
    policy_id: parsed.policyId,
    employee_id: emp.id,
    due_at: parsed.dueAt,
    status: "ASSIGNED" as const,
  }))

  const { error: assignError } = await supabase.from("hrms_policy_assignments").insert(assignments)

  if (assignError) {
    console.error("[v0] publishPolicy assignment error:", assignError)
    return { error: "Failed to create assignments" }
  }

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await appendAudit({
    tenantId: policy.tenant_id,
    actorUserId: user?.id,
    action: "policy:publish",
    entity: "policy",
    entityId: parsed.policyId,
    diff: { audience: parsed.audience, dueAt: parsed.dueAt, assignedCount: employees.length },
  })

  revalidatePath("/hrms/documents")
  return { success: true, assignedCount: employees.length }
}

export async function sendAckReminders(input: z.infer<typeof sendAckRemindersSchema>) {
  const parsed = sendAckRemindersSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canManage = await hasFeature("hrms.acks.manage")
  if (!canManage) {
    return { error: "Permission denied: hrms.acks.manage required" }
  }

  // Get unacknowledged assignments
  const { data: assignments } = await supabase
    .from("hrms_policy_assignments")
    .select("id, employee_id, tenant_id")
    .eq("policy_id", parsed.policyId)
    .eq("status", "ASSIGNED")

  if (!assignments || assignments.length === 0) {
    return { success: true, remindersSent: 0 }
  }

  // Stub: Would send actual notifications/emails in production
  console.log(`[v0] Sending ${assignments.length} policy acknowledgment reminders`)

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await appendAudit({
    tenantId: assignments[0].tenant_id,
    actorUserId: user?.id,
    action: "policy:remind",
    entity: "policy",
    entityId: parsed.policyId,
    diff: { remindersSent: assignments.length },
  })

  return { success: true, remindersSent: assignments.length }
}

export async function acknowledgePolicy(input: z.infer<typeof acknowledgePolicySchema>) {
  const parsed = acknowledgePolicySchema.parse(input)
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Get employee ID for current user
  const { data: employee } = await supabase
    .from("hrms_employees")
    .select("id, tenant_id")
    .eq("user_id", user.id)
    .single()

  if (!employee) {
    return { error: "Employee record not found" }
  }

  // Update assignment
  const { error: updateError } = await supabase
    .from("hrms_policy_assignments")
    .update({
      status: "ACKNOWLEDGED",
      acknowledged_at: new Date().toISOString(),
    })
    .eq("policy_id", parsed.policyId)
    .eq("employee_id", employee.id)

  if (updateError) {
    console.error("[v0] acknowledgePolicy error:", updateError)
    return { error: "Failed to acknowledge policy" }
  }

  // Log event (stub - would link to document if policy has one)
  await supabase.from("hrms_document_events").insert({
    tenant_id: employee.tenant_id,
    document_id: parsed.policyId, // stub: would be actual document ID
    kind: "ACKED",
    actor_id: user.id,
  })

  // Audit log
  await appendAudit({
    tenantId: employee.tenant_id,
    actorUserId: user.id,
    action: "policy:ack",
    entity: "policy",
    entityId: parsed.policyId,
    diff: {},
  })

  revalidatePath("/hrms/documents")
  return { success: true }
}

export async function startEsign(input: z.infer<typeof startEsignSchema>) {
  const parsed = startEsignSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canEsign = await hasFeature("hrms.esign.use")
  if (!canEsign) {
    return { error: "Permission denied: hrms.esign.use required" }
  }

  // Get document
  const { data: doc } = await supabase.from("hrms_documents").select("tenant_id").eq("id", parsed.documentId).single()

  if (!doc) {
    return { error: "Document not found" }
  }

  // Update document status
  const { error: updateError } = await supabase
    .from("hrms_documents")
    .update({
      e_sign_status: "OUT_FOR_SIGNATURE",
      signer_roles: parsed.recipients.map((r) => r.role),
    })
    .eq("id", parsed.documentId)

  if (updateError) {
    console.error("[v0] startEsign error:", updateError)
    return { error: "Failed to start e-sign" }
  }

  // Log event
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await supabase.from("hrms_document_events").insert({
    tenant_id: doc.tenant_id,
    document_id: parsed.documentId,
    kind: "E_SIGN_SENT",
    actor_id: user?.id,
    metadata: { recipients: parsed.recipients, message: parsed.message },
  })

  // Audit log
  await appendAudit({
    tenantId: doc.tenant_id,
    actorUserId: user?.id,
    action: "esign:send",
    entity: "document",
    entityId: parsed.documentId,
    diff: { recipients: parsed.recipients.length },
  })

  // Stub: Would integrate with actual e-sign provider (DocuSign, HelloSign, etc.)
  console.log(`[v0] E-sign sent to ${parsed.recipients.length} recipients`)

  revalidatePath("/hrms/documents")
  return { success: true }
}

export async function finalizeEsign(input: z.infer<typeof finalizeEsignSchema>) {
  const parsed = finalizeEsignSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canEsign = await hasFeature("hrms.esign.use")
  if (!canEsign) {
    return { error: "Permission denied: hrms.esign.use required" }
  }

  // Get document
  const { data: doc } = await supabase
    .from("hrms_documents")
    .select("version, tenant_id")
    .eq("id", parsed.documentId)
    .single()

  if (!doc) {
    return { error: "Document not found" }
  }

  // Update document with signed version
  const { error: updateError } = await supabase
    .from("hrms_documents")
    .update({
      e_sign_status: "SIGNED",
      version: doc.version + 1,
      url: parsed.signedPdfUrl,
      sha256: parsed.signedSha256,
    })
    .eq("id", parsed.documentId)

  if (updateError) {
    console.error("[v0] finalizeEsign error:", updateError)
    return { error: "Failed to finalize e-sign" }
  }

  // Log event
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await supabase.from("hrms_document_events").insert({
    tenant_id: doc.tenant_id,
    document_id: parsed.documentId,
    kind: "E_SIGN_SIGNED",
    actor_id: user?.id,
  })

  // Audit log
  await appendAudit({
    tenantId: doc.tenant_id,
    actorUserId: user?.id,
    action: "esign:signed",
    entity: "document",
    entityId: parsed.documentId,
    diff: { version: doc.version + 1, hash: parsed.signedSha256 },
  })

  revalidatePath("/hrms/documents")
  return { success: true, version: doc.version + 1 }
}

export async function exportAcksCsv(input: z.infer<typeof exportAcksCsvSchema>) {
  const parsed = exportAcksCsvSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canExport = await hasFeature("exports.allowed")
  if (!canExport) {
    return { error: "Permission denied: exports.allowed required" }
  }

  // Get assignments
  const { data: assignments } = await supabase
    .from("hrms_policy_assignments")
    .select(
      `
      *,
      policy:hrms_policy_defs(title, version),
      employee:hrms_employees(first_name, last_name, email)
    `,
    )
    .eq("policy_id", parsed.policyId)

  if (!assignments) {
    return { error: "No assignments found" }
  }

  // Generate CSV (stub - would use proper CSV library in production)
  const csv = [
    "Employee,Email,Status,Due Date,Acknowledged At",
    ...assignments.map(
      (a: any) =>
        `${a.employee?.first_name} ${a.employee?.last_name},${a.employee?.email},${a.status},${a.due_at || ""},${a.acknowledged_at || ""}`,
    ),
  ].join("\n")

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: policy } = await supabase
    .from("hrms_policy_defs")
    .select("tenant_id")
    .eq("id", parsed.policyId)
    .single()

  if (policy) {
    await appendAudit({
      tenantId: policy.tenant_id,
      actorUserId: user?.id,
      action: "export:acks",
      entity: "policy",
      entityId: parsed.policyId,
      diff: { rowCount: assignments.length },
    })
  }

  return { csv }
}

export async function exportInventoryCsv(input: z.infer<typeof exportInventoryCsvSchema>) {
  const parsed = exportInventoryCsvSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canExport = await hasFeature("exports.allowed")
  if (!canExport) {
    return { error: "Permission denied: exports.allowed required" }
  }

  // Build query
  let query = supabase.from("hrms_documents").select("*")

  if (parsed.filters?.kind && parsed.filters.kind.length > 0) {
    query = query.in("kind", parsed.filters.kind)
  }

  if (parsed.filters?.dateFrom) {
    query = query.gte("uploaded_at", parsed.filters.dateFrom)
  }

  if (parsed.filters?.dateTo) {
    query = query.lte("uploaded_at", parsed.filters.dateTo)
  }

  const { data: documents } = await query

  if (!documents) {
    return { error: "No documents found" }
  }

  // Generate CSV (stub - would use proper CSV library in production)
  const csv = [
    "Name,Kind,Size (bytes),Uploaded At,Notarized,Legal Hold",
    ...documents.map(
      (d: any) =>
        `${d.name},${d.kind},${d.size_bytes || 0},${d.uploaded_at},${d.notarized_hash ? "Yes" : "No"},${d.legal_hold ? "Yes" : "No"}`,
    ),
  ].join("\n")

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: member } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user?.id || "")
    .single()

  if (member) {
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user?.id,
      action: "export:docs",
      entity: "document",
      entityId: null,
      diff: { rowCount: documents.length },
    })
  }

  return { csv }
}
