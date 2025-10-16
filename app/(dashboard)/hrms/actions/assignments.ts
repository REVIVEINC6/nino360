"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAssignments() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("hr.assignments").select("*").order("start_date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createAssignment(formData: FormData) {
  const supabase = await createServerClient()

  const assignment = {
    employee_id: formData.get("employee_id"),
    project_id: formData.get("project_id"),
    role: formData.get("role"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    allocation_pct: formData.get("allocation_pct"),
  }

  const { error } = await supabase.from("hr.assignments").insert(assignment)

  if (error) throw error

  revalidatePath("/hrms/assignments")
  return { success: true }
}
