"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getApplications(jobId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("applications")
    .select(`
      *,
      job:jobs(*),
      candidate:candidates(*),
      owner:users!owner_id(full_name)
    `)
    .order("created_at", { ascending: false })

  if (jobId) {
    query = query.eq("job_id", jobId)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching applications:", error)
    return []
  }

  return data || []
}

export async function createApplication(jobId: string, candidateId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("applications").insert({
    job_id: jobId,
    candidate_id: candidateId,
    stage: "applied",
    source: "internal",
  })

  if (error) {
    console.error("[v0] Error creating application:", error)
    return { error: error.message }
  }

  revalidatePath("/talent/applications")
  return { success: true }
}

export async function updateApplicationStage(id: string, stage: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("applications")
    .update({
      stage,
      stage_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("[v0] Error updating application stage:", error)
    return { error: error.message }
  }

  revalidatePath("/talent/applications")
  return { success: true }
}

export async function matchCandidates(jobId: string) {
  // TODO: Integrate with AI matching engine
  // For now, return placeholder scores
  const supabase = await createClient()

  const { data: candidates } = await supabase.from("candidates").select("*").eq("status", "active")

  if (!candidates) return []

  // Placeholder scoring logic
  return candidates
    .map((candidate) => ({
      candidate_id: candidate.id,
      candidate,
      score: Math.random() * 100,
      factors: {
        skills_match: Math.random() * 100,
        experience_match: Math.random() * 100,
        location_match: Math.random() * 100,
      },
    }))
    .sort((a, b) => b.score - a.score)
}
