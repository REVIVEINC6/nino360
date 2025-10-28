"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDocuments() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("hr.documents")
    .select("*, employee:hr.employees(first_name, last_name)")
    .order("uploaded_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createServerClient()

  const document = {
    employee_id: formData.get("employee_id"),
    doc_type: formData.get("doc_type"),
    title: formData.get("title"),
    file_path: formData.get("file_path"),
    expiry_date: formData.get("expiry_date"),
  }

  const { error } = await supabase.from("hr.documents").insert(document)

  if (error) throw error

  revalidatePath("/hrms/documents")
  return { success: true }
}
