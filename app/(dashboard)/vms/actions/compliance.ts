"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getComplianceRecords() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("vms.compliance")
    .select("*, vendor:vms.vendors(name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createComplianceRecord(formData: FormData) {
  const supabase = await createServerClient()

  const record = {
    vendor_id: formData.get("vendor_id"),
    doc_type: formData.get("doc_type"),
    status: formData.get("status"),
    expiry_date: formData.get("expiry_date"),
    notes: formData.get("notes"),
  }

  const { error } = await supabase.from("vms.compliance").insert(record)

  if (error) throw error

  revalidatePath("/vms/compliance")
  return { success: true }
}
