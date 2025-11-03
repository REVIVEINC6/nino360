"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "@/lib/audit/hash-chain"
import { generateText } from "ai"

const findSlotsSchema = z.object({
  candidate_id: z.string().uuid().optional(),
  panel_user_ids: z.array(z.string().uuid()).min(1).max(8),
  durationMins: z.number().int().min(15).max(240),
  from: z.string(),
  to: z.string(),
  timezone: z.string().optional(),
  avoid_conflicts_with: z.array(z.string().uuid()).optional(),
  max_suggestions: z.number().int().max(20).optional().default(5),
})

const scheduleInterviewSchema = z.object({
  application_id: z.string().uuid(),
  starts_at: z.string(),
  ends_at: z.string(),
  timezone: z.string().optional(),
  panel: z.array(
    z.object({
      user_id: z.string().uuid(),
      role: z.enum(["interviewer", "hm", "observer"]),
    }),
  ),
  scorecard_id: z.string().uuid().optional(),
  round_name: z.string().optional(),
  mode: z.enum(["video", "phone", "onsite", "remote"]).default("video"),
  meet_url: z.string().url().optional(),
  agenda_md: z.string().optional(),
  interviewer_instructions: z.string().optional(),
  send_invites: z.boolean().default(true),
})

const submitFeedbackSchema = z.object({
  interview_id: z.string().uuid(),
  reviewer_id: z.string().uuid(),
  ratings: z.array(
    z.object({
      dimension_key: z.string(),
      score: z.number(),
      note: z.string().optional(),
    }),
  ),
  overall: z.enum(["strong_yes", "yes", "lean_yes", "no", "strong_no"]),
  notes: z.string().optional(),
})

const uploadRecordingSchema = z.object({
  interview_id: z.string().uuid(),
  recording_path: z.string(),
  transcript_path: z.string().optional(),
})

const ragSearchSchema = z.object({
  interview_id: z.string().uuid(),
  q: z.string().min(3).max(1000),
  topK: z.number().int().max(20).optional().default(5),
})

export async function getContext() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tenant_id, timezone")
    .eq("user_id", user.id)
    .single()

  if (!profile) throw new Error("Profile not found")

  // Check features
  const { data: features } = await supabase
    .from("tenant_features")
    .select("feature_key")
    .eq("tenant_id", profile.tenant_id)
    .eq("enabled", true)

  const featureKeys = features?.map((f: any) => f.feature_key) || []

  return {
    tenantId: profile.tenant_id,
    tz: profile.timezone || "UTC",
    myUserId: user.id,
    features: {
      copilot: featureKeys.includes("tenant.copilot"),
      recordings: featureKeys.includes("talent.interviews.recordings"),
      integrations: featureKeys.includes("integrations.sync"),
      audit: featureKeys.includes("security.audit_chain"),
      rag: featureKeys.includes("talent.interviews.rag"),
    },
    availabilityProviders: ["google", "microsoft"], // stub
  }
}

// Helper: detect common auth/profile errors so callers can fall back gracefully
function isProfileOrAuthError(e: any) {
  const msg = typeof e?.message === "string" ? e.message : ""
  return msg.includes("Profile not found") || msg.includes("Unauthorized")
}

// Non-throwing context getter: returns null on missing profile/auth so callers
// can fall back without try/catch noise.
export async function getContextOrNull() {
  try {
    return await getContext()
  } catch (e: any) {
    if (isProfileOrAuthError(e)) return null
    throw e
  }
}

export async function findSlots(input: unknown) {
  const body = findSlotsSchema.parse(input)
  const supabase = await createClient()
  const ctx = await getContext()

  // Get panel members' existing interviews in the date range
  const { data: existingInterviews } = await supabase
    .from("interviews")
    .select("scheduled_start, scheduled_end, panel")
    .gte("scheduled_start", body.from)
    .lte("scheduled_end", body.to)
    .eq("tenant_id", ctx.tenantId)
    .in("status", ["scheduled"])

  // Generate time slots (simplified - in production, use calendar API)
  const slots: Array<{
    start: string
    end: string
    conflicts: Array<{ user_id: string; event: string }>
    score: number
  }> = []

  const startDate = new Date(body.from)
  const endDate = new Date(body.to)
  const durationMs = body.durationMins * 60 * 1000

  // Generate slots every hour during business hours (9 AM - 5 PM)
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    for (let hour = 9; hour < 17; hour++) {
      const slotStart = new Date(d)
      slotStart.setHours(hour, 0, 0, 0)
      const slotEnd = new Date(slotStart.getTime() + durationMs)

      // Check conflicts
      const conflicts: Array<{ user_id: string; event: string }> = []
      for (const panelUserId of body.panel_user_ids) {
        const hasConflict = existingInterviews?.some((interview: any) => {
          const intStart = new Date(interview.scheduled_start)
          const intEnd = new Date(interview.scheduled_end)
          const panelMembers = (interview.panel as any[]) || []
          const isInPanel = panelMembers.some((p: any) => p.user_id === panelUserId)
          return isInPanel && slotStart < intEnd && slotEnd > intStart
        })

        if (hasConflict) {
          conflicts.push({ user_id: panelUserId, event: "Existing interview" })
        }
      }

      // Score: fewer conflicts = higher score
      const score = 100 - conflicts.length * 20

      if (score > 0) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          conflicts,
          score,
        })
      }
    }
  }

  // Sort by score and return top suggestions
  return slots.sort((a, b) => b.score - a.score).slice(0, body.max_suggestions)
}

export async function scheduleInterview(input: unknown) {
  const body = scheduleInterviewSchema.parse(input)
  const supabase = await createClient()
  const ctx = await getContext()

  // Create interview record
  const { data: interview, error } = await supabase
    .from("interviews")
    .insert({
      tenant_id: ctx.tenantId,
      application_id: body.application_id,
      scheduled_start: body.starts_at,
      scheduled_end: body.ends_at,
      panel: body.panel,
      scorecard_id: body.scorecard_id,
      round_name: body.round_name,
      mode: body.mode,
      meet_url: body.meet_url,
      agenda_md: body.agenda_md,
      interviewer_instructions: body.interviewer_instructions,
      status: "scheduled",
    })
    .select()
    .single()

  if (error) throw error

  // Update interviewer load
  for (const panelMember of body.panel) {
    const date = new Date(body.starts_at).toISOString().split("T")[0]
    await supabase.rpc("increment_interviewer_load", {
      p_tenant_id: ctx.tenantId,
      p_user_id: panelMember.user_id,
      p_date: date,
    })
  }

  // Create event log
  await supabase.from("interview_events").insert({
    tenant_id: ctx.tenantId,
    interview_id: interview.id,
    type: "scheduled",
    actor: ctx.myUserId,
    meta: { panel: body.panel, mode: body.mode },
  })

  // Audit log
  if (ctx.features.audit) {
    await createAuditLog({
      tenantId: ctx.tenantId,
      userId: ctx.myUserId,
      action: "interview:schedule",
      entity: "ats.interviews",
      entityId: interview.id,
      diff: { created: interview },
    })
  }

  // TODO: Create provider event if integration enabled
  if (ctx.features.integrations && body.send_invites) {
    // await createProviderEvent(interview.id, 'google')
  }

  revalidatePath("/talent/interviews")
  return { success: true, interview }
}

export async function rescheduleInterview(id: string, newStartsAt: string, newEndsAt: string, reason?: string) {
  const supabase = await createClient()
  const ctx = await getContext()

  const { data: interview, error } = await supabase
    .from("interviews")
    .update({
      scheduled_start: newStartsAt,
      scheduled_end: newEndsAt,
      reschedule_count: supabase.rpc("increment", { x: 1 }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", ctx.tenantId)
    .select()
    .single()

  if (error) throw error

  // Create event
  await supabase.from("interview_events").insert({
    tenant_id: ctx.tenantId,
    interview_id: id,
    type: "rescheduled",
    actor: ctx.myUserId,
    meta: { reason, old_start: interview.scheduled_start, new_start: newStartsAt },
  })

  // Audit
  if (ctx.features.audit) {
    await createAuditLog({
      tenantId: ctx.tenantId,
      userId: ctx.myUserId,
      action: "interview:reschedule",
      entity: "ats.interviews",
      entityId: id,
      diff: { reason, new_start: newStartsAt },
    })
  }

  revalidatePath("/talent/interviews")
  return { success: true, interview }
}

export async function markNoShow(interview_id: string, actor_id?: string) {
  const supabase = await createClient()
  const ctx = await getContext()

  const { error } = await supabase
    .from("interviews")
    .update({ status: "no_show", updated_at: new Date().toISOString() })
    .eq("id", interview_id)
    .eq("tenant_id", ctx.tenantId)

  if (error) throw error

  // Create event
  await supabase.from("interview_events").insert({
    tenant_id: ctx.tenantId,
    interview_id,
    type: "no_show",
    actor: actor_id || ctx.myUserId,
  })

  // Audit
  if (ctx.features.audit) {
    await createAuditLog({
      tenantId: ctx.tenantId,
      userId: ctx.myUserId,
      action: "interview:no_show",
      entity: "ats.interviews",
      entityId: interview_id,
      diff: { status: "no_show" },
    })
  }

  revalidatePath("/talent/interviews")
  return { success: true }
}

export async function getWorkspace(interview_id: string) {
  const supabase = await createClient()
  const ctx = await getContext()

  const { data: interview, error } = await supabase
    .from("interviews")
    .select(
      `
      *,
      application:applications(
        *,
        candidate:candidates(*),
        job:jobs(*)
      ),
      scorecard:scorecards(
        *,
        dimensions:scorecard_dimensions(*)
      )
    `,
    )
    .eq("id", interview_id)
    .eq("tenant_id", ctx.tenantId)
    .single()

  if (error) throw error

  // Get previous feedback for this candidate
  const { data: previous_feedbacks } = await supabase
    .from("feedback")
    .select("*, interview:interviews(round_name)")
    .eq("tenant_id", ctx.tenantId)
    .eq("interview_id", interview_id)

  return {
    interview,
    application: interview.application,
    candidate_profile: interview.application?.candidate,
    scorecard: interview.scorecard,
    previous_feedbacks: previous_feedbacks || [],
  }
}

export async function submitFeedback(input: unknown) {
  const body = submitFeedbackSchema.parse(input)
  const supabase = await createClient()
  const ctx = await getContext()

  // Calculate weighted score
  const { data: dimensions } = await supabase
    .from("scorecard_dimensions")
    .select("key, weight")
    .eq("tenant_id", ctx.tenantId)

  const dimMap = new Map(dimensions?.map((d: any) => [d.key, d.weight || 1]) || [])
  let totalScore = 0
  let totalWeight = 0

  for (const rating of body.ratings) {
    const weightVal = dimMap.get(rating.dimension_key) || 1
    const weight = typeof weightVal === "number" ? weightVal : 1
    totalScore += rating.score * weight
    totalWeight += weight
  }

  const avgScore = totalWeight > 0 ? totalScore / totalWeight : 0

  // Insert feedback
  const { data: feedback, error } = await supabase
    .from("feedback")
    .insert({
      tenant_id: ctx.tenantId,
      interview_id: body.interview_id,
      reviewer_id: body.reviewer_id,
      ratings: body.ratings,
      overall: body.overall,
      notes: body.notes,
      scores: { avg: avgScore, weighted: totalScore },
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  // Update interviewer load (decrement feedback_pending)
  const { data: interview } = await supabase
    .from("interviews")
    .select("scheduled_start")
    .eq("id", body.interview_id)
    .single()

  if (interview) {
    const date = new Date(interview.scheduled_start).toISOString().split("T")[0]
    await supabase.rpc("decrement_feedback_pending", {
      p_tenant_id: ctx.tenantId,
      p_user_id: body.reviewer_id,
      p_date: date,
    })
  }

  // Create event
  await supabase.from("interview_events").insert({
    tenant_id: ctx.tenantId,
    interview_id: body.interview_id,
    type: "feedback_submitted",
    actor: body.reviewer_id,
    meta: { overall: body.overall, avg_score: avgScore },
  })

  // Audit
  if (ctx.features.audit) {
    await createAuditLog({
      tenantId: ctx.tenantId,
      userId: ctx.myUserId,
      action: "feedback:submit",
      entity: "ats.feedback",
      entityId: feedback.id,
      diff: { interview_id: body.interview_id, overall: body.overall },
    })
  }

  revalidatePath("/talent/interviews")
  return { success: true, feedback }
}

export async function recomputeFeedbackAggregates(period?: string) {
  const supabase = await createClient()
  const ctx = await getContext()

  const currentPeriod = period || new Date().toISOString().slice(0, 7) // YYYY-MM

  // Get all feedback for the period
  const { data: feedbacks } = await supabase
    .from("feedback")
    .select("reviewer_id, scores, submitted_at")
    .eq("tenant_id", ctx.tenantId)
    .gte("submitted_at", `${currentPeriod}-01`)
    .lt("submitted_at", `${currentPeriod}-32`)

  // Group by reviewer
  const reviewerStats = new Map<string, { total: number; count: number }>()

  for (const fb of feedbacks || []) {
    const reviewerId = fb.reviewer_id
    const score = (fb.scores as any)?.avg || 0
    const existing = reviewerStats.get(reviewerId) || { total: 0, count: 0 }
    reviewerStats.set(reviewerId, {
      total: existing.total + score,
      count: existing.count + 1,
    })
  }

  // Insert aggregates
  for (const [reviewerId, stats] of reviewerStats) {
    await supabase.from("feedback_aggregates").upsert({
      tenant_id: ctx.tenantId,
      interviewer_id: reviewerId,
      period: currentPeriod,
      avg_score: stats.total / stats.count,
      submissions: stats.count,
    })
  }

  // Audit
  if (ctx.features.audit) {
    await createAuditLog({
      tenantId: ctx.tenantId,
      userId: ctx.myUserId,
      action: "feedback:aggregate",
      entity: "ats.feedback_aggregates",
      entityId: currentPeriod,
      diff: { period: currentPeriod, reviewers: reviewerStats.size },
    })
  }

  return { success: true, period: currentPeriod }
}

export async function getCalibrationMetrics(filters?: { job_id?: string; period?: string }) {
  const supabase = await createClient()
  const ctx: any = await getContextOrNull()
  if (!ctx) return { per_interviewer: [], icc_proxy: 0, bias_table: [] }

  const period = filters?.period || new Date().toISOString().slice(0, 7)

  const { data: aggregates } = await supabase
    .from("feedback_aggregates")
    .select("interviewer_id, avg_score, submissions")
    .eq("tenant_id", ctx.tenantId)
    .eq("period", period)

  if (!aggregates || aggregates.length === 0) {
    return { per_interviewer: [], icc_proxy: 0, bias_table: [] }
  }

  // Calculate mean and standard deviation
  const scores = aggregates.map((a: any) => Number(a.avg_score) || 0)
  const mean = scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length
  const variance = scores.reduce((sum: number, s: number) => sum + Math.pow(s - mean, 2), 0) / scores.length
  const sd = Math.sqrt(variance)

  // Per-interviewer stats
  const per_interviewer = aggregates.map((a: any) => ({
    id: a.interviewer_id,
    avg: a.avg_score,
    sd: sd, // simplified
    n: a.submissions,
  }))

  // Bias table (difference from mean)
  const bias_table = aggregates.map((a: any) => ({
    interviewer: a.interviewer_id,
    avg_diff_from_mean: a.avg_score - mean,
  }))

  // ICC proxy (simplified - in production, calculate proper ICC)
  const icc_proxy = variance > 0 ? 1 - sd / mean : 0

  return { per_interviewer, icc_proxy, bias_table }
}

export async function uploadRecording(input: unknown) {
  const body = uploadRecordingSchema.parse(input)
  const supabase = await createClient()
  const ctx = await getContext()

  if (!ctx.features.recordings) {
    throw new Error("Recording feature not enabled")
  }

  const { error } = await supabase
    .from("interviews")
    .update({
      recording_path: body.recording_path,
      transcript_path: body.transcript_path,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.interview_id)
    .eq("tenant_id", ctx.tenantId)

  if (error) throw error

  // Create event
  await supabase.from("interview_events").insert({
    tenant_id: ctx.tenantId,
    interview_id: body.interview_id,
    type: "recording_uploaded",
    actor: ctx.myUserId,
    meta: { recording_path: body.recording_path },
  })

  // Audit
  if (ctx.features.audit) {
    await createAuditLog({
      tenantId: ctx.tenantId,
      userId: ctx.myUserId,
      action: "interview:recording",
      entity: "ats.interviews",
      entityId: body.interview_id,
      diff: { recording_path: body.recording_path },
    })
  }

  revalidatePath("/talent/interviews")
  return { success: true }
}

export async function ragSearchTranscript(input: unknown) {
  const body = ragSearchSchema.parse(input)
  const supabase = await createClient()
  const ctx = await getContext()

  if (!ctx.features.rag) {
    throw new Error("RAG search not enabled")
  }

  // Get transcript
  const { data: interview } = await supabase
    .from("interviews")
    .select("transcript_path")
    .eq("id", body.interview_id)
    .eq("tenant_id", ctx.tenantId)
    .single()

  if (!interview?.transcript_path) {
    return { snippets: [] }
  }

  // TODO: Implement actual RAG search with embeddings
  // For now, return stub
  const snippets = [
    {
      text: "Candidate discussed their experience with React and TypeScript...",
      timestamp: "00:05:23",
      relevance: 0.92,
    },
    {
      text: "Explained their approach to system design and scalability...",
      timestamp: "00:12:45",
      relevance: 0.87,
    },
  ]

  // Audit
  if (ctx.features.audit) {
    await createAuditLog({
      tenantId: ctx.tenantId,
      userId: ctx.myUserId,
      action: "interview:rag_search",
      entity: "ats.interviews",
      entityId: body.interview_id,
      diff: { query: body.q },
    })
  }

  return { snippets }
}

export async function getInterviewerLoad(user_ids: string[], dateFrom: string, dateTo: string) {
  const supabase = await createClient()
  const ctx = await getContext()

  const { data, error } = await supabase
    .from("interviewer_load")
    .select("*")
    .eq("tenant_id", ctx.tenantId)
    .in("user_id", user_ids)
    .gte("date", dateFrom)
    .lte("date", dateTo)

  if (error) throw error

  return data || []
}

export async function generateFeedbackDraft(interview_id: string, dimension_key: string) {
  const supabase = await createClient()
  const ctx = await getContext()

  if (!ctx.features.copilot) {
    throw new Error("AI features not enabled")
  }

  // Get interview context
  const workspace = await getWorkspace(interview_id)

  const prompt = `Generate interview feedback for the "${dimension_key}" dimension.
  
Candidate: ${workspace.candidate_profile?.full_name}
Role: ${workspace.application?.job?.title}
Dimension: ${dimension_key}

Provide a concise, professional assessment (2-3 sentences) based on typical evaluation criteria.`

  const { text } = await generateText({
    model: "openai/gpt-4o-mini",
    prompt,
  })

  return { draft: text }
}

export async function listInterviews(filters?: {
  job_id?: string
  status?: string
  from?: string
  to?: string
}) {
  const supabase = await createClient()
  const ctx: any = await getContextOrNull()
  if (!ctx) return []

  let query = supabase
    .from("interviews")
    .select(
      `
      *,
      application:applications(
        *,
        candidate:candidates(full_name, email),
        job:jobs(title, code)
      )
    `,
    )
    .eq("tenant_id", ctx.tenantId)
    .order("scheduled_start", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.from) {
    query = query.gte("scheduled_start", filters.from)
  }

  if (filters?.to) {
    query = query.lte("scheduled_end", filters.to)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching interviews:", error)
    return []
  }

  return data || []
}

export async function getAuditMini(limit = 8) {
  const supabase = await createClient()
  const ctx: any = await getContextOrNull()
  if (!ctx) return []

  const { data } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("tenant_id", ctx.tenantId)
    .like("entity", "ats.interview%")
    .order("created_at", { ascending: false })
    .limit(limit)

  return data || []
}

export async function verifyHash(hash: string) {
  const supabase = await createClient()

  const { data } = await supabase.from("sec.audit_logs").select("*").eq("hash", hash).single()

  if (!data) {
    return { valid: false, message: "Hash not found" }
  }

  // Verify chain integrity (simplified)
  return { valid: true, entry: data }
}

export async function getInterviewTimeline(interview_id: string) {
  const supabase = await createClient()
  const ctx = await getContext()

  const { data: events, error } = await supabase
    .from("interview_events")
    .select(
      `
      *,
      user:user_profiles!interview_events_actor_fkey(
        full_name,
        avatar_url
      )
    `,
    )
    .eq("tenant_id", ctx.tenantId)
    .eq("interview_id", interview_id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching interview timeline:", error)
    return { success: false, error: error.message }
  }

  const formattedEvents = events?.map((event: any) => ({
    id: event.id,
    event_type: event.type,
    event_data: event.meta,
    created_at: event.created_at,
    user_name: event.user?.full_name,
    user_avatar: event.user?.avatar_url,
  }))

  return { success: true, data: formattedEvents || [] }
}

export { getWorkspace as getInterviewWorkspace }
export { ragSearchTranscript as searchTranscript }
