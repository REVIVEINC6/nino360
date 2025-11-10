"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAttendance() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("hr.attendance")
    .select("*, employee:hr.employees(first_name, last_name)")
    .order("date", { ascending: false })
    .limit(100)

  if (error) throw error
  return data || []
}

export async function recordAttendance(formData: FormData) {
  const supabase = await createServerClient()

  const attendance = {
    employee_id: formData.get("employee_id"),
    date: formData.get("date"),
    status: formData.get("status"),
    check_in: formData.get("check_in"),
    check_out: formData.get("check_out"),
    notes: formData.get("notes"),
  }

  const { error } = await supabase.from("hr.attendance").insert(attendance)

  if (error) throw error

  revalidatePath("/hrms/attendance")
  return { success: true }
}
