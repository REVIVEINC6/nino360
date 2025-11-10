"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeatures } from "@/lib/fbac"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

// ============================================================================
// SCHEMAS
// ============================================================================

const Section1Schema = z.object({
  citizenship_status: z.enum(["USC", "NONCITIZEN_NATIONAL", "LPR", "AUTHORIZED_ALIEN"]),
  alien_number: z.string().optional(),
  uscis_number: z.string().optional(),
  i94_number: z.string().optional(),
  passport_number: z.string().optional(),
  country_of_issuance: z.string().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  middle_initial: z.string().optional(),
  other_last_names: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zip: z.string().min(5),
  dob: z.string(), // ISO date
  ssn_last4: z.string().length(4),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  signature_date: z.string(), // ISO date
  preparer_translator_used: z.boolean().default(false),
  preparer_info: z
    .object({
      name: z.string(),
      address: z.string(),
      signature_date: z.string(),
    })
    .optional(),
})

const DocumentSchema = z.object({
  list: z.enum(["A", "B", "C"]),
  doc_title: z.string().min(1),
  issuing_authority: z.string().min(1),
  doc_number: z.string().min(1),
  expiration_date: z.string().optional(), // ISO date or "N/A"
  scan_url: z.string().url().optional(),
  redacted_scan_url: z.string().url().optional(),
})

const Section2Schema = z.object({
  list_a_doc: DocumentSchema.optional(),
  list_b_doc: DocumentSchema.optional(),
  list_c_doc: DocumentSchema.optional(),
  examiner_name: z.string().min(1),
  examiner_title: z.string().min(1),
  business_name: z.string().min(1),
  business_address: z.string().min(1),
  exam_date: z.string(), // ISO date
  signature_date: z.string(), // ISO date
  alternative_procedure_used: z.boolean().default(false),
  remote_session_ref: z.string().optional(),
  additional_info: z.string().optional(),
})

const Section3Schema = z.object({
  reverification_date: z.string().optional(), // ISO date
  new_name: z.string().optional(),
  rehire_date: z.string().optional(), // ISO date
  new_doc_info: DocumentSchema.optional(),
  examiner_name: z.string().min(1),
  examiner_signature_date: z.string(), // ISO date
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function getQueue(input: {
  orgId?: string
  dueBucket?: string
  q?: string
  page?: number
  limit?: number
}) {
  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["hrms.i9.read"])
  if (!flags["hrms.i9.read"]) {
    return { error: "Permission denied: hrms.i9.read required" }
  }

  const page = input.page || 1
  const limit = input.limit || 50
  const offset = (page - 1) * limit

  let query = supabase
    .from("i9_records")
    .select(
      `
      *,
      employee:employees!inner(id, legal_name, employee_no, status)
    `,
      { count: "exact" },
    )
    .order("hire_date", { ascending: false })
    .range(offset, offset + limit - 1)

  // Filter by due bucket
  if (input.dueBucket) {
    const today = new Date().toISOString().split("T")[0]
    const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const in60Days = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    switch (input.dueBucket) {
      case "S1_DUE_TODAY":
        query = query.eq("hire_date", today).is("section1_completed_at", null)
        break
      case "S2_DUE_3DAYS":
        query = query
          .not("section1_completed_at", "is", null)
          .is("section2_examined_at", null)
          .lte("hire_date", in3Days)
        break
      case "S3_DUE_60DAYS":
        query = query.not("section3_due", "is", null).lte("section3_due", in60Days).gte("section3_due", today)
        break
      case "PAST_DUE":
        query = query
          .not("section1_completed_at", "is", null)
          .is("section2_examined_at", null)
          .lt("hire_date", new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
        break
      case "COMPLETE":
        query = query.eq("status", "COMPLETE")
        break
      case "REVERIFY":
        query = query.eq("reverification_required", true)
        break
    }
  }

  // Search by employee name or number
  if (input.q) {
    query = query.or(`legal_name.ilike.%${input.q}%,employee_no.ilike.%${input.q}%`, { foreignTable: "employees" })
  }

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] getQueue error:", error)
    return { error: error.message }
  }

  // Get summary counts
  const { data: summary } = await supabase.from("vw_i9_queue_summary").select("*").single()

  return {
    records: data || [],
    summary: summary || {},
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  }
}

export async function startI9(input: { employeeId: string }) {
  const schema = z.object({
    employeeId: z.string().uuid(),
  })

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["hrms.i9.write"])
  if (!flags["hrms.i9.write"]) {
    return { error: "Permission denied: hrms.i9.write required" }
  }

  // Get employee hire date
  const { data: employee, error: empError } = await supabase
    .from("employees")
    .select("id, hire_date, termination_date")
    .eq("id", parsed.data.employeeId)
    .single()

  if (empError || !employee) {
    return { error: "Employee not found" }
  }

  if (!employee.hire_date) {
    return { error: "Employee hire date is required to start I-9" }
  }

  // Check if I-9 record already exists
  const { data: existing } = await supabase
    .from("i9_records")
    .select("id")
    .eq("employee_id", parsed.data.employeeId)
    .maybeSingle()

  if (existing) {
    return { error: "I-9 record already exists for this employee", recordId: existing.id }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Compute retention due
  const retentionDue = employee.termination_date
    ? new Date(
        Math.max(
          new Date(employee.hire_date).getTime() + 3 * 365 * 24 * 60 * 60 * 1000,
          new Date(employee.termination_date).getTime() + 365 * 24 * 60 * 60 * 1000,
        ),
      )
        .toISOString()
        .split("T")[0]
    : new Date(new Date(employee.hire_date).getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Create I-9 record
  const { data: record, error: insertError } = await supabase
    .from("i9_records")
    .insert({
      employee_id: parsed.data.employeeId,
      hire_date: employee.hire_date,
      retention_due: retentionDue,
      status: "IN_PROGRESS",
      created_by: user?.id,
    })
    .select()
    .single()

  if (insertError) {
    console.error("[v0] startI9 error:", insertError)
    return { error: insertError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: record.tenant_id,
    actorUserId: user?.id,
    action: "i9:start",
    entity: "i9_record",
    entityId: record.id,
    diff: { employee_id: parsed.data.employeeId, hire_date: employee.hire_date },
  })

  revalidatePath("/hrms/i9-compliance")

  return { success: true, recordId: record.id }
}

export async function saveSection1(input: {
  recordId: string
  payload: z.infer<typeof Section1Schema>
}) {
  const schema = z.object({
    recordId: z.string().uuid(),
    payload: Section1Schema,
  })

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["hrms.i9.write"])
  if (!flags["hrms.i9.write"]) {
    return { error: "Permission denied: hrms.i9.write required" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update I-9 record
  const { data: record, error: updateError } = await supabase
    .from("i9_records")
    .update({
      section1: parsed.data.payload,
      section1_completed_at: new Date().toISOString(),
      preparer_translator: parsed.data.payload.preparer_translator_used,
      status: "IN_PROGRESS",
      updated_by: user?.id,
    })
    .eq("id", parsed.data.recordId)
    .select()
    .single()

  if (updateError) {
    console.error("[v0] saveSection1 error:", updateError)
    return { error: updateError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: record.tenant_id,
    actorUserId: user?.id,
    action: "i9:section1:save",
    entity: "i9_record",
    entityId: record.id,
    diff: { section1: parsed.data.payload },
  })

  revalidatePath("/hrms/i9-compliance")

  return { success: true, record }
}

export async function saveSection2(input: {
  recordId: string
  payload: z.infer<typeof Section2Schema>
}) {
  const schema = z.object({
    recordId: z.string().uuid(),
    payload: Section2Schema,
  })

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["hrms.i9.write"])
  if (!flags["hrms.i9.write"]) {
    return { error: "Permission denied: hrms.i9.write required" }
  }

  // Validate documents: must have List A OR (List B AND List C)
  const hasListA = !!parsed.data.payload.list_a_doc
  const hasListB = !!parsed.data.payload.list_b_doc
  const hasListC = !!parsed.data.payload.list_c_doc

  if (!hasListA && !(hasListB && hasListC)) {
    return { error: "Must provide either List A document OR both List B and List C documents" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Build documents array
  const documents: any[] = []
  if (parsed.data.payload.list_a_doc) documents.push({ ...parsed.data.payload.list_a_doc, list: "A" })
  if (parsed.data.payload.list_b_doc) documents.push({ ...parsed.data.payload.list_b_doc, list: "B" })
  if (parsed.data.payload.list_c_doc) documents.push({ ...parsed.data.payload.list_c_doc, list: "C" })

  // Update I-9 record
  const { data: record, error: updateError } = await supabase
    .from("i9_records")
    .update({
      section2: parsed.data.payload,
      section2_examined_at: new Date().toISOString(),
      alternative_procedure_used: parsed.data.payload.alternative_procedure_used,
      remote_session_ref: parsed.data.payload.remote_session_ref,
      documents,
      status: "COMPLETE",
      updated_by: user?.id,
    })
    .eq("id", parsed.data.recordId)
    .select()
    .single()

  if (updateError) {
    console.error("[v0] saveSection2 error:", updateError)
    return { error: updateError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: record.tenant_id,
    actorUserId: user?.id,
    action: "i9:section2:save",
    entity: "i9_record",
    entityId: record.id,
    diff: { section2: parsed.data.payload, documents },
  })

  revalidatePath("/hrms/i9-compliance")

  return { success: true, record }
}

export async function saveSection3(input: {
  recordId: string
  payload: z.infer<typeof Section3Schema>
}) {
  const schema = z.object({
    recordId: z.string().uuid(),
    payload: Section3Schema,
  })

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["hrms.i9.write"])
  if (!flags["hrms.i9.write"]) {
    return { error: "Permission denied: hrms.i9.write required" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update I-9 record
  const { data: record, error: updateError } = await supabase
    .from("i9_records")
    .update({
      section3: parsed.data.payload,
      section3_due: parsed.data.payload.reverification_date || parsed.data.payload.rehire_date,
      reverification_required: false, // Mark as completed
      status: "COMPLETE",
      updated_by: user?.id,
    })
    .eq("id", parsed.data.recordId)
    .select()
    .single()

  if (updateError) {
    console.error("[v0] saveSection3 error:", updateError)
    return { error: updateError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: record.tenant_id,
    actorUserId: user?.id,
    action: "i9:section3:save",
    entity: "i9_record",
    entityId: record.id,
    diff: { section3: parsed.data.payload },
  })

  revalidatePath("/hrms/i9-compliance")

  return { success: true, record }
}

export async function setEVerify(input: {
  recordId: string
  status: string
  caseNo?: string
}) {
  const schema = z.object({
    recordId: z.string().uuid(),
    status: z.enum([
      "NOT_STARTED",
      "OPEN",
      "EMPLOYMENT_AUTH_CONFIRMED",
      "TNC",
      "CASE_IN_CONTINUANCE",
      "CLOSED",
      "FINAL_NONCONFIRMATION",
    ]),
    caseNo: z.string().optional(),
  })

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["integrations.everify"])
  if (!flags["integrations.everify"]) {
    return { error: "Permission denied: integrations.everify required" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update I-9 record
  const { data: record, error: updateError } = await supabase
    .from("i9_records")
    .update({
      e_verify_status: parsed.data.status,
      e_verify_case_no: parsed.data.caseNo,
      e_verify_submitted_at: parsed.data.status === "OPEN" ? new Date().toISOString() : undefined,
      e_verify_result_at: ["EMPLOYMENT_AUTH_CONFIRMED", "FINAL_NONCONFIRMATION", "CLOSED"].includes(parsed.data.status)
        ? new Date().toISOString()
        : undefined,
      updated_by: user?.id,
    })
    .eq("id", parsed.data.recordId)
    .select()
    .single()

  if (updateError) {
    console.error("[v0] setEVerify error:", updateError)
    return { error: updateError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: record.tenant_id,
    actorUserId: user?.id,
    action: "everify:update",
    entity: "i9_record",
    entityId: record.id,
    diff: { e_verify_status: parsed.data.status, e_verify_case_no: parsed.data.caseNo },
  })

  revalidatePath("/hrms/i9-compliance")

  return { success: true, record }
}

export async function computeRetention(input: { recordId: string }) {
  const schema = z.object({
    recordId: z.string().uuid(),
  })

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["hrms.i9.write"])
  if (!flags["hrms.i9.write"]) {
    return { error: "Permission denied: hrms.i9.write required" }
  }

  // Get I-9 record and employee
  const { data: record, error: recordError } = await supabase
    .from("i9_records")
    .select(`
      *,
      employee:employees!inner(hire_date, termination_date)
    `)
    .eq("id", parsed.data.recordId)
    .single()

  if (recordError || !record) {
    return { error: "I-9 record not found" }
  }

  // Compute retention due: max(hire_date + 3 years, termination_date + 1 year)
  const hireDate = new Date(record.employee.hire_date)
  const terminationDate = record.employee.termination_date ? new Date(record.employee.termination_date) : null

  const retentionDue = terminationDate
    ? new Date(
        Math.max(
          hireDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000,
          terminationDate.getTime() + 365 * 24 * 60 * 60 * 1000,
        ),
      )
        .toISOString()
        .split("T")[0]
    : new Date(hireDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Update I-9 record
  const { data: updated, error: updateError } = await supabase
    .from("i9_records")
    .update({
      retention_due: retentionDue,
      updated_by: user?.id,
    })
    .eq("id", parsed.data.recordId)
    .select()
    .single()

  if (updateError) {
    console.error("[v0] computeRetention error:", updateError)
    return { error: updateError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: updated.tenant_id,
    actorUserId: user?.id,
    action: "i9:retention:compute",
    entity: "i9_record",
    entityId: updated.id,
    diff: { retention_due: retentionDue },
  })

  revalidatePath("/hrms/i9-compliance")

  return { success: true, retentionDue }
}

export async function notarizeI9(input: { recordId: string }) {
  const schema = z.object({
    recordId: z.string().uuid(),
  })

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["ledger.notarize"])
  if (!flags["ledger.notarize"]) {
    return { error: "Permission denied: ledger.notarize required" }
  }

  // Get I-9 record
  const { data: record, error: recordError } = await supabase
    .from("i9_records")
    .select("*")
    .eq("id", parsed.data.recordId)
    .single()

  if (recordError || !record) {
    return { error: "I-9 record not found" }
  }

  if (record.status !== "COMPLETE") {
    return { error: "I-9 record must be complete before notarization" }
  }

  // Compute hash of canonical JSON
  const canonical = JSON.stringify(
    {
      id: record.id,
      employee_id: record.employee_id,
      hire_date: record.hire_date,
      section1: record.section1,
      section2: record.section2,
      section3: record.section3,
      documents: record.documents,
      e_verify_status: record.e_verify_status,
      e_verify_case_no: record.e_verify_case_no,
    },
    Object.keys(record).sort(),
  )

  const hash = crypto.createHash("sha256").update(canonical).digest("hex")

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Insert ledger proof
  const { error: proofError } = await supabase.from("ledger_proofs").insert({
    tenant_id: record.tenant_id,
    object_type: "i9_record",
    object_id: record.id,
    hash,
    notarized_by: user?.id,
  })

  if (proofError) {
    console.error("[v0] notarizeI9 proof error:", proofError)
    return { error: proofError.message }
  }

  // Update I-9 record
  const { data: updated, error: updateError } = await supabase
    .from("i9_records")
    .update({
      pdf_hash: hash,
      notarized_at: new Date().toISOString(),
      updated_by: user?.id,
    })
    .eq("id", parsed.data.recordId)
    .select()
    .single()

  if (updateError) {
    console.error("[v0] notarizeI9 update error:", updateError)
    return { error: updateError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: updated.tenant_id,
    actorUserId: user?.id,
    action: "i9:notarize",
    entity: "i9_record",
    entityId: updated.id,
    diff: { hash, notarized_at: updated.notarized_at },
  })

  revalidatePath("/hrms/i9-compliance")

  return { success: true, hash }
}

export async function exportI9Csv(input: { filters?: any }) {
  const supabase = await createServerClient()

  // Check permissions
  const flags = await hasFeatures(["exports.allowed", "hrms.i9.pii.unmask"])
  if (!flags["exports.allowed"]) {
    return { error: "Permission denied: exports.allowed required" }
  }

  // Get all I-9 records
  const { data: records, error } = await supabase
    .from("i9_records")
    .select(`
      *,
      employee:employees!inner(legal_name, employee_no)
    `)
    .order("hire_date", { ascending: false })

  if (error) {
    console.error("[v0] exportI9Csv error:", error)
    return { error: error.message }
  }

  // Build CSV
  const headers = [
    "Employee Name",
    "Employee No",
    "Hire Date",
    "Status",
    "Section 1 Completed",
    "Section 2 Completed",
    "Section 3 Due",
    "E-Verify Status",
    "E-Verify Case No",
    "Retention Due",
    "Notarized",
  ]

  const rows = records.map((r: any) => [
    r.employee.legal_name,
    r.employee.employee_no,
    r.hire_date,
    r.status,
    r.section1_completed_at || "N/A",
    r.section2_examined_at || "N/A",
    r.section3_due || "N/A",
    r.e_verify_status || "N/A",
    flags["hrms.i9.pii.unmask"] ? r.e_verify_case_no || "N/A" : "[REDACTED]",
    r.retention_due || "N/A",
    r.notarized_at ? "Yes" : "No",
  ])

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Audit log
  await appendAudit({
    tenantId: records[0]?.tenant_id,
    actorUserId: user?.id,
    action: "export:i9",
    entity: "i9_record",
    entityId: null,
    diff: { count: records.length },
  })

  return { success: true, csv }
}
