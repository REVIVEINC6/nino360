"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { hasFeature, hasFeatures, maskFields } from "@/lib/fbac"
import { appendAudit } from "@/lib/hash"
import { notarizeHash } from "@/lib/ledger/notarize"
import { generateCsv } from "@/lib/export/csv"
import { syncEnrollmentToPayroll } from "@/lib/payroll/deductions"
import { generateEdi834 } from "@/lib/edi/edi834"
import { generateConfirmationPdf } from "@/lib/pdf/render-confirmation"

// ============================================================================
// SCHEMAS
// ============================================================================

const GetOpenEnrollmentSchema = z.object({
  employeeId: z.string().uuid(),
})

const ComputeCostSchema = z.object({
  employeeId: z.string().uuid(),
  planId: z.string().uuid(),
  optionId: z.string().uuid(),
  dependents: z.array(z.string().uuid()),
})

const SaveDraftEnrollmentSchema = z.object({
  employeeId: z.string().uuid(),
  planId: z.string().uuid(),
  optionId: z.string().uuid(),
  dependents: z.array(z.string().uuid()),
  eventId: z.string().uuid().optional(),
  coverageStart: z.string(),
})

const SubmitEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid(),
})

const ApproveEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid(),
})

const DeclineEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid(),
  reason: z.string(),
})

const ManageDependentSchema = z.object({
  id: z.string().uuid().optional(),
  employeeId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.enum(["SPOUSE", "DOMESTIC_PARTNER", "CHILD", "OTHER"]),
  dob: z.string(),
  gender: z.string().optional(),
  ssnLast4: z.string().optional(),
  tobaccoUser: z.boolean().default(false),
  disabled: z.boolean().default(false),
})

const StartQleSchema = z.object({
  employeeId: z.string().uuid(),
  qleType: z.enum([
    "MARRIAGE",
    "BIRTH",
    "ADOPTION",
    "DIVORCE",
    "LOSS_OF_COVERAGE",
    "GAIN_OF_COVERAGE",
    "ADDRESS_CHANGE",
    "OTHER",
  ]),
  eventDate: z.string(),
})

const VerifyEvidenceSchema = z.object({
  eventId: z.string().uuid(),
  documentId: z.string().uuid(),
  verified: z.boolean(),
})

const SavePlanSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string(),
  name: z.string(),
  type: z.enum(["MEDICAL", "DENTAL", "VISION", "LIFE", "DISABILITY", "FSA", "HSA", "COMMUTER", "OTHER"]),
  carrierId: z.string().uuid().optional(),
  region: z.string().optional(),
  currency: z.string().default("USD"),
  waitingPeriodDays: z.number().default(0),
  calcRule: z.any(),
  effectiveFrom: z.string(),
  effectiveTo: z.string().optional(),
})

const GenerateEdi834Schema = z.object({
  carrierId: z.string().uuid(),
  periodFrom: z.string(),
  periodTo: z.string(),
})

const NotarizeConfirmationSchema = z.object({
  enrollmentId: z.string().uuid(),
})

const NotarizeEdiSchema = z.object({
  runId: z.string().uuid(),
})

const ExportBenefitsCsvSchema = z.object({
  scope: z.enum(["enrollments", "plans", "deductions", "edi"]),
  filters: z.any().optional(),
})

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Get open enrollment data for an employee
 */
export async function getOpenEnrollment(input: z.infer<typeof GetOpenEnrollmentSchema>) {
  const parsed = GetOpenEnrollmentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canRead = await hasFeature("hrms.benefits.read")
  if (!canRead) {
    throw new Error("Permission denied")
  }

  // Get active plans
  const { data: plans, error: plansError } = await supabase
    .from("plans")
    .select(`
      *,
      carrier:carriers(*),
      options:plan_options(*),
      rates:rate_cards(*)
    `)
    .eq("active", true)
    .lte("effective_from", new Date().toISOString().split("T")[0])
    .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split("T")[0]}`)

  if (plansError) {
    throw new Error("Failed to fetch plans")
  }

  // Get current enrollments
  const { data: enrollments, error: enrollError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("employee_id", parsed.employeeId)
    .in("status", ["DRAFT", "SUBMITTED", "APPROVED"])

  if (enrollError) {
    throw new Error("Failed to fetch enrollments")
  }

  // Get dependents
  const { data: dependents, error: depsError } = await supabase
    .from("dependents")
    .select("*")
    .eq("employee_id", parsed.employeeId)

  if (depsError) {
    throw new Error("Failed to fetch dependents")
  }

  // Mask dependent PII
  const permissions = await hasFeatures(["pii.dependent.unmask"])
  const maskedDependents = dependents?.map((d: any) =>
    maskFields(d, permissions, {
      dob: "pii.dependent.unmask",
      ssn_last4: "pii.dependent.unmask",
    }),
  )

  return {
    plans: plans || [],
    enrollments: enrollments || [],
    dependents: maskedDependents || [],
  }
}

/**
 * Compute enrollment cost
 */
export async function computeCost(input: z.infer<typeof ComputeCostSchema>) {
  const parsed = ComputeCostSchema.parse(input)
  const supabase = await createServerClient()

  // Get plan and option
  const { data: plan, error: planError } = await supabase.from("plans").select("*").eq("id", parsed.planId).single()

  if (planError || !plan) {
    throw new Error("Plan not found")
  }

  const { data: option, error: optionError } = await supabase
    .from("plan_options")
    .select("*")
    .eq("id", parsed.optionId)
    .single()

  if (optionError || !option) {
    throw new Error("Option not found")
  }

  // Get rate card
  const { data: rateCard, error: rateError } = await supabase
    .from("rate_cards")
    .select("*")
    .eq("plan_id", parsed.planId)
    .eq("option_id", parsed.optionId)
    .lte("effective_from", new Date().toISOString().split("T")[0])
    .or(`effective_to.is.null,effective_to.gte.${new Date().toISOString().split("T")[0]}`)
    .single()

  if (rateError || !rateCard) {
    throw new Error("Rate card not found")
  }

  // Calculate cost based on rule
  const rule = rateCard.rule
  let employeeCost = 0
  let employerCost = 0

  if (rule.kind === "composite") {
    // Composite pricing
    employeeCost = rule.employee || 0
    if (option.coverage_tier === "EE_SPOUSE") {
      employeeCost += rule.spouse || 0
    } else if (option.coverage_tier === "EE_CHILDREN") {
      employeeCost += (rule.child || 0) * parsed.dependents.length
    } else if (option.coverage_tier === "FAMILY") {
      employeeCost = rule.family || 0
    }
    employerCost = (rule.employer_contribution || 0) * 1.0 // stub
  } else if (rule.kind === "flat") {
    employeeCost = rule.rate || 0
    employerCost = rule.employer_rate || 0
  }

  // Assume bi-weekly pay frequency for per-paycheck calculation
  const perPaycheck = employeeCost / 2

  return {
    employeeCost,
    employerCost,
    perPaycheck,
    currency: plan.currency,
  }
}

/**
 * Save draft enrollment
 */
export async function saveDraftEnrollment(input: z.infer<typeof SaveDraftEnrollmentSchema>) {
  const parsed = SaveDraftEnrollmentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canWrite = await hasFeature("hrms.benefits.write")
  if (!canWrite) {
    throw new Error("Permission denied")
  }

  // Compute cost
  const cost = await computeCost({
    employeeId: parsed.employeeId,
    planId: parsed.planId,
    optionId: parsed.optionId,
    dependents: parsed.dependents,
  })

  // Get tenant ID
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  if (!member) {
    throw new Error("Tenant not found")
  }

  // Create or update enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .upsert({
      tenant_id: member.tenant_id,
      employee_id: parsed.employeeId,
      plan_id: parsed.planId,
      option_id: parsed.optionId,
      event_id: parsed.eventId || null,
      coverage_start: parsed.coverageStart,
      status: "DRAFT",
      employee_cost: cost.employeeCost,
      employer_cost: cost.employerCost,
      currency: cost.currency,
    })
    .select()
    .single()

  if (enrollError) {
    throw new Error("Failed to save enrollment")
  }

  // Create enrollment lines for dependents
  if (parsed.dependents.length > 0) {
    const lines = parsed.dependents.map((depId) => ({
      tenant_id: member.tenant_id,
      enrollment_id: enrollment.id,
      dependent_id: depId,
      covered: true,
    }))

    const { error: linesError } = await supabase.from("enrollment_lines").upsert(lines)

    if (linesError) {
      throw new Error("Failed to save enrollment lines")
    }
  }

  // Audit
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user?.id,
    action: "benefits:save_draft",
    entity: "enrollment",
    entityId: enrollment.id,
    diff: { status: "DRAFT", planId: parsed.planId },
  })

  return { success: true, enrollmentId: enrollment.id }
}

/**
 * Submit enrollment
 */
export async function submitEnrollment(input: z.infer<typeof SubmitEnrollmentSchema>) {
  const parsed = SubmitEnrollmentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canWrite = await hasFeature("hrms.benefits.write")
  if (!canWrite) {
    throw new Error("Permission denied")
  }

  // Update status
  const { error } = await supabase
    .from("enrollments")
    .update({ status: "SUBMITTED", updated_at: new Date().toISOString() })
    .eq("id", parsed.enrollmentId)

  if (error) {
    throw new Error("Failed to submit enrollment")
  }

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:submit",
    entity: "enrollment",
    entityId: parsed.enrollmentId,
    diff: { status: "SUBMITTED" },
  })

  return { success: true }
}

/**
 * Approve enrollment
 */
export async function approveEnrollment(input: z.infer<typeof ApproveEnrollmentSchema>) {
  const parsed = ApproveEnrollmentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canAdmin = await hasFeature("hrms.benefits.admin")
  if (!canAdmin) {
    throw new Error("Permission denied")
  }

  // Update status
  const { error } = await supabase
    .from("enrollments")
    .update({ status: "APPROVED", updated_at: new Date().toISOString() })
    .eq("id", parsed.enrollmentId)

  if (error) {
    throw new Error("Failed to approve enrollment")
  }

  // Generate confirmation PDF
  const pdf = await generateConfirmationPdf(parsed.enrollmentId)
  if (pdf.success && pdf.pdfUrl) {
    // In production, create document record and link to enrollment
    console.log("[v0] Confirmation PDF generated:", pdf.pdfUrl)
  }

  // Sync to payroll
  const payrollSync = await syncEnrollmentToPayroll(parsed.enrollmentId)
  console.log("[v0] Payroll sync:", payrollSync)

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:approve",
    entity: "enrollment",
    entityId: parsed.enrollmentId,
    diff: { status: "APPROVED" },
  })

  return { success: true }
}

/**
 * Decline enrollment
 */
export async function declineEnrollment(input: z.infer<typeof DeclineEnrollmentSchema>) {
  const parsed = DeclineEnrollmentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canAdmin = await hasFeature("hrms.benefits.admin")
  if (!canAdmin) {
    throw new Error("Permission denied")
  }

  // Update status
  const { error } = await supabase
    .from("enrollments")
    .update({ status: "DECLINED", updated_at: new Date().toISOString() })
    .eq("id", parsed.enrollmentId)

  if (error) {
    throw new Error("Failed to decline enrollment")
  }

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:decline",
    entity: "enrollment",
    entityId: parsed.enrollmentId,
    diff: { status: "DECLINED", reason: parsed.reason },
  })

  return { success: true }
}

/**
 * Manage dependent
 */
export async function manageDependent(input: z.infer<typeof ManageDependentSchema>) {
  const parsed = ManageDependentSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canWrite = await hasFeature("hrms.benefits.write")
  if (!canWrite) {
    throw new Error("Permission denied")
  }

  // Get tenant ID
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  if (!member) {
    throw new Error("Tenant not found")
  }

  // Upsert dependent
  const { data: dependent, error } = await supabase
    .from("dependents")
    .upsert({
      id: parsed.id,
      tenant_id: member.tenant_id,
      employee_id: parsed.employeeId,
      first_name: parsed.firstName,
      last_name: parsed.lastName,
      relationship: parsed.relationship,
      dob: parsed.dob,
      gender: parsed.gender || null,
      ssn_last4: parsed.ssnLast4 || null,
      tobacco_user: parsed.tobaccoUser,
      disabled: parsed.disabled,
    })
    .select()
    .single()

  if (error) {
    throw new Error("Failed to save dependent")
  }

  // Audit
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user?.id,
    action: parsed.id ? "benefits:update_dependent" : "benefits:create_dependent",
    entity: "dependent",
    entityId: dependent.id,
    diff: { firstName: parsed.firstName, lastName: parsed.lastName },
  })

  return { success: true, dependentId: dependent.id }
}

/**
 * Start QLE
 */
export async function startQle(input: z.infer<typeof StartQleSchema>) {
  const parsed = StartQleSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canWrite = await hasFeature("hrms.benefits.write")
  if (!canWrite) {
    throw new Error("Permission denied")
  }

  // Get tenant ID
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  if (!member) {
    throw new Error("Tenant not found")
  }

  // Compute window end (30 days from event date)
  const eventDate = new Date(parsed.eventDate)
  const windowEnds = new Date(eventDate)
  windowEnds.setDate(windowEnds.getDate() + 30)

  // Create event
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      tenant_id: member.tenant_id,
      employee_id: parsed.employeeId,
      kind: "QLE",
      qle_type: parsed.qleType,
      event_date: parsed.eventDate,
      window_ends: windowEnds.toISOString().split("T")[0],
      status: "OPEN",
    })
    .select()
    .single()

  if (error) {
    throw new Error("Failed to create QLE event")
  }

  // Audit
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user?.id,
    action: "benefits:start_qle",
    entity: "event",
    entityId: event.id,
    diff: { qleType: parsed.qleType, eventDate: parsed.eventDate },
  })

  return { success: true, eventId: event.id, windowEnds: windowEnds.toISOString().split("T")[0] }
}

/**
 * Verify evidence
 */
export async function verifyEvidence(input: z.infer<typeof VerifyEvidenceSchema>) {
  const parsed = VerifyEvidenceSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canAdmin = await hasFeature("hrms.benefits.admin")
  if (!canAdmin) {
    throw new Error("Permission denied")
  }

  // Update evidence
  const { error } = await supabase
    .from("evidence")
    .update({
      verified: parsed.verified,
      verified_at: parsed.verified ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("event_id", parsed.eventId)
    .eq("document_id", parsed.documentId)

  if (error) {
    throw new Error("Failed to verify evidence")
  }

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:verify_evidence",
    entity: "evidence",
    entityId: `${parsed.eventId}-${parsed.documentId}`,
    diff: { verified: parsed.verified },
  })

  return { success: true }
}

/**
 * Save plan (admin)
 */
export async function savePlan(input: z.infer<typeof SavePlanSchema>) {
  const parsed = SavePlanSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canAdmin = await hasFeature("hrms.benefits.admin")
  if (!canAdmin) {
    throw new Error("Permission denied")
  }

  // Get tenant ID
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  if (!member) {
    throw new Error("Tenant not found")
  }

  // Upsert plan
  const { data: plan, error } = await supabase
    .from("plans")
    .upsert({
      id: parsed.id,
      tenant_id: member.tenant_id,
      key: parsed.key,
      name: parsed.name,
      type: parsed.type,
      carrier_id: parsed.carrierId || null,
      region: parsed.region || null,
      currency: parsed.currency,
      waiting_period_days: parsed.waitingPeriodDays,
      calc_rule: parsed.calcRule,
      effective_from: parsed.effectiveFrom,
      effective_to: parsed.effectiveTo || null,
      active: true,
    })
    .select()
    .single()

  if (error) {
    throw new Error("Failed to save plan")
  }

  // Audit
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user?.id,
    action: parsed.id ? "benefits:update_plan" : "benefits:create_plan",
    entity: "plan",
    entityId: plan.id,
    diff: { name: parsed.name, type: parsed.type },
  })

  return { success: true, planId: plan.id }
}

/**
 * Generate EDI 834
 */
export async function generateEdi834Action(input: z.infer<typeof GenerateEdi834Schema>) {
  const parsed = GenerateEdi834Schema.parse(input)

  // Check permissions
  const canAdmin = await hasFeature("hrms.benefits.admin")
  const hasEdi = await hasFeature("integrations.edi834")
  if (!canAdmin || !hasEdi) {
    throw new Error("Permission denied")
  }

  const result = await generateEdi834(parsed)

  // Audit
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:generate_edi834",
    entity: "edi_run",
    entityId: result.runId,
    diff: { controlNo: result.controlNo, sha256: result.sha256 },
  })

  return result
}

/**
 * Notarize confirmation
 */
export async function notarizeConfirmation(input: z.infer<typeof NotarizeConfirmationSchema>) {
  const parsed = NotarizeConfirmationSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canNotarize = await hasFeature("ledger.notarize")
  if (!canNotarize) {
    throw new Error("Permission denied")
  }

  // Get enrollment
  const { data: enrollment, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", parsed.enrollmentId)
    .single()

  if (error || !enrollment) {
    throw new Error("Enrollment not found")
  }

  // Compute hash
  const hash = `enrollment-${enrollment.id}-${enrollment.status}-${enrollment.employee_cost}`

  // Notarize
  const proof = await notarizeHash(hash, "enrollment", enrollment.id)

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:notarize_confirmation",
    entity: "enrollment",
    entityId: enrollment.id,
    diff: { hash, block: proof.block },
  })

  return { success: true, proof }
}

/**
 * Notarize EDI
 */
export async function notarizeEdi(input: z.infer<typeof NotarizeEdiSchema>) {
  const parsed = NotarizeEdiSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canNotarize = await hasFeature("ledger.notarize")
  if (!canNotarize) {
    throw new Error("Permission denied")
  }

  // Get EDI run
  const { data: run, error } = await supabase.from("edi_runs").select("*").eq("id", parsed.runId).single()

  if (error || !run || !run.sha256) {
    throw new Error("EDI run not found or missing hash")
  }

  // Notarize
  const proof = await notarizeHash(run.sha256, "edi_run", run.id)

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:notarize_edi",
    entity: "edi_run",
    entityId: run.id,
    diff: { hash: run.sha256, block: proof.block },
  })

  return { success: true, proof }
}

/**
 * Export benefits CSV
 */
export async function exportBenefitsCsv(input: z.infer<typeof ExportBenefitsCsvSchema>) {
  const parsed = ExportBenefitsCsvSchema.parse(input)
  const supabase = await createServerClient()

  // Check permissions
  const canExport = await hasFeature("exports.allowed")
  if (!canExport) {
    throw new Error("Permission denied")
  }

  let data: any[] = []
  let headers: string[] = []

  if (parsed.scope === "enrollments") {
    const { data: enrollments } = await supabase.from("v_enrollment_summary").select("*")

    data = enrollments || []
    headers = [
      "employee_name",
      "plan_name",
      "plan_type",
      "coverage_tier",
      "status",
      "employee_cost",
      "employer_cost",
      "coverage_start",
    ]
  } else if (parsed.scope === "plans") {
    const { data: plans } = await supabase.from("plans").select("*")

    data = plans || []
    headers = ["name", "type", "region", "currency", "waiting_period_days", "effective_from", "effective_to", "active"]
  } else if (parsed.scope === "deductions") {
    const { data: deductions } = await supabase.from("deductions").select("*")

    data = deductions || []
    headers = ["employee_id", "provider_key", "code", "amount", "type", "start_date", "end_date", "source"]
  } else if (parsed.scope === "edi") {
    const { data: runs } = await supabase.from("edi_runs").select("*")

    data = runs || []
    headers = ["carrier_id", "control_no", "period_from", "period_to", "status", "sha256", "created_at"]
  }

  const csv = await generateCsv(data, headers)

  // Audit
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id || null,
    actorUserId: user?.id,
    action: "benefits:export_csv",
    entity: "export",
    entityId: parsed.scope,
    diff: { scope: parsed.scope, rowCount: data.length },
  })

  return { success: true, csv }
}
