"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { hasFeature } from "@/lib/fbac"
import { appendAudit } from "@/lib/hash"
import { notarizeHash, computeFileHash } from "@/lib/ledger/notarize"
import { generateCsv } from "@/lib/export/csv"

// =====================================================
// Validation Schemas
// =====================================================

const cycleSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  period_from: z.string(),
  period_to: z.string(),
  kind: z.enum(["ANNUAL", "MIDYEAR", "QUARTERLY", "PROBATION"]),
  rating_scale: z.object({
    min: z.number(),
    max: z.number(),
    labels: z.record(z.string()),
  }),
  competencies: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      description: z.string().optional(),
    }),
  ),
  weights: z.object({
    goals: z.number().min(0).max(100),
    competencies: z.number().min(0).max(100),
  }),
  due_dates: z.object({
    self: z.string().optional(),
    mgr: z.string().optional(),
    peer: z.string().optional(),
    signoff: z.string().optional(),
  }),
  visibility: z.object({
    self_sees_mgr: z.boolean(),
    mgr_sees_peer: z.boolean(),
  }),
})

const goalSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  category: z.string().optional(),
  alignment_id: z.string().uuid().optional().nullable(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "AT_RISK", "BLOCKED", "DONE", "CANCELLED"]),
  weight: z.number().min(0).max(100),
  progress: z.number().min(0).max(100),
  visibility: z.enum(["PRIVATE", "MANAGER", "ORG", "TENANT"]),
})

// =====================================================
// Cycle Actions
// =====================================================

export async function listCycles(input?: { status?: string }) {
  const supabase = await createServerClient()

  let query = supabase.from("perf_cycles").select("*").order("period_from", { ascending: false })

  if (input?.status) {
    query = query.eq("status", input.status)
  }

  const { data, error } = await query

  if (error) throw new Error("Failed to list cycles")

  return { success: true, data }
}

export async function getCycle(input: { id: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("perf_cycles").select("*").eq("id", input.id).single()

  if (error) throw new Error("Failed to get cycle")

  return { success: true, data }
}

export async function saveCycle(input: { id?: string; payload: z.infer<typeof cycleSchema> }) {
  const supabase = await createServerClient()

  // Validate
  const validated = cycleSchema.parse(input.payload)

  // Check permission
  const hasWrite = await hasFeature("hrms.performance.admin")
  if (!hasWrite) throw new Error("Permission denied")

  // Get tenant
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()
  if (!member) throw new Error("No tenant membership")

  if (input.id) {
    // Update
    const { data, error } = await supabase.from("perf_cycles").update(validated).eq("id", input.id).select().single()

    if (error) throw new Error("Failed to update cycle")

    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "perf:cycle_updated",
      entity: "perf.cycles",
      entityId: input.id,
      diff: validated,
    })

    return { success: true, data }
  } else {
    // Create
    const { data, error } = await supabase
      .from("perf_cycles")
      .insert({
        ...validated,
        tenant_id: member.tenant_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw new Error("Failed to create cycle")

    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "perf:cycle_created",
      entity: "perf.cycles",
      entityId: data.id,
      diff: validated,
    })

    return { success: true, data }
  }
}

export async function publishCycle(input: { id: string }) {
  const supabase = await createServerClient()

  const hasWrite = await hasFeature("hrms.performance.admin")
  if (!hasWrite) throw new Error("Permission denied")

  const { data, error } = await supabase
    .from("perf_cycles")
    .update({ status: "PUBLISHED" })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to publish cycle")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:cycle_published",
    entity: "perf.cycles",
    entityId: input.id,
  })

  return { success: true, data }
}

export async function lockCycle(input: { id: string }) {
  const supabase = await createServerClient()

  const hasWrite = await hasFeature("hrms.performance.admin")
  if (!hasWrite) throw new Error("Permission denied")

  const { data, error } = await supabase
    .from("perf_cycles")
    .update({ status: "LOCKED" })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to lock cycle")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:cycle_locked",
    entity: "perf.cycles",
    entityId: input.id,
  })

  return { success: true, data }
}

export async function finalizeCycle(input: { id: string }) {
  const supabase = await createServerClient()

  const hasWrite = await hasFeature("hrms.performance.admin")
  if (!hasWrite) throw new Error("Permission denied")

  const { data, error } = await supabase
    .from("perf_cycles")
    .update({ status: "FINALIZED" })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to finalize cycle")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:cycle_finalized",
    entity: "perf.cycles",
    entityId: input.id,
  })

  return { success: true, data }
}

// =====================================================
// Review Actions
// =====================================================

export async function inboxReviews(input: { scope: "SELF" | "TEAM" | "ALL"; cycleId?: string; filters?: any }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get employee ID
  const { data: employee } = await supabase.from("hrms_employees").select("id").eq("user_id", user.id).single()

  let query = supabase
    .from("perf_reviews")
    .select(
      `
      *,
      employee:hrms_employees!employee_id(id, employee_no, first_name, last_name),
      manager:hrms_employees!manager_id(id, employee_no, first_name, last_name),
      cycle:perf_cycles(id, key, name, due_dates)
    `,
    )
    .order("created_at", { ascending: false })

  if (input.cycleId) {
    query = query.eq("cycle_id", input.cycleId)
  }

  if (input.scope === "SELF" && employee) {
    query = query.eq("employee_id", employee.id)
  } else if (input.scope === "TEAM" && employee) {
    query = query.eq("manager_id", employee.id)
  }
  // ALL scope returns all reviews (HR/Admin)

  const { data, error } = await query

  if (error) throw new Error("Failed to fetch reviews")

  return { success: true, data }
}

export async function getReview(input: { id: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_reviews")
    .select(
      `
      *,
      employee:hrms_employees!employee_id(id, employee_no, first_name, last_name, email),
      manager:hrms_employees!manager_id(id, employee_no, first_name, last_name, email),
      cycle:perf_cycles(id, key, name, rating_scale, competencies, weights, visibility)
    `,
    )
    .eq("id", input.id)
    .single()

  if (error) throw new Error("Failed to get review")

  return { success: true, data }
}

export async function saveSelf(input: { id: string; payload: any }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_reviews")
    .update({
      self_rating: input.payload,
      status: "SELF_DRAFT",
    })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to save self review")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:self_saved",
    entity: "perf.reviews",
    entityId: input.id,
    diff: input.payload,
  })

  return { success: true, data }
}

export async function submitSelf(input: { id: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_reviews")
    .update({
      status: "SELF_SUBMITTED",
      self_submitted_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to submit self review")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:self_submitted",
    entity: "perf.reviews",
    entityId: input.id,
  })

  return { success: true, data }
}

export async function saveManager(input: { id: string; payload: any }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_reviews")
    .update({
      mgr_rating: input.payload,
      status: "MGR_DRAFT",
    })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to save manager review")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:mgr_saved",
    entity: "perf.reviews",
    entityId: input.id,
    diff: input.payload,
  })

  return { success: true, data }
}

export async function submitManager(input: { id: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_reviews")
    .update({
      status: "MGR_SUBMITTED",
      mgr_submitted_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to submit manager review")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:mgr_submitted",
    entity: "perf.reviews",
    entityId: input.id,
  })

  return { success: true, data }
}

// =====================================================
// Goal Actions
// =====================================================

export async function listGoals(input?: { employeeId?: string; cycleId?: string; filters?: any }) {
  const supabase = await createServerClient()

  let query = supabase
    .from("perf_goals")
    .select(
      `
      *,
      employee:hrms_employees(id, employee_no, first_name, last_name),
      parent:perf_goals!alignment_id(id, title)
    `,
    )
    .order("created_at", { ascending: false })

  if (input?.employeeId) {
    query = query.eq("employee_id", input.employeeId)
  }
  if (input?.cycleId) {
    query = query.eq("cycle_id", input.cycleId)
  }

  const { data, error } = await query

  if (error) throw new Error("Failed to list goals")

  return { success: true, data }
}

export async function saveGoal(input: {
  id?: string
  employeeId: string
  cycleId?: string
  payload: z.infer<typeof goalSchema>
}) {
  const supabase = await createServerClient()

  const validated = goalSchema.parse(input.payload)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()
  if (!member) throw new Error("No tenant membership")

  if (input.id) {
    // Update
    const { data, error } = await supabase.from("perf_goals").update(validated).eq("id", input.id).select().single()

    if (error) throw new Error("Failed to update goal")

    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "perf:goal_updated",
      entity: "perf.goals",
      entityId: input.id,
      diff: validated,
    })

    return { success: true, data }
  } else {
    // Create
    const { data, error } = await supabase
      .from("perf_goals")
      .insert({
        ...validated,
        tenant_id: member.tenant_id,
        employee_id: input.employeeId,
        cycle_id: input.cycleId ?? null,
      })
      .select()
      .single()

    if (error) throw new Error("Failed to create goal")

    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "perf:goal_created",
      entity: "perf.goals",
      entityId: data.id,
      diff: validated,
    })

    return { success: true, data }
  }
}

export async function updateProgress(input: { id: string; progress: number }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_goals")
    .update({ progress: input.progress })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to update progress")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:goal_progress",
    entity: "perf.goals",
    entityId: input.id,
    diff: { progress: input.progress },
  })

  return { success: true, data }
}

export async function archiveGoal(input: { id: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_goals")
    .update({ status: "CANCELLED" })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to archive goal")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:goal_archived",
    entity: "perf.goals",
    entityId: input.id,
  })

  return { success: true, data }
}

// =====================================================
// Feedback Actions
// =====================================================

export async function requestFeedback(input: {
  subjectEmployeeId: string
  reviewId?: string
  relationship: "PEER" | "DIRECT_REPORT" | "OTHER"
  formKey: string
  dueAt: string
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: employee } = await supabase.from("hrms_employees").select("id").eq("user_id", user.id).single()
  if (!employee) throw new Error("Employee not found")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()
  if (!member) throw new Error("No tenant membership")

  // Get form template
  const { data: template } = await supabase
    .from("perf_templates")
    .select("schema")
    .eq("kind", "FEEDBACK")
    .eq("key", input.formKey)
    .single()

  const { data, error } = await supabase
    .from("perf_feedback")
    .insert({
      tenant_id: member.tenant_id,
      requester_id: employee.id,
      subject_employee_id: input.subjectEmployeeId,
      review_id: input.reviewId ?? null,
      relationship: input.relationship,
      form: template?.schema ?? {},
      due_at: input.dueAt,
    })
    .select()
    .single()

  if (error) throw new Error("Failed to request feedback")

  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "perf:feedback_requested",
    entity: "perf.feedback",
    entityId: data.id,
  })

  return { success: true, data }
}

export async function submitFeedback(input: { id: string; response: any }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_feedback")
    .update({
      response: input.response,
      status: "RECEIVED",
      received_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to submit feedback")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:feedback_submitted",
    entity: "perf.feedback",
    entityId: input.id,
  })

  return { success: true, data }
}

export async function declineFeedback(input: { id: string; reason?: string }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("perf_feedback")
    .update({
      status: "DECLINED",
    })
    .eq("id", input.id)
    .select()
    .single()

  if (error) throw new Error("Failed to decline feedback")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:feedback_declined",
    entity: "perf.feedback",
    entityId: input.id,
    diff: { reason: input.reason },
  })

  return { success: true, data }
}

// =====================================================
// Calibration Actions
// =====================================================

export async function createPool(input: { cycleId: string; key: string; name: string; orgNodeId?: string }) {
  const supabase = await createServerClient()

  const hasCalibrate = await hasFeature("hrms.calibration.run")
  if (!hasCalibrate) throw new Error("Permission denied")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: employee } = await supabase.from("hrms_employees").select("id").eq("user_id", user.id).single()

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()
  if (!member) throw new Error("No tenant membership")

  const { data, error } = await supabase
    .from("perf_calibration_pools")
    .insert({
      tenant_id: member.tenant_id,
      cycle_id: input.cycleId,
      key: input.key,
      name: input.name,
      org_node_id: input.orgNodeId ?? null,
      owner_id: employee?.id ?? null,
    })
    .select()
    .single()

  if (error) throw new Error("Failed to create pool")

  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "perf:pool_created",
    entity: "perf.calibration_pools",
    entityId: data.id,
  })

  return { success: true, data }
}

export async function addToPool(input: { poolId: string; reviewId: string }) {
  const supabase = await createServerClient()

  const hasCalibrate = await hasFeature("hrms.calibration.run")
  if (!hasCalibrate) throw new Error("Permission denied")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()
  if (!member) throw new Error("No tenant membership")

  // Get review employee
  const { data: review } = await supabase.from("perf_reviews").select("employee_id").eq("id", input.reviewId).single()
  if (!review) throw new Error("Review not found")

  const { data, error } = await supabase
    .from("perf_calibration_items")
    .insert({
      tenant_id: member.tenant_id,
      pool_id: input.poolId,
      review_id: input.reviewId,
      employee_id: review.employee_id,
    })
    .select()
    .single()

  if (error) throw new Error("Failed to add to pool")

  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "perf:item_added_to_pool",
    entity: "perf.calibration_items",
    entityId: data.id,
  })

  return { success: true, data }
}

export async function moveInNineBox(input: { itemId: string; performance: number; potential: number }) {
  const supabase = await createServerClient()

  const hasCalibrate = await hasFeature("hrms.calibration.run")
  if (!hasCalibrate) throw new Error("Permission denied")

  const { data, error } = await supabase
    .from("perf_calibration_items")
    .update({
      performance: input.performance,
      potential: input.potential,
      coordinates: { x: input.performance, y: input.potential },
    })
    .eq("id", input.itemId)
    .select()
    .single()

  if (error) throw new Error("Failed to move item")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:item_moved",
    entity: "perf.calibration_items",
    entityId: input.itemId,
    diff: { performance: input.performance, potential: input.potential },
  })

  return { success: true, data }
}

export async function writebackCalibration(input: { poolId: string }) {
  const supabase = await createServerClient()

  const hasCalibrate = await hasFeature("hrms.calibration.run")
  if (!hasCalibrate) throw new Error("Permission denied")

  // Get all items in pool
  const { data: items } = await supabase
    .from("perf_calibration_items")
    .select("review_id, performance, potential")
    .eq("pool_id", input.poolId)

  if (!items) throw new Error("No items found")

  // Update reviews with final ratings
  for (const item of items) {
    await supabase
      .from("perf_reviews")
      .update({
        final_rating: {
          performance: item.performance,
          potential: item.potential,
        },
        status: "CALIBRATED",
        calibrated_at: new Date().toISOString(),
      })
      .eq("id", item.review_id)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:calibration_writeback",
    entity: "perf.calibration_pools",
    entityId: input.poolId,
  })

  return { success: true }
}

// =====================================================
// Signoff Actions
// =====================================================

export async function signoff(input: { reviewId: string; statement?: string }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: employee } = await supabase.from("hrms_employees").select("id").eq("user_id", user.id).single()
  if (!employee) throw new Error("Employee not found")

  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()
  if (!member) throw new Error("No tenant membership")

  // Create signoff
  const { data: signoffData, error: signoffError } = await supabase
    .from("perf_signoffs")
    .insert({
      tenant_id: member.tenant_id,
      review_id: input.reviewId,
      signer_id: employee.id,
      statement: input.statement ?? null,
    })
    .select()
    .single()

  if (signoffError) throw new Error("Failed to create signoff")

  // Update review status
  const { data: reviewData, error: reviewError } = await supabase
    .from("perf_reviews")
    .update({
      status: "SIGNED_OFF",
      signed_off_at: new Date().toISOString(),
    })
    .eq("id", input.reviewId)
    .select()
    .single()

  if (reviewError) throw new Error("Failed to update review")

  await appendAudit({
    tenantId: member.tenant_id,
    actorUserId: user.id,
    action: "perf:signoff",
    entity: "perf.signoffs",
    entityId: signoffData.id,
  })

  return { success: true, data: reviewData }
}

// =====================================================
// Export Actions
// =====================================================

export async function exportPerfCsv(input: { scope: "REVIEWS" | "GOALS"; cycleId?: string; filters?: any }) {
  const supabase = await createServerClient()

  const hasExport = await hasFeature("exports.allowed")
  if (!hasExport) throw new Error("Permission denied")

  if (input.scope === "REVIEWS") {
    let query = supabase.from("perf_reviews").select(
      `
        id,
        status,
        employee:hrms_employees!employee_id(employee_no, first_name, last_name),
        manager:hrms_employees!manager_id(employee_no, first_name, last_name),
        self_rating,
        mgr_rating,
        final_rating
      `,
    )

    if (input.cycleId) {
      query = query.eq("cycle_id", input.cycleId)
    }

    const { data } = await query

    const csv = await generateCsv(
      data?.map((r: any) => ({
        employee_no: r.employee?.employee_no,
        employee_name: `${r.employee?.first_name} ${r.employee?.last_name}`,
        manager_name: `${r.manager?.first_name} ${r.manager?.last_name}`,
        status: r.status,
        self_overall: r.self_rating?.overall,
        mgr_overall: r.mgr_rating?.overall,
        final_performance: r.final_rating?.performance,
        final_potential: r.final_rating?.potential,
      })) ?? [],
      [
        "employee_no",
        "employee_name",
        "manager_name",
        "status",
        "self_overall",
        "mgr_overall",
        "final_performance",
        "final_potential",
      ],
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

    await appendAudit({
      tenantId: member?.tenant_id ?? null,
      actorUserId: user?.id,
      action: "export:performance_reviews",
    })

    return { success: true, csv }
  } else {
    // GOALS
    let query = supabase.from("perf_goals").select(
      `
        id,
        title,
        status,
        progress,
        weight,
        employee:hrms_employees(employee_no, first_name, last_name)
      `,
    )

    if (input.cycleId) {
      query = query.eq("cycle_id", input.cycleId)
    }

    const { data } = await query

    const csv = await generateCsv(
      data?.map((g: any) => ({
        employee_no: g.employee?.employee_no,
        employee_name: `${g.employee?.first_name} ${g.employee?.last_name}`,
        title: g.title,
        status: g.status,
        progress: g.progress,
        weight: g.weight,
      })) ?? [],
      ["employee_no", "employee_name", "title", "status", "progress", "weight"],
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

    await appendAudit({
      tenantId: member?.tenant_id ?? null,
      actorUserId: user?.id,
      action: "export:performance_goals",
    })

    return { success: true, csv }
  }
}

// =====================================================
// Notarization Actions
// =====================================================

export async function notarizeReview(input: { reviewId: string }) {
  const supabase = await createServerClient()

  const hasNotarize = await hasFeature("ledger.notarize")
  if (!hasNotarize) throw new Error("Permission denied")

  // Get review
  const { data: review } = await supabase.from("perf_reviews").select("*").eq("id", input.reviewId).single()

  if (!review) throw new Error("Review not found")

  // Compute hash
  const reviewJson = JSON.stringify(review)
  const hash = await computeFileHash(Buffer.from(reviewJson))

  // Notarize
  await notarizeHash(hash, "perf.reviews", input.reviewId)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user?.id).single()

  await appendAudit({
    tenantId: member?.tenant_id ?? null,
    actorUserId: user?.id,
    action: "perf:review_notarized",
    entity: "perf.reviews",
    entityId: input.reviewId,
  })

  return { success: true, hash }
}
