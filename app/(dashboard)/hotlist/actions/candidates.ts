"use server"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit/server"
import { hasPermission, requirePermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import {
  hotlistCandidateSchema,
  type HotlistCandidateInput,
  hotlistCandidateFiltersSchema,
  type HotlistCandidateFilters,
} from "@/lib/hotlist/validators"

/**
 * Get hotlist candidates with filters
 */
export async function getHotlistCandidates(filters?: HotlistCandidateFilters) {
  const validatedFilters = hotlistCandidateFiltersSchema.parse(filters || {})
  const { page, limit, status, priority_level, min_readiness_score, skills, search } = validatedFilters

  const allowed = await hasPermission(PERMISSIONS.HOTLIST_CANDIDATES_READ)
  if (!allowed) {
    return {
      candidates: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      candidates: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) {
    return {
      candidates: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }


  let query = supabase
    .from("bench.hotlist_candidates")
    .select(
      `
      *,
      candidate:bench.consultants!candidate_id(
        id,
        first_name,
        last_name,
        email,
        phone,
        primary_skill,
        skills,
        experience_years,
        current_rate,
        availability_date,
        work_authorization,
        location
      ),
      added_by_user:core.users!added_by(id, email, full_name)
    `,
      { count: "exact" },
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)
  if (priority_level) query = query.eq("priority_level", priority_level)
  if (min_readiness_score) query = query.gte("readiness_score", min_readiness_score)

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) {
    console.error("[v0] Error fetching hotlist candidates:", error)
    return {
      candidates: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  return {
    candidates: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Add candidate to hotlist
 */
export async function addToHotlist(input: HotlistCandidateInput) {
  await requirePermission(PERMISSIONS.HOTLIST_CANDIDATES_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const body = hotlistCandidateSchema.parse(input)

  const { data, error } = await supabase
    .from("bench.hotlist_candidates")
    .insert({
      ...body,
      tenant_id: tenantId,
      added_by: user.id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Audit log
  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.candidate.added",
    entity: "hotlist_candidate",
    entityId: data.id,
    metadata: { candidate_id: body.candidate_id, priority_level: body.priority_level },
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/priority")
  return data
}

/**
 * Update hotlist candidate
 */
export async function updateHotlistCandidate(id: string, input: Partial<HotlistCandidateInput>) {
  await requirePermission(PERMISSIONS.HOTLIST_CANDIDATES_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_candidates")
    .update(input)
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.candidate.updated",
    entity: "hotlist_candidate",
    entityId: id,
    metadata: input,
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/priority")
  return data
}

/**
 * Remove candidate from hotlist (archive)
 */
export async function removeFromHotlist(id: string) {
  await requirePermission(PERMISSIONS.HOTLIST_CANDIDATES_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_candidates")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.candidate.removed",
    entity: "hotlist_candidate",
    entityId: id,
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/priority")
  return data
}

/**
 * Bulk add candidates to hotlist
 */
export async function bulkAddToHotlist(candidateIds: string[], priority_level = "medium") {
  await requirePermission(PERMISSIONS.HOTLIST_CANDIDATES_WRITE)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const records = candidateIds.map((candidate_id) => ({
    tenant_id: tenantId,
    candidate_id,
    priority_level,
    added_by: user.id,
  }))

  const { data, error } = await supabase.from("bench.hotlist_candidates").insert(records).select()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.candidates.bulk_added",
    entity: "hotlist_candidate",
    entityId: "bulk",
    metadata: { count: candidateIds.length, candidate_ids: candidateIds },
  })

  revalidatePath("/hotlist")
  revalidatePath("/hotlist/priority")
  return data
}

/**
 * Calculate readiness score for a candidate
 */
export async function calculateReadinessScore(candidateId: string) {
  await requirePermission(PERMISSIONS.HOTLIST_CANDIDATES_READ)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  // Get candidate data
  const { data: candidate } = await supabase
    .from("bench.consultants")
    .select("*")
    .eq("id", candidateId)
    .eq("tenant_id", tenantId)
    .single()

  if (!candidate) throw new Error("Candidate not found")

  // Deterministic scoring algorithm
  let score = 0

  // Skills completeness (30 points)
  if (candidate.skills && Array.isArray(candidate.skills) && candidate.skills.length > 0) {
    score += Math.min(30, candidate.skills.length * 5)
  }

  // Experience (20 points)
  if (candidate.experience_years) {
    score += Math.min(20, candidate.experience_years * 2)
  }

  // Availability (20 points)
  if (candidate.availability_date) {
    const daysUntilAvailable = Math.ceil(
      (new Date(candidate.availability_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )
    if (daysUntilAvailable <= 0) score += 20
    else if (daysUntilAvailable <= 7) score += 15
    else if (daysUntilAvailable <= 14) score += 10
    else if (daysUntilAvailable <= 30) score += 5
  }

  // Profile completeness (15 points)
  let completeness = 0
  if (candidate.summary) completeness += 5
  if (candidate.resume_url) completeness += 5
  if (candidate.linkedin_url) completeness += 5
  score += completeness

  // Recent activity (15 points) - placeholder
  score += 10

  return Math.min(100, score)
}
