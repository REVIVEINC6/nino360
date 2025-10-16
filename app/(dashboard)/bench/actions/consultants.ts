"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const consultantSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  work_auth: z.string().optional().nullable(),
  remote: z.boolean().default(true),
  relocation: z.boolean().default(false),
  skills: z.array(z.string()).default([]),
  seniority: z.string().optional().nullable(),
  current_role: z.string().optional().nullable(),
  last_project: z.string().optional().nullable(),
  rolloff_date: z.string().optional().nullable(),
  availability_date: z.string().optional().nullable(),
  cost_rate: z.number().optional().nullable(),
  bill_rate_expected: z.number().optional().nullable(),
  summary: z.string().optional().nullable(),
  resume_url: z.string().url().optional().nullable(),
  status: z.enum(["bench", "allocated", "pipeline", "inactive", "placed"]).default("bench"),
  tags: z.array(z.string()).default([]),
})

export async function listConsultants(filters?: {
  q?: string
  status?: string
  skill?: string
  page?: number
  per?: number
}) {
  const supabase = await createServerClient()

  const page = filters?.page || 1
  const per = filters?.per || 25
  const from = (page - 1) * per
  const to = from + per - 1

  let query = supabase.from("bench.consultants").select("*", { count: "exact" })

  if (filters?.q) {
    query = query.ilike("full_name", `%${filters.q}%`)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.skill) {
    query = query.contains("skills", [filters.skill])
  }

  const { data, error, count } = await query.range(from, to).order("updated_at", { ascending: false })

  if (error) {
    console.error("[v0] Error listing consultants:", error)
    throw new Error("Failed to list consultants")
  }

  return data || []
}

export async function upsertConsultant(input: z.infer<typeof consultantSchema>) {
  const supabase = await createServerClient()

  const validated = consultantSchema.parse(input)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("bench.consultants")
    .upsert({
      ...validated,
      created_by: validated.id ? undefined : user.id,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error upserting consultant:", error)
    throw new Error("Failed to save consultant")
  }

  revalidatePath("/bench")
  return data
}

export async function changeStatus(id: string, status: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("bench.consultants")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error changing status:", error)
    throw new Error("Failed to change status")
  }

  revalidatePath("/bench")
  return data
}

export async function deleteConsultant(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("bench.consultants").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting consultant:", error)
    throw new Error("Failed to delete consultant")
  }

  revalidatePath("/bench")
  return { success: true }
}

export async function getDashboardKPIs() {
  const supabase = await createServerClient()

  // Get consultant counts by status
  const { data: consultants, error: consultantsError } = await supabase
    .from("bench.consultants")
    .select("status, rolloff_date")

  if (consultantsError) {
    console.error("[v0] Error fetching consultants:", consultantsError)
    return {
      on_bench: 0,
      avg_bench_days: 0,
      active_allocations: 0,
      upcoming_rolloffs: 0,
    }
  }

  // Count by status
  const onBench = consultants?.filter((c) => c.status === "bench").length || 0

  // Calculate average bench days
  const benchConsultants = consultants?.filter((c) => c.status === "bench" && c.rolloff_date) || []
  const avgBenchDays =
    benchConsultants.length > 0
      ? Math.round(
          benchConsultants.reduce((sum, c) => {
            const days = Math.floor((Date.now() - new Date(c.rolloff_date!).getTime()) / (1000 * 60 * 60 * 24))
            return sum + Math.max(0, days)
          }, 0) / benchConsultants.length,
        )
      : 0

  // Get active allocations count
  const { count: allocationsCount } = await supabase
    .from("bench.allocations")
    .select("*", { count: "exact", head: true })
    .in("status", ["confirmed", "active"])

  // Get upcoming rolloffs (next 30 days)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const upcomingRolloffs =
    consultants?.filter((c) => {
      if (!c.rolloff_date) return false
      const rolloffDate = new Date(c.rolloff_date)
      return rolloffDate >= new Date() && rolloffDate <= thirtyDaysFromNow
    }).length || 0

  return {
    on_bench: onBench,
    avg_bench_days: avgBenchDays,
    active_allocations: allocationsCount || 0,
    upcoming_rolloffs: upcomingRolloffs,
  }
}

export async function addActivity(input: { consultant_id: string; kind: string; body: string }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("bench.activities")
    .insert({
      ...input,
      actor_user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding activity:", error)
    throw new Error("Failed to add activity")
  }

  revalidatePath("/bench")
  return data
}

export async function bulkTag(ids: string[], tags: string[]) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from("bench.consultants")
    .update({ tags, updated_at: new Date().toISOString() })
    .in("id", ids)

  if (error) {
    console.error("[v0] Error bulk tagging:", error)
    throw new Error("Failed to bulk tag consultants")
  }

  revalidatePath("/bench")
  return { success: true }
}

export async function listTags() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("bench.consultants").select("tags")

  if (error) {
    console.error("[v0] Error listing tags:", error)
    return []
  }

  // Flatten and deduplicate tags
  const allTags = data?.flatMap((c) => c.tags || []) || []
  return Array.from(new Set(allTags))
}

export async function listSources() {
  // Placeholder for source tracking
  return ["Direct", "Referral", "Agency", "LinkedIn", "Internal"]
}
