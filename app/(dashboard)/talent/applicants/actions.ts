"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"

const moveStageSchema = z.object({
  application_id: z.string().uuid(),
  to_stage: z.enum(["applicant", "screen", "interview", "offer", "hired", "rejected"]),
  note: z.string().optional(),
})

const scheduleInterviewSchema = z.object({
  application_id: z.string().uuid(),
  starts_at: z.string(),
  ends_at: z.string(),
  timezone: z.string().optional(),
  panel: z.array(
    z.object({
      user_id: z.string().uuid(),
      role: z.enum(["interviewer", "hm"]).optional(),
    }),
  ),
  scorecard_id: z.string().uuid().optional(),
  location: z.string().optional(),
})

const submitFeedbackSchema = z.object({
  interview_id: z.string().uuid(),
  ratings: z.array(
    z.object({
      dimension_key: z.string(),
      score: z.number().min(1).max(5),
      note: z.string().optional(),
    }),
  ),
  overall: z.enum(["strong_yes", "yes", "lean_yes", "no", "strong_no"]),
  notes: z.string().optional(),
})

export async function getContext() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get tenant context
  const { data: profile } = await supabase.from("user_profiles").select("tenant_id").eq("user_id", user.id).single()

  // Get users for panel selection
  const { data: users } = await supabase
    .from("user_profiles")
    .select("user_id, full_name")
    .eq("tenant_id", profile?.tenant_id)

  // Get requisitions
  const { data: reqs } = await supabase
    .from("ats.jobs")
    .select("id, title, code")
    .eq("status", "open")
    .order("created_at", { ascending: false })

  return {
    tenantId: profile?.tenant_id,
    tz: "America/New_York",
    features: {
      copilot: true,
      audit: true,
    },
    stages: ["applicant", "screen", "interview", "offer", "hired", "rejected"],
    users: users?.map((u) => ({ id: u.user_id, name: u.full_name })) || [],
    reqs: reqs || [],
  }
}

export async function listBoard(params: {
  requisition_id?: string
  owner?: string
  stage?: string[]
  source?: string[]
  tag?: string[]
  q?: string
  page?: number
  pageSize?: number
}) {
  const supabase = await createClient()
  const page = params.page || 1
  const pageSize = params.pageSize || 100

  let query = supabase.from("ats.applications").select(
    `
      *,
      candidate:candidate_id(full_name, email, headline, skills),
      job:job_id(title, code),
      owner:owner_id(full_name)
    `,
    { count: "exact" },
  )

  if (params.requisition_id) {
    query = query.eq("job_id", params.requisition_id)
  }

  if (params.stage && params.stage.length > 0) {
    query = query.in("stage", params.stage)
  }

  if (params.source && params.source.length > 0) {
    query = query.in("source", params.source)
  }

  if (params.q) {
    query = query.or(`candidate.full_name.ilike.%${params.q}%,candidate.email.ilike.%${params.q}%`)
  }

  const {
    data: apps,
    error,
    count,
  } = await query.range((page - 1) * pageSize, page * pageSize - 1).order("created_at", { ascending: false })

  if (error) throw error

  // Group by stage for columns
  const stages = ["applicant", "screen", "interview", "offer", "hired", "rejected"]
  const columns = stages.map((stage) => ({
    stage,
    key: stage,
    count: apps?.filter((a) => a.stage === stage).length || 0,
  }))

  const cards =
    apps?.map((app) => ({
      id: app.id,
      candidate: app.candidate,
      role: app.job?.title,
      source: app.source,
      tags: app.tags || [],
      owner: app.owner,
      age_days: Math.floor((Date.now() - new Date(app.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      resume_path: app.resume_path,
      stage: app.stage,
      stage_sla_due_at: app.stage_sla_due_at,
      score: app.score,
    })) || []

  return { columns, cards, total: count || 0 }
}

export async function canMove(input: { application_id: string; to_stage: string }) {
  const supabase = await createClient()

  const { data: app } = await supabase
    .from("ats.applications")
    .select("*, candidate:candidate_id(*)")
    .eq("id", input.application_id)
    .single()

  if (!app) return { ok: false, missing_fields: ["Application not found"] }

  const missing: string[] = []

  // Stage-specific validations
  if (input.to_stage === "interview" && !app.candidate?.email) {
    missing.push("Candidate email required for interview stage")
  }

  if (input.to_stage === "offer" && !app.candidate?.phone) {
    missing.push("Candidate phone required for offer stage")
  }

  // Calculate SLA reset
  const slaHours = { applicant: 24, screen: 48, interview: 72, offer: 24, hired: 0, rejected: 0 }
  const sla_reset_at = new Date(
    Date.now() + (slaHours[input.to_stage as keyof typeof slaHours] || 24) * 60 * 60 * 1000,
  ).toISOString()

  return {
    ok: missing.length === 0,
    missing_fields: missing.length > 0 ? missing : undefined,
    sla_reset_at,
    warnings: [],
  }
}

export async function moveStage(input: unknown) {
  const body = moveStageSchema.parse(input)
  const supabase = await createClient()

  const check = await canMove({ application_id: body.application_id, to_stage: body.to_stage })
  if (!check.ok) {
    throw new Error(`Cannot move: ${check.missing_fields?.join(", ")}`)
  }

  const { error } = await supabase
    .from("ats.applications")
    .update({
      stage: body.to_stage,
      stage_changed_at: new Date().toISOString(),
      stage_sla_due_at: check.sla_reset_at,
      stage_notes: body.note,
    })
    .eq("id", body.application_id)

  if (error) throw error

  // Log activity
  await supabase.from("ats.application_activities").insert({
    application_id: body.application_id,
    type: "system",
    data: { event: "stage_change", to_stage: body.to_stage, note: body.note },
  })

  revalidatePath("/talent/applicants")
  return { ok: true }
}

export async function assignOwner(input: { application_ids: string[]; owner_id: string }) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("ats.applications")
    .update({ owner_id: input.owner_id })
    .in("id", input.application_ids)

  if (error) throw error

  revalidatePath("/talent/applicants")
  return { ok: true }
}

export async function setTags(input: { application_id: string; tags: string[] }) {
  const supabase = await createClient()

  const { error } = await supabase.from("ats.applications").update({ tags: input.tags }).eq("id", input.application_id)

  if (error) throw error

  revalidatePath("/talent/applicants")
  return { ok: true }
}

export async function scheduleInterview(input: unknown) {
  const body = scheduleInterviewSchema.parse(input)
  const supabase = await createClient()

  const feedbackDueAt = new Date(new Date(body.ends_at).getTime() + 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from("ats.interviews")
    .insert({
      application_id: body.application_id,
      scheduled_start: body.starts_at,
      scheduled_end: body.ends_at,
      location: body.location,
      panel: body.panel,
      feedback_due_at: feedbackDueAt,
      status: "scheduled",
    })
    .select()
    .single()

  if (error) throw error

  // Log activity
  await supabase.from("ats.application_activities").insert({
    application_id: body.application_id,
    type: "system",
    data: { event: "interview_scheduled", interview_id: data.id },
  })

  revalidatePath("/talent/applicants")
  return data
}

export async function submitFeedback(input: unknown) {
  const body = submitFeedbackSchema.parse(input)
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("ats.feedback_v2")
    .upsert({
      interview_id: body.interview_id,
      reviewer_id: user.id,
      ratings: body.ratings,
      overall: body.overall,
      notes: body.notes,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  // Mark interview feedback as submitted
  await supabase.from("ats.interviews").update({ feedback_submitted: true }).eq("id", body.interview_id)

  revalidatePath("/talent/applicants")
  return data
}

export async function startOffer(application_id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get application with job details for comp seeding
  const { data: app } = await supabase
    .from("ats.applications")
    .select("*, job:job_id(*)")
    .eq("id", application_id)
    .single()

  if (!app) throw new Error("Application not found")

  const { data, error } = await supabase
    .from("ats.offers")
    .insert({
      application_id,
      base: app.job?.pay_rate_max || 0,
      currency: app.job?.budget_currency || "USD",
      status: "draft",
      created_by: user.id,
    })
    .select()
    .single()

  if (error) throw error

  // Log activity
  await supabase.from("ats.application_activities").insert({
    application_id,
    type: "system",
    data: { event: "offer_started", offer_id: data.id },
  })

  revalidatePath("/talent/applicants")
  return data
}

export async function listActivities(application_id: string, limit = 100) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("ats.application_activities")
    .select("*, actor:actor(full_name)")
    .eq("application_id", application_id)
    .order("ts", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function addNote(application_id: string, text: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("ats.application_activities").insert({
    application_id,
    type: "note",
    actor: user.id,
    data: { text },
  })

  if (error) throw error

  revalidatePath("/talent/applicants")
  return { ok: true }
}

export async function bulkMove(input: { ids: string[]; to_stage: string }) {
  const supabase = await createClient()

  if (input.ids.length > 200) {
    throw new Error("Bulk move limited to 200 applications")
  }

  const { error } = await supabase
    .from("ats.applications")
    .update({
      stage: input.to_stage,
      stage_changed_at: new Date().toISOString(),
    })
    .in("id", input.ids)

  if (error) throw error

  revalidatePath("/talent/applicants")
  return { ok: true, count: input.ids.length }
}

export async function bulkEmail(input: {
  ids: string[]
  template_id?: string
  subject?: string
  body_md?: string
}) {
  // TODO: Integrate with CRM engagement queue
  console.log("[v0] Bulk email queued for", input.ids.length, "applicants")

  revalidatePath("/talent/applicants")
  return { ok: true, queue_id: crypto.randomUUID() }
}

export async function exportCsv(params: any) {
  const supabase = await createClient()

  // TODO: Generate CSV and upload to storage
  const signedUrl = "/exports/applicants-export.csv"

  // Log audit
  await supabase.from("core.audit_log").insert({
    action: "app:export",
    entity: "talent.applications",
    data: { params },
  })

  return { url: signedUrl }
}

export async function aiSummarizeCandidate(application_id: string) {
  const supabase = await createClient()

  const { data: app } = await supabase
    .from("ats.applications")
    .select("*, candidate:candidate_id(*)")
    .eq("id", application_id)
    .single()

  if (!app) throw new Error("Application not found")

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Summarize this candidate profile in 3-5 bullet points:
      
Name: ${app.candidate?.full_name}
Headline: ${app.candidate?.headline}
Skills: ${app.candidate?.skills?.join(", ")}
Summary: ${app.candidate?.summary}

Focus on: experience highlights, key skills, potential risks or gaps.`,
    })

    // Log audit
    await supabase.from("core.audit_log").insert({
      action: "ai:summarize",
      entity: "talent.applications",
      entity_id: application_id,
    })

    return { summary: text }
  } catch (error) {
    console.error("[v0] AI summarize error:", error)
    throw new Error("AI summarization failed")
  }
}

export async function aiGenerateFeedback(input: {
  application_id: string
  tone?: "concise" | "structured" | "positive" | "constructive"
}) {
  const supabase = await createClient()

  const { data: app } = await supabase
    .from("ats.applications")
    .select("*, candidate:candidate_id(*), job:job_id(*)")
    .eq("id", input.application_id)
    .single()

  if (!app) throw new Error("Application not found")

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Generate interview feedback for this candidate in a ${input.tone || "structured"} tone:

Candidate: ${app.candidate?.full_name}
Role: ${app.job?.title}
Skills: ${app.candidate?.skills?.join(", ")}

Provide feedback covering: technical skills, communication, culture fit, and recommendation.`,
    })

    // Log audit
    await supabase.from("core.audit_log").insert({
      action: "ai:feedback",
      entity: "talent.applications",
      entity_id: input.application_id,
    })

    return { feedback: text }
  } catch (error) {
    console.error("[v0] AI feedback error:", error)
    throw new Error("AI feedback generation failed")
  }
}

export async function getAuditMini(limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("core.audit_log")
    .select("*")
    .eq("entity", "talent.applications")
    .order("ts", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function verifyHash(hash: string) {
  // TODO: Implement blockchain-style hash verification
  return { valid: true, hash }
}
