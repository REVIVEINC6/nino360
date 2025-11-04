"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeature } from "@/lib/fbac"
import { revalidatePath } from "next/cache"
import { generatePDF } from "@/lib/pdf/generator"
import { sendEmailWithPDF } from "@/lib/email/send"
import { computeFileHash } from "@/lib/ledger/notarize"

// ============================================================================
// SCHEMAS
// ============================================================================

const GetToBillSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
})

const BuildInvoiceSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  clientId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  currency: z.string().length(3),
  terms: z.number().int().min(0).max(365),
})

const CreateInvoiceSchema = z.object({
  clientId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  periodFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  currency: z.string().length(3),
  paymentTerms: z.number().int(),
  poNumber: z.string().optional(),
  lines: z.array(
    z.object({
      assignmentId: z.string().uuid().optional(),
      description: z.string().min(1),
      qtyHours: z.number().positive(),
      unitRate: z.number().nonnegative(),
      taxRate: z.number().min(0).max(1),
      glAccount: z.string().optional(),
    }),
  ),
  taxes: z.array(
    z.object({
      code: z.string(),
      rate: z.number().min(0).max(1),
      amount: z.number().nonnegative(),
    }),
  ),
  discounts: z.array(
    z.object({
      description: z.string(),
      amount: z.number().positive(),
    }),
  ),
  notes: z.string().optional(),
})

const ApproveInvoiceSchema = z.object({
  id: z.string().uuid(),
})

const SendInvoiceSchema = z.object({
  id: z.string().uuid(),
  recipients: z.array(z.string().email()),
  message: z.string().optional(),
})

const RecordPaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  method: z.enum(["WIRE", "CHECK", "ACH", "CARD", "OTHER"]),
  receivedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reference: z.string().optional(),
})

const CreditInvoiceSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().optional(),
  reason: z.string().min(1),
})

const VoidInvoiceSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().min(1),
})

const ExportInvoicesCsvSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.string().optional(),
  clientId: z.string().uuid().optional(),
})

const NotarizeInvoiceSchema = z.object({
  id: z.string().uuid(),
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function getToBill(input: z.infer<typeof GetToBillSchema>) {
  const parsed = GetToBillSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { from, to, clientId, projectId } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canRead = await hasFeature("hrms.billing.read")
  if (!canRead) {
    return { error: "Feature not enabled: hrms.billing.read" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Query to-bill view with filters
  let query = supabase.from("vw_to_bill").select("*").gte("week_start", from).lte("week_start", to)

  if (clientId) query = query.eq("client_id", clientId)
  if (projectId) query = query.eq("project_id", projectId)

  const { data, error } = await query

  if (error) return { error: error.message }

  // Group by client/project
  const groups = data.reduce((acc: any[], row: any) => {
    const key = `${row.client_id}-${row.project_id || "none"}`
    const existing = acc.find((g) => g.key === key)

    if (existing) {
      existing.hours += row.total_hours
      existing.amount += row.estimated_amount
      existing.entries.push(row)
    } else {
      acc.push({
        key,
        client: row.client_name,
        clientId: row.client_id,
        projectId: row.project_id,
        hours: row.total_hours,
        amount: row.estimated_amount,
        currency: row.currency,
        entries: [row],
      })
    }

    return acc
  }, [])

  return { data: groups }
}

export async function buildInvoice(input: z.infer<typeof BuildInvoiceSchema>) {
  const parsed = BuildInvoiceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { from, to, clientId, projectId, currency, terms } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canWrite = await hasFeature("hrms.billing.write")
  if (!canWrite) {
    return { error: "Feature not enabled: hrms.billing.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get approved billable entries for the period
  let query = supabase
    .from("vw_to_bill")
    .select("*")
    .gte("week_start", from)
    .lte("week_start", to)
    .eq("client_id", clientId)

  if (projectId) query = query.eq("project_id", projectId)

  const { data: entries, error } = await query

  if (error) return { error: error.message }
  if (!entries || entries.length === 0) {
    return { error: "No billable hours found for the specified period" }
  }

  // Build candidate lines
  const lines = entries.map((entry: any, index: number) => ({
    lineNo: index + 1,
    assignmentId: entry.assignment_id,
    description: `${entry.role_title} - ${entry.employee_name} (${entry.week_start})`,
    qtyHours: entry.total_hours,
    unitRate: Number.parseFloat(entry.rate_value || "0"),
    taxRate: 0,
    amount: entry.estimated_amount,
  }))

  // Calculate totals
  const subtotal = lines.reduce((sum: number, line: any) => sum + line.amount, 0)

  return {
    data: {
      clientId,
      projectId,
      periodFrom: from,
      periodTo: to,
      currency,
      paymentTerms: terms,
      lines,
      subtotal,
      taxTotal: 0,
      discountTotal: 0,
      total: subtotal,
    },
  }
}

export async function createInvoice(input: z.infer<typeof CreateInvoiceSchema>) {
  const parsed = CreateInvoiceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const data = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canWrite = await hasFeature("hrms.billing.write")
  if (!canWrite) {
    return { error: "Feature not enabled: hrms.billing.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Calculate totals
  const subtotal = data.lines.reduce((sum, line) => sum + line.qtyHours * line.unitRate, 0)
  const taxTotal = data.taxes.reduce((sum, tax) => sum + tax.amount, 0)
  const discountTotal = data.discounts.reduce((sum, discount) => sum + discount.amount, 0)
  const total = subtotal + taxTotal - discountTotal

  // Validate totals
  if (total < 0) {
    return { error: "Total cannot be negative" }
  }

  // Insert invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      tenant_id: member.tenant_id,
      client_id: data.clientId,
      project_id: data.projectId,
      invoice_no: "DRAFT-" + Date.now(), // Temporary number
      period_from: data.periodFrom,
      period_to: data.periodTo,
      issue_date: data.issueDate,
      due_date: data.dueDate,
      currency: data.currency,
      payment_terms: data.paymentTerms,
      po_number: data.poNumber,
      subtotal,
      tax_total: taxTotal,
      discount_total: discountTotal,
      total,
      status: "DRAFT",
      notes: data.notes,
    })
    .select()
    .single()

  if (invoiceError) return { error: invoiceError.message }

  // Insert lines
  const linesData = data.lines.map((line, index) => ({
    invoice_id: invoice.id,
    line_no: index + 1,
    assignment_id: line.assignmentId,
    description: line.description,
    qty_hours: line.qtyHours,
    unit_rate: line.unitRate,
    tax_rate: line.taxRate,
    amount: line.qtyHours * line.unitRate,
    gl_account: line.glAccount,
  }))

  const { error: linesError } = await supabase.from("invoice_lines").insert(linesData)

  if (linesError) {
    // Rollback invoice
    await supabase.from("invoices").delete().eq("id", invoice.id)
    return { error: linesError.message }
  }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "invoice:create",
    entity: "invoice",
    entityId: invoice.id,
    diff: { status: "DRAFT", total },
  })

  revalidatePath("/hrms/invoices")

  return { data: invoice }
}

export async function approveInvoice(input: z.infer<typeof ApproveInvoiceSchema>) {
  const parsed = ApproveInvoiceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { id } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canApprove = await hasFeature("hrms.billing.approve")
  if (!canApprove) {
    return { error: "Feature not enabled: hrms.billing.approve" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Get invoice
  const { data: invoice, error: fetchError } = await supabase.from("invoices").select("*").eq("id", id).single()

  if (fetchError) return { error: fetchError.message }
  if (invoice.status !== "DRAFT") {
    return { error: "Only DRAFT invoices can be approved" }
  }

  // Generate invoice number
  const { data: numberData, error: numberError } = await supabase.rpc("fn_generate_invoice_number", {
    p_tenant_id: member.tenant_id,
  })

  if (numberError) return { error: numberError.message }

  // Update invoice
  const { data: updated, error: updateError } = await supabase
    .from("invoices")
    .update({
      invoice_no: numberData,
      status: "READY",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq("id", id)
    .select()
    .single()

  if (updateError) return { error: updateError.message }

  try {
    const invoiceHtml = generateInvoiceHtml(updated)
    const { url: pdfUrl, sha256 } = await generatePDF({
      html: invoiceHtml,
      filename: `invoice-${updated.invoice_no}.pdf`,
      metadata: { invoiceId: id, invoiceNo: updated.invoice_no },
    })

    // Update invoice with PDF URL and hash
    await supabase.from("invoices").update({ pdf_url: pdfUrl, pdf_hash: sha256 }).eq("id", id)
  } catch (error) {
    console.error("[v0] PDF generation error:", error)
    // Continue even if PDF generation fails
  }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "invoice:approve",
    entity: "invoice",
    entityId: id,
    diff: { status: "READY", invoice_no: numberData },
  })

  revalidatePath("/hrms/invoices")

  return { data: updated }
}

export async function sendInvoice(input: z.infer<typeof SendInvoiceSchema>) {
  const parsed = SendInvoiceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { id, recipients, message } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canWrite = await hasFeature("hrms.billing.write")
  if (!canWrite) {
    return { error: "Feature not enabled: hrms.billing.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Get invoice
  const { data: invoice, error: fetchError } = await supabase.from("invoices").select("*").eq("id", id).single()

  if (fetchError) return { error: fetchError.message }
  if (invoice.status !== "READY") {
    return { error: "Only READY invoices can be sent" }
  }

  if (invoice.pdf_url) {
    const emailHtml = `
      <h2>Invoice ${invoice.invoice_no}</h2>
      <p>${message || "Please find attached your invoice."}</p>
      <p>Amount Due: ${invoice.currency} ${invoice.total.toFixed(2)}</p>
      <p>Due Date: ${invoice.due_date}</p>
    `

    const emailResult = await sendEmailWithPDF({
      to: recipients,
      subject: `Invoice ${invoice.invoice_no}`,
      html: emailHtml,
      pdfUrl: invoice.pdf_url,
      pdfFilename: `invoice-${invoice.invoice_no}.pdf`,
    })

    if (!emailResult.success) {
      return { error: `Failed to send email: ${emailResult.error}` }
    }
  }

  // Update invoice
  const { data: updated, error: updateError } = await supabase
    .from("invoices")
    .update({
      status: "SENT",
      sent_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (updateError) return { error: updateError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "invoice:send",
    entity: "invoice",
    entityId: id,
    diff: { status: "SENT", recipients },
  })

  revalidatePath("/hrms/invoices")

  return { data: updated }
}

export async function recordPayment(input: z.infer<typeof RecordPaymentSchema>) {
  const parsed = RecordPaymentSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { id, amount, method, receivedAt, reference } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canWrite = await hasFeature("hrms.billing.write")
  if (!canWrite) {
    return { error: "Feature not enabled: hrms.billing.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Get invoice
  const { data: invoice, error: fetchError } = await supabase.from("invoices").select("*").eq("id", id).single()

  if (fetchError) return { error: fetchError.message }

  // Validate payment amount
  const remaining = invoice.total - invoice.paid_amount
  if (amount > remaining) {
    return { error: `Payment amount exceeds remaining balance of ${remaining}` }
  }

  // Insert payment
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      tenant_id: member.tenant_id,
      invoice_id: id,
      amount,
      method,
      received_at: receivedAt,
      reference,
    })
    .select()
    .single()

  if (paymentError) return { error: paymentError.message }

  // Trigger will update invoice status automatically

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "payment:record",
    entity: "payment",
    entityId: payment.id,
    diff: { invoice_id: id, amount, method },
  })

  revalidatePath("/hrms/invoices")

  return { data: payment }
}

export async function creditInvoice(input: z.infer<typeof CreditInvoiceSchema>) {
  const parsed = CreditInvoiceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { id, amount, reason } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canApprove = await hasFeature("hrms.billing.approve")
  if (!canApprove) {
    return { error: "Feature not enabled: hrms.billing.approve" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Get invoice
  const { data: invoice, error: fetchError } = await supabase.from("invoices").select("*").eq("id", id).single()

  if (fetchError) return { error: fetchError.message }

  // Calculate credit amount (full or partial)
  const creditAmount = amount || invoice.total - invoice.paid_amount

  // Update invoice
  const { data: updated, error: updateError } = await supabase
    .from("invoices")
    .update({
      status: "VOID",
      notes: (invoice.notes || "") + `\n\nCREDIT: ${reason} (Amount: ${creditAmount})`,
    })
    .eq("id", id)
    .select()
    .single()

  if (updateError) return { error: updateError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "invoice:credit",
    entity: "invoice",
    entityId: id,
    diff: { status: "VOID", credit_amount: creditAmount, reason },
  })

  revalidatePath("/hrms/invoices")

  return { data: updated }
}

export async function voidInvoice(input: z.infer<typeof VoidInvoiceSchema>) {
  const parsed = VoidInvoiceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { id, reason } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canApprove = await hasFeature("hrms.billing.approve")
  if (!canApprove) {
    return { error: "Feature not enabled: hrms.billing.approve" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Get invoice
  const { data: invoice, error: fetchError } = await supabase.from("invoices").select("*").eq("id", id).single()

  if (fetchError) return { error: fetchError.message }

  // Update invoice
  const { data: updated, error: updateError } = await supabase
    .from("invoices")
    .update({
      status: "VOID",
      notes: (invoice.notes || "") + `\n\nVOIDED: ${reason}`,
    })
    .eq("id", id)
    .select()
    .single()

  if (updateError) return { error: updateError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "invoice:void",
    entity: "invoice",
    entityId: id,
    diff: { status: "VOID", reason },
  })

  revalidatePath("/hrms/invoices")

  return { data: updated }
}

export async function exportInvoicesCsv(input: z.infer<typeof ExportInvoicesCsvSchema>) {
  const parsed = ExportInvoicesCsvSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { from, to, status, clientId } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canExport = await hasFeature("exports.allowed")
  if (!canExport) {
    return { error: "Feature not enabled: exports.allowed" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Query invoices
  let query = supabase
    .from("invoices")
    .select("*, client:clients(name), lines:invoice_lines(*)")
    .gte("issue_date", from)
    .lte("issue_date", to)

  if (status) query = query.eq("status", status)
  if (clientId) query = query.eq("client_id", clientId)

  const { data: invoices, error } = await query

  if (error) return { error: error.message }

  // Generate CSV
  const headers = [
    "Invoice Number",
    "Client",
    "Issue Date",
    "Due Date",
    "Period From",
    "Period To",
    "Currency",
    "Subtotal",
    "Tax",
    "Discount",
    "Total",
    "Paid",
    "Status",
  ]

  const rows = invoices.map((inv: any) => [
    inv.invoice_no,
    inv.client?.name || "",
    inv.issue_date,
    inv.due_date,
    inv.period_from || "",
    inv.period_to || "",
    inv.currency,
    inv.subtotal,
    inv.tax_total,
    inv.discount_total || 0,
    inv.total,
    inv.paid_amount,
    inv.status,
  ])

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "export:invoices",
    entity: "invoice",
    entityId: null,
    diff: { from, to, count: invoices.length },
  })

  return { data: csv }
}

export async function notarizeInvoice(input: z.infer<typeof NotarizeInvoiceSchema>) {
  const parsed = NotarizeInvoiceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Invalid input", details: parsed.error.flatten() }
  }

  const { id } = parsed.data

  const supabase = await createServerClient()

  // Check feature flag
  const canNotarize = await hasFeature("ledger.notarize")
  if (!canNotarize) {
    return { error: "Feature not enabled: ledger.notarize" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { error: "No tenant found" }

  // Get invoice
  const { data: invoice, error: fetchError } = await supabase.from("invoices").select("*").eq("id", id).single()

  if (fetchError) return { error: fetchError.message }
  if (!invoice.pdf_url) {
    return { error: "Invoice must have a PDF before notarization" }
  }

  let hash = invoice.pdf_hash
  if (!hash) {
    try {
      // Fetch PDF and compute hash
      const response = await fetch(invoice.pdf_url)
      if (response.ok) {
        const pdfBuffer = Buffer.from(await response.arrayBuffer())
        hash = await computeFileHash(pdfBuffer)

        // Update invoice with hash
        await supabase.from("invoices").update({ pdf_hash: hash }).eq("id", id)
      }
    } catch (error) {
      console.error("[v0] Hash computation error:", error)
      return { error: "Failed to compute PDF hash" }
    }
  }

  // Insert ledger proof
  const { data: proof, error: proofError } = await supabase
    .from("proofs")
    .insert({
      object_type: "invoice",
      object_id: id,
      hash,
    })
    .select()
    .single()

  if (proofError) return { error: proofError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "invoice:notarize",
    entity: "invoice",
    entityId: id,
    diff: { hash },
  })

  revalidatePath("/hrms/invoices")

  return { data: proof }
}

// Helper function to generate invoice HTML
function generateInvoiceHtml(invoice: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .invoice-details { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; }
          .totals { text-align: right; margin-top: 20px; }
          .total-row { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <p>Invoice #: ${invoice.invoice_no}</p>
        </div>
        <div class="invoice-details">
          <p><strong>Issue Date:</strong> ${invoice.issue_date}</p>
          <p><strong>Due Date:</strong> ${invoice.due_date}</p>
          <p><strong>Period:</strong> ${invoice.period_from} to ${invoice.period_to}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Hours</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
             Lines would be inserted here 
          </tbody>
        </table>
        <div class="totals">
          <p>Subtotal: ${invoice.currency} ${invoice.subtotal.toFixed(2)}</p>
          <p>Tax: ${invoice.currency} ${invoice.tax_total.toFixed(2)}</p>
          <p class="total-row">Total: ${invoice.currency} ${invoice.total.toFixed(2)}</p>
        </div>
      </body>
    </html>
  `
}
