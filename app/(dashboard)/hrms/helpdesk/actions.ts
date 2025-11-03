"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { hasFeature } from "@/lib/fbac"
import { appendAudit } from "@/lib/hash"
import { notarizeHash, computeFileHash } from "@/lib/ledger/notarize"
import { generateCsv } from "@/lib/export/csv"
import { triageCase, findSimilarCases, suggestKbArticles } from "@/lib/ai/triage"
import { sendEmail } from "@/lib/email/inbound"
import { sendSlackMessage } from "@/lib/slack/bridge"

// =====================================================
// Schemas
// =====================================================

const listCasesSchema = z.object({
  queue: z.string().optional(),
  status: z.enum(["NEW", "OPEN", "PENDING", "WAITING_ON_EMPLOYEE", "RESOLVED", "CLOSED"]).optional(),
  category: z.string().optional(),
  priority: z.enum(["P1", "P2", "P3", "P4"]).optional(),
  assignee: z.string().optional(),
  q: z.string().optional(),
  page: z.number().default(1),
  pageSize: z.number().default(50),
  sort: z.string().default("created_at:desc"),
})

const createCaseSchema = z.object({
  channel: z.enum(["PORTAL", "EMAIL", "SLACK", "API"]).default("PORTAL"),
  subject: z.string().min(3).max(140),
  description: z.string().min(1),
  employeeId: z.string().optional(),
  requesterEmail: z.string().email().optional(),
  category: z.string().optional(),
  priority: z.enum(["P1", "P2", "P3", "P4"]).optional(),
})

const updateCaseSchema = z.object({
  id: z.string().uuid(),
  patch: z.object({
    status: z.enum(["NEW", "OPEN", "PENDING", "WAITING_ON_EMPLOYEE", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["P1", "P2", "P3", "P4"]).optional(),
    assigneeId: z.string().uuid().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
})

const addCommentSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1),
  public: z.boolean().default(true),
  channelReply: z.enum(["EMAIL", "SLACK", "PORTAL"]).optional(),
})

const closeCaseSchema = z.object({
  id: z.string().uuid(),
  resolution: z.string().min(1),
  csat: z.number().min(1).max(5).optional(),
})

// =====================================================
// Actions
// =====================================================

export async function listCases(input: z.infer<typeof listCasesSchema>) {
  const supabase = await createServerClient()
  const canRead = await hasFeature("helpdesk.read")

  if (!canRead) {
    return { success: false, error: "Permission denied" }
  }

  const validated = listCasesSchema.parse(input)
  let query = supabase
    .from("helpdesk_cases")
    .select("*, assignee:app_users!assignee_id(id, email), employee:hr_employees!employee_id(id, legal_name)", {
      count: "exact",
    })

  // Filters
  if (validated.queue) query = query.eq("queue_id", validated.queue)
  if (validated.status) query = query.eq("status", validated.status)
  if (validated.category) query = query.eq("category", validated.category)
  if (validated.priority) query = query.eq("priority", validated.priority)
  if (validated.assignee) query = query.eq("assignee_id", validated.assignee)
  if (validated.q) {
    query = query.or(`subject.ilike.%${validated.q}%,description.ilike.%${validated.q}%,number.ilike.%${validated.q}%`)
  }

  // Pagination
  const offset = (validated.page - 1) * validated.pageSize
  query = query.range(offset, offset + validated.pageSize - 1)

  // Sort
  const [sortField, sortDir] = validated.sort.split(":")
  query = query.order(sortField, { ascending: sortDir === "asc" })

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] listCases error:", error)
    return { success: false, error: "Failed to list cases" }
  }

  return {
    success: true,
    cases: data || [],
    total: count || 0,
    page: validated.page,
    pageSize: validated.pageSize,
  }
}

export async function getCase(id: string) {
  const supabase = await createServerClient()
  const canRead = await hasFeature("helpdesk.read")

  if (!canRead) {
    return { success: false, error: "Permission denied" }
  }

  // Get case with related data
  const { data: caseData, error: caseError } = await supabase
    .from("helpdesk_cases")
    .select(
      "*, assignee:app_users!assignee_id(id, email), employee:hr_employees!employee_id(id, legal_name, work_email), queue:helpdesk_queues!queue_id(id, name), sla_policy:helpdesk_sla_policies!sla_policy_id(id, name, targets)",
    )
    .eq("id", id)
    .single()

  if (caseError || !caseData) {
    return { success: false, error: "Case not found" }
  }

  // Get events
  const { data: events } = await supabase
    .from("helpdesk_case_events")
    .select("*, actor:app_users!actor_id(id, email)")
    .eq("case_id", id)
    .order("ts", { ascending: true })

  // Get attachments
  const { data: attachments } = await supabase.from("helpdesk_attachments").select("*").eq("case_id", id)

  // Get AI suggestions if enabled
  let aiSuggestions: { similar: any[]; kbArticles: any[] } | null = null
  const hasAi = await hasFeature("ai.copilot")
  if (hasAi) {
    const [similar, kbArticles] = await Promise.all([
      findSimilarCases(caseData.subject, caseData.description, caseData.tenant_id),
      suggestKbArticles(caseData.subject, caseData.description, caseData.tenant_id),
    ])

    aiSuggestions = {
      similar: similar.success ? similar.similar : [],
      kbArticles: kbArticles.success ? kbArticles.articles : [],
    }
  }

  return {
    success: true,
    case: caseData,
    events: events || [],
    attachments: attachments || [],
    aiSuggestions,
  }
}

export async function createCase(input: z.infer<typeof createCaseSchema>) {
  const supabase = await createServerClient()
  const canWrite = await hasFeature("helpdesk.write")

  if (!canWrite) {
    return { success: false, error: "Permission denied" }
  }

  const validated = createCaseSchema.parse(input)

  // Get tenant ID
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const { data: member } = await supabase.from("app_tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Get default queue and SLA policy
  const { data: queue } = await supabase
    .from("helpdesk_queues")
    .select("id")
    .eq("tenant_id", member.tenant_id)
    .eq("key", "general")
    .single()

  const { data: slaPolicy } = await supabase
    .from("helpdesk_sla_policies")
    .select("id")
    .eq("tenant_id", member.tenant_id)
    .eq("key", "default")
    .single()

  // AI triage if enabled
  let category = validated.category
  let priority = validated.priority || "P3"
  const hasAi = await hasFeature("ai.copilot")
  if (hasAi && !validated.category) {
    const triage = await triageCase(validated.subject, validated.description)
    if (triage.success && triage.triage) {
      category = triage.triage.category
      priority = triage.triage.priority
    }
  }

  // Create case
  const { data: newCase, error } = await supabase
    .from("helpdesk_cases")
    .insert({
      tenant_id: member.tenant_id,
      channel: validated.channel,
      subject: validated.subject,
      description: validated.description,
      employee_id: validated.employeeId || null,
      requester_email: validated.requesterEmail || null,
      category,
      priority,
      queue_id: queue?.id || null,
      sla_policy_id: slaPolicy?.id || null,
      status: "NEW",
    })
    .select()
    .single()

  if (error || !newCase) {
    console.error("[v0] createCase error:", error)
    return { success: false, error: "Failed to create case" }
  }

  // Audit
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "case:create",
    entity: "helpdesk_case",
    entityId: newCase.id,
    diff: { case: newCase },
  })

  return { success: true, case: newCase }
}

export async function updateCase(input: z.infer<typeof updateCaseSchema>) {
  const supabase = await createServerClient()
  const canWrite = await hasFeature("helpdesk.write")

  if (!canWrite) {
    return { success: false, error: "Permission denied" }
  }

  const validated = updateCaseSchema.parse(input)

  // Get current case
  const { data: current } = await supabase.from("helpdesk_cases").select("*").eq("id", validated.id).single()

  if (!current) {
    return { success: false, error: "Case not found" }
  }

  // Update case
  const { data: updated, error } = await supabase
    .from("helpdesk_cases")
    .update(validated.patch)
    .eq("id", validated.id)
    .select()
    .single()

  if (error || !updated) {
    console.error("[v0] updateCase error:", error)
    return { success: false, error: "Failed to update case" }
  }

  // Create event for status change
  if (validated.patch.status && validated.patch.status !== current.status) {
    await supabase.from("helpdesk_case_events").insert({
      case_id: validated.id,
      kind: "STATUS",
      payload: { from: current.status, to: validated.patch.status },
    })
  }

  // Create event for assignment
  if (validated.patch.assigneeId && validated.patch.assigneeId !== current.assignee_id) {
    await supabase.from("helpdesk_case_events").insert({
      case_id: validated.id,
      kind: "ASSIGN",
      payload: { from: current.assignee_id, to: validated.patch.assigneeId },
    })
  }

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await appendAudit({
    tenantId: current.tenant_id,
    actorUserId: user?.id,
    action: "case:update",
    entity: "helpdesk_case",
    entityId: validated.id,
    diff: { before: current, after: updated },
  })

  return { success: true, case: updated }
}

export async function addComment(input: z.infer<typeof addCommentSchema>) {
  const supabase = await createServerClient()
  const canWrite = await hasFeature("helpdesk.write")

  if (!canWrite) {
    return { success: false, error: "Permission denied" }
  }

  const validated = addCommentSchema.parse(input)

  // Get case
  const { data: caseData } = await supabase.from("helpdesk_cases").select("*").eq("id", validated.id).single()

  if (!caseData) {
    return { success: false, error: "Case not found" }
  }

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Create event
  const { data: event, error } = await supabase
    .from("helpdesk_case_events")
    .insert({
      case_id: validated.id,
      kind: "COMMENT",
      actor_id: user?.id,
      payload: { body: validated.body, public: validated.public },
    })
    .select()
    .single()

  if (error || !event) {
    console.error("[v0] addComment error:", error)
    return { success: false, error: "Failed to add comment" }
  }

  // Update first_response_at if this is the first public comment
  if (validated.public && !caseData.first_response_at) {
    await supabase.from("helpdesk_cases").update({ first_response_at: new Date().toISOString() }).eq("id", validated.id)
  }

  // Send via channel if requested
  if (validated.channelReply === "EMAIL" && caseData.requester_email) {
    await sendEmail(caseData.requester_email, `Re: [${caseData.number}] ${caseData.subject}`, validated.body)
  } else if (validated.channelReply === "SLACK") {
    await sendSlackMessage("hr-helpdesk", validated.body)
  }

  // Audit
  await appendAudit({
    tenantId: caseData.tenant_id,
    actorUserId: user?.id,
    action: "case:comment",
    entity: "helpdesk_case",
    entityId: validated.id,
    diff: { comment: validated.body },
  })

  return { success: true, event }
}

export async function closeCase(input: z.infer<typeof closeCaseSchema>) {
  const supabase = await createServerClient()
  const canWrite = await hasFeature("helpdesk.write")

  if (!canWrite) {
    return { success: false, error: "Permission denied" }
  }

  const validated = closeCaseSchema.parse(input)

  // Get case
  const { data: caseData } = await supabase.from("helpdesk_cases").select("*").eq("id", validated.id).single()

  if (!caseData) {
    return { success: false, error: "Case not found" }
  }

  // Update case
  const now = new Date().toISOString()
  const { data: updated, error } = await supabase
    .from("helpdesk_cases")
    .update({
      status: "RESOLVED",
      resolved_at: now,
      resolution_text: validated.resolution,
      csat: validated.csat || null,
    })
    .eq("id", validated.id)
    .select()
    .single()

  if (error || !updated) {
    console.error("[v0] closeCase error:", error)
    return { success: false, error: "Failed to close case" }
  }

  // Create event
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await supabase.from("helpdesk_case_events").insert({
    case_id: validated.id,
    kind: "STATUS",
    actor_id: user?.id,
    payload: { from: caseData.status, to: "RESOLVED", resolution: validated.resolution },
  })

  // Audit
  await appendAudit({
    tenantId: caseData.tenant_id,
    actorUserId: user?.id,
    action: "case:close",
    entity: "helpdesk_case",
    entityId: validated.id,
    diff: { resolution: validated.resolution, csat: validated.csat },
  })

  return { success: true, case: updated }
}

export async function notarizeResolution(id: string) {
  const supabase = await createServerClient()
  const canNotarize = await hasFeature("ledger.notarize")

  if (!canNotarize) {
    return { success: false, error: "Permission denied" }
  }

  // Get case
  const { data: caseData } = await supabase.from("helpdesk_cases").select("*").eq("id", id).single()

  if (!caseData || !caseData.resolution_text) {
    return { success: false, error: "Case not found or not resolved" }
  }

  // Compute hash
  const hash = await computeFileHash(Buffer.from(JSON.stringify({ case: caseData })))

  // Notarize
  const proof = await notarizeHash(hash, "helpdesk_case", id)

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await appendAudit({
    tenantId: caseData.tenant_id,
    actorUserId: user?.id,
    action: "case:notarize",
    entity: "helpdesk_case",
    entityId: id,
    diff: { hash, proof },
  })

  return { success: true, proof }
}

export async function exportCasesCsv(filters: z.infer<typeof listCasesSchema>) {
  const supabase = await createServerClient()
  const canExport = await hasFeature("exports.allowed")

  if (!canExport) {
    return { success: false, error: "Permission denied" }
  }

  // Get all cases matching filters (no pagination)
  const result = await listCases({ ...filters, pageSize: 10000 })

  if (!result.success || !result.cases) {
    return { success: false, error: "Failed to fetch cases" }
  }

  // Generate CSV
  const headers = ["number", "subject", "status", "priority", "category", "created_at", "resolved_at", "assignee_email"]
  const csv = await generateCsv(
    result.cases.map((c: any) => ({
      number: c.number,
      subject: c.subject,
      status: c.status,
      priority: c.priority,
      category: c.category || "",
      created_at: c.created_at,
      resolved_at: c.resolved_at || "",
      assignee_email: c.assignee?.email || "",
    })),
    headers,
  )

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase
    .from("app_tenant_members")
    .select("tenant_id")
    .eq("user_id", user?.id)
    .single()

  await appendAudit({
    tenantId: member?.tenant_id,
    actorUserId: user?.id,
    action: "export:cases",
    entity: "helpdesk_case",
    entityId: null,
    diff: { count: result.cases.length },
  })

  return { success: true, csv }
}
