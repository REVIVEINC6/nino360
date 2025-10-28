"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getBurndown(projectId: string) {
  const supabase = await createServerClient()

  const { data: tasks, error } = await supabase
    .from("proj.tasks")
    .select("estimate_hours, logged_hours, created_at, updated_at")
    .eq("project_id", projectId)

  if (error) throw new Error(error.message)

  const totalEst = (tasks || []).reduce((acc, task) => acc + Number(task.estimate_hours || 0), 0)
  const totalLogged = (tasks || []).reduce((acc, task) => acc + Number(task.logged_hours || 0), 0)

  return {
    totalEst,
    totalLogged,
    remaining: totalEst - totalLogged,
    percentComplete: totalEst > 0 ? (totalLogged / totalEst) * 100 : 0,
  }
}
