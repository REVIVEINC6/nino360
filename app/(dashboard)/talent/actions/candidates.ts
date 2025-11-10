"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { parseResumeFromUrl } from "@/lib/ai/client"
import { revalidatePath } from "next/cache"

const candidateSchema = z.object({
  id: z.string().uuid().optional(),
  source: z.enum(["upload", "sourced", "referral", "job_board", "vendor", "crm"]).default("upload"),
  full_name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  work_auth: z.string().optional(),
  remote: z.boolean().default(true),
  relocation: z.boolean().default(false),
  headline: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.any().optional(),
  education: z.any().optional(),
  resume_url: z.string().optional(),
  rate_currency: z.string().default("USD"),
  bill_rate_min: z.number().optional(),
  bill_rate_max: z.number().optional(),
  availability_date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["active", "on_hold", "placed", "blacklist"]).default("active"),
})

export async function listCandidates(filters?: {
  q?: string
  page?: number
  per?: number
  status?: string
  skills?: string[]
}) {
  const supabase = await createClient()
  const page = filters?.page || 1
  const per = filters?.per || 25
  const from = (page - 1) * per
  const to = from + per - 1

  let query = supabase
    .from("ats.candidates")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (filters?.q) {
    query = query.or(`full_name.ilike.%${filters.q}%,email.ilike.%${filters.q}%,headline.ilike.%${filters.q}%`)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] Error fetching candidates:", error)
    return { rows: [], total: 0 }
  }

  return { rows: data || [], total: count || 0 }
}

export async function upsertCandidate(input: unknown) {
  const body = candidateSchema.parse(input)
  const supabase = await createClient()

  const { data, error } = await supabase.from("ats.candidates").upsert(body).select().single()

  if (error) {
    console.error("[v0] Error upserting candidate:", error)
    throw error
  }

  revalidatePath("/talent/candidates")
  return data
}

export async function deleteCandidate(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("ats.candidates").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting candidate:", error)
    throw error
  }

  revalidatePath("/talent/candidates")
  return { ok: true }
}

export async function parseResume(resumeUrl: string) {
  // Delegate to the AI client. The client defaults to a mock provider so
  // this is safe to run in CI/dev without secrets. Replace with a real
  // provider via lib/ai/client when ready.
  try {
    const parsed = await parseResumeFromUrl(resumeUrl)
    return parsed
  } catch (err) {
    // Fall back to a minimal object so callers can continue to function.
    return {
      full_name: "",
      email: "",
      phone: "",
      skills: [],
      summary: "",
      resume_url: resumeUrl,
    }
  }
}

export async function bulkTag({
  candidate_ids,
  tag_id,
}: {
  candidate_ids: string[]
  tag_id: string
}) {
  const supabase = await createClient()
  const rows = candidate_ids.map((id) => ({ candidate_id: id, tag_id }))

  const { error } = await supabase.from("ats.candidate_tags").upsert(rows)
  if (error) {
    console.error("[v0] Error bulk tagging candidates:", error)
    throw error
  }

  revalidatePath("/talent/candidates")
  return { ok: true }
}

export async function listTags() {
  // TODO: Create tags table in schema
  return []
}

export async function listSources() {
  // TODO: Create sources table in schema
  return []
}
