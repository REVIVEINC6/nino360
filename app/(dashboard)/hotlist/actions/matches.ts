"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit/server"
import { requirePermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"

/**
 * Run auto-match for a requirement
 */
export async function runAutoMatch(requirementId: string) {
  await requirePermission(PERMISSIONS.HOTLIST_MATCHES_RUN)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  // Get requirement
  const { data: requirement } = await supabase
    .from("bench.hotlist_requirements")
    .select("*")
    .eq("id", requirementId)
    .eq("tenant_id", tenantId)
    .single()

  if (!requirement) throw new Error("Requirement not found")

  // Get all hotlist candidates
  const { data: hotlistCandidates } = await supabase
    .from("bench.hotlist_candidates")
    .select(
      `
      *,
      candidate:bench.consultants!candidate_id(*)
    `,
    )
    .eq("tenant_id", tenantId)
    .eq("status", "active")

  if (!hotlistCandidates || hotlistCandidates.length === 0) {
    return { matches: [], message: "No active candidates on hotlist" }
  }

  // Calculate match scores
  const matches: any[] = []
  for (const hotlistCandidate of hotlistCandidates) {
    const candidate = hotlistCandidate.candidate

    if (!candidate) continue

    const matchResult = calculateMatchScore(requirement, candidate)

    // Only include matches with score > 50
    if (matchResult.match_score > 50) {
      matches.push({
        tenant_id: tenantId,
        requirement_id: requirementId,
        candidate_id: candidate.id,
        hotlist_candidate_id: hotlistCandidate.id,
        ...matchResult,
        matched_by: "auto",
      })
    }
  }

  // Sort by match score
  matches.sort((a, b) => b.match_score - a.match_score)

  // Add rank
  matches.forEach((match, index) => {
    match.rank = index + 1
  })

  // Delete existing matches for this requirement
  await supabase.from("bench.hotlist_matches").delete().eq("requirement_id", requirementId).eq("tenant_id", tenantId)

  // Insert new matches
  if (matches.length > 0) {
    const { data, error } = await supabase.from("bench.hotlist_matches").insert(matches).select()

    if (error) throw new Error(error.message)

    await logAudit({
      tenantId,
      userId: user.id,
      action: "hotlist.matches.auto_run",
      entity: "hotlist_match",
      entityId: requirementId,
      metadata: { matches_found: matches.length },
    })

    revalidatePath("/hotlist")
    revalidatePath("/hotlist/requirements")
    return { matches: data, message: `Found ${matches.length} matches` }
  }

  return { matches: [], message: "No suitable matches found" }
}

/**
 * Calculate match score between requirement and candidate
 */
function calculateMatchScore(requirement: any, candidate: any) {
  let skills_score = 0
  let availability_score = 0
  const history_score = 0
  const match_reasons: string[] = []
  const concerns: string[] = []

  // Skills matching (55% weight)
  const reqSkills = requirement.required_skills || []
  const candSkills = candidate.skills || []

  if (reqSkills.length > 0 && candSkills.length > 0) {
    const matchedSkills = reqSkills.filter((skill: string) =>
      candSkills.some((cs: any) => {
        const skillName = typeof cs === "string" ? cs : cs.name
        return skillName.toLowerCase().includes(skill.toLowerCase())
      }),
    )

    skills_score = Math.round((matchedSkills.length / reqSkills.length) * 100)

    if (matchedSkills.length > 0) {
      match_reasons.push(`Matched ${matchedSkills.length}/${reqSkills.length} required skills`)
    }
    if (matchedSkills.length < reqSkills.length) {
      concerns.push(`Missing ${reqSkills.length - matchedSkills.length} required skills`)
    }
  }

  // Availability matching (20% weight)
  if (candidate.availability_date) {
    const daysUntilAvailable = Math.ceil(
      (new Date(candidate.availability_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    )

    if (daysUntilAvailable <= 0) {
      availability_score = 100
      match_reasons.push("Available immediately")
    } else if (daysUntilAvailable <= 7) {
      availability_score = 80
      match_reasons.push(`Available in ${daysUntilAvailable} days`)
    } else if (daysUntilAvailable <= 14) {
      availability_score = 60
      match_reasons.push(`Available in ${daysUntilAvailable} days`)
    } else if (daysUntilAvailable <= 30) {
      availability_score = 40
    } else {
      availability_score = 20
      concerns.push(`Not available for ${daysUntilAvailable} days`)
    }
  }

  // Rate matching (15% weight)
  let rate_score = 0
  if (requirement.pay_range_min && requirement.pay_range_max && candidate.current_rate) {
    if (candidate.current_rate >= requirement.pay_range_min && candidate.current_rate <= requirement.pay_range_max) {
      rate_score = 100
      match_reasons.push("Rate within budget")
    } else if (candidate.current_rate < requirement.pay_range_min) {
      rate_score = 80
      match_reasons.push("Rate below budget (negotiable)")
    } else {
      rate_score = 40
      concerns.push("Rate above budget")
    }
  }

  // Experience matching (10% weight)
  let experience_score = 0
  if (requirement.experience_years && candidate.experience_years) {
    if (candidate.experience_years >= requirement.experience_years) {
      experience_score = 100
      match_reasons.push(`${candidate.experience_years}+ years experience`)
    } else {
      experience_score = 50
      concerns.push("Less experience than required")
    }
  }

  // Calculate weighted match score
  const match_score = Math.round(
    skills_score * 0.55 + availability_score * 0.2 + rate_score * 0.15 + experience_score * 0.1,
  )

  return {
    match_score,
    skills_score,
    availability_score,
    history_score: 0, // Placeholder for historical data
    explainability: {
      weights: {
        skills: 0.55,
        availability: 0.2,
        rate: 0.15,
        experience: 0.1,
      },
      scores: {
        skills: skills_score,
        availability: availability_score,
        rate: rate_score,
        experience: experience_score,
      },
    },
    match_reasons,
    concerns,
  }
}

/**
 * Get matches for a requirement
 */
export async function getMatchesForRequirement(requirementId: string) {
  await requirePermission(PERMISSIONS.HOTLIST_MATCHES_READ)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_matches")
    .select(
      `
      *,
      candidate:bench.consultants!candidate_id(*),
      requirement:bench.hotlist_requirements!requirement_id(*)
    `,
    )
    .eq("requirement_id", requirementId)
    .eq("tenant_id", tenantId)
    .order("match_score", { ascending: false })

  if (error) throw new Error(error.message)

  return data || []
}

/**
 * Update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: "suggested" | "reviewed" | "submitted" | "rejected" | "accepted",
) {
  await requirePermission(PERMISSIONS.HOTLIST_MATCHES_READ)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  const { data, error } = await supabase
    .from("bench.hotlist_matches")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", matchId)
    .eq("tenant_id", tenantId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logAudit({
    tenantId,
    userId: user.id,
    action: "hotlist.match.status_updated",
    entity: "hotlist_match",
    entityId: matchId,
    metadata: { status },
  })

  revalidatePath("/hotlist")
  return data
}
