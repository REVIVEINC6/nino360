"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const milestoneSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid(),
  title: z.string().min(2),
  due_date: z.string().optional().nullable(),
  amount: z.number().min(0).optional().default(0),
  status: z.enum(["planned", "in_progress", "ready_for_bill", "billed", "completed", "canceled"]).default("planned"),
})

export async function listMilestones(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("proj.milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("due_date", { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function upsertMilestone(input: unknown) {
  const body = milestoneSchema.parse(input)
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("proj.milestones").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return data
}

export async function deleteMilestone(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("proj.milestones").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return { success: true }
}
