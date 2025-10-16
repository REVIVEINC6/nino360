"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getVMSInvoices() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("vms.invoices")
    .select("*, vendor:vms.vendors(name)")
    .order("invoice_date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createVMSInvoice(formData: FormData) {
  const supabase = await createServerClient()

  const invoice = {
    vendor_id: formData.get("vendor_id"),
    invoice_number: formData.get("invoice_number"),
    invoice_date: formData.get("invoice_date"),
    due_date: formData.get("due_date"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  }

  const { error } = await supabase.from("vms.invoices").insert(invoice)

  if (error) throw error

  revalidatePath("/vms/invoices")
  return { success: true }
}
