"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hasFeature, hasFeatures } from "@/lib/fbac"
import { appendAudit } from "@/lib/hash"
import { revalidatePath } from "next/cache"
import { generateObject, generateText } from "ai"
import { z } from "zod"

// ============================================================================
// TYPES
// ============================================================================

export type ImmigrationCase = {
  id: string
  tenant_id: string
  employee_id: string
  case_type: string
  case_number: string | null
  status: string
  priority_date: string | null
  filing_date: string | null
  approval_date: string | null
  expiry_date: string | null
  attorney_name: string | null
  attorney_firm: string | null
  attorney_email: string | null
  attorney_phone: string | null
  receipt_number: string | null
  uscis_case_status: string | null
  rfe_received_date: string | null
  rfe_response_due_date: string | null
  rfe_description: string | null
  compliance_score: number | null
  risk_level: string | null
  petition_pdf_url: string | null
  approval_notice_url: string | null
  i94_url: string | null
  ocr_processed: boolean
  ocr_confidence_score: number | null
  ocr_extracted_data: Record<string, any>
  notes: string | null
  created_at: string
  updated_at: string
  employee?: {
    first_name: string
    last_name: string
    email: string
  }
}

export type I9Record = {
  id: string
  tenant_id: string
  employee_id: string
  citizenship_status: string | null
  section1_completed_at: string | null
  section2_completed_at: string | null
  section3_completed_at: string | null
  doc_list_a_type: string | null
  doc_list_a_number: string | null
  doc_list_a_expiry: string | null
  everify_case_number: string | null
  everify_status: string | null
  reverification_due_date: string | null
  status: string
  compliance_score: number | null
  form_pdf_url: string | null
  ocr_processed: boolean
  ocr_confidence_score: number | null
  notes: string | null
  created_at: string
  updated_at: string
  employee?: {
    first_name: string
    last_name: string
    email: string
  }
}

export type ImmigrationAlert = {
  id: string
  tenant_id: string
  employee_id: string
  case_id: string | null
  i9_id: string | null
  alert_type: string
  severity: string
  message: string
  action_required: string | null
  due_date: string | null
  resolved: boolean
  created_at: string
  employee?: {
    first_name: string
    last_name: string
  }
}

// ============================================================================
// IMMIGRATION CASES
// ============================================================================

export async function getImmigrationCases(filters?: {
  status?: string
  case_type?: string
  expiring_soon?: boolean
  rfe_pending?: boolean
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasImmigration = await hasFeature("hrms.immigration")
  if (!hasImmigration) {
    return { error: "Immigration feature not enabled" }
  }

  let query = supabase
    .from("hr.immigration_cases")
    .select(
      `
      *,
      employee:hr.employees!employee_id(first_name, last_name, email)
    `,
    )
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.case_type) {
    query = query.eq("case_type", filters.case_type)
  }

  if (filters?.expiring_soon) {
    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)
    query = query.lte("expiry_date", ninetyDaysFromNow.toISOString().split("T")[0])
    query = query.gte("expiry_date", new Date().toISOString().split("T")[0])
  }

  if (filters?.rfe_pending) {
    query = query.not("rfe_response_due_date", "is", null)
    query = query.gte("rfe_response_due_date", new Date().toISOString().split("T")[0])
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { data: data as ImmigrationCase[] }
}

export async function createImmigrationCase(input: {
  employee_id: string
  case_type: string
  case_number?: string
  filing_date?: string
  expiry_date?: string
  attorney_name?: string
  attorney_firm?: string
  attorney_email?: string
  attorney_phone?: string
  notes?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasImmigration = await hasFeature("hrms.immigration")
  if (!hasImmigration) {
    return { error: "Immigration feature not enabled" }
  }

  // Get tenant_id
  const { data: profile } = await supabase.from("user_roles").select("tenant_id").eq("user_id", user.id).single()

  if (!profile) return { error: "Profile not found" }

  const { data, error } = await supabase
    .from("hr.immigration_cases")
    .insert({
      tenant_id: profile.tenant_id,
      employee_id: input.employee_id,
      case_type: input.case_type,
      case_number: input.case_number,
      filing_date: input.filing_date,
      expiry_date: input.expiry_date,
      attorney_name: input.attorney_name,
      attorney_firm: input.attorney_firm,
      attorney_email: input.attorney_email,
      attorney_phone: input.attorney_phone,
      notes: input.notes,
      status: "draft",
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Audit log
  await appendAudit({
    tenantId: profile.tenant_id,
    actorUserId: user.id,
    action: "immigration_case.created",
    entity: "immigration_case",
    entityId: data.id,
    diff: { case_type: input.case_type, employee_id: input.employee_id },
  })

  revalidatePath("/hrms/immigration")
  return { data }
}

export async function updateImmigrationCase(
  id: string,
  updates: Partial<{
    status: string
    case_number: string
    filing_date: string
    approval_date: string
    expiry_date: string
    receipt_number: string
    uscis_case_status: string
    rfe_received_date: string
    rfe_response_due_date: string
    rfe_description: string
    attorney_name: string
    attorney_firm: string
    attorney_email: string
    attorney_phone: string
    petition_pdf_url: string
    approval_notice_url: string
    i94_url: string
    notes: string
  }>,
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasImmigration = await hasFeature("hrms.immigration")
  if (!hasImmigration) {
    return { error: "Immigration feature not enabled" }
  }

  const { data, error } = await supabase
    .from("hr.immigration_cases")
    .update({ ...updates, updated_by: user.id })
    .eq("id", id)
    .select()
    .single()

  if (error) return { error: error.message }

  // Audit log
  const { data: profile } = await supabase.from("user_roles").select("tenant_id").eq("user_id", user.id).single()

  await appendAudit({
    tenantId: profile?.tenant_id || null,
    actorUserId: user.id,
    action: "immigration_case.updated",
    entity: "immigration_case",
    entityId: id,
    diff: updates,
  })

  revalidatePath("/hrms/immigration")
  return { data }
}

// ============================================================================
// AI-POWERED DOCUMENT OCR
// ============================================================================

const immigrationDocumentSchema = z.object({
  case_type: z.string().describe("Type of visa or immigration case (H1B, L1, etc.)"),
  case_number: z.string().optional().describe("USCIS case number or receipt number"),
  receipt_number: z.string().optional().describe("Receipt number (e.g., WAC, EAC, LIN)"),
  beneficiary_name: z.string().optional().describe("Name of the beneficiary/employee"),
  filing_date: z.string().optional().describe("Date the petition was filed"),
  approval_date: z.string().optional().describe("Date the petition was approved"),
  expiry_date: z.string().optional().describe("Expiration date of the visa or status"),
  priority_date: z.string().optional().describe("Priority date for green card cases"),
  attorney_name: z.string().optional().describe("Name of the attorney or law firm"),
  uscis_office: z.string().optional().describe("USCIS service center or office"),
})

export async function processImmigrationDocument(caseId: string, fileData: string, mediaType: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const flags = await hasFeatures(["hrms.immigration", "ai.document_ocr"])
  if (!flags["hrms.immigration"] || !flags["ai.document_ocr"]) {
    return { error: "Required features not enabled" }
  }

  try {
    // Use AI SDK to extract structured data from the document
    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: immigrationDocumentSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract immigration case information from this document. Focus on visa type, case numbers, dates, and attorney information.",
            },
            {
              type: "file",
              data: fileData,
              mediaType: mediaType || "application/pdf",
            },
          ],
        },
      ],
    })

    // Calculate confidence score based on how many fields were extracted
    const totalFields = Object.keys(immigrationDocumentSchema.shape).length
    const extractedFields = Object.values(object).filter((v) => v !== undefined && v !== null && v !== "").length
    const confidenceScore = Math.round((extractedFields / totalFields) * 100)

    // Update the immigration case with OCR data
    const { data, error } = await supabase
      .from("hr.immigration_cases")
      .update({
        ocr_processed: true,
        ocr_confidence_score: confidenceScore,
        ocr_extracted_data: object,
        updated_by: user.id,
      })
      .eq("id", caseId)
      .select()
      .single()

    if (error) return { error: error.message }

    // Audit log
    const { data: profile } = await supabase.from("user_roles").select("tenant_id").eq("user_id", user.id).single()

    await appendAudit({
      tenantId: profile?.tenant_id || null,
      actorUserId: user.id,
      action: "immigration_case.ocr_processed",
      entity: "immigration_case",
      entityId: caseId,
      diff: { ocr_confidence_score: confidenceScore, extracted_fields: extractedFields },
    })

    revalidatePath("/hrms/immigration")
    return { data, extractedData: object, confidenceScore }
  } catch (err: any) {
    return { error: err.message || "OCR processing failed" }
  }
}

// ============================================================================
// I-9 RECORDS
// ============================================================================

export async function getI9Records(filters?: { status?: string; reverify_due?: boolean }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasI9 = await hasFeature("hrms.i9")
  if (!hasI9) {
    return { error: "I-9 feature not enabled" }
  }

  let query = supabase
    .from("hr.i9_records")
    .select(
      `
      *,
      employee:hr.employees!employee_id(first_name, last_name, email)
    `,
    )
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.reverify_due) {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    query = query.lte("reverification_due_date", thirtyDaysFromNow.toISOString().split("T")[0])
    query = query.gte("reverification_due_date", new Date().toISOString().split("T")[0])
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { data: data as I9Record[] }
}

export async function createI9Record(input: {
  employee_id: string
  citizenship_status: string
  section1_completed_at?: string
  notes?: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasI9 = await hasFeature("hrms.i9")
  if (!hasI9) {
    return { error: "I-9 feature not enabled" }
  }

  // Get tenant_id
  const { data: profile } = await supabase.from("user_roles").select("tenant_id").eq("user_id", user.id).single()

  if (!profile) return { error: "Profile not found" }

  const { data, error } = await supabase
    .from("hr.i9_records")
    .insert({
      tenant_id: profile.tenant_id,
      employee_id: input.employee_id,
      citizenship_status: input.citizenship_status,
      section1_completed_at: input.section1_completed_at,
      section1_completed_by: user.id,
      notes: input.notes,
      status: "pending",
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Audit log
  await appendAudit({
    tenantId: profile.tenant_id,
    actorUserId: user.id,
    action: "i9_record.created",
    entity: "i9_record",
    entityId: data.id,
    diff: { employee_id: input.employee_id, citizenship_status: input.citizenship_status },
  })

  revalidatePath("/hrms/immigration")
  return { data }
}

export async function updateI9Record(
  id: string,
  updates: Partial<{
    section2_completed_at: string
    doc_list_a_type: string
    doc_list_a_number: string
    doc_list_a_expiry: string
    doc_list_b_type: string
    doc_list_b_number: string
    doc_list_b_expiry: string
    doc_list_c_type: string
    doc_list_c_number: string
    doc_list_c_expiry: string
    everify_case_number: string
    everify_status: string
    status: string
    form_pdf_url: string
    notes: string
  }>,
) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasI9 = await hasFeature("hrms.i9")
  if (!hasI9) {
    return { error: "I-9 feature not enabled" }
  }

  const { data, error } = await supabase
    .from("hr.i9_records")
    .update({ ...updates, updated_by: user.id })
    .eq("id", id)
    .select()
    .single()

  if (error) return { error: error.message }

  // Audit log
  const { data: profile } = await supabase.from("user_roles").select("tenant_id").eq("user_id", user.id).single()

  await appendAudit({
    tenantId: profile?.tenant_id || null,
    actorUserId: user.id,
    action: "i9_record.updated",
    entity: "i9_record",
    entityId: id,
    diff: updates,
  })

  revalidatePath("/hrms/immigration")
  return { data }
}

// ============================================================================
// IMMIGRATION ALERTS
// ============================================================================

export async function getImmigrationAlerts(filters?: { resolved?: boolean; severity?: string }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasImmigration = await hasFeature("hrms.immigration")
  if (!hasImmigration) {
    return { error: "Immigration feature not enabled" }
  }

  let query = supabase
    .from("hr.immigration_alerts")
    .select(
      `
      *,
      employee:hr.employees!employee_id(first_name, last_name)
    `,
    )
    .order("created_at", { ascending: false })

  if (filters?.resolved !== undefined) {
    query = query.eq("resolved", filters.resolved)
  }

  if (filters?.severity) {
    query = query.eq("severity", filters.severity)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { data: data as ImmigrationAlert[] }
}

export async function resolveAlert(alertId: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data, error } = await supabase
    .from("hr.immigration_alerts")
    .update({
      resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
    })
    .eq("id", alertId)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath("/hrms/immigration")
  return { data }
}

// ============================================================================
// AI COPILOT
// ============================================================================

export async function askImmigrationCopilot(question: string, context?: { caseId?: string; i9Id?: string }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flags
  const flags = await hasFeatures(["hrms.immigration", "ai.copilot"])
  if (!flags["hrms.immigration"] || !flags["ai.copilot"]) {
    return { error: "Required features not enabled" }
  }

  try {
    // Gather context if case or I-9 ID provided
    let contextData = ""

    if (context?.caseId) {
      const { data: caseData } = await supabase
        .from("hr.immigration_cases")
        .select("*")
        .eq("id", context.caseId)
        .single()

      if (caseData) {
        contextData += `\n\nImmigration Case Context:\n${JSON.stringify(caseData, null, 2)}`
      }
    }

    if (context?.i9Id) {
      const { data: i9Data } = await supabase.from("hr.i9_records").select("*").eq("id", context.i9Id).single()

      if (i9Data) {
        contextData += `\n\nI-9 Record Context:\n${JSON.stringify(i9Data, null, 2)}`
      }
    }

    const { text } = await generateText({
      model: "openai/gpt-5",
      prompt: `You are an immigration compliance expert assistant for an HRMS system. 
      
You help HR professionals with:
- Immigration case management (H1B, L1, TN, Green Card, etc.)
- I-9 compliance and E-Verify
- USCIS procedures and timelines
- RFE responses and documentation
- Visa expiration tracking
- Compliance best practices

${contextData}

User Question: ${question}

Provide a clear, actionable answer. If you're unsure, recommend consulting with an immigration attorney.`,
      maxOutputTokens: 1000,
    })

    // Audit log
    const { data: profile } = await supabase.from("user_roles").select("tenant_id").eq("user_id", user.id).single()

    await appendAudit({
      tenantId: profile?.tenant_id || null,
      actorUserId: user.id,
      action: "immigration.copilot_query",
      entity: "copilot",
      entityId: null,
      diff: { question, has_context: !!contextData },
    })

    return { answer: text }
  } catch (err: any) {
    return { error: err.message || "Copilot query failed" }
  }
}

// ============================================================================
// ANALYTICS
// ============================================================================

export async function getImmigrationAnalytics() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check feature flag
  const hasImmigration = await hasFeature("hrms.immigration")
  if (!hasImmigration) {
    return { error: "Immigration feature not enabled" }
  }

  // Get immigration summary
  const { data: immigrationSummary } = await supabase.from("hr.vw_immigration_summary").select("*").single()

  // Get I-9 summary
  const { data: i9Summary } = await supabase.from("hr.vw_i9_compliance_summary").select("*").single()

  // Get unresolved alerts
  const { data: alerts } = await supabase
    .from("hr.immigration_alerts")
    .select("*")
    .eq("resolved", false)
    .order("severity", { ascending: false })
    .limit(10)

  return {
    data: {
      immigration: immigrationSummary || {},
      i9: i9Summary || {},
      alerts: alerts || [],
    },
  }
}
