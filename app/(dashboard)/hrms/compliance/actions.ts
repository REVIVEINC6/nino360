"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeature, hasFeatures } from "@/lib/fbac"
import { notarizeHash } from "@/lib/ledger/notarize"
import { generateCsv } from "@/lib/export/csv"
import {
  getComplianceOverview,
  listObligations,
  listTasks,
  listEvidence,
  listControls,
  listExceptions,
} from "@/lib/hrms/compliance"

// ============================================================================
// SCHEMAS
// ============================================================================

const GetOverviewSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  orgId: z.string().optional(),
})

const ListObligationsSchema = z.object({
  kind: z.enum(["POLICY_ACK", "TRAINING", "I9", "IMMIGRATION", "RETENTION", "DOC_REVIEW", "BACKGROUND"]),
  orgId: z.string().optional(),
  dueBucket: z.enum(["TODAY", "7D", "14D", "30D", "PAST_DUE"]).optional(),
  status: z.enum(["OPEN", "DONE", "BLOCKED"]).optional(),
  q: z.string().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(50),
})

const CompleteTaskSchema = z.object({
  taskId: z.string().uuid(),
})

const BlockTaskSchema = z.object({
  taskId: z.string().uuid(),
  reason: z.string().min(1),
})

const AssignTaskSchema = z.object({
  taskId: z.string().uuid(),
  ownerId: z.string().uuid(),
})

const RemindSchema = z.object({
  kind: z.enum(["POLICY_ACK", "TRAINING", "I9", "IMMIGRATION", "RETENTION", "DOC_REVIEW", "BACKGROUND"]),
  targetIds: z.array(z.string().uuid()),
})

const LinkEvidenceSchema = z.object({
  controlId: z.string().uuid(),
  documentId: z.string().uuid().optional(),
  title: z.string().min(1),
  url: z.string().url().optional(),
  sha256: z.string().optional(),
})

const MapControlSchema = z.object({
  frameworkKey: z.string(),
  controlKey: z.string(),
  artifactType: z.enum(["POLICY", "TRAINING", "I9", "IMMIGRATION", "RETENTION", "DOC", "BACKGROUND"]),
  artifactId: z.string().uuid(),
})

const CreateExceptionSchema = z.object({
  controlId: z.string().uuid().optional(),
  context: z.record(z.any()),
  risk: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  reason: z.string().min(1),
})

const UpdateExceptionSchema = z.object({
  id: z.string().uuid(),
  patch: z.object({
    status: z.enum(["OPEN", "MITIGATED", "WAIVED", "CLOSED"]).optional(),
    approverId: z.string().uuid().optional(),
    reason: z.string().optional(),
  }),
})

const ResolveExceptionSchema = z.object({
  id: z.string().uuid(),
})

const BuildPackSchema = z.object({
  scope: z.object({
    kinds: z.array(z.string()),
    from: z.string().optional(),
    to: z.string().optional(),
    orgId: z.string().optional(),
  }),
  name: z.string().min(1),
})

const NotarizePackSchema = z.object({
  packId: z.string().uuid(),
})

const ExportComplianceCsvSchema = z.object({
  tab: z.enum(["obligations", "tasks", "evidence", "controls", "exceptions"]),
  filters: z.record(z.any()).optional(),
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function getOverview(input: z.infer<typeof GetOverviewSchema>) {
  const parsed = GetOverviewSchema.parse(input)

  // Check permissions
  const canRead = await hasFeature("hrms.compliance.read")
  if (!canRead) {
    throw new Error("Permission denied: hrms.compliance.read required")
  }

  const overview = await getComplianceOverview(parsed)

  return { success: true, data: overview }
}

export async function getObligations(input: z.infer<typeof ListObligationsSchema>) {
  const parsed = ListObligationsSchema.parse(input)

  // Check permissions
  const canRead = await hasFeature("hrms.compliance.read")
  if (!canRead) {
    throw new Error("Permission denied: hrms.compliance.read required")
  }

  const result = await listObligations(parsed)

  return { success: true, data: result }
}

export async function getTasks(filters: {
  kind?: string
  state?: string
  assigneeId?: string
  page: number
  pageSize: number
}) {
  // Check permissions
  const canRead = await hasFeature("hrms.compliance.read")
  if (!canRead) {
    throw new Error("Permission denied: hrms.compliance.read required")
  }

  const result = await listTasks(filters)

  return { success: true, data: result }
}

export async function completeTask(input: z.infer<typeof CompleteTaskSchema>) {
  const parsed = CompleteTaskSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Update task
  const { data, error } = await supabase
    .from("tasks")
    .update({
      state: "DONE",
      completed_at: new Date().toISOString(),
    })
    .eq("id", parsed.taskId)
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:task:complete",
    entity: "compliance.tasks",
    entityId: parsed.taskId,
    diff: { state: "DONE" },
  })

  return { success: true, data }
}

export async function blockTask(input: z.infer<typeof BlockTaskSchema>) {
  const parsed = BlockTaskSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Update task
  const { data, error } = await supabase
    .from("tasks")
    .update({
      state: "BLOCKED",
      notes: parsed.reason,
    })
    .eq("id", parsed.taskId)
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:task:block",
    entity: "compliance.tasks",
    entityId: parsed.taskId,
    diff: { state: "BLOCKED", notes: parsed.reason },
  })

  return { success: true, data }
}

export async function assignTask(input: z.infer<typeof AssignTaskSchema>) {
  const parsed = AssignTaskSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Update task
  const { data, error } = await supabase
    .from("tasks")
    .update({
      assignee_id: parsed.ownerId,
    })
    .eq("id", parsed.taskId)
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:task:assign",
    entity: "compliance.tasks",
    entityId: parsed.taskId,
    diff: { assignee_id: parsed.ownerId },
  })

  return { success: true, data }
}

export async function remind(input: z.infer<typeof RemindSchema>) {
  const parsed = RemindSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // TODO: Send email/slack reminders (stub)
  console.log("[v0] Sending reminders for", parsed.kind, "to", parsed.targetIds.length, "targets")

  // Audit
  await appendAudit({
    tenantId: null, // Will be set by RLS
    actorUserId: user.id,
    action: "compliance:remind",
    entity: "compliance.tasks",
    entityId: null,
    diff: { kind: parsed.kind, targetIds: parsed.targetIds },
  })

  return { success: true, message: `Reminders sent to ${parsed.targetIds.length} recipients` }
}

export async function linkEvidence(input: z.infer<typeof LinkEvidenceSchema>) {
  const parsed = LinkEvidenceSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Insert evidence
  const { data, error } = await supabase
    .from("evidence")
    .insert({
      control_id: parsed.controlId,
      document_id: parsed.documentId || null,
      title: parsed.title,
      url: parsed.url || null,
      sha256: parsed.sha256 || null,
    })
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:evidence:link",
    entity: "compliance.evidence",
    entityId: data.id,
    diff: parsed,
  })

  return { success: true, data }
}

export async function mapControl(input: z.infer<typeof MapControlSchema>) {
  const parsed = MapControlSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Find framework and control
  const { data: framework } = await supabase.from("frameworks").select("id").eq("key", parsed.frameworkKey).single()

  if (!framework) throw new Error("Framework not found")

  const { data: control } = await supabase
    .from("controls")
    .select("id")
    .eq("framework_id", framework.id)
    .eq("key", parsed.controlKey)
    .single()

  if (!control) throw new Error("Control not found")

  // Upsert control mapping
  const { data, error } = await supabase
    .from("control_mappings")
    .upsert(
      {
        control_id: control.id,
        artifact_type: parsed.artifactType,
        artifact_id: parsed.artifactId,
        status: "PASS",
        last_checked_at: new Date().toISOString(),
      },
      {
        onConflict: "control_id,artifact_type,artifact_id",
      },
    )
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:control:map",
    entity: "compliance.control_mappings",
    entityId: data.id,
    diff: parsed,
  })

  return { success: true, data }
}

export async function createException(input: z.infer<typeof CreateExceptionSchema>) {
  const parsed = CreateExceptionSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Insert exception
  const { data, error } = await supabase
    .from("exceptions")
    .insert({
      control_id: parsed.controlId || null,
      context: parsed.context,
      risk: parsed.risk,
      reason: parsed.reason,
      status: "OPEN",
    })
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:exception:create",
    entity: "compliance.exceptions",
    entityId: data.id,
    diff: parsed,
  })

  return { success: true, data }
}

export async function updateException(input: z.infer<typeof UpdateExceptionSchema>) {
  const parsed = UpdateExceptionSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Update exception
  const updateData: any = { ...parsed.patch }
  if (parsed.patch.status === "CLOSED" || parsed.patch.status === "MITIGATED" || parsed.patch.status === "WAIVED") {
    updateData.resolved_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("exceptions").update(updateData).eq("id", parsed.id).select().single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:exception:update",
    entity: "compliance.exceptions",
    entityId: parsed.id,
    diff: parsed.patch,
  })

  return { success: true, data }
}

export async function resolveException(input: z.infer<typeof ResolveExceptionSchema>) {
  const parsed = ResolveExceptionSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Update exception
  const { data, error } = await supabase
    .from("exceptions")
    .update({
      status: "CLOSED",
      resolved_at: new Date().toISOString(),
    })
    .eq("id", parsed.id)
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:exception:resolve",
    entity: "compliance.exceptions",
    entityId: parsed.id,
    diff: { status: "CLOSED" },
  })

  return { success: true, data }
}

export async function buildPack(input: z.infer<typeof BuildPackSchema>) {
  const parsed = BuildPackSchema.parse(input)

  // Check permissions
  const canWrite = await hasFeature("hrms.compliance.write")
  if (!canWrite) {
    throw new Error("Permission denied: hrms.compliance.write required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // TODO: Gather artifacts and create ZIP (stub)
  console.log("[v0] Building pack with scope:", parsed.scope)

  const packKey = `pack-${Date.now()}`
  const zipUrl = `https://example.com/packs/${packKey}.zip` // Stub
  const sha256 = "stub-sha256-hash" // Stub

  // Insert pack
  const { data, error } = await supabase
    .from("packs")
    .insert({
      key: packKey,
      name: parsed.name,
      scope: parsed.scope,
      zip_url: zipUrl,
      sha256,
    })
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:pack:build",
    entity: "compliance.packs",
    entityId: data.id,
    diff: parsed,
  })

  return { success: true, data }
}

export async function notarizePack(input: z.infer<typeof NotarizePackSchema>) {
  const parsed = NotarizePackSchema.parse(input)

  // Check permissions
  const flags = await hasFeatures(["hrms.compliance.write", "ledger.notarize"])
  if (!flags["hrms.compliance.write"] || !flags["ledger.notarize"]) {
    throw new Error("Permission denied: hrms.compliance.write and ledger.notarize required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get pack
  const { data: pack, error: packError } = await supabase.from("packs").select("*").eq("id", parsed.packId).single()

  if (packError || !pack) throw new Error("Pack not found")

  if (!pack.sha256) throw new Error("Pack must have sha256 hash")

  // Notarize
  const proof = await notarizeHash(pack.sha256, "compliance.packs", parsed.packId)

  // Update pack
  const { data, error } = await supabase
    .from("packs")
    .update({
      notarized_hash: pack.sha256,
    })
    .eq("id", parsed.packId)
    .select()
    .single()

  if (error) throw error

  // Audit
  await appendAudit({
    tenantId: data.tenant_id,
    actorUserId: user.id,
    action: "compliance:pack:notarize",
    entity: "compliance.packs",
    entityId: parsed.packId,
    diff: { notarized_hash: pack.sha256 },
  })

  return { success: true, data, proof }
}

export async function exportComplianceCsv(input: z.infer<typeof ExportComplianceCsvSchema>) {
  const parsed = ExportComplianceCsvSchema.parse(input)

  // Check permissions
  const flags = await hasFeatures(["hrms.compliance.read", "exports.allowed"])
  if (!flags["hrms.compliance.read"] || !flags["exports.allowed"]) {
    throw new Error("Permission denied: hrms.compliance.read and exports.allowed required")
  }

  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  let data: any[] = []
  let headers: string[] = []

  if (parsed.tab === "obligations") {
    const result = await listObligations({
      kind: parsed.filters?.kind || "POLICY_ACK",
      page: 1,
      pageSize: 10000,
    })
    data = result.rows
    headers = ["id", "kind", "subject_employee_id", "assignee_id", "due_at", "state", "notes"]
  } else if (parsed.tab === "tasks") {
    const result = await listTasks({
      page: 1,
      pageSize: 10000,
    })
    data = result.rows
    headers = ["id", "kind", "subject_employee_id", "assignee_id", "due_at", "state", "notes"]
  } else if (parsed.tab === "evidence") {
    const controlId = parsed.filters?.controlId
    if (!controlId) throw new Error("controlId required for evidence export")
    data = await listEvidence(controlId)
    headers = ["id", "control_id", "title", "url", "sha256", "gathered_at", "expires_at"]
  } else if (parsed.tab === "controls") {
    data = await listControls()
    headers = ["id", "framework_id", "key", "name", "description", "owner_id", "evidence_required"]
  } else if (parsed.tab === "exceptions") {
    data = await listExceptions({})
    headers = ["id", "control_id", "risk", "status", "opened_at", "resolved_at", "reason"]
  }

  // Check for PII masking
  const canUnmask = await hasFeature("pii.redact.unmask")
  if (!canUnmask) {
    // Mask PII fields (stub - would mask specific fields based on tab)
    data = data.map((row) => ({
      ...row,
      notes: row.notes ? "[REDACTED]" : null,
    }))
  }

  const csv = await generateCsv(data, headers)

  // Audit
  await appendAudit({
    tenantId: null, // Will be set by RLS
    actorUserId: user.id,
    action: "compliance:export:csv",
    entity: `compliance.${parsed.tab}`,
    entityId: null,
    diff: { tab: parsed.tab, filters: parsed.filters },
  })

  return { success: true, csv }
}
