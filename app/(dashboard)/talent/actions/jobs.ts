"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const jobSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  title: z.string().min(2),
  department: z.string().optional(),
  location: z.string().optional(),
  remote: z.boolean().default(true),
  employment_type: z.enum(["C2C", "W2", "Contract", "Contract-to-Hire", "Full-Time"]).default("Full-Time"),
  description: z.string().optional(),
  skills_required: z.array(z.string()).optional(),
  skills_nice: z.array(z.string()).optional(),
  headcount: z.number().int().min(1).default(1),
  budget_currency: z.string().default("USD"),
  bill_rate_max: z.number().optional(),
  pay_rate_max: z.number().optional(),
  hiring_manager: z.string().uuid().optional(),
  recruiter_id: z.string().uuid().optional(),
  status: z.enum(["draft", "open", "on_hold", "closed", "cancelled"]).default("draft"),
})

export async function listJobs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("jobs")
    .select("*, hiring_manager:users!hiring_manager(full_name), recruiter:users!recruiter_id(full_name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching jobs:", error)
    return []
  }
  return data || []
}

export async function upsertJob(input: unknown) {
  const body = jobSchema.parse(input)
  const supabase = await createClient()

  const { data, error } = await supabase.from("jobs").upsert(body).select().single()

  if (error) {
    console.error("[v0] Error upserting job:", error)
    throw error
  }

  revalidatePath("/talent/jobs")
  return data
}

export async function deleteJob(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("jobs").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting job:", error)
    throw error
  }

  revalidatePath("/talent/jobs")
  return { ok: true }
}

export async function generateJobDescription(title: string, skills: string[]) {
  // TODO: Integrate with AI router for JD generation
  return {
    description: `We are seeking a talented ${title} to join our team. The ideal candidate will have experience with ${skills.join(", ")}.`,
    skills_required: skills,
  }
}
