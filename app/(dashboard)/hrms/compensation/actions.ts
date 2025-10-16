"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hasFeatures, maskFields } from "@/lib/fbac"
import { appendAudit } from "@/lib/hash"
import { notarizeHash, computeFileHash } from "@/lib/ledger/notarize"
import { generateCsv } from "@/lib/export/csv"
import { z } from "zod"

// =====================================================================
// Validation Schemas
// =====================================================================

const bandSchema = z.object({
  job_family: z.string().min(1),
  grade: z.string().min(1),
  level: z.string().min(1),
  region: z.string().min(1),
  currency: z.string().length(3),
  min_amount: z.number().positive(),
  mid_amount: z.number().positive(),
  max_amount: z.number().positive(),
  effective_date: z.string(),
  expires_date: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

const cycleSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["ANNUAL", "MIDYEAR", "OFFCYCLE"]),
  period_from: z.string(),
  period_to: z.string(),
  budget_total: z.number().positive().nullable().optional(),
  budget_currency: z.string().length(3).default("USD"),
  guidelines: z.any().default({}),
  eligibility_rule: z.any().default({}),
  exchange_rate_date: z.string().nullable().optional(),
})

const proposalSchema = z.object({
  cycle_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  proposed_merit_pct: z.number().min(0).max(100),
  proposed_merit_amount: z.number().min(0),
  market_adjustment: z.number().default(0),
  promotion_pct: z.number().min(0).default(0),
  promotion_new_band: z.string().nullable().optional(),
  lump_sum: z.number().min(0).default(0),
  bonus_target_pct: z.number().min(0).nullable().optional(),
  bonus_amount: z.number().min(0).nullable().optional(),
  stock_units: z.number().min(0).nullable().optional(),
  stock_type: z.string().nullable().optional(),
  vesting: z.any().nullable().optional(),
  effective_date: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  exception_reason: z.string().nullable().optional(),
})

// =====================================================================
// Bands
// =====================================================================

export async function listBands() {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.read"])

  if (!flags["hrms.comp.read"]) {
    throw new Error("Unauthorized: hrms.comp.read required")
  }

  const { data, error } = await supabase
    .from("comp_bands")
    .select("*")
    .order("job_family", { ascending: true })
    .order("grade", { ascending: true })

  if (error) throw error
  return data
}

export async function saveBand(input: z.infer<typeof bandSchema> & { id?: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.bands.manage"])

  if (!flags["hrms.comp.bands.manage"]) {
    throw new Error("Unauthorized: hrms.comp.bands.manage required")
  }

  const validated = bandSchema.parse(input)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: tenant } = await supabase.from("tenants").select("id").single()

  if (input.id) {
    // Update
    const { data, error } = await supabase.from("comp_bands").update(validated).eq("id", input.id).select().single()

    if (error) throw error

    await appendAudit({
      tenantId: tenant?.id || null,
      actorUserId: user?.id,
      action: "comp:band_update",
      entity: "comp_band",
      entityId: input.id,
      diff: validated,
    })

    return data
  } else {
    // Create
    const { data, error } = await supabase
      .from("comp_bands")
      .insert({ ...validated, tenant_id: tenant?.id })
      .select()
      .single()

    if (error) throw error

    await appendAudit({
      tenantId: tenant?.id || null,
      actorUserId: user?.id,
      action: "comp:band_create",
      entity: "comp_band",
      entityId: data.id,
      diff: validated,
    })

    return data
  }
}

export async function archiveBand(id: string) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.bands.manage"])

  if (!flags["hrms.comp.bands.manage"]) {
    throw new Error("Unauthorized: hrms.comp.bands.manage required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Set expires_date to today
  const { error } = await supabase
    .from("comp_bands")
    .update({ expires_date: new Date().toISOString().split("T")[0] })
    .eq("id", id)

  if (error) throw error

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:band_archive",
    entity: "comp_band",
    entityId: id,
    diff: {},
  })

  return { success: true }
}

// =====================================================================
// Cycles
// =====================================================================

export async function listCycles() {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.read"])

  if (!flags["hrms.comp.read"]) {
    throw new Error("Unauthorized: hrms.comp.read required")
  }

  const { data, error } = await supabase.from("comp_cycles").select("*").order("period_from", { ascending: false })

  if (error) throw error
  return data
}

export async function getCycle(id: string) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.read"])

  if (!flags["hrms.comp.read"]) {
    throw new Error("Unauthorized: hrms.comp.read required")
  }

  const { data, error } = await supabase.from("comp_cycles").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function saveCycle(input: z.infer<typeof cycleSchema> & { id?: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.admin"])

  if (!flags["hrms.comp.admin"]) {
    throw new Error("Unauthorized: hrms.comp.admin required")
  }

  const validated = cycleSchema.parse(input)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: tenant } = await supabase.from("tenants").select("id").single()

  if (input.id) {
    // Update
    const { data, error } = await supabase.from("comp_cycles").update(validated).eq("id", input.id).select().single()

    if (error) throw error

    await appendAudit({
      tenantId: tenant?.id || null,
      actorUserId: user?.id,
      action: "comp:cycle_update",
      entity: "comp_cycle",
      entityId: input.id,
      diff: validated,
    })

    return data
  } else {
    // Create
    const { data, error } = await supabase
      .from("comp_cycles")
      .insert({ ...validated, tenant_id: tenant?.id, status: "DRAFT" })
      .select()
      .single()

    if (error) throw error

    await appendAudit({
      tenantId: tenant?.id || null,
      actorUserId: user?.id,
      action: "comp:cycle_create",
      entity: "comp_cycle",
      entityId: data.id,
      diff: validated,
    })

    return data
  }
}

export async function publishCycle(id: string) {
  return updateCycleStatus(id, "PUBLISHED")
}

export async function openCycle(id: string) {
  return updateCycleStatus(id, "OPEN")
}

export async function lockCycle(id: string) {
  return updateCycleStatus(id, "LOCKED")
}

export async function finalizeCycle(id: string) {
  return updateCycleStatus(id, "FINALIZED")
}

async function updateCycleStatus(id: string, status: string) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.admin"])

  if (!flags["hrms.comp.admin"]) {
    throw new Error("Unauthorized: hrms.comp.admin required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase.from("comp_cycles").update({ status }).eq("id", id).select().single()

  if (error) throw error

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: `comp:cycle_${status.toLowerCase()}`,
    entity: "comp_cycle",
    entityId: id,
    diff: { status },
  })

  return data
}

// =====================================================================
// Proposals
// =====================================================================

export async function getWorksheet(input: { cycleId: string; managerId?: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.read", "pii.salary.unmask"])

  if (!flags["hrms.comp.read"]) {
    throw new Error("Unauthorized: hrms.comp.read required")
  }

  // Get proposals for cycle
  const { data, error } = await supabase
    .from("comp_proposals")
    .select(`
      *,
      employee:hr_employees(id, employee_no, first_name, last_name, email)
    `)
    .eq("cycle_id", input.cycleId)
    .order("created_at", { ascending: false })

  if (error) throw error

  // Mask salary fields if no unmask permission
  const masked = data.map((p) =>
    maskFields(p, flags, {
      current_base: "pii.salary.unmask",
      current_variable: "pii.salary.unmask",
      proposed_merit_amount: "pii.salary.unmask",
      market_adjustment: "pii.salary.unmask",
      lump_sum: "pii.salary.unmask",
      bonus_amount: "pii.salary.unmask",
    }),
  )

  return masked
}

export async function saveProposal(input: z.infer<typeof proposalSchema>) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.write"])

  if (!flags["hrms.comp.write"]) {
    throw new Error("Unauthorized: hrms.comp.write required")
  }

  const validated = proposalSchema.parse(input)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: tenant } = await supabase.from("tenants").select("id").single()

  // Check if proposal exists
  const { data: existing } = await supabase
    .from("comp_proposals")
    .select("id")
    .eq("cycle_id", validated.cycle_id)
    .eq("employee_id", validated.employee_id)
    .maybeSingle()

  if (existing) {
    // Update
    const { data, error } = await supabase
      .from("comp_proposals")
      .update(validated)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw error

    await appendAudit({
      tenantId: tenant?.id || null,
      actorUserId: user?.id,
      action: "comp:proposal_save",
      entity: "comp_proposal",
      entityId: existing.id,
      diff: validated,
    })

    return data
  } else {
    // Create
    const { data, error } = await supabase
      .from("comp_proposals")
      .insert({ ...validated, tenant_id: tenant?.id, status: "DRAFT" })
      .select()
      .single()

    if (error) throw error

    await appendAudit({
      tenantId: tenant?.id || null,
      actorUserId: user?.id,
      action: "comp:proposal_create",
      entity: "comp_proposal",
      entityId: data.id,
      diff: validated,
    })

    return data
  }
}

export async function submitWorksheet(input: { cycleId: string; managerId: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.write"])

  if (!flags["hrms.comp.write"]) {
    throw new Error("Unauthorized: hrms.comp.write required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update worksheet status
  const { data, error } = await supabase
    .from("comp_worksheets")
    .update({ status: "SUBMITTED", submitted_at: new Date().toISOString() })
    .eq("cycle_id", input.cycleId)
    .eq("manager_id", input.managerId)
    .select()
    .single()

  if (error) throw error

  // Update all proposals to SUBMITTED
  await supabase
    .from("comp_proposals")
    .update({ status: "SUBMITTED" })
    .eq("cycle_id", input.cycleId)
    .in("employee_id", supabase.from("hr_employees").select("id").eq("manager_id", input.managerId))

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:worksheet_submit",
    entity: "comp_worksheet",
    entityId: data.id,
    diff: {},
  })

  return data
}

// =====================================================================
// Approvals
// =====================================================================

export async function listApprovals(input: { cycleId: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.read"])

  if (!flags["hrms.comp.read"]) {
    throw new Error("Unauthorized: hrms.comp.read required")
  }

  const { data, error } = await supabase
    .from("comp_approvals")
    .select(`
      *,
      proposal:comp_proposals(
        *,
        employee:hr_employees(id, employee_no, first_name, last_name, email)
      )
    `)
    .eq("proposal.cycle_id", input.cycleId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function approveProposal(input: { proposalId: string; comment?: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.admin"])

  if (!flags["hrms.comp.admin"]) {
    throw new Error("Unauthorized: hrms.comp.admin required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update proposal status
  const { data, error } = await supabase
    .from("comp_proposals")
    .update({ status: "APPROVED" })
    .eq("id", input.proposalId)
    .select()
    .single()

  if (error) throw error

  // Create approval record
  await supabase.from("comp_approvals").insert({
    tenant_id: tenant?.id,
    proposal_id: input.proposalId,
    approver_id: user?.id,
    status: "APPROVED",
    comment: input.comment,
    approved_at: new Date().toISOString(),
  })

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:proposal_approve",
    entity: "comp_proposal",
    entityId: input.proposalId,
    diff: { comment: input.comment },
  })

  return data
}

export async function rejectProposal(input: { proposalId: string; reason: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.admin"])

  if (!flags["hrms.comp.admin"]) {
    throw new Error("Unauthorized: hrms.comp.admin required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update proposal status
  const { data, error } = await supabase
    .from("comp_proposals")
    .update({ status: "REJECTED" })
    .eq("id", input.proposalId)
    .select()
    .single()

  if (error) throw error

  // Create approval record
  await supabase.from("comp_approvals").insert({
    tenant_id: tenant?.id,
    proposal_id: input.proposalId,
    approver_id: user?.id,
    status: "REJECTED",
    comment: input.reason,
  })

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:proposal_reject",
    entity: "comp_proposal",
    entityId: input.proposalId,
    diff: { reason: input.reason },
  })

  return data
}

// =====================================================================
// Budgets
// =====================================================================

export async function computeBudgets(input: { cycleId: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.read"])

  if (!flags["hrms.comp.read"]) {
    throw new Error("Unauthorized: hrms.comp.read required")
  }

  // Get all approved proposals for cycle
  const { data: proposals, error } = await supabase
    .from("comp_proposals")
    .select("*")
    .eq("cycle_id", input.cycleId)
    .eq("status", "APPROVED")

  if (error) throw error

  // Calculate total used
  const totalUsed = proposals.reduce((sum, p) => {
    return sum + (p.proposed_merit_amount || 0) + (p.market_adjustment || 0) + (p.lump_sum || 0)
  }, 0)

  return {
    totalUsed,
    proposalCount: proposals.length,
  }
}

// =====================================================================
// Pay Equity
// =====================================================================

export async function payEquityReport(input: { cycleId?: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.read", "pii.salary.unmask"])

  if (!flags["hrms.comp.read"]) {
    throw new Error("Unauthorized: hrms.comp.read required")
  }

  let query = supabase.from("comp_v_pay_equity").select("*")

  if (input.cycleId) {
    query = query.eq("cycle_id", input.cycleId)
  }

  const { data, error } = await query

  if (error) throw error

  // Mask salary fields if no unmask permission
  const masked = data.map((p) =>
    maskFields(p, flags, {
      current_base: "pii.salary.unmask",
      band_min: "pii.salary.unmask",
      band_mid: "pii.salary.unmask",
      band_max: "pii.salary.unmask",
    }),
  )

  return masked
}

// =====================================================================
// Letters
// =====================================================================

export async function generateLetters(input: { cycleId: string; templateKey: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.letters.send"])

  if (!flags["hrms.comp.letters.send"]) {
    throw new Error("Unauthorized: hrms.comp.letters.send required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get all approved proposals
  const { data: proposals, error } = await supabase
    .from("comp_proposals")
    .select(`
      *,
      employee:hr_employees(id, employee_no, first_name, last_name, email)
    `)
    .eq("cycle_id", input.cycleId)
    .eq("status", "APPROVED")

  if (error) throw error

  // Create letter records
  const letters = proposals.map((p) => ({
    tenant_id: tenant?.id,
    cycle_id: input.cycleId,
    employee_id: p.employee_id,
    status: "DRAFT",
  }))

  const { data: created, error: insertError } = await supabase.from("comp_letters").insert(letters).select()

  if (insertError) throw insertError

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:letters_generate",
    entity: "comp_cycle",
    entityId: input.cycleId,
    diff: { count: created.length },
  })

  return created
}

export async function sendLetter(input: { letterId: string; recipients: string[] }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.letters.send"])

  if (!flags["hrms.comp.letters.send"]) {
    throw new Error("Unauthorized: hrms.comp.letters.send required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update letter status
  const { data, error } = await supabase
    .from("comp_letters")
    .update({ status: "SENT", sent_at: new Date().toISOString() })
    .eq("id", input.letterId)
    .select()
    .single()

  if (error) throw error

  // TODO: Send email via email service

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:letter_send",
    entity: "comp_letter",
    entityId: input.letterId,
    diff: { recipients: input.recipients },
  })

  return data
}

// =====================================================================
// Exports
// =====================================================================

export async function exportCompCsv(input: {
  cycleId: string
  scope: "bands" | "worksheets" | "approvals" | "letters"
}) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["exports.allowed"])

  if (!flags["exports.allowed"]) {
    throw new Error("Unauthorized: exports.allowed required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let data: any[] = []
  let headers: string[] = []

  if (input.scope === "bands") {
    const { data: bands } = await supabase.from("comp_bands").select("*")
    data = bands || []
    headers = ["job_family", "grade", "level", "region", "currency", "min_amount", "mid_amount", "max_amount"]
  } else if (input.scope === "worksheets") {
    const { data: proposals } = await supabase.from("comp_proposals").select("*").eq("cycle_id", input.cycleId)
    data = proposals || []
    headers = ["employee_id", "current_base", "proposed_merit_pct", "proposed_merit_amount", "status"]
  }

  const csv = await generateCsv(data, headers)

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:export_csv",
    entity: "comp_cycle",
    entityId: input.cycleId,
    diff: { scope: input.scope },
  })

  return csv
}

// =====================================================================
// Ledger Notarization
// =====================================================================

export async function notarizeCycle(input: { cycleId: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["ledger.notarize"])

  if (!flags["ledger.notarize"]) {
    throw new Error("Unauthorized: ledger.notarize required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get cycle data
  const { data: cycle, error } = await supabase.from("comp_cycles").select("*").eq("id", input.cycleId).single()

  if (error) throw error

  // Compute hash
  const hash = await computeFileHash(Buffer.from(JSON.stringify(cycle)))

  // Notarize
  await notarizeHash(hash, "comp_cycle", input.cycleId)

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:cycle_notarize",
    entity: "comp_cycle",
    entityId: input.cycleId,
    diff: { hash },
  })

  return { success: true, hash }
}

export async function notarizeLetter(input: { letterId: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["ledger.notarize"])

  if (!flags["ledger.notarize"]) {
    throw new Error("Unauthorized: ledger.notarize required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get letter data
  const { data: letter, error } = await supabase.from("comp_letters").select("*").eq("id", input.letterId).single()

  if (error) throw error

  // Compute hash
  const hash = await computeFileHash(Buffer.from(JSON.stringify(letter)))

  // Notarize
  await notarizeHash(hash, "comp_letter", input.letterId)

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:letter_notarize",
    entity: "comp_letter",
    entityId: input.letterId,
    diff: { hash },
  })

  return { success: true, hash }
}

// =====================================================================
// Payroll Integration (Stub)
// =====================================================================

export async function pushToPayroll(input: { cycleId: string; providerKey: string }) {
  const supabase = await createServerClient()
  const flags = await hasFeatures(["hrms.comp.admin"])

  if (!flags["hrms.comp.admin"]) {
    throw new Error("Unauthorized: hrms.comp.admin required")
  }

  const { data: tenant } = await supabase.from("tenants").select("id").single()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get all approved proposals
  const { data: proposals, error } = await supabase
    .from("comp_proposals")
    .select("*")
    .eq("cycle_id", input.cycleId)
    .eq("status", "APPROVED")

  if (error) throw error

  // TODO: Push to payroll provider API

  await appendAudit({
    tenantId: tenant?.id || null,
    actorUserId: user?.id,
    action: "comp:push_to_payroll",
    entity: "comp_cycle",
    entityId: input.cycleId,
    diff: { providerKey: input.providerKey, count: proposals.length },
  })

  return { success: true, count: proposals.length }
}
