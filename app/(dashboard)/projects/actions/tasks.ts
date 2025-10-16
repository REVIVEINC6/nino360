"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const taskSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "in_progress", "review", "done", "blocked"]).default("todo"),
  assignee_id: z.string().uuid().optional().nullable(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  estimate_hours: z.number().min(0).default(0),
  position: z.number().int().default(0),
})

export async function listTasks(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("proj.tasks")
    .select("*, assignee:core.users(full_name, email)")
    .eq("project_id", projectId)
    .order("position", { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function upsertTask(input: unknown) {
  const body = taskSchema.parse(input)
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("proj.tasks").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return data
}

export async function moveTask(id: string, status: string, position: number) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("proj.tasks").update({ status, position }).eq("id", id).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return data
}

export async function deleteTask(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("proj.tasks").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return { success: true }
}
