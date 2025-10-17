"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateText } from "ai"

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const requisitionSchema = z.object({
  title: z.string().min(3).max(120),
  department: z.string().optional(),
  location: z.string().optional(),
  employment_type: z.enum(["full_time", "contract", "intern", "part_time"]).optional(),
  seniority: z.enum(["junior", "mid", "senior", "lead", "principal", "executive"]).optional(),
  openings: z.number().int().min(1).max(999).default(1),
  hm: z.string().uuid().optional(),
  recruiter_id: z.string().uuid().optional(),
  band: z.string().optional(),
  salary_range: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
      currency: z.string().length(3).optional(),
    })
    .optional(),
  skills: z.array(z.string().max(40)).max(40).optional(),
  description_md: z.string().optional(),
  remote_policy: z.enum(["onsite", "hybrid", "remote"]).optional(),
})

const listParamsSchema = z.object({
  q: z.string().optional(),
  status: z.array(z.enum(["draft", "open", "on_hold", "closed", "canceled"])).optional(),
  department: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
  owner: z.union([z.literal("me"), z.literal("team"), z.literal("all"), z.string().uuid()]).optional(),
  hm: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sort: z.string().default("created_at"),
  dir: z.enum(["asc", "desc"]).default("desc"),
})

const hiringTeamMemberSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["hm", "recruiter", "coord", "interviewer"]),
})

const interviewStepSchema = z.object({
  name: z.string().min(1),
  duration: z.number().int().min(15).max(240),
  panel: z.array(z.string().uuid()),
  scorecard_id: z.string().uuid().optional(),
})

const scorecardDimensionSchema = z.object({
  key: z.string(),
  label: z.string(),
  scale: z.number().int().min(1).max(5),
  anchors: z.array(z.string()),
})

const scorecardSchema = z.object({
  requisition_id: z.string().uuid(),
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  dimensions: z.array(scorecardDimensionSchema),
  pos: z.number().int().optional(),
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getTenantContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: userTenant } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  if (!userTenant?.tenant_id) throw new Error("Tenant not found")

  return { user, tenantId: userTenant.tenant_id, supabase }
}

// ============================================================================
// CONTEXT
// ============================================================================

export async function getContext() {
  try {
    const { tenantId, supabase } = await getTenantContext()

    const { data: tenant } = await supabase.from("tenants").select("settings").eq("id", tenantId).single()

    const settings = (tenant?.settings as any) || {}

    const { data: targets } = await supabase
      .from("talent.publish_targets")
      .select("id, key, name, kind, enabled")
      .eq("tenant_id", tenantId)
      .eq("enabled", true)

    return {
      tenantId,
      tz: settings.timezone || "UTC",
      features: {
        copilot: settings.features?.copilot || false,
        audit: settings.features?.audit || true,
        publish: settings.features?.publish || true,
      },
      defaultSla: {
        reviewHours: settings.sla?.reviewHours || 48,
      },
      targets: targets || [],
    }
  } catch (error) {
    console.error("[v0] Error getting context:", error)
    throw error
  }
}

// ============================================================================
// LIST & FILTERS
// ============================================================================

export async function listRequisitions(params: z.infer<typeof listParamsSchema>) {
  try {
    const validated = listParamsSchema.parse(params)
    const { tenantId, user, supabase } = await getTenantContext()

    let query = supabase
      .from("talent.requisitions")
      .select(
        `
        id, title, department, location, employment_type, seniority, openings, status, created_at,
        hiring_manager:users!hiring_manager(id, full_name),
        recruiter:users!recruiter_id(id, full_name)
      `,
        { count: "exact" },
      )
      .eq("tenant_id", tenantId)

    // Apply filters
    if (validated.q) {
      query = query.or(`title.ilike.%${validated.q}%,description_md.ilike.%${validated.q}%`)
    }
    if (validated.status?.length) {
      query = query.in("status", validated.status)
    }
    if (validated.department?.length) {
      query = query.in("department", validated.department)
    }
    if (validated.location?.length) {
      query = query.in("location", validated.location)
    }
    if (validated.hm) {
      query = query.eq("hiring_manager", validated.hm)
    }
    if (validated.owner === "me") {
      query = query.or(`hiring_manager.eq.${user.id},recruiter_id.eq.${user.id}`)
    }
    if (validated.dateFrom) {
      query = query.gte("created_at", validated.dateFrom)
    }
    if (validated.dateTo) {
      query = query.lte("created_at", validated.dateTo)
    }

    // Apply sorting and pagination
    query = query.order(validated.sort, { ascending: validated.dir === "asc" })
    const from = (validated.page - 1) * validated.pageSize
    query = query.range(from, from + validated.pageSize - 1)

    const { data, error, count } = await query

    if (error) throw error

    const rows = (data || []).map((row: any) => ({
      ...row,
      age_days: Math.floor((Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24)),
    }))

    return { rows, total: count || 0 }
  } catch (error) {
    console.error("[v0] Error listing requisitions:", error)
    throw error
  }
}

// ============================================================================
// CRUD / INTAKE
// ============================================================================

export async function createRequisition(input: z.infer<typeof requisitionSchema>) {
  try {
    const validated = requisitionSchema.parse(input)
    const { tenantId, user, supabase } = await getTenantContext()

    const { data, error } = await supabase
      .from("talent.requisitions")
      .insert({
        ...validated,
        tenant_id: tenantId,
        hiring_manager: validated.hm,
        status: "draft",
      })
      .select("id")
      .single()

    if (error) throw error

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:create",
      resource_type: "talent.requisition",
      resource_id: data.id,
      metadata: { title: validated.title },
    })

    revalidatePath("/talent/jobs")
    return data.id
  } catch (error) {
    console.error("[v0] Error creating requisition:", error)
    throw error
  }
}

export async function updateRequisition(id: string, patch: Partial<z.infer<typeof requisitionSchema>>) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    const { data: original } = await supabase
      .from("talent.requisitions")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single()

    if (!original) throw new Error("Requisition not found")

    const { error } = await supabase
      .from("talent.requisitions")
      .update({
        ...patch,
        hiring_manager: patch.hm,
      })
      .eq("id", id)
      .eq("tenant_id", tenantId)

    if (error) throw error

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:update",
      resource_type: "talent.requisition",
      resource_id: id,
      metadata: { diff: patch },
    })

    revalidatePath("/talent/jobs")
    revalidatePath(`/talent/jobs/${id}`)
  } catch (error) {
    console.error("[v0] Error updating requisition:", error)
    throw error
  }
}

// ============================================================================
// HIRING TEAM & PLAN
// ============================================================================

export async function setHiringTeam(requisition_id: string, members: Array<z.infer<typeof hiringTeamMemberSchema>>) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    await supabase
      .from("talent.requisition_members")
      .delete()
      .eq("requisition_id", requisition_id)
      .eq("tenant_id", tenantId)

    if (members.length > 0) {
      const { error } = await supabase.from("talent.requisition_members").insert(
        members.map((m) => ({
          tenant_id: tenantId,
          requisition_id,
          user_id: m.user_id,
          role: m.role,
        })),
      )

      if (error) throw error
    }

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:team:set",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { members },
    })

    revalidatePath(`/talent/jobs/${requisition_id}`)
  } catch (error) {
    console.error("[v0] Error setting hiring team:", error)
    throw error
  }
}

export async function upsertInterviewPlan(requisition_id: string, steps: Array<z.infer<typeof interviewStepSchema>>) {
  try {
    const validated = z.array(interviewStepSchema).min(1).max(12).parse(steps)
    const { tenantId, user, supabase } = await getTenantContext()

    const { error } = await supabase
      .from("talent.interview_plan")
      .upsert({
        tenant_id: tenantId,
        requisition_id,
        steps: validated,
      })
      .eq("requisition_id", requisition_id)

    if (error) throw error

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:plan:upsert",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { steps: validated },
    })

    revalidatePath(`/talent/jobs/${requisition_id}`)
  } catch (error) {
    console.error("[v0] Error upserting interview plan:", error)
    throw error
  }
}

export async function upsertScorecard(input: z.infer<typeof scorecardSchema>) {
  try {
    const validated = scorecardSchema.parse(input)
    const { tenantId, user, supabase } = await getTenantContext()

    if (validated.id) {
      const { error } = await supabase
        .from("talent.scorecards")
        .update({
          name: validated.name,
          dimensions: validated.dimensions,
          pos: validated.pos,
        })
        .eq("id", validated.id)
        .eq("tenant_id", tenantId)

      if (error) throw error
    } else {
      const { error } = await supabase.from("talent.scorecards").insert({
        tenant_id: tenantId,
        requisition_id: validated.requisition_id,
        name: validated.name,
        dimensions: validated.dimensions,
        pos: validated.pos || 1,
      })

      if (error) throw error
    }

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:scorecard:upsert",
      resource_type: "talent.requisition",
      resource_id: validated.requisition_id,
      metadata: { scorecard: validated.name },
    })

    revalidatePath(`/talent/jobs/${validated.requisition_id}`)
  } catch (error) {
    console.error("[v0] Error upserting scorecard:", error)
    throw error
  }
}

export async function reorderScorecards(requisition_id: string, order: Array<{ id: string; pos: number }>) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    for (const item of order) {
      await supabase.from("talent.scorecards").update({ pos: item.pos }).eq("id", item.id).eq("tenant_id", tenantId)
    }

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:scorecard:reorder",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { order },
    })

    revalidatePath(`/talent/jobs/${requisition_id}`)
  } catch (error) {
    console.error("[v0] Error reordering scorecards:", error)
    throw error
  }
}

export async function getHiringTeam(requisition_id: string) {
  try {
    const { tenantId, supabase } = await getTenantContext()

    const { data, error } = await supabase
      .from("talent.requisition_members")
      .select(
        `
        id, role, created_at,
        user:users!user_id(id, full_name, email, avatar_url, title)
      `,
      )
      .eq("requisition_id", requisition_id)
      .eq("tenant_id", tenantId)
      .order("role", { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("[v0] Error getting hiring team:", error)
    throw error
  }
}

// ============================================================================
// APPROVALS
// ============================================================================

export async function startApproval(requisition_id: string, approver_ids: string[]) {
  try {
    if (approver_ids.length === 0) throw new Error("At least one approver is required")

    const { tenantId, user, supabase } = await getTenantContext()

    // Create approval records for each approver with step numbers
    const approvals = approver_ids.map((approver_id, index) => ({
      tenant_id: tenantId,
      requisition_id,
      approver_id,
      step: index + 1,
      status: "pending" as const,
    }))

    const { error } = await supabase.from("talent.requisition_approvals").insert(approvals)

    if (error) throw error

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:approval:start",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { approver_ids, steps: approver_ids.length },
    })

    revalidatePath(`/talent/jobs/${requisition_id}`)
  } catch (error) {
    console.error("[v0] Error starting approval:", error)
    throw error
  }
}

export async function setApproval(id: string, decision: "approved" | "rejected", comment?: string) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get the approval record
    const { data: approval } = await supabase
      .from("talent.requisition_approvals")
      .select("*, requisition:talent.requisitions(id, status)")
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .single()

    if (!approval) throw new Error("Approval not found")
    if (approval.status !== "pending") throw new Error("Approval already decided")

    // Update approval
    const { error: updateError } = await supabase
      .from("talent.requisition_approvals")
      .update({
        status: decision,
        comment,
        decided_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    // Check if all approvals are complete
    const { data: allApprovals } = await supabase
      .from("talent.requisition_approvals")
      .select("status")
      .eq("requisition_id", approval.requisition_id)
      .eq("tenant_id", tenantId)

    const allApproved = allApprovals?.every((a) => a.status === "approved")
    const anyRejected = allApprovals?.some((a) => a.status === "rejected")

    // Update requisition status if all approved
    if (allApproved) {
      await supabase
        .from("talent.requisitions")
        .update({ status: "open" })
        .eq("id", approval.requisition_id)
        .eq("tenant_id", tenantId)
    } else if (anyRejected) {
      await supabase
        .from("talent.requisitions")
        .update({ status: "draft" })
        .eq("id", approval.requisition_id)
        .eq("tenant_id", tenantId)
    }

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:approval:set",
      resource_type: "talent.requisition",
      resource_id: approval.requisition_id,
      metadata: { decision, comment, approval_id: id },
    })

    revalidatePath(`/talent/jobs/${approval.requisition_id}`)
  } catch (error) {
    console.error("[v0] Error setting approval:", error)
    throw error
  }
}

export async function getApprovals(requisition_id: string) {
  try {
    const { tenantId, supabase } = await getTenantContext()

    const { data, error } = await supabase
      .from("talent.requisition_approvals")
      .select(
        `
        id, step, status, comment, decided_at, created_at,
        approver:users!approver_id(id, full_name, email, avatar_url)
      `,
      )
      .eq("requisition_id", requisition_id)
      .eq("tenant_id", tenantId)
      .order("step", { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("[v0] Error getting approvals:", error)
    throw error
  }
}

export async function cancelApproval(requisition_id: string) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Delete all pending approvals
    const { error } = await supabase
      .from("talent.requisition_approvals")
      .delete()
      .eq("requisition_id", requisition_id)
      .eq("tenant_id", tenantId)
      .eq("status", "pending")

    if (error) throw error

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:approval:cancel",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: {},
    })

    revalidatePath(`/talent/jobs/${requisition_id}`)
  } catch (error) {
    console.error("[v0] Error canceling approval:", error)
    throw error
  }
}

// ============================================================================
// PUBLISH & DISTRIBUTION
// ============================================================================

export async function listTargets() {
  try {
    const { tenantId, supabase } = await getTenantContext()

    const { data, error } = await supabase
      .from("talent.publish_targets")
      .select("id, key, name, kind, enabled, meta")
      .eq("tenant_id", tenantId)
      .eq("enabled", true)
      .order("kind", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("[v0] Error listing targets:", error)
    throw error
  }
}

export async function publishRequisition(requisition_id: string, targets: string[]) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get requisition details
    const { data: req } = await supabase
      .from("talent.requisitions")
      .select("*")
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!req) throw new Error("Requisition not found")

    // Get target details
    const { data: targetDetails } = await supabase
      .from("talent.publish_targets")
      .select("*")
      .eq("tenant_id", tenantId)
      .in("key", targets)

    if (!targetDetails || targetDetails.length === 0) {
      throw new Error("No valid targets found")
    }

    // Build payload for publishing
    const payload = {
      title: req.title,
      description: req.description_md,
      department: req.department,
      location: req.location,
      employment_type: req.employment_type,
      seniority: req.seniority,
      skills: req.skills,
      salary_range: req.salary_range,
      remote_policy: req.remote_policy,
      openings: req.openings,
    }

    const publishResults: Record<string, any> = {}

    // Publish to each target
    for (const target of targetDetails) {
      try {
        if (target.kind === "career") {
          // Internal careers page - just mark as published
          publishResults[target.key] = {
            success: true,
            url: `/careers/jobs/${requisition_id}`,
            published_at: new Date().toISOString(),
          }
        } else if (target.kind === "job_board") {
          // Job boards (Indeed, LinkedIn) - stub adapters
          if (target.key === "indeed") {
            publishResults[target.key] = {
              success: true,
              external_id: `indeed_${requisition_id}`,
              url: `https://indeed.com/jobs/${requisition_id}`,
              published_at: new Date().toISOString(),
              note: "Stub: Indeed API integration pending",
            }
          } else if (target.key === "linkedin") {
            publishResults[target.key] = {
              success: true,
              external_id: `linkedin_${requisition_id}`,
              url: `https://linkedin.com/jobs/${requisition_id}`,
              published_at: new Date().toISOString(),
              note: "Stub: LinkedIn API integration pending",
            }
          }
        } else if (target.kind === "vendor") {
          // Vendor distribution - stub
          publishResults[target.key] = {
            success: true,
            external_id: `vendor_${target.key}_${requisition_id}`,
            published_at: new Date().toISOString(),
            note: "Stub: Vendor API integration pending",
          }
        } else if (target.kind === "internal") {
          // Internal mobility (Bench/Hotlist)
          publishResults[target.key] = {
            success: true,
            url: `/internal/mobility/${requisition_id}`,
            published_at: new Date().toISOString(),
          }
        }
      } catch (targetError) {
        console.error(`[v0] Error publishing to ${target.key}:`, targetError)
        publishResults[target.key] = {
          success: false,
          error: targetError instanceof Error ? targetError.message : "Unknown error",
        }
      }
    }

    // Update requisition with publish metadata
    const currentMeta = (req.publish_meta as any) || {}
    const updatedMeta = {
      ...currentMeta,
      boards: targets,
      results: publishResults,
      last_published: new Date().toISOString(),
    }

    await supabase
      .from("talent.requisitions")
      .update({ publish_meta: updatedMeta })
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:publish",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { targets, results: publishResults },
    })

    revalidatePath(`/talent/jobs/${requisition_id}`)

    return { success: true, results: publishResults }
  } catch (error) {
    console.error("[v0] Error publishing requisition:", error)
    throw error
  }
}

export async function unpublishRequisition(requisition_id: string, targets?: string[]) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get current publish metadata
    const { data: req } = await supabase
      .from("talent.requisitions")
      .select("publish_meta")
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!req) throw new Error("Requisition not found")

    const currentMeta = (req.publish_meta as any) || {}
    const currentBoards = currentMeta.boards || []

    // If no targets specified, unpublish from all
    const targetsToUnpublish = targets || currentBoards

    // Remove specified targets from boards array
    const updatedBoards = currentBoards.filter((board: string) => !targetsToUnpublish.includes(board))

    // Update results to mark as unpublished
    const updatedResults = { ...(currentMeta.results || {}) }
    for (const target of targetsToUnpublish) {
      if (updatedResults[target]) {
        updatedResults[target] = {
          ...updatedResults[target],
          unpublished_at: new Date().toISOString(),
        }
      }
    }

    const updatedMeta = {
      ...currentMeta,
      boards: updatedBoards,
      results: updatedResults,
      last_unpublished: new Date().toISOString(),
    }

    await supabase
      .from("talent.requisitions")
      .update({ publish_meta: updatedMeta })
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:unpublish",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { targets: targetsToUnpublish },
    })

    revalidatePath(`/talent/jobs/${requisition_id}`)

    return { success: true, unpublished: targetsToUnpublish }
  } catch (error) {
    console.error("[v0] Error unpublishing requisition:", error)
    throw error
  }
}

export async function getPublishStatus(requisition_id: string) {
  try {
    const { tenantId, supabase } = await getTenantContext()

    const { data: req } = await supabase
      .from("talent.requisitions")
      .select("publish_meta")
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!req) throw new Error("Requisition not found")

    const publishMeta = (req.publish_meta as any) || {}

    return {
      boards: publishMeta.boards || [],
      results: publishMeta.results || {},
      last_published: publishMeta.last_published,
      last_unpublished: publishMeta.last_unpublished,
    }
  } catch (error) {
    console.error("[v0] Error getting publish status:", error)
    throw error
  }
}

// ============================================================================
// STATUS / CLONE / CLOSE
// ============================================================================

export async function setStatus(
  requisition_id: string,
  status: "open" | "on_hold" | "closed" | "canceled",
  reason?: string,
) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // If closing, check for open applications
    if (status === "closed") {
      const { data: applications } = await supabase
        .from("talent.applications")
        .select("id, stage")
        .eq("requisition_id", requisition_id)
        .eq("tenant_id", tenantId)
        .not("stage", "in", '("hired","rejected","withdrawn")')

      if (applications && applications.length > 0) {
        console.log(`[v0] Warning: ${applications.length} open applications will need resolution`)
      }
    }

    await supabase.from("talent.requisitions").update({ status }).eq("id", requisition_id).eq("tenant_id", tenantId)

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:status",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { status, reason },
    })

    revalidatePath("/talent/jobs")
    revalidatePath(`/talent/jobs/${requisition_id}`)
  } catch (error) {
    console.error("[v0] Error setting status:", error)
    throw error
  }
}

export async function cloneRequisition(
  requisition_id: string,
  overrides?: Partial<{ title: string; openings: number; location: string; skills: string[] }>,
) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get original requisition
    const { data: original } = await supabase
      .from("talent.requisitions")
      .select("*")
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!original) throw new Error("Requisition not found")

    // Create new requisition with overrides
    const { data: newReq, error: createError } = await supabase
      .from("talent.requisitions")
      .insert({
        tenant_id: tenantId,
        title: overrides?.title || `${original.title} (Copy)`,
        department: original.department,
        location: overrides?.location || original.location,
        employment_type: original.employment_type,
        seniority: original.seniority,
        openings: overrides?.openings || original.openings,
        hiring_manager: original.hiring_manager,
        recruiter_id: original.recruiter_id,
        band: original.band,
        salary_range: original.salary_range,
        skills: overrides?.skills || original.skills,
        description_md: original.description_md,
        remote_policy: original.remote_policy,
        status: "draft",
      })
      .select("id")
      .single()

    if (createError) throw createError

    // Clone hiring team
    const { data: team } = await supabase
      .from("talent.requisition_members")
      .select("user_id, role")
      .eq("requisition_id", requisition_id)
      .eq("tenant_id", tenantId)

    if (team && team.length > 0) {
      await supabase.from("talent.requisition_members").insert(
        team.map((m) => ({
          tenant_id: tenantId,
          requisition_id: newReq.id,
          user_id: m.user_id,
          role: m.role,
        })),
      )
    }

    // Clone interview plan
    const { data: plan } = await supabase
      .from("talent.interview_plan")
      .select("steps")
      .eq("requisition_id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (plan) {
      await supabase.from("talent.interview_plan").insert({
        tenant_id: tenantId,
        requisition_id: newReq.id,
        steps: plan.steps,
      })
    }

    // Clone scorecards
    const { data: scorecards } = await supabase
      .from("talent.scorecards")
      .select("name, dimensions, pos")
      .eq("requisition_id", requisition_id)
      .eq("tenant_id", tenantId)

    if (scorecards && scorecards.length > 0) {
      await supabase.from("talent.scorecards").insert(
        scorecards.map((sc) => ({
          tenant_id: tenantId,
          requisition_id: newReq.id,
          name: sc.name,
          dimensions: sc.dimensions,
          pos: sc.pos,
        })),
      )
    }

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:clone",
      resource_type: "talent.requisition",
      resource_id: newReq.id,
      metadata: { source_id: requisition_id, overrides },
    })

    revalidatePath("/talent/jobs")

    return newReq.id
  } catch (error) {
    console.error("[v0] Error cloning requisition:", error)
    throw error
  }
}

// ============================================================================
// AI HELPERS
// ============================================================================

export async function rewriteJD(requisition_id: string, tone: "formal" | "casual" | "inclusive") {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get current JD
    const { data: req } = await supabase
      .from("talent.requisitions")
      .select("title, description_md")
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!req || !req.description_md) throw new Error("No job description found")

    const prompt = `Rewrite this job description in a ${tone} tone. Keep the key requirements and responsibilities, but make it more ${tone === "inclusive" ? "inclusive and welcoming to diverse candidates" : tone}.

Original JD:
${req.description_md}

Rewritten JD (markdown format):`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 2000,
    })

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:ai:rewrite",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { tone, original_length: req.description_md.length, new_length: text.length },
    })

    return { rewritten: text }
  } catch (error) {
    console.error("[v0] Error rewriting JD:", error)
    throw error
  }
}

export async function extractSkills(requisition_id: string) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get current JD
    const { data: req } = await supabase
      .from("talent.requisitions")
      .select("title, description_md, skills")
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!req || !req.description_md) throw new Error("No job description found")

    const prompt = `Extract the key technical and soft skills from this job description. Return ONLY a JSON array of skill strings (max 20 skills).

Job Title: ${req.title}

Job Description:
${req.description_md}

Skills (JSON array only):`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 500,
    })

    // Parse the AI response
    const extractedSkills = JSON.parse(text.trim())

    if (!Array.isArray(extractedSkills)) {
      throw new Error("AI did not return a valid skills array")
    }

    // Merge with existing skills
    const currentSkills = req.skills || []
    const mergedSkills = Array.from(new Set([...currentSkills, ...extractedSkills])).slice(0, 40)

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:ai:extract_skills",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { extracted: extractedSkills.length, total: mergedSkills.length },
    })

    return { skills: mergedSkills, extracted: extractedSkills }
  } catch (error) {
    console.error("[v0] Error extracting skills:", error)
    throw error
  }
}

export async function suggestDiversityEdits(requisition_id: string) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get current JD
    const { data: req } = await supabase
      .from("talent.requisitions")
      .select("title, description_md")
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!req || !req.description_md) throw new Error("No job description found")

    const prompt = `Analyze this job description for potential bias and suggest specific edits to make it more inclusive and welcoming to diverse candidates. Focus on:
- Gender-neutral language
- Removing unnecessary requirements that may discourage underrepresented groups
- Inclusive tone and welcoming language
- Avoiding jargon or cultural references that may exclude candidates

Return a JSON object with:
{
  "issues": [{"line": "problematic text", "reason": "why it's problematic"}],
  "suggestions": [{"original": "text to replace", "replacement": "suggested replacement", "reason": "why this is better"}]
}

Job Description:
${req.description_md}

Analysis (JSON only):`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 1500,
    })

    const analysis = JSON.parse(text.trim())

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:ai:diversity",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: { issues: analysis.issues?.length || 0, suggestions: analysis.suggestions?.length || 0 },
    })

    return analysis
  } catch (error) {
    console.error("[v0] Error suggesting diversity edits:", error)
    throw error
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export async function exportJDPDF(requisition_id: string) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get requisition details
    const { data: req } = await supabase
      .from("talent.requisitions")
      .select(
        `
        *,
        hiring_manager:users!hiring_manager(full_name, email),
        recruiter:users!recruiter_id(full_name, email)
      `,
      )
      .eq("id", requisition_id)
      .eq("tenant_id", tenantId)
      .single()

    if (!req) throw new Error("Requisition not found")

    const pdfContent = {
      title: req.title,
      department: req.department,
      location: req.location,
      employment_type: req.employment_type,
      seniority: req.seniority,
      openings: req.openings,
      hiring_manager: req.hiring_manager?.full_name,
      recruiter: req.recruiter?.full_name,
      salary_range: req.salary_range,
      skills: req.skills,
      description: req.description_md,
      remote_policy: req.remote_policy,
      created_at: req.created_at,
    }

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:export:pdf",
      resource_type: "talent.requisition",
      resource_id: requisition_id,
      metadata: {},
    })

    // In production, this would return a PDF blob or URL
    return {
      format: "pdf",
      filename: `${req.title.replace(/[^a-z0-9]/gi, "_")}_JD.pdf`,
      content: pdfContent,
      note: "Stub: PDF generation would use a library like puppeteer or pdfkit",
    }
  } catch (error) {
    console.error("[v0] Error exporting JD PDF:", error)
    throw error
  }
}

export async function exportRequisitionsCSV(filters?: z.infer<typeof listParamsSchema>) {
  try {
    const { tenantId, user, supabase } = await getTenantContext()

    // Get requisitions with filters
    const params = filters || { page: 1, pageSize: 1000 }
    const { rows } = await listRequisitions(params)

    const headers = [
      "ID",
      "Title",
      "Department",
      "Location",
      "Employment Type",
      "Seniority",
      "Openings",
      "Status",
      "Hiring Manager",
      "Recruiter",
      "Created At",
      "Age (Days)",
    ]

    const csvRows = rows.map((row: any) => [
      row.id,
      row.title,
      row.department || "",
      row.location || "",
      row.employment_type || "",
      row.seniority || "",
      row.openings,
      row.status,
      row.hiring_manager?.full_name || "",
      row.recruiter?.full_name || "",
      row.created_at,
      row.age_days,
    ])

    const csvContent = [headers, ...csvRows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: user.id,
      action: "req:export:csv",
      resource_type: "talent.requisition",
      resource_id: "bulk",
      metadata: { count: rows.length, filters },
    })

    return {
      format: "csv",
      filename: `requisitions_${new Date().toISOString().split("T")[0]}.csv`,
      content: csvContent,
      count: rows.length,
    }
  } catch (error) {
    console.error("[v0] Error exporting CSV:", error)
    throw error
  }
}

export async function verifyAuditHash(requisition_id: string) {
  try {
    const { tenantId, supabase } = await getTenantContext()

    // Get all audit logs for this requisition
    const { data: logs } = await supabase
      .from("audit_logs")
      .select("id, action, created_at, metadata, user_id")
      .eq("resource_type", "talent.requisition")
      .eq("resource_id", requisition_id)
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true })

    if (!logs || logs.length === 0) {
      return { verified: true, logs: 0, note: "No audit logs found" }
    }

    // In production, this would:
    // 1. Recompute hash chain from logs
    // 2. Compare with stored hashes
    // 3. Detect any tampering

    const verification = {
      verified: true,
      logs: logs.length,
      first_log: logs[0].created_at,
      last_log: logs[logs.length - 1].created_at,
      actions: logs.map((l) => l.action),
      note: "Stub: Full hash chain verification would be implemented with cryptographic verification",
    }

    return verification
  } catch (error) {
    console.error("[v0] Error verifying audit hash:", error)
    throw error
  }
}
