"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { hasFeature, hasFeatures } from "@/lib/fbac"
import { appendAudit } from "@/lib/hash"
import { revalidatePath } from "next/cache"
import { generateBankFile, encryptBankData } from "@/lib/payroll/bank-files"
import { computeFileHash } from "@/lib/ledger/notarize"
import { generateCsv } from "@/lib/export/csv"

// ============================================================================
// SCHEMAS
// ============================================================================

const getToBillSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  vendorId: z.string().uuid().optional(),
})

const buildBillSchema = z.object({
  vendorId: z.string().uuid(),
  from: z.string(),
  to: z.string(),
  currency: z.string().default("USD"),
})

const createBillSchema = z.object({
  vendorId: z.string().uuid(),
  source: z.enum(["TIMESHEET", "EXPENSE", "MANUAL"]),
  periodFrom: z.string().optional(),
  periodTo: z.string().optional(),
  dueDate: z.string(),
  currency: z.string().default("USD"),
  lines: z.array(
    z.object({
      employeeId: z.string().uuid().optional(),
      assignmentId: z.string().uuid().optional(),
      date: z.string().optional(),
      description: z.string(),
      qtyHours: z.number().optional(),
      unitRate: z.number().optional(),
      amount: z.number(),
      taxCode: z.string().optional(),
      glAccount: z.string().optional(),
    }),
  ),
  taxTotal: z.number().default(0),
  discountTotal: z.number().default(0),
  notes: z.string().optional(),
})

const approveBillSchema = z.object({
  id: z.string().uuid(),
})

const voidBillSchema = z.object({
  id: z.string().uuid(),
  reason: z.string(),
})

const scheduleBillsSchema = z.object({
  ids: z.array(z.string().uuid()),
  method: z.enum(["ACH", "SEPA", "WIRE", "CHECK", "MANUAL"]),
  payDate: z.string(),
})

const exportBatchFileSchema = z.object({
  batchId: z.string().uuid(),
  format: z.enum(["ACH", "SEPA", "WIRE", "CSV"]),
})

const confirmBatchSchema = z.object({
  batchId: z.string().uuid(),
  reference: z.string(),
})

const failBatchSchema = z.object({
  batchId: z.string().uuid(),
  error: z.string(),
})

const recordPaymentSchema = z.object({
  billId: z.string().uuid(),
  amount: z.number(),
  method: z.enum(["ACH", "SEPA", "WIRE", "CHECK", "MANUAL"]),
  paidAt: z.string(),
  reference: z.string().optional(),
})

const saveVendorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  legalName: z.string().optional(),
  taxId: z.string().optional(),
  country: z.string().default("US"),
  currency: z.string().default("USD"),
  email: z.string().email().optional(),
  contact: z.record(z.any()).optional(),
  bank: z.record(z.any()).optional(),
  paymentTerms: z.string().default("Net 30"),
  w8W9Url: z.string().optional(),
  active: z.boolean().default(true),
})

const exportApCsvSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.string().optional(),
  vendorId: z.string().uuid().optional(),
})

const notarizeBillSchema = z.object({
  id: z.string().uuid(),
})

const notarizeBatchSchema = z.object({
  batchId: z.string().uuid(),
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function getToBill(input: z.infer<typeof getToBillSchema>) {
  const parsed = getToBillSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flag
  const canRead = await hasFeature("ap.read")
  if (!canRead) {
    return { success: false, error: "Feature not enabled: ap.read" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  // Query to-bill view
  let query = supabase.from("vw_to_bill").select("*")

  if (parsed.from) query = query.gte("period_from", parsed.from)
  if (parsed.to) query = query.lte("period_to", parsed.to)
  if (parsed.vendorId) query = query.eq("vendor_id", parsed.vendorId)

  const { data, error } = await query

  if (error) return { success: false, error: error.message }

  return { success: true, data }
}

export async function buildBill(input: z.infer<typeof buildBillSchema>) {
  const parsed = buildBillSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.write"])
  if (!flags["ap.read"] || !flags["ap.write"]) {
    return { success: false, error: "Feature not enabled: ap.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  // Get approved contractor hours for vendor in period
  const { data: entries, error: entriesError } = await supabase
    .from("timesheet_entries")
    .select(
      `
      *,
      timesheet:timesheets!inner(employee_id, status),
      assignment:assignments(id, rate),
      employee:employees!inner(id, name, vendor_id)
    `,
    )
    .eq("employee.vendor_id", parsed.vendorId)
    .eq("timesheet.status", "APPROVED")
    .eq("billable", true)
    .gte("date", parsed.from)
    .lte("date", parsed.to)

  if (entriesError) return { success: false, error: entriesError.message }

  // Build candidate lines
    const lines = (entries || []).map((entry: any) => ({
    employeeId: entry.employee.id,
    assignmentId: entry.assignment?.id,
    date: entry.date,
    description: `${entry.employee.name} - ${entry.date}`,
    qtyHours: entry.hours,
    unitRate: entry.assignment?.rate?.amount || 0,
    amount: entry.hours * (entry.assignment?.rate?.amount || 0),
  }))

  return {
    success: true,
    data: {
      vendorId: parsed.vendorId,
      periodFrom: parsed.from,
      periodTo: parsed.to,
      currency: parsed.currency,
      lines,
  subtotal: lines.reduce((sum: number, l: any) => sum + l.amount, 0),
    },
  }
}

export async function createBill(input: z.infer<typeof createBillSchema>) {
  const parsed = createBillSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.write"])
  if (!flags["ap.read"] || !flags["ap.write"]) {
    return { success: false, error: "Feature not enabled: ap.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Generate bill number
  const { data: billNumber } = await supabase.rpc("fn_generate_bill_number", {
    p_tenant_id: member.tenant_id,
  })

  // Calculate totals
  const subtotal = parsed.lines.reduce((sum: number, l: any) => sum + l.amount, 0)
  const total = subtotal + parsed.taxTotal - parsed.discountTotal

  // Insert bill
  const { data: bill, error: billError } = await supabase
    .from("vendor_bills")
    .insert({
      tenant_id: member.tenant_id,
      vendor_id: parsed.vendorId,
      number: billNumber,
      source: parsed.source,
      period_from: parsed.periodFrom,
      period_to: parsed.periodTo,
      due_date: parsed.dueDate,
      currency: parsed.currency,
      subtotal,
      tax_total: parsed.taxTotal,
      discount_total: parsed.discountTotal,
      total,
      status: "DRAFT",
      notes: parsed.notes,
      created_by: user.id,
    })
    .select()
    .single()

  if (billError) return { success: false, error: billError.message }

  // Insert lines
  const { error: linesError } = await supabase.from("vendor_bill_lines").insert(
    parsed.lines.map((line) => ({
      bill_id: bill.id,
      employee_id: line.employeeId,
      assignment_id: line.assignmentId,
      date: line.date,
      description: line.description,
      qty_hours: line.qtyHours,
      unit_rate: line.unitRate,
      amount: line.amount,
      tax_code: line.taxCode,
      gl_account: line.glAccount,
    })),
  )

  if (linesError) return { success: false, error: linesError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ap:bill_create",
    entity: "vendor_bill",
    entityId: bill.id,
    diff: { number: bill.number, vendor_id: parsed.vendorId, total },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: bill }
}

export async function approveBill(input: z.infer<typeof approveBillSchema>) {
  const parsed = approveBillSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.approve"])
  if (!flags["ap.read"] || !flags["ap.approve"]) {
    return { success: false, error: "Feature not enabled: ap.approve" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Update bill status
  const { data: bill, error } = await supabase
    .from("vendor_bills")
    .update({
      status: "APPROVED",
      approved_at: new Date().toISOString(),
      approved_by: user.id,
    })
    .eq("id", parsed.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ap:bill_approve",
    entity: "vendor_bill",
    entityId: bill.id,
    diff: { status: "APPROVED" },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: bill }
}

export async function voidBill(input: z.infer<typeof voidBillSchema>) {
  const parsed = voidBillSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.write"])
  if (!flags["ap.read"] || !flags["ap.write"]) {
    return { success: false, error: "Feature not enabled: ap.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Update bill status
  const { data: bill, error } = await supabase
    .from("vendor_bills")
    .update({
      status: "VOID",
      notes: `VOIDED: ${parsed.reason}`,
    })
    .eq("id", parsed.id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ap:bill_void",
    entity: "vendor_bill",
    entityId: bill.id,
    diff: { status: "VOID", reason: parsed.reason },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: bill }
}

export async function scheduleBills(input: z.infer<typeof scheduleBillsSchema>) {
  const parsed = scheduleBillsSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.pay"])
  if (!flags["ap.read"] || !flags["ap.pay"]) {
    return { success: false, error: "Feature not enabled: ap.pay" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Get bills to schedule
  const { data: bills, error: billsError } = await supabase
    .from("vendor_bills")
    .select("*")
    .in("id", parsed.ids)
    .eq("status", "APPROVED")

  if (billsError) return { success: false, error: billsError.message }
  if (!bills || bills.length === 0) return { success: false, error: "No approved bills found" }

  // Generate batch number
  const { data: batchNumber } = await supabase.rpc("fn_generate_batch_number", {
    p_tenant_id: member.tenant_id,
  })

  // Calculate batch total
  const total = bills.reduce((sum: number, b: any) => sum + (b.total - b.paid_amount), 0)

  // Create payment batch
  const { data: batch, error: batchError } = await supabase
    .from("payment_batches")
    .insert({
      tenant_id: member.tenant_id,
      batch_no: batchNumber,
      method: parsed.method,
      pay_date: parsed.payDate,
      currency: bills[0].currency,
      total,
      status: "PENDING",
      created_by: user.id,
    })
    .select()
    .single()

  if (batchError) return { success: false, error: batchError.message }

  // Update bills to SCHEDULED
  const { error: updateError } = await supabase
    .from("vendor_bills")
    .update({ status: "SCHEDULED" })
    .in("id", parsed.ids)

  if (updateError) return { success: false, error: updateError.message }

  // Create payment records
  const { error: paymentsError } = await supabase.from("payments").insert(
    bills.map((bill: any) => ({
      bill_id: bill.id,
      batch_id: batch.id,
      amount: bill.total - bill.paid_amount,
      method: parsed.method,
      paid_at: parsed.payDate,
    })),
  )

  if (paymentsError) return { success: false, error: paymentsError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ap:batch_schedule",
    entity: "payment_batch",
    entityId: batch.id,
    diff: { batch_no: batch.batch_no, bill_ids: parsed.ids, total },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: batch }
}

export async function exportBatchFile(input: z.infer<typeof exportBatchFileSchema>) {
  const parsed = exportBatchFileSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.pay", "exports.allowed"])
  if (!flags["ap.read"] || !flags["ap.pay"] || !flags["exports.allowed"]) {
    return { success: false, error: "Feature not enabled: exports.allowed" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Get batch with bills and vendor details
  const { data: batch, error: batchError } = await supabase
    .from("payment_batches")
    .select(
      `
      *,
      payments(
        *,
        bill:vendor_bills(
          *,
          vendor:vendors(*)
        )
      )
    `,
    )
    .eq("id", parsed.batchId)
    .single()

  if (batchError) return { success: false, error: batchError.message }

  try {
    const payments = batch.payments.map((p: any) => ({
      id: p.id,
      employeeId: p.bill.vendor.id,
      employeeName: p.bill.vendor.name,
      amount: p.amount,
      currency: batch.currency,
      accountNumber: p.bill.vendor.bank?.account_number || "",
      routingNumber: p.bill.vendor.bank?.routing_number || "",
      bankName: p.bill.vendor.bank?.bank_name || "",
      iban: p.bill.vendor.bank?.iban,
      swiftCode: p.bill.vendor.bank?.swift_code,
      reference: `Bill ${p.bill.number}`,
      effectiveDate: batch.pay_date,
    }))

    const { content, filename } = await generateBankFile(parsed.format, payments, {
      companyName: "Nino360",
      companyId: member.tenant_id,
    })

    // Upload to Vercel Blob
    const { put } = await import("@vercel/blob")
    const { url: fileUrl } = await put(filename, content, {
      access: "public",
      contentType: parsed.format === "SEPA" ? "application/xml" : "text/plain",
    })

    // Update batch status
    const { error: updateError } = await supabase
      .from("payment_batches")
      .update({
        status: "SENT",
        file_url: fileUrl,
      })
      .eq("id", parsed.batchId)

    if (updateError) return { success: false, error: updateError.message }

    // Audit log
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "ap:batch_export",
      entity: "payment_batch",
      entityId: batch.id,
      diff: { format: parsed.format, file_url: fileUrl },
    })

    revalidatePath("/hrms/accounts-payable")

    return { success: true, data: { fileUrl } }
  } catch (error) {
    console.error("[v0] Bank file generation error:", error)
    return { success: false, error: "Failed to generate bank file" }
  }
}

export async function confirmBatch(input: z.infer<typeof confirmBatchSchema>) {
  const parsed = confirmBatchSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.pay"])
  if (!flags["ap.read"] || !flags["ap.pay"]) {
    return { success: false, error: "Feature not enabled: ap.pay" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Update batch status
  const { data: batch, error } = await supabase
    .from("payment_batches")
    .update({
      status: "CONFIRMED",
      reference: parsed.reference,
    })
    .eq("id", parsed.batchId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ap:batch_confirm",
    entity: "payment_batch",
    entityId: batch.id,
    diff: { status: "CONFIRMED", reference: parsed.reference },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: batch }
}

export async function failBatch(input: z.infer<typeof failBatchSchema>) {
  const parsed = failBatchSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.pay"])
  if (!flags["ap.read"] || !flags["ap.pay"]) {
    return { success: false, error: "Feature not enabled: ap.pay" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Update batch status
  const { data: batch, error } = await supabase
    .from("payment_batches")
    .update({
      status: "FAILED",
      error_message: parsed.error,
    })
    .eq("id", parsed.batchId)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ap:batch_fail",
    entity: "payment_batch",
    entityId: batch.id,
    diff: { status: "FAILED", error: parsed.error },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: batch }
}

export async function recordPayment(input: z.infer<typeof recordPaymentSchema>) {
  const parsed = recordPaymentSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ap.pay"])
  if (!flags["ap.read"] || !flags["ap.pay"]) {
    return { success: false, error: "Feature not enabled: ap.pay" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Insert payment
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      bill_id: parsed.billId,
      amount: parsed.amount,
      method: parsed.method,
      paid_at: parsed.paidAt,
      reference: parsed.reference,
    })
    .select()
    .single()

  if (paymentError) return { success: false, error: paymentError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ap:payment_record",
    entity: "payment",
    entityId: payment.id,
    diff: { bill_id: parsed.billId, amount: parsed.amount },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: payment }
}

export async function saveVendor(input: z.infer<typeof saveVendorSchema>) {
  const parsed = saveVendorSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["vendors.read", "vendors.write"])
  if (!flags["vendors.read"] || !flags["vendors.write"]) {
    return { success: false, error: "Feature not enabled: vendors.write" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  let encryptedBank = parsed.bank || {}
  if (parsed.bank?.account_number) {
    try {
      encryptedBank = {
        ...parsed.bank,
        account_number: await encryptBankData(parsed.bank.account_number),
      }
    } catch (error) {
      console.error("[v0] Bank data encryption error:", error)
      // Continue with unencrypted data if encryption fails
    }
  }

  // Upsert vendor
  const vendorData = {
    tenant_id: member.tenant_id,
    name: parsed.name,
    legal_name: parsed.legalName,
    tax_id: parsed.taxId,
    country: parsed.country,
    currency: parsed.currency,
    email: parsed.email,
    contact: parsed.contact || {},
    bank: encryptedBank,
    payment_terms: parsed.paymentTerms,
    w8_w9_url: parsed.w8W9Url,
    active: parsed.active,
  }

  let vendor
  if (parsed.id) {
    const { data, error } = await supabase.from("vendors").update(vendorData).eq("id", parsed.id).select().single()

    if (error) return { success: false, error: error.message }
    vendor = data
  } else {
    const { data, error } = await supabase.from("vendors").insert(vendorData).select().single()

    if (error) return { success: false, error: error.message }
    vendor = data
  }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: parsed.id ? "vendor:update" : "vendor:create",
    entity: "vendor",
    entityId: vendor.id,
    diff: { name: parsed.name },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: vendor }
}

export async function exportApCsv(input: z.infer<typeof exportApCsvSchema>) {
  const parsed = exportApCsvSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "exports.allowed"])
  if (!flags["ap.read"] || !flags["exports.allowed"]) {
    return { success: false, error: "Feature not enabled: exports.allowed" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Query bills
  let query = supabase.from("vendor_bills").select("*, vendor:vendors(name)")

  if (parsed.from) query = query.gte("period_from", parsed.from)
  if (parsed.to) query = query.lte("period_to", parsed.to)
  if (parsed.status) query = query.eq("status", parsed.status)
  if (parsed.vendorId) query = query.eq("vendor_id", parsed.vendorId)

  const { data: bills, error } = await query

  if (error) return { success: false, error: error.message }

  const csv = await generateCsv({
    headers: ["Bill Number", "Vendor", "Due Date", "Total", "Status"],
    rows: (bills || []).map((b: any) => [b.number, b.vendor.name, b.due_date, b.total.toString(), b.status]),
  })

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "export:ap",
    entity: "vendor_bills",
    entityId: null,
    diff: { count: bills?.length || 0 },
  })

  return { success: true, data: csv }
}

export async function notarizeBill(input: z.infer<typeof notarizeBillSchema>) {
  const parsed = notarizeBillSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ledger.notarize"])
  if (!flags["ap.read"] || !flags["ledger.notarize"]) {
    return { success: false, error: "Feature not enabled: ledger.notarize" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Get bill
  const { data: bill, error: billError } = await supabase.from("vendor_bills").select("*").eq("id", parsed.id).single()

  if (billError) return { success: false, error: billError.message }

  const billData = JSON.stringify({
    id: bill.id,
    number: bill.number,
    vendor_id: bill.vendor_id,
    total: bill.total,
    status: bill.status,
  })
  const hash = await computeFileHash(Buffer.from(billData))

  // Insert ledger proof
  const { data: proof, error: proofError } = await supabase
    .from("proofs")
    .insert({
      object_type: "vendor_bill",
      object_id: bill.id,
      hash,
    })
    .select()
    .single()

  if (proofError) return { success: false, error: proofError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ledger:notarize_bill",
    entity: "vendor_bill",
    entityId: bill.id,
    diff: { hash },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: proof }
}

export async function notarizeBatch(input: z.infer<typeof notarizeBatchSchema>) {
  const parsed = notarizeBatchSchema.parse(input)
  const supabase = await createServerClient()

  // Check feature flags
  const flags = await hasFeatures(["ap.read", "ledger.notarize"])
  if (!flags["ap.read"] || !flags["ledger.notarize"]) {
    return { success: false, error: "Feature not enabled: ledger.notarize" }
  }

  // Get current user and tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

  if (!member) return { success: false, error: "No tenant found" }

  // Get batch
  const { data: batch, error: batchError } = await supabase
    .from("payment_batches")
    .select("*")
    .eq("id", parsed.batchId)
    .single()

  if (batchError) return { success: false, error: batchError.message }

  let hash: string
  if (batch.file_url) {
    try {
      const response = await fetch(batch.file_url)
      if (response.ok) {
        const fileBuffer = Buffer.from(await response.arrayBuffer())
        hash = await computeFileHash(fileBuffer)
      } else {
        throw new Error("Failed to fetch batch file")
      }
    } catch (error) {
      console.error("[v0] Hash computation error:", error)
      return { success: false, error: "Failed to compute batch file hash" }
    }
  } else {
    // Hash batch data if no file exists
    const batchData = JSON.stringify({
      id: batch.id,
      batch_no: batch.batch_no,
      total: batch.total,
      status: batch.status,
    })
    hash = await computeFileHash(Buffer.from(batchData))
  }

  // Insert ledger proof
  const { data: proof, error: proofError } = await supabase
    .from("proofs")
    .insert({
      object_type: "payment_batch",
      object_id: batch.id,
      hash,
    })
    .select()
    .single()

  if (proofError) return { success: false, error: proofError.message }

  // Audit log
  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "ledger:notarize_batch",
    entity: "payment_batch",
    entityId: batch.id,
    diff: { hash },
  })

  revalidatePath("/hrms/accounts-payable")

  return { success: true, data: proof }
}
