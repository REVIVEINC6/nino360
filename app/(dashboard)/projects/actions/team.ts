"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const allocationSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid(),
  person_id: z.string().uuid(),
  person_type: z.enum(["user", "consultant"]).default("user"),
  role: z.string().optional().nullable(),
  start_date: z.string(),
  end_date: z.string(),
  allocation_pct: z.number().int().min(0).max(100),
  bill_rate: z.number().optional().nullable(),
  pay_rate: z.number().optional().nullable(),
})

export async function listAllocations(projectId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("proj.allocations")
    .select("*")
    .eq("project_id", projectId)
    .order("start_date", { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function upsertAllocation(input: unknown) {
  const body = allocationSchema.parse(input)
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("proj.allocations").upsert(body).select().single()

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return data
}

export async function removeAllocation(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("proj.allocations").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/projects")
  return { success: true }
}
