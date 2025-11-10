"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getProjects() {
  const supabase = await createServerClient()

  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_members(count),
      project_tasks(count)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return projects || []
}

export async function createProject(formData: FormData) {
  const supabase = await createServerClient()

  const projectData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    budget: Number.parseFloat(formData.get("budget") as string),
    client_id: formData.get("client_id") as string,
  }

  const { data, error } = await supabase.from("projects").insert(projectData).select().single()

  if (error) throw error
  return data
}
