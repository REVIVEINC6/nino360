"use server"

import { createClient } from "@/lib/supabase/server"

export async function getProjectTasks(projectId: string) {
  const supabase = await createClient()

  const { data: tasks } = await supabase
    .from("project_tasks")
    .select(`
      *,
      assignee:profiles(id, full_name, avatar_url)
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  return tasks || []
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("project_tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId)

  if (error) throw error
}

export async function createTask(projectId: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from("project_tasks").insert({
    project_id: projectId,
    ...data,
  })

  if (error) throw error
}
