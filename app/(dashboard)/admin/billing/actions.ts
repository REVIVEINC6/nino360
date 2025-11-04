"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { guardAdmin } from "@/lib/rbac/server"

export async function listInvoices() {
  await guardAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      tenant:tenants(name, slug),
      subscription:subscriptions(plan_id)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) throw error
  return data
}

export async function syncInvoice(invoiceId: string) {
  await guardAdmin()
  const supabase = await createServerClient()

  // Simulate Stripe sync
  const { data: invoice, error } = await supabase.from("invoices").select("*").eq("id", invoiceId).single()

  if (error) throw error

  // Update sync status
  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      synced_at: new Date().toISOString(),
      sync_status: "synced",
    })
    .eq("id", invoiceId)

  if (updateError) throw updateError

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "invoice.sync",
      resource_type: "invoice",
      resource_id: invoiceId,
      details: { invoice_id: invoiceId },
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/billing")
  return { success: true }
}

export async function resolveDispute(invoiceId: string, resolution: string) {
  await guardAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("invoices")
    .update({
      dispute_status: "resolved",
      dispute_resolution: resolution,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)

  if (error) throw error

  // Audit log
  try {
    await supabase.from("audit_logs").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      action: "dispute.resolve",
      resource_type: "invoice",
      resource_id: invoiceId,
      details: { resolution },
    })
  } catch (e) {
    console.error("[v0] Audit log failed:", e)
  }

  revalidatePath("/admin/billing")
  return { success: true }
}
