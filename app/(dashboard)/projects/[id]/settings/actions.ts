"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProjectSettings(projectId: string, settings: any) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("projects").update(settings).eq("id", projectId).select().single()

  if (error) throw error

  revalidatePath(`/projects/${projectId}/settings`)
  return data
}

export async function deleteProject(projectId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("projects").delete().eq("id", projectId)

  if (error) throw error

  revalidatePath("/projects")
  return { success: true }
}

export async function archiveProject(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("projects")
    .update({ status: "archived" })
    .eq("id", projectId)
    .select()
    .single()

  if (error) throw error

  revalidatePath(`/projects/${projectId}/settings`)
  return data
}
