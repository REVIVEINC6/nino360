"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getProjectTimeEntries(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("project_time_entries")
    .select(`
      *,
      employee:employees(id, first_name, last_name, email),
      task:project_tasks(id, title)
    `)
    .eq("project_id", projectId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

export async function addTimeEntry(data: {
  project_id: string
  employee_id: string
  task_id?: string
  date: string
  hours: number
  description?: string
  billable: boolean
}) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("project_time_entries").insert(data)

  if (error) throw error
}

export async function updateTimeEntry(
  id: string,
  data: Partial<{
    hours: number
    description: string
    billable: boolean
  }>,
) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("project_time_entries").update(data).eq("id", id)

  if (error) throw error
}

export async function deleteTimeEntry(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("project_time_entries").delete().eq("id", id)

  if (error) throw error
}
