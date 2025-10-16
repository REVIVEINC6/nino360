"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getBills() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("finance.bills")
      .select("*, vendor:finance.clients(name)")
      .order("bill_date", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[v0] Error fetching bills:", error)
    return []
  }
}

const lineSchema = z.object({
  line_no: z.number().int(),
  description: z.string().min(2),
  quantity: z.number().min(0),
  unit_cost: z.number().min(0),
  tax_rate: z.number().min(0),
})

const billSchema = z.object({
  id: z.string().uuid().optional(),
  vendor_id: z.string().uuid(),
  bill_no: z.string(),
  bill_date: z.string(),
  due_date: z.string(),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
  lines: z.array(lineSchema).min(1),
})

export async function upsertBill(input: unknown) {
  try {
    const body = billSchema.parse(input)
    const supabase = await createServerClient()

    // Calculate totals
    const totals = body.lines.reduce(
      (acc, line) => {
        const amount = line.quantity * line.unit_cost
        const tax = (amount * line.tax_rate) / 100
        return {
          subtotal: acc.subtotal + amount,
          tax_total: acc.tax_total + tax,
        }
      },
      { subtotal: 0, tax_total: 0 },
    )

    const total = totals.subtotal + totals.tax_total

    // Upsert bill header
    const bill = {
      id: body.id,
      vendor_id: body.vendor_id,
      bill_no: body.bill_no,
      bill_date: body.bill_date,
      due_date: body.due_date,
      currency: body.currency,
      notes: body.notes,
      subtotal: totals.subtotal,
      tax_total: totals.tax_total,
      total,
    }

    const { data: header, error: headerError } = await supabase.from("finance.bills").upsert(bill).select().single()

    if (headerError) throw headerError

    // Delete existing lines
    await supabase.from("finance.bill_lines").delete().eq("bill_id", header.id)

    // Insert new lines
    const lines = body.lines.map((line) => ({
      ...line,
      amount: line.quantity * line.unit_cost,
      bill_id: header.id,
    }))

    const { error: linesError } = await supabase.from("finance.bill_lines").insert(lines)

    if (linesError) throw linesError

    // Audit log
    await supabase.rpc("finance.audit", {
      _action: body.id ? "update" : "create",
      _resource: "bill",
      _payload: { header, lines },
    })

    revalidatePath("/finance/bills")
    return { success: true, data: header }
  } catch (error) {
    console.error("[v0] Error upserting bill:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save bill" }
  }
}

export async function schedulePayout(bill_id: string, amount: number, method = "bank", reference?: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("finance.payouts")
      .insert({ bill_id, amount, method, reference })
      .select()
      .single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "schedule",
      _resource: "payout",
      _payload: data,
    })

    revalidatePath("/finance/bills")
    revalidatePath("/finance/payouts")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error scheduling payout:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to schedule payout" }
  }
}
