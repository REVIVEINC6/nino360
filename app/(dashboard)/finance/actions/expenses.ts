"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const expenseSchema = z.object({
  id: z.string().uuid().optional(),
  person_id: z.string().uuid(),
  person_name: z.string(),
  expense_date: z.string(),
  category: z.string(),
  description: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().default("USD"),
  receipt_url: z.string().optional(),
  notes: z.string().optional(),
})

export async function upsertExpense(input: unknown) {
  try {
    const body = expenseSchema.parse(input)
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("finance.expenses").upsert(body).select().single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: body.id ? "update" : "create",
      _resource: "expense",
      _payload: data,
    })

    revalidatePath("/finance/expenses")
    revalidatePath("/finance/approvals")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error upserting expense:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to save expense" }
  }
}

export async function approveExpense(id: string, approver_id: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("finance.expenses")
      .update({
        status: "approved",
        approver_id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "approve",
      _resource: "expense",
      _payload: { id, approver_id },
    })

    revalidatePath("/finance/expenses")
    revalidatePath("/finance/approvals")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error approving expense:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to approve expense" }
  }
}

export async function rejectExpense(id: string, approver_id: string, reason?: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("finance.expenses")
      .update({
        status: "rejected",
        approver_id,
        notes: reason,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "reject",
      _resource: "expense",
      _payload: { id, approver_id, reason },
    })

    revalidatePath("/finance/expenses")
    revalidatePath("/finance/approvals")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error rejecting expense:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to reject expense" }
  }
}

export async function reimburseExpense(id: string, payout_method = "bank", reference?: string) {
  try {
    const supabase = await createServerClient()

    // Get expense details
    const { data: expense, error: expenseError } = await supabase
      .from("finance.expenses")
      .select("*")
      .eq("id", id)
      .single()

    if (expenseError) throw expenseError

    // Create payout
    const { data: payout, error: payoutError } = await supabase
      .from("finance.payouts")
      .insert({
        expense_id: id,
        amount: expense.amount,
        currency: expense.currency,
        method: payout_method,
        reference,
      })
      .select()
      .single()

    if (payoutError) throw payoutError

    // Update expense status
    const { data, error } = await supabase
      .from("finance.expenses")
      .update({
        status: "reimbursed",
        reimbursed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "reimburse",
      _resource: "expense",
      _payload: { id, payout },
    })

    revalidatePath("/finance/expenses")
    revalidatePath("/finance/payouts")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error reimbursing expense:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to reimburse expense" }
  }
}
