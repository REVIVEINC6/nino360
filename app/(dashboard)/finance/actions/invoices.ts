"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const lineSchema = z.object({
  line_no: z.number().int(),
  description: z.string().min(2),
  qty: z.number().min(0),
  unit_price: z.number().min(0),
  tax_rate: z.number().min(0).default(0),
})

const invoiceSchema = z.object({
  id: z.string().uuid().optional(),
  customer_id: z.string().uuid(),
  number: z.string(),
  issue_date: z.string(),
  due_date: z.string(),
  currency: z.string().default("USD"),
  po_number: z.string().optional(),
  reference: z.string().optional(),
  lines: z.array(lineSchema).min(1),
})

export async function getInvoices() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("invoices")
      .select("*, customer:customers(name)")
      .order("issue_date", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[v0] Error fetching invoices:", error)
    return []
  }
}

export async function getInvoice(id: string) {
  try {
    const supabase = await createServerClient()

    const { data: invoice, error: invError } = await supabase
      .from("invoices")
      .select("*, customer:customers(name, contact)")
      .eq("id", id)
      .single()

    if (invError) throw invError

    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("line_no")

    if (itemsError) throw itemsError

    return { ...invoice, items: items || [] }
  } catch (error) {
    console.error("[v0] Error fetching invoice:", error)
    return null
  }
}

export async function upsertInvoice(input: unknown) {
  try {
    const body = invoiceSchema.parse(input)
    const supabase = await createServerClient()

    const totals = body.lines.reduce(
      (acc, line) => {
        const amount = line.qty * line.unit_price
        const tax = (amount * line.tax_rate) / 100
        return {
          subtotal: acc.subtotal + amount,
          tax: acc.tax + tax,
        }
      },
      { subtotal: 0, tax: 0 },
    )

    const total = totals.subtotal + totals.tax

    const invoice = {
      id: body.id,
      customer_id: body.customer_id,
      number: body.number,
      issue_date: body.issue_date,
      due_date: body.due_date,
      currency: body.currency,
      po_number: body.po_number,
      reference: body.reference,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total,
      balance: total, // Initial balance equals total
      status: "draft",
    }

    const { data: header, error: headerError } = await supabase.from("invoices").upsert(invoice).select().single()

    if (headerError) throw headerError

    // Delete existing lines
    if (body.id) {
      await supabase.from("invoice_items").delete().eq("invoice_id", header.id)
    }

    const lines = body.lines.map((line) => ({
      line_no: line.line_no,
      description: line.description,
      qty: line.qty,
      unit_price: line.unit_price,
      amount: line.qty * line.unit_price,
      tax_rate: line.tax_rate,
      invoice_id: header.id,
    }))

    const { error: linesError } = await supabase.from("invoice_items").insert(lines)

    if (linesError) throw linesError

    revalidatePath("/finance/accounts-receivable")
    return { success: true, data: header }
  } catch (error) {
    console.error("[v0] Error upserting invoice:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save invoice" }
  }
}

export async function setInvoiceStatus(id: string, status: "draft" | "sent" | "partial" | "paid" | "void") {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("invoices").update({ status }).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/finance/accounts-receivable")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating invoice status:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update status" }
  }
}

export async function recordReceipt(input: {
  invoice_id: string
  amount: number
  received_date: string
  method: "ach" | "wire" | "check" | "card" | "cash"
  reference?: string
}) {
  try {
    const supabase = await createServerClient()

    // Get invoice and customer
    const { data: invoice, error: invError } = await supabase
      .from("invoices")
      .select("customer_id, balance, status")
      .eq("id", input.invoice_id)
      .single()

    if (invError) throw invError

    // Insert receipt
    const { error: receiptError } = await supabase.from("receipts").insert({
      customer_id: invoice.customer_id,
      invoice_id: input.invoice_id,
      received_date: input.received_date,
      amount: input.amount,
      method: input.method,
      reference: input.reference,
    })

    if (receiptError) throw receiptError

    // Update invoice balance
    const newBalance = Number(invoice.balance) - input.amount
    const newStatus = newBalance <= 0 ? "paid" : newBalance < Number(invoice.balance) ? "partial" : invoice.status

    const { error: updateError } = await supabase
      .from("invoices")
      .update({ balance: newBalance, status: newStatus })
      .eq("id", input.invoice_id)

    if (updateError) throw updateError

    revalidatePath("/finance/accounts-receivable")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error recording receipt:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to record receipt" }
  }
}

export async function deleteInvoice(id: string) {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("invoices").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/finance/accounts-receivable")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting invoice:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete invoice" }
  }
}

export async function getARAging() {
  try {
    const supabase = await createServerClient()
    const today = new Date().toISOString().slice(0, 10)

    const { data, error } = await supabase
      .from("invoices")
      .select("due_date, balance")
      .not("status", "in", '("paid","void")')
      .gt("balance", 0)

    if (error) throw error

    const aging = {
      current: 0,
      days_30: 0,
      days_60: 0,
      days_90: 0,
      days_90_plus: 0,
    }

    data?.forEach((inv) => {
      const dueDate = new Date(inv.due_date)
      const todayDate = new Date(today)
      const daysOverdue = Math.floor((todayDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      const balance = Number(inv.balance)

      if (daysOverdue < 0) {
        aging.current += balance
      } else if (daysOverdue <= 30) {
        aging.days_30 += balance
      } else if (daysOverdue <= 60) {
        aging.days_60 += balance
      } else if (daysOverdue <= 90) {
        aging.days_90 += balance
      } else {
        aging.days_90_plus += balance
      }
    })

    return aging
  } catch (error) {
    console.error("[v0] Error calculating AR aging:", error)
    return { current: 0, days_30: 0, days_60: 0, days_90: 0, days_90_plus: 0 }
  }
}
