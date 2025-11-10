"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const interviewSchema = z.object({
  id: z.string().uuid().optional(),
  application_id: z.string().uuid(),
  round_no: z.number().int().default(1),
  panel: z.any().optional(),
  scheduled_start: z.string(),
  scheduled_end: z.string(),
  location: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).default("scheduled"),
})

const feedbackSchema = z.object({
  interview_id: z.string().uuid(),
  scores: z.any().optional(),
  decision: z.enum(["advance", "hold", "reject"]),
  notes: z.string().optional(),
})

export async function listInterviews(applicationId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("interviews")
    .select(`
      *,
      application:applications(
        *,
        candidate:candidates(full_name),
        job:jobs(title)
      )
    `)
    .order("scheduled_start", { ascending: true })

  if (applicationId) {
    query = query.eq("application_id", applicationId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching interviews:", error)
    return []
  }
  return data || []
}

export async function upsertInterview(input: unknown) {
  const body = interviewSchema.parse(input)
  const supabase = await createClient()

  const { data, error } = await supabase.from("interviews").upsert(body).select().single()

  if (error) {
    console.error("[v0] Error upserting interview:", error)
    throw error
  }

  revalidatePath("/talent/interviews")
  return data
}

export async function submitFeedback(input: unknown) {
  const body = feedbackSchema.parse(input)
  const supabase = await createClient()

  const { data, error } = await supabase.from("feedback").insert(body).select().single()

  if (error) {
    console.error("[v0] Error submitting feedback:", error)
    throw error
  }

  revalidatePath("/talent/interviews")
  return data
}

export async function deleteInterview(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("interviews").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting interview:", error)
    throw error
  }

  revalidatePath("/talent/interviews")
  return { ok: true }
}
