"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeatures, maskFields, maskFieldsArray } from "@/lib/fbac"
import { revalidatePath } from "next/cache"

// ============================================================================
// SCHEMAS
// ============================================================================

const assignmentFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  status: z.enum(["active", "planned", "ended"]).optional(),
  search: z.string().optional(),
  employeeId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  billable: z.boolean().optional(),
  rateType: z.enum(["hourly", "daily", "monthly", "fixed"]).optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
})

const createAssignmentSchema = z.object({
  employeeId: z.string().uuid(),
  clientId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  roleTitle: z.string().min(1),
  managerId: z.string().uuid().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  allocationPercent: z.number().min(1).max(100),
  schedule: z.record(z.any()).optional(),
  rateType: z.enum(["hourly", "daily", "monthly", "fixed"]),
  rateValue: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  billable: z.boolean().default(false),
  timesheetPolicy: z.record(z.any()).optional(),
  costCenter: z.string().optional(),
  billingCode: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
})

const updateAssignmentSchema = createAssignmentSchema.partial().extend({
  id: z.string().uuid(),
})

const changeRateSchema = z.object({
  id: z.string().uuid(),
  effectiveDate: z.string(),
  rateType: z.enum(["hourly", "daily", "monthly", "fixed"]),
  value: z.number().positive(),
  currency: z.string().length(3),
  overtimeRule: z.record(z.any()).optional(),
  reason: z.string().optional(),
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function getAssignments(input: z.infer<typeof assignmentFiltersSchema>) {
  const supabase = await createServerClient()
  const validated = assignmentFiltersSchema.parse(input)

  // Check permissions
  const features = await hasFeatures(["hrms.assignments.read", "hrms.rates.read"])
  if (!features["hrms.assignments.read"]) {
    return { success: false, error: "Permission denied" }
  }

  // Build query
  let query = supabase
    .from("assignments")
    .select(
      `
      *,
      employee:employees!employee_id(id, first_name, last_name, email, status),
      manager:employees!manager_id(id, first_name, last_name)
    `,
      { count: "exact" },
    )
    .eq("tenant_id", (await supabase.auth.getUser()).data.user?.id)

  // Apply filters
  if (validated.status) query = query.eq("status", validated.status)
  if (validated.employeeId) query = query.eq("employee_id", validated.employeeId)
  if (validated.clientId) query = query.eq("client_id", validated.clientId)
  if (validated.projectId) query = query.eq("project_id", validated.projectId)
  if (validated.managerId) query = query.eq("manager_id", validated.managerId)
  if (validated.billable !== undefined) query = query.eq("billable", validated.billable)
  if (validated.rateType) query = query.eq("rate_type", validated.rateType)
  if (validated.startDateFrom) query = query.gte("start_date", validated.startDateFrom)
  if (validated.startDateTo) query = query.lte("start_date", validated.startDateTo)

  // Search
  if (validated.search) {
    query = query.or(`role_title.ilike.%${validated.search}%,notes.ilike.%${validated.search}%`)
  }

  // Pagination
  const from = (validated.page - 1) * validated.pageSize
  const to = from + validated.pageSize - 1
  query = query.range(from, to).order("start_date", { ascending: false })

  const { data, error, count } = await query

  if (error) {
    console.error("[v0] getAssignments error:", error)
    return { success: false, error: error.message }
  }

  // Mask rate fields based on FBAC
  const fieldMap = {
    rate: "hrms.rates.read",
    rate_type: "hrms.rates.read",
    currency: "hrms.rates.read",
  }
  const masked = maskFieldsArray(data || [], features, fieldMap)

  return {
    success: true,
    data: masked,
    pagination: {
      page: validated.page,
      pageSize: validated.pageSize,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / validated.pageSize),
    },
  }
}

export async function getAssignment(id: string) {
  const supabase = await createServerClient()

  // Check permissions
  const features = await hasFeatures(["hrms.assignments.read", "hrms.rates.read"])
  if (!features["hrms.assignments.read"]) {
    return { success: false, error: "Permission denied" }
  }

  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
      *,
      employee:employees!employee_id(*),
      manager:employees!manager_id(id, first_name, last_name),
      rates:assignment_rates(*),
      docs:assignment_docs(*)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] getAssignment error:", error)
    return { success: false, error: error.message }
  }

  // Mask rate fields
  const fieldMap = {
    rate: "hrms.rates.read",
    rate_type: "hrms.rates.read",
    currency: "hrms.rates.read",
  }
  const masked = maskFields(data, features, fieldMap)

  return { success: true, data: masked }
}

export async function createAssignment(input: z.infer<typeof createAssignmentSchema>) {
  const supabase = await createServerClient()
  const validated = createAssignmentSchema.parse(input)

  // Check permissions
  const features = await hasFeatures(["hrms.assignments.write", "hrms.rates.write"])
  if (!features["hrms.assignments.write"]) {
    return { success: false, error: "Permission denied" }
  }

  // Get tenant ID
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Check for overlaps
  const { data: overlaps } = await supabase.rpc("fn_detect_overlap", {
    p_tenant_id: user.id,
    p_employee_id: validated.employeeId,
    p_start_date: validated.startDate,
    p_end_date: validated.endDate || null,
  })

  if (overlaps) {
    return { success: false, error: "Assignment overlaps with existing assignment" }
  }

  // Create assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .insert({
      tenant_id: user.id,
      employee_id: validated.employeeId,
      client_id: validated.clientId,
      project_id: validated.projectId,
      role_title: validated.roleTitle,
      manager_id: validated.managerId,
      start_date: validated.startDate,
      end_date: validated.endDate,
      allocation_percent: validated.allocationPercent,
      schedule: validated.schedule || {},
      rate: { value: validated.rateValue, type: validated.rateType },
      rate_type: validated.rateType,
      currency: validated.currency,
      billable: validated.billable,
      timesheet_policy: validated.timesheetPolicy || {},
      cost_center: validated.costCenter,
      billing_code: validated.billingCode,
      location: validated.location,
      notes: validated.notes,
      status: "active",
    })
    .select()
    .single()

  if (assignmentError) {
    console.error("[v0] createAssignment error:", assignmentError)
    return { success: false, error: assignmentError.message }
  }

  // Create initial rate history
  if (features["hrms.rates.write"]) {
    await supabase.from("assignment_rates").insert({
      tenant_id: user.id,
      assignment_id: assignment.id,
      effective_date: validated.startDate,
      rate_type: validated.rateType,
      value: validated.rateValue,
      currency: validated.currency,
      created_by: user.id,
    })
  }

  // Audit log
  await appendAudit({
    tenantId: user.id,
    actorUserId: user.id,
    action: "assignment:create",
    entity: "assignment",
    entityId: assignment.id,
    diff: validated,
  })

  revalidatePath("/hrms/assignments")
  return { success: true, data: assignment }
}

export async function updateAssignment(input: z.infer<typeof updateAssignmentSchema>) {
  const supabase = await createServerClient()
  const validated = updateAssignmentSchema.parse(input)

  // Check permissions
  const features = await hasFeatures(["hrms.assignments.write"])
  if (!features["hrms.assignments.write"]) {
    return { success: false, error: "Permission denied" }
  }

  const { id, ...updates } = validated

  const { data, error } = await supabase.from("assignments").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] updateAssignment error:", error)
    return { success: false, error: error.message }
  }

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await appendAudit({
    tenantId: user?.id || null,
    actorUserId: user?.id,
    action: "assignment:update",
    entity: "assignment",
    entityId: id,
    diff: updates,
  })

  revalidatePath("/hrms/assignments")
  return { success: true, data }
}

export async function changeRate(input: z.infer<typeof changeRateSchema>) {
  const supabase = await createServerClient()
  const validated = changeRateSchema.parse(input)

  // Check permissions
  const features = await hasFeatures(["hrms.rates.write"])
  if (!features["hrms.rates.write"]) {
    return { success: false, error: "Permission denied" }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Insert new rate history
  const { data, error } = await supabase
    .from("assignment_rates")
    .insert({
      tenant_id: user.id,
      assignment_id: validated.id,
      effective_date: validated.effectiveDate,
      rate_type: validated.rateType,
      value: validated.value,
      currency: validated.currency,
      overtime_rule: validated.overtimeRule || {},
      notes: validated.reason,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] changeRate error:", error)
    return { success: false, error: error.message }
  }

  // Update assignment current rate
  await supabase
    .from("assignments")
    .update({
      rate: { value: validated.value, type: validated.rateType },
      rate_type: validated.rateType,
      currency: validated.currency,
    })
    .eq("id", validated.id)

  // Audit log
  await appendAudit({
    tenantId: user.id,
    actorUserId: user.id,
    action: "assignment:change_rate",
    entity: "assignment",
    entityId: validated.id,
    diff: validated,
  })

  revalidatePath("/hrms/assignments")
  return { success: true, data }
}

export async function endAssignment(id: string, endDate: string, reason?: string) {
  const supabase = await createServerClient()

  // Check permissions
  const features = await hasFeatures(["hrms.assignments.write"])
  if (!features["hrms.assignments.write"]) {
    return { success: false, error: "Permission denied" }
  }

  const { data, error } = await supabase
    .from("assignments")
    .update({
      end_date: endDate,
      status: "ended",
      notes: reason,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] endAssignment error:", error)
    return { success: false, error: error.message }
  }

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await appendAudit({
    tenantId: user?.id || null,
    actorUserId: user?.id,
    action: "assignment:end",
    entity: "assignment",
    entityId: id,
    diff: { endDate, reason },
  })

  revalidatePath("/hrms/assignments")
  return { success: true, data }
}

export async function exportAssignmentsCsv(filters: z.infer<typeof assignmentFiltersSchema>) {
  const supabase = await createServerClient()

  // Check permissions
  const features = await hasFeatures(["exports.allowed", "hrms.rates.read"])
  if (!features["exports.allowed"]) {
    return { success: false, error: "Export permission denied" }
  }

  // Get all assignments (no pagination for export)
  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
      *,
      employee:employees!employee_id(first_name, last_name, email)
    `,
    )
    .eq("tenant_id", (await supabase.auth.getUser()).data.user?.id)

  if (error) {
    console.error("[v0] exportAssignmentsCsv error:", error)
    return { success: false, error: error.message }
  }

  // Mask rate fields
  const fieldMap = {
    rate: "hrms.rates.read",
    rate_type: "hrms.rates.read",
    currency: "hrms.rates.read",
  }
  const masked = maskFieldsArray(data || [], features, fieldMap)

  // Audit log
  const {
    data: { user },
  } = await supabase.auth.getUser()
  await appendAudit({
    tenantId: user?.id || null,
    actorUserId: user?.id,
    action: "export:assignments",
    entity: "assignment",
    entityId: null,
    diff: { filters, count: masked.length },
  })

  return { success: true, data: masked }
}
