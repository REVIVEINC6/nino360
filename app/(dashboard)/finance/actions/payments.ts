"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const paymentSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.number().min(0),
  currency: z.string().default("USD"),
  method: z.string().default("bank"),
  reference: z.string().optional(),
  received_at: z.string().optional(),
})

export async function recordPayment(input: unknown) {
  try {
    const body = paymentSchema.parse(input)
    const supabase = await createServerClient()

    const { data: payment, error } = await supabase.from("finance.payments").insert(body).select().single()

    if (error) throw error

    // The trigger will automatically update invoice paid_amount and status

    await supabase.rpc("finance.audit", {
      _action: "record",
      _resource: "payment",
      _payload: payment,
    })

    revalidatePath("/finance/invoices")
    revalidatePath("/finance/payments")
    return { success: true, data: payment }
  } catch (error) {
    console.error("[v0] Error recording payment:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to record payment" }
  }
}

export async function deletePayment(id: string) {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase.from("finance.payments").delete().eq("id", id)

    if (error) throw error

    await supabase.rpc("finance.audit", {
      _action: "delete",
      _resource: "payment",
      _payload: { id },
    })

    revalidatePath("/finance/invoices")
    revalidatePath("/finance/payments")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting payment:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete payment" }
  }
}
