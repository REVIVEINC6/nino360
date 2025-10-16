"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { appendAudit } from "@/lib/hash"
import { hasFeature } from "@/lib/fbac"

// ============================================================================
// SCHEMAS
// ============================================================================

const SaveEntriesSchema = z.object({
  timesheetId: z.string().uuid(),
  entries: z.array(
    z.object({
      entryId: z.string().uuid().optional(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      assignmentId: z.string().uuid().optional(),
      taskCode: z.string().optional(),
      hours: z.number().min(0).max(24),
      billable: z.boolean().default(true),
      notes: z.string().optional(),
    }),
  ),
})

const SubmitTimesheetSchema = z.object({
  timesheetId: z.string().uuid(),
  note: z.string().optional(),
})

const ApproveTimesheetSchema = z.object({
  timesheetId: z.string().uuid(),
  comment: z.string().optional(),
})

const RejectTimesheetSchema = z.object({
  timesheetId: z.string().uuid(),
  reason: z.string().min(1, "Reason is required"),
})

const GetComplianceSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  orgId: z.string().uuid().optional(),
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function listTimesheets() {
  const supabase = await createServerClient()

  // Check feature flag
  const hasTimesheetsRead = await hasFeature("hrms.timesheets.read")
  if (!hasTimesheetsRead) {
    return []
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  // Get employee record
  const { data: employee } = await supabase.from("hr.employees").select("id, tenant_id").eq("user_id", user.id).single()

  if (!employee) return []

  // Get timesheets for the tenant
  const { data: timesheets } = await supabase
    .from("hr.timesheets")
    .select(
      `
      *,
      employee:hr.employees(first_name, last_name, code)
    `,
    )
    .eq("tenant_id", employee.tenant_id)
    .order("week_start", { ascending: false })
    .limit(50)

  return timesheets || []
}

export async function getMyTimesheet(input: { weekStart: string }) {
  const supabase = await createServerClient()

  // Check feature flag
  const hasTimesheetsRead = await hasFeature("hrms.timesheets.read")
  if (!hasTimesheetsRead) {
    return { error: "Feature not enabled: hrms.timesheets.read" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get employee record
  const { data: employee } = await supabase.from("hr.employees").select("id, tenant_id").eq("user_id", user.id).single()

  if (!employee) return { error: "Employee record not found" }

  // Get or create timesheet
  let { data: timesheet } = await supabase
    .from("hr.timesheets")
    .select("*")
    .eq("employee_id", employee.id)
    .eq("week_start", input.weekStart)
    .single()

  if (!timesheet) {
    // Create new timesheet
    const weekStart = new Date(input.weekStart)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const { data: newTimesheet, error: createError } = await supabase
      .from("hr.timesheets")
      .insert({
        tenant_id: employee.tenant_id,
        employee_id: employee.id,
        week_start: input.weekStart,
        week_end: weekEnd.toISOString().split("T")[0],
        status: "DRAFT",
      })
      .select()
      .single()

    if (createError) return { error: createError.message }
    timesheet = newTimesheet
  }

  // Get entries
  const { data: entries } = await supabase
    .from("hr.timesheet_entries")
    .select("*, assignment:hr.assignments(id, role_title, client_id, project_id)")
    .eq("timesheet_id", timesheet.id)
    .order("date")

  // Get policy
  const { data: policy } = await supabase
    .from("hr.timesheet_policies")
    .select("*")
    .eq("tenant_id", employee.tenant_id)
    .eq("is_default", true)
    .single()

  // Get holidays for the week
  const { data: holidays } = await supabase
    .from("calendars.holidays")
    .select("*")
    .gte("date", input.weekStart)
    .lte("date", timesheet.week_end)

  return {
    timesheet,
    entries: entries || [],
    policy,
    holidays: holidays || [],
  }
}

export async function saveEntries(input: z.infer<typeof SaveEntriesSchema>) {
  const supabase = await createServerClient()

  // Validate input
  const parsed = SaveEntriesSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Check feature flag
  const hasTimesheetsWrite = await hasFeature("hrms.timesheets.write")
  if (!hasTimesheetsWrite) {
    return { error: "Feature not enabled: hrms.timesheets.write" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get timesheet and verify ownership
  const { data: timesheet } = await supabase
    .from("hr.timesheets")
    .select("*, employee:hr.employees!inner(user_id, tenant_id)")
    .eq("id", parsed.data.timesheetId)
    .single()

  if (!timesheet) return { error: "Timesheet not found" }
  if (timesheet.employee.user_id !== user.id) return { error: "Unauthorized" }
  if (timesheet.status === "LOCKED") return { error: "Timesheet is locked" }

  // Upsert entries
  for (const entry of parsed.data.entries) {
    if (entry.entryId) {
      // Update existing
      await supabase
        .from("hr.timesheet_entries")
        .update({
          date: entry.date,
          assignment_id: entry.assignmentId,
          task_code: entry.taskCode,
          hours: entry.hours,
          billable: entry.billable,
          notes: entry.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", entry.entryId)
    } else {
      // Insert new
      await supabase.from("hr.timesheet_entries").insert({
        timesheet_id: parsed.data.timesheetId,
        date: entry.date,
        assignment_id: entry.assignmentId,
        task_code: entry.taskCode,
        hours: entry.hours,
        billable: entry.billable,
        notes: entry.notes,
      })
    }
  }

  // Audit log
  await appendAudit({
    tenantId: timesheet.employee.tenant_id,
    actorUserId: user.id,
    action: "timesheet:save",
    entity: "timesheet",
    entityId: parsed.data.timesheetId,
    diff: { entries: parsed.data.entries.length },
  })

  revalidatePath("/hrms/timesheets")
  return { success: true }
}

export async function submitTimesheet(input: z.infer<typeof SubmitTimesheetSchema>) {
  const supabase = await createServerClient()

  // Validate input
  const parsed = SubmitTimesheetSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Check feature flag
  const hasTimesheetsWrite = await hasFeature("hrms.timesheets.write")
  if (!hasTimesheetsWrite) {
    return { error: "Feature not enabled: hrms.timesheets.write" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get timesheet and verify ownership
  const { data: timesheet } = await supabase
    .from("hr.timesheets")
    .select("*, employee:hr.employees!inner(user_id, tenant_id, manager_id)")
    .eq("id", parsed.data.timesheetId)
    .single()

  if (!timesheet) return { error: "Timesheet not found" }
  if (timesheet.employee.user_id !== user.id) return { error: "Unauthorized" }
  if (timesheet.status !== "DRAFT") return { error: "Timesheet already submitted" }

  // Validate policy
  const { data: validation } = await supabase.rpc("hr.fn_policy_validate", {
    p_tenant_id: timesheet.employee.tenant_id,
    p_employee_id: timesheet.employee_id,
    p_week_start: timesheet.week_start,
  })

  if (validation && !validation.valid) {
    return { error: "Policy validation failed", errors: validation.errors }
  }

  // Update timesheet status
  await supabase
    .from("hr.timesheets")
    .update({
      status: "PENDING",
      submitted_at: new Date().toISOString(),
      notes: parsed.data.note,
    })
    .eq("id", parsed.data.timesheetId)

  // Create approval record
  await supabase.from("hr.approvals").insert({
    tenant_id: timesheet.employee.tenant_id,
    object_type: "timesheet",
    object_id: parsed.data.timesheetId,
    status: "PENDING",
    approver_id: timesheet.employee.manager_id,
  })

  // Audit log
  await appendAudit({
    tenantId: timesheet.employee.tenant_id,
    actorUserId: user.id,
    action: "timesheet:submit",
    entity: "timesheet",
    entityId: parsed.data.timesheetId,
    diff: { status: "PENDING", note: parsed.data.note },
  })

  revalidatePath("/hrms/timesheets")
  return { success: true }
}

export async function retractTimesheet(input: { timesheetId: string }) {
  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get timesheet and verify ownership
  const { data: timesheet } = await supabase
    .from("hr.timesheets")
    .select("*, employee:hr.employees!inner(user_id, tenant_id)")
    .eq("id", input.timesheetId)
    .single()

  if (!timesheet) return { error: "Timesheet not found" }
  if (timesheet.employee.user_id !== user.id) return { error: "Unauthorized" }
  if (timesheet.status !== "PENDING") return { error: "Can only retract pending timesheets" }

  // Update timesheet status
  await supabase
    .from("hr.timesheets")
    .update({
      status: "DRAFT",
      submitted_at: null,
    })
    .eq("id", input.timesheetId)

  // Delete approval record
  await supabase.from("hr.approvals").delete().eq("object_type", "timesheet").eq("object_id", input.timesheetId)

  // Audit log
  await appendAudit({
    tenantId: timesheet.employee.tenant_id,
    actorUserId: user.id,
    action: "timesheet:retract",
    entity: "timesheet",
    entityId: input.timesheetId,
  })

  revalidatePath("/hrms/timesheets")
  return { success: true }
}

export async function approveTimesheet(input: z.infer<typeof ApproveTimesheetSchema>) {
  const supabase = await createServerClient()

  // Validate input
  const parsed = ApproveTimesheetSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Check feature flag
  const hasTimesheetsApprove = await hasFeature("hrms.timesheets.approve")
  if (!hasTimesheetsApprove) {
    return { error: "Feature not enabled: hrms.timesheets.approve" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get timesheet
  const { data: timesheet } = await supabase
    .from("hr.timesheets")
    .select("*, employee:hr.employees!inner(tenant_id, manager_id)")
    .eq("id", parsed.data.timesheetId)
    .single()

  if (!timesheet) return { error: "Timesheet not found" }
  if (timesheet.status !== "PENDING") return { error: "Timesheet not pending approval" }

  // Verify manager permission (simplified - should check manager hierarchy)
  const { data: approverEmployee } = await supabase.from("hr.employees").select("id").eq("user_id", user.id).single()

  if (!approverEmployee || approverEmployee.id !== timesheet.employee.manager_id) {
    return { error: "Unauthorized: not the assigned manager" }
  }

  // Update timesheet status
  await supabase
    .from("hr.timesheets")
    .update({
      status: "APPROVED",
      approved_at: new Date().toISOString(),
      approver_id: approverEmployee.id,
    })
    .eq("id", parsed.data.timesheetId)

  // Update approval record
  await supabase
    .from("hr.approvals")
    .update({
      status: "APPROVED",
      approved_at: new Date().toISOString(),
      comment: parsed.data.comment,
    })
    .eq("object_type", "timesheet")
    .eq("object_id", parsed.data.timesheetId)

  // Audit log
  await appendAudit({
    tenantId: timesheet.employee.tenant_id,
    actorUserId: user.id,
    action: "timesheet:approve",
    entity: "timesheet",
    entityId: parsed.data.timesheetId,
    diff: { status: "APPROVED", comment: parsed.data.comment },
  })

  revalidatePath("/hrms/timesheets")
  return { success: true }
}

export async function rejectTimesheet(input: z.infer<typeof RejectTimesheetSchema>) {
  const supabase = await createServerClient()

  // Validate input
  const parsed = RejectTimesheetSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Check feature flag
  const hasTimesheetsApprove = await hasFeature("hrms.timesheets.approve")
  if (!hasTimesheetsApprove) {
    return { error: "Feature not enabled: hrms.timesheets.approve" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get timesheet
  const { data: timesheet } = await supabase
    .from("hr.timesheets")
    .select("*, employee:hr.employees!inner(tenant_id, manager_id)")
    .eq("id", parsed.data.timesheetId)
    .single()

  if (!timesheet) return { error: "Timesheet not found" }
  if (timesheet.status !== "PENDING") return { error: "Timesheet not pending approval" }

  // Verify manager permission
  const { data: approverEmployee } = await supabase.from("hr.employees").select("id").eq("user_id", user.id).single()

  if (!approverEmployee || approverEmployee.id !== timesheet.employee.manager_id) {
    return { error: "Unauthorized: not the assigned manager" }
  }

  // Update timesheet status
  await supabase
    .from("hr.timesheets")
    .update({
      status: "REJECTED",
      notes: parsed.data.reason,
    })
    .eq("id", parsed.data.timesheetId)

  // Update approval record
  await supabase
    .from("hr.approvals")
    .update({
      status: "REJECTED",
      comment: parsed.data.reason,
    })
    .eq("object_type", "timesheet")
    .eq("object_id", parsed.data.timesheetId)

  // Audit log
  await appendAudit({
    tenantId: timesheet.employee.tenant_id,
    actorUserId: user.id,
    action: "timesheet:reject",
    entity: "timesheet",
    entityId: parsed.data.timesheetId,
    diff: { status: "REJECTED", reason: parsed.data.reason },
  })

  revalidatePath("/hrms/timesheets")
  return { success: true }
}

export async function getCompliance(input: z.infer<typeof GetComplianceSchema>) {
  const supabase = await createServerClient()

  // Validate input
  const parsed = GetComplianceSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Check feature flag
  const hasTimesheetsRead = await hasFeature("hrms.timesheets.read")
  if (!hasTimesheetsRead) {
    return { error: "Feature not enabled: hrms.timesheets.read" }
  }

  // Get compliance data
  const { data: weekly } = await supabase
    .from("hr.vw_timesheet_compliance_weekly")
    .select("*")
    .gte("week_start", parsed.data.from)
    .lte("week_start", parsed.data.to)
    .order("week_start")

  // Calculate totals
  const totals = (weekly || []).reduce(
    (acc, week) => ({
      onTime: acc.onTime + (week.on_time || 0),
      late: acc.late + (week.late || 0),
      missing: acc.missing + (week.missing || 0),
    }),
    { onTime: 0, late: 0, missing: 0 },
  )

  const total = totals.onTime + totals.late + totals.missing
  const onTimePct = total > 0 ? (totals.onTime / total) * 100 : 0

  // Get anomalies
  const { data: anomalies } = await supabase
    .from("hr.overtime_anomalies")
    .select("*, employee:hr.employees(first_name, last_name, employee_no)")
    .gte("week_start", parsed.data.from)
    .lte("week_start", parsed.data.to)
    .order("score", { ascending: false })

  return {
    onTimePct: Math.round(onTimePct * 10) / 10,
    lateCount: totals.late,
    missingCount: totals.missing,
    anomalies: anomalies || [],
    weekly: weekly || [],
  }
}

export async function exportTimesheetsCsv(input: {
  from: string
  to: string
  orgId?: string
  scope: "employee" | "assignment"
}) {
  const supabase = await createServerClient()

  // Check feature flags
  const [hasTimesheetsRead, hasExportsAllowed] = await Promise.all([
    hasFeature("hrms.timesheets.read"),
    hasFeature("exports.allowed"),
  ])

  if (!hasTimesheetsRead) {
    return { error: "Feature not enabled: hrms.timesheets.read" }
  }

  if (!hasExportsAllowed) {
    return { error: "Feature not enabled: exports.allowed" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get employee for tenant_id
  const { data: employee } = await supabase.from("hr.employees").select("tenant_id").eq("user_id", user.id).single()

  if (!employee) return { error: "Employee record not found" }

  // Query timesheets with entries
  let query = supabase
    .from("hr.timesheets")
    .select(
      `
      *,
      employee:hr.employees(employee_no, first_name, last_name),
      entries:hr.timesheet_entries(*, assignment:hr.assignments(role_title, client_id, project_id))
    `,
    )
    .gte("week_start", input.from)
    .lte("week_start", input.to)

  if (input.orgId) {
    query = query.eq("employee.org_node_id", input.orgId)
  }

  const { data: timesheets } = await query

  // Build CSV
  const rows: string[][] = []

  if (input.scope === "employee") {
    rows.push(["Employee No", "Name", "Week Start", "Week End", "Total Hours", "Billable Hours", "Status"])
    for (const ts of timesheets || []) {
      rows.push([
        ts.employee?.employee_no || "",
        `${ts.employee?.first_name || ""} ${ts.employee?.last_name || ""}`,
        ts.week_start,
        ts.week_end,
        ts.total_hours?.toString() || "0",
        ts.billable_hours?.toString() || "0",
        ts.status,
      ])
    }
  } else {
    rows.push(["Employee No", "Name", "Date", "Assignment", "Task Code", "Hours", "Billable", "Notes"])
    for (const ts of timesheets || []) {
      for (const entry of ts.entries || []) {
        rows.push([
          ts.employee?.employee_no || "",
          `${ts.employee?.first_name || ""} ${ts.employee?.last_name || ""}`,
          entry.date,
          entry.assignment?.role_title || "Unassigned",
          entry.task_code || "",
          entry.hours?.toString() || "0",
          entry.billable ? "Yes" : "No",
          entry.notes || "",
        ])
      }
    }
  }

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  // Audit log
  await appendAudit({
    tenantId: employee.tenant_id,
    actorUserId: user.id,
    action: "export:timesheets",
    entity: "timesheet",
    diff: { from: input.from, to: input.to, scope: input.scope, rows: rows.length - 1 },
  })

  return { csv }
}
