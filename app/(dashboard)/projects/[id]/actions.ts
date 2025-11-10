"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProjectDetail(projectId: string) {
  const supabase = await createServerClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      *,
      client:clients(id, name),
      team:project_team(
        id,
        role,
        allocation,
        employee:employees(id, name, title, avatar_url)
      ),
      tasks:project_tasks(id, title, status, priority, due_date),
      milestones:project_milestones(id, title, due_date, status, completion)
    `)
    .eq("id", projectId)
    .single()

  if (error) throw error
  return project
}

export async function updateProject(projectId: string, data: any) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("projects").update(data).eq("id", projectId)

  if (error) throw error
  revalidatePath(`/projects/${projectId}`)
}
