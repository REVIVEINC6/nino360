"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const allocationSchema = z.object({
  consultant_id: z.string().uuid(),
  kind: z.enum(["ats_job", "internal", "client_direct"]),
  job_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  percent: z.number().int().min(1).max(100).default(100),
  status: z.enum(["proposed", "confirmed", "active", "completed", "cancelled"]).default("proposed"),
  notes: z.string().optional().nullable(),
})

export async function listAllocations(filters?: {
  consultant_id?: string
  job_id?: string
  status?: string
}) {
  const supabase = await createServerClient()

  let query = supabase
    .from("bench.allocations")
    .select(`
      *,
      consultant:bench.consultants(id, full_name, email, skills, status),
      job:ats.jobs(id, title, location, status)
    `)
    .order("created_at", { ascending: false })

  if (filters?.consultant_id) {
    query = query.eq("consultant_id", filters.consultant_id)
  }

  if (filters?.job_id) {
    query = query.eq("job_id", filters.job_id)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error listing allocations:", error)
    throw new Error("Failed to list allocations")
  }

  return data
}

export async function createAllocation(input: z.infer<typeof allocationSchema>) {
  const supabase = await createServerClient()

  const validated = allocationSchema.parse(input)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("bench.allocations")
    .insert({
      ...validated,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating allocation:", error)
    throw new Error("Failed to create allocation")
  }

  revalidatePath("/bench")
  return data
}

export async function updateAllocation(id: string, input: Partial<z.infer<typeof allocationSchema>>) {
  const supabase = await createServerClient()

  const validated = allocationSchema.partial().parse(input)

  const { data, error } = await supabase
    .from("bench.allocations")
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating allocation:", error)
    throw new Error("Failed to update allocation")
  }

  revalidatePath("/bench")
  return data
}

export async function setAllocationStatus(id: string, status: string) {
  return updateAllocation(id, { status: status as any })
}

export async function deleteAllocation(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("bench.allocations").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting allocation:", error)
    throw new Error("Failed to delete allocation")
  }

  revalidatePath("/bench")
}
