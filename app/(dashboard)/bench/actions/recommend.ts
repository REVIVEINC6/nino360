"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function recommendForConsultant(consultant_id: string, top_k = 20) {
  const supabase = await createServerClient()

  // TODO: Call edge function bench-recommend
  // For now, return a simple skill-based match

  // Get consultant skills
  const { data: consultant } = await supabase
    .from("bench.consultants")
    .select("skills")
    .eq("id", consultant_id)
    .single()

  if (!consultant) throw new Error("Consultant not found")

  // Find open jobs with matching skills
  const { data: jobs, error } = await supabase.from("ats.jobs").select("*").eq("status", "open").limit(top_k)

  if (error) {
    console.error("[v0] Error recommending jobs:", error)
    throw new Error("Failed to recommend jobs")
  }

  // Simple scoring: count matching skills
  const scored = jobs.map((job: any) => {
    const jobSkills = job.skills_required || []
    const matchCount = consultant.skills.filter((s: string) =>
      jobSkills.some((js: string) => js.toLowerCase() === s.toLowerCase()),
    ).length

    return {
      ...job,
      score: matchCount,
      match_factors: {
        skills_match: matchCount,
        total_skills: jobSkills.length,
      },
    }
  })

  // Sort by score descending
  scored.sort((a: any, b: any) => b.score - a.score)

  return scored
}

export async function recommendForJob(job_id: string, top_k = 20) {
  const supabase = await createServerClient()

  // TODO: Call edge function bench-recommend
  // For now, return a simple skill-based match

  // Get job skills
  const { data: job } = await supabase.from("ats.jobs").select("skills_required").eq("id", job_id).single()

  if (!job) throw new Error("Job not found")

  // Find bench consultants with matching skills
  const { data: consultants, error } = await supabase
    .from("bench.consultants")
    .select("*")
    .eq("status", "bench")
    .limit(top_k)

  if (error) {
    console.error("[v0] Error recommending consultants:", error)
    throw new Error("Failed to recommend consultants")
  }

  // Simple scoring: count matching skills
  const scored = consultants.map((consultant: any) => {
    const jobSkills = job.skills_required || []
    const matchCount = consultant.skills.filter((s: string) =>
      jobSkills.some((js: string) => js.toLowerCase() === s.toLowerCase()),
    ).length

    return {
      ...consultant,
      score: matchCount,
      match_factors: {
        skills_match: matchCount,
        total_skills: jobSkills.length,
      },
    }
  })

  // Sort by score descending
  scored.sort((a: any, b: any) => b.score - a.score)

  return scored
}
