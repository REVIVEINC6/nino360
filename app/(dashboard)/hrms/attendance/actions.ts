"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeatures } from "@/lib/fbac"
import { revalidatePath } from "next/cache"

// ============================================================================
// SCHEMAS
// ============================================================================

const getAttendanceSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  orgId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  employeeId: z.string().uuid().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HOLIDAY", "WFH", "REMOTE"]).optional(),
})

const requestLeaveSchema = z.object({
  employeeId: z.string().uuid(),
  kind: z.string().min(1),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1),
})

const approveLeaveSchema = z.object({
  requestId: z.string().uuid(),
  comment: z.string().optional(),
})

const rejectLeaveSchema = z.object({
  requestId: z.string().uuid(),
  reason: z.string().min(1),
})

const checkinSchema = z.object({
  kind: z.enum(["IN", "OUT"]),
  source: z.enum(["web", "mobile", "kiosk", "api"]),
  notes: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  timezone: z.string().optional(),
})

const correctEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  employeeId: z.string().uuid(),
  hoursWorked: z.number().min(0).max(24).optional(),
  status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HOLIDAY", "WFH", "REMOTE"]).optional(),
  note: z.string().min(1),
})

// ============================================================================
// ACTIONS
// ============================================================================

export async function getAttendance(input: z.infer<typeof getAttendanceSchema>) {
  try {
    const validated = getAttendanceSchema.parse(input)
    const supabase = await createServerClient()

    // Check feature flags
    const features = await hasFeatures(["hrms.attendance.read", "hrms.leave.read", "hrms.timesheets.read"])

    if (!features["hrms.attendance.read"]) {
      return { error: "Attendance feature not enabled" }
    }

    // Get current user and tenant
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Build query for attendance days
    let daysQuery = supabase
      .from("hrms_attendance_days")
      .select("*, hrms_employees!inner(employee_no, first_name, last_name, department)")
      .gte("date", validated.from)
      .lte("date", validated.to)

    if (validated.employeeId) {
      daysQuery = daysQuery.eq("employee_id", validated.employeeId)
    }
    if (validated.status) {
      daysQuery = daysQuery.eq("status", validated.status)
    }

    const { data: calendarDays, error: daysError } = await daysQuery

    if (daysError) throw daysError

    // Get KPIs for today
    const today = new Date().toISOString().split("T")[0]
    const { data: kpisData } = await supabase.from("hrms_attendance_days").select("status").eq("date", today)

    const kpis = {
      present: kpisData?.filter((d: any) => d.status === "PRESENT").length || 0,
        absent: kpisData?.filter((d: any) => d.status === "ABSENT").length || 0,
        leave: kpisData?.filter((d: any) => d.status === "LEAVE").length || 0,
        wfh: kpisData?.filter((d: any) => d.status === "WFH" || d.status === "REMOTE").length || 0,
        // Some DB rows use `exception` while others may use `exceptions` or nested shapes; normalize via any
        exceptions: kpisData?.filter((d: any) => Boolean(d?.exception || d?.exceptions)).length || 0,
    }

    // Get exceptions (missing checkouts, long hours)
    const { data: exceptions } = await supabase.rpc("fn_detect_missing_checkouts", {
      p_tenant_id: user.id, // This should be tenant_id from context
      p_date: today,
    })

    // RPCs may return mixed shapes; normalize via unknown/any to avoid tight typing here
    const exceptionsNormalized = (exceptions as unknown) as any[]

    // Get leave balances
    const { data: leaveBalances } = await supabase
      .from("hrms_leave_balances")
      .select("*, hrms_employees!inner(employee_no, first_name, last_name)")
      .order("kind")

    // Get leave requests
    const { data: leaveRequests } = await supabase
      .from("hrms_leave_requests")
      .select("*, hrms_employees!inner(employee_no, first_name, last_name)")
      .gte("start_date", validated.from)
      .lte("end_date", validated.to)
      .order("start_date", { ascending: false })

    // Get recent check-ins
    const { data: checkins } = await supabase
      .from("hrms_attendance_checkins")
      .select("*, hrms_employees!inner(employee_no, first_name, last_name)")
      .gte("ts", validated.from)
      .lte("ts", validated.to)
      .order("ts", { ascending: false })
      .limit(50)

    return {
      calendarDays: calendarDays || [],
      kpis,
  exceptions: exceptionsNormalized || [],
      leaveBalances: leaveBalances || [],
      leaveRequests: leaveRequests || [],
      checkins: checkins || [],
    }
  } catch (error) {
    console.error("[v0] getAttendance error:", error)
    return { error: error instanceof Error ? error.message : "Failed to fetch attendance data" }
  }
}

export async function requestLeave(input: z.infer<typeof requestLeaveSchema>) {
  try {
    const validated = requestLeaveSchema.parse(input)
    const supabase = await createServerClient()

    // Check feature flags
    const features = await hasFeatures(["hrms.leave.write"])
    if (!features["hrms.leave.write"]) {
      return { error: "Leave management feature not enabled" }
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Validate date range
    if (validated.from > validated.to) {
      return { error: "Start date must be before end date" }
    }

    // Calculate days
    const fromDate = new Date(validated.from)
    const toDate = new Date(validated.to)
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Check for overlaps
    const { data: hasOverlap } = await supabase.rpc("fn_validate_leave_overlap", {
      p_tenant_id: user.id, // Should be tenant_id from context
      p_employee_id: validated.employeeId,
      p_from_date: validated.from,
      p_to_date: validated.to,
    })

    if (!hasOverlap) {
      return { error: "Leave request overlaps with existing request" }
    }

    // Check balance
    const { data: balance } = await supabase
      .from("hrms_leave_balances")
      .select("balance_days")
      .eq("employee_id", validated.employeeId)
      .eq("kind", validated.kind)
      .single()

    if (balance && balance.balance_days < days) {
      return { error: `Insufficient leave balance. Available: ${balance.balance_days} days` }
    }

    // Insert leave request
    const { data: request, error: insertError } = await supabase
      .from("hrms_leave_requests")
      .insert({
        employee_id: validated.employeeId,
        leave_type: validated.kind,
        start_date: validated.from,
        end_date: validated.to,
        days,
        reason: validated.reason,
        status: "pending",
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Audit log
    await appendAudit({
      tenantId: user.id, // Should be tenant_id from context
      actorUserId: user.id,
      action: "leave:request",
      entity: "hrms_leave_requests",
      entityId: request.id,
      diff: { kind: validated.kind, from: validated.from, to: validated.to, days },
    })

    revalidatePath("/hrms/attendance")
    return { success: true, requestId: request.id }
  } catch (error) {
    console.error("[v0] requestLeave error:", error)
    return { error: error instanceof Error ? error.message : "Failed to request leave" }
  }
}

export async function approveLeave(input: z.infer<typeof approveLeaveSchema>) {
  try {
    const validated = approveLeaveSchema.parse(input)
    const supabase = await createServerClient()

    // Check feature flags
    const features = await hasFeatures(["hrms.leave.write"])
    if (!features["hrms.leave.write"]) {
      return { error: "Leave management feature not enabled" }
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // TODO: Check RBAC - user must be manager or HR

    // Get request details
    const { data: request, error: fetchError } = await supabase
      .from("hrms_leave_requests")
      .select("*")
      .eq("id", validated.requestId)
      .single()

    if (fetchError) throw fetchError
    if (!request) return { error: "Leave request not found" }

    // Update request status
    const { error: updateError } = await supabase
      .from("hrms_leave_requests")
      .update({
        status: "approved",
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", validated.requestId)

    if (updateError) throw updateError

    // Backfill attendance_days with LEAVE status
    const dates: string[] = []
    const currentDate = new Date(request.start_date)
    const endDate = new Date(request.end_date)

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const attendanceDays = dates.map((date) => ({
      employee_id: request.employee_id,
      date,
      status: "LEAVE",
      notes: `Approved leave: ${request.leave_type}`,
    }))

    const { error: insertError } = await supabase.from("hrms_attendance_days").upsert(attendanceDays, {
      onConflict: "tenant_id,employee_id,date",
    })

    if (insertError) throw insertError

    // Deduct from balance
    const { error: balanceError } = await supabase.rpc("update_leave_balance", {
      p_employee_id: request.employee_id,
      p_kind: request.leave_type,
      p_days: -request.days,
    })

    if (balanceError) console.error("[v0] Failed to update balance:", balanceError)

    // Audit log
    await appendAudit({
      tenantId: user.id, // Should be tenant_id from context
      actorUserId: user.id,
      action: "leave:approve",
      entity: "hrms_leave_requests",
      entityId: validated.requestId,
      diff: { status: "approved", comment: validated.comment },
    })

    revalidatePath("/hrms/attendance")
    return { success: true }
  } catch (error) {
    console.error("[v0] approveLeave error:", error)
    return { error: error instanceof Error ? error.message : "Failed to approve leave" }
  }
}

export async function rejectLeave(input: z.infer<typeof rejectLeaveSchema>) {
  try {
    const validated = rejectLeaveSchema.parse(input)
    const supabase = await createServerClient()

    // Check feature flags
    const features = await hasFeatures(["hrms.leave.write"])
    if (!features["hrms.leave.write"]) {
      return { error: "Leave management feature not enabled" }
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // TODO: Check RBAC - user must be manager or HR

    // Update request status
    const { error: updateError } = await supabase
      .from("hrms_leave_requests")
      .update({
        status: "rejected",
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", validated.requestId)

    if (updateError) throw updateError

    // Audit log
    await appendAudit({
      tenantId: user.id, // Should be tenant_id from context
      actorUserId: user.id,
      action: "leave:reject",
      entity: "hrms_leave_requests",
      entityId: validated.requestId,
      diff: { status: "rejected", reason: validated.reason },
    })

    revalidatePath("/hrms/attendance")
    return { success: true }
  } catch (error) {
    console.error("[v0] rejectLeave error:", error)
    return { error: error instanceof Error ? error.message : "Failed to reject leave" }
  }
}

export async function checkin(input: z.infer<typeof checkinSchema>) {
  try {
    const validated = checkinSchema.parse(input)
    const supabase = await createServerClient()

    // Check feature flags
    const features = await hasFeatures(["hrms.attendance.write"])
    if (!features["hrms.attendance.write"]) {
      return { error: "Attendance feature not enabled" }
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Get employee_id for current user
    const { data: employee } = await supabase.from("hrms_employees").select("id").eq("user_id", user.id).single()

    if (!employee) return { error: "Employee record not found" }

    // Validate check-in sequence (cannot OUT before IN)
    if (validated.kind === "OUT") {
      const { data: lastCheckin } = await supabase
        .from("hrms_attendance_checkins")
        .select("kind")
        .eq("employee_id", employee.id)
        .order("ts", { ascending: false })
        .limit(1)
        .single()

      if (!lastCheckin || lastCheckin.kind === "OUT") {
        return { error: "Cannot check out without checking in first" }
      }
    }

    // Insert check-in
    const { data: checkin, error: insertError } = await supabase
      .from("hrms_attendance_checkins")
      .insert({
        employee_id: employee.id,
        kind: validated.kind,
        source: validated.source,
        notes: validated.notes,
        location_lat: validated.locationLat,
        location_lng: validated.locationLng,
        timezone: validated.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Audit log
    await appendAudit({
      tenantId: user.id, // Should be tenant_id from context
      actorUserId: user.id,
      action: "attendance:checkin",
      entity: "hrms_attendance_checkins",
      entityId: checkin.id,
      diff: { kind: validated.kind, source: validated.source },
    })

    revalidatePath("/hrms/attendance")
    return { success: true, checkinId: checkin.id }
  } catch (error) {
    console.error("[v0] checkin error:", error)
    return { error: error instanceof Error ? error.message : "Failed to record check-in" }
  }
}

export async function correctEntry(input: z.infer<typeof correctEntrySchema>) {
  try {
    const validated = correctEntrySchema.parse(input)
    const supabase = await createServerClient()

    // Check feature flags
    const features = await hasFeatures(["hrms.attendance.write"])
    if (!features["hrms.attendance.write"]) {
      return { error: "Attendance feature not enabled" }
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // TODO: Check RBAC - user must be manager or HR

    // Upsert attendance day with exception trail
    const { data: day, error: upsertError } = await supabase
      .from("hrms_attendance_days")
      .upsert(
        {
          employee_id: validated.employeeId,
          date: validated.date,
          hours_worked: validated.hoursWorked,
          status: validated.status,
          exception: {
            corrected_by: user.id,
            corrected_at: new Date().toISOString(),
            note: validated.note,
          },
        },
        {
          onConflict: "tenant_id,employee_id,date",
        },
      )
      .select()
      .single()

    if (upsertError) throw upsertError

    // Audit log
    await appendAudit({
      tenantId: user.id, // Should be tenant_id from context
      actorUserId: user.id,
      action: "attendance:correct",
      entity: "hrms_attendance_days",
      entityId: day.id,
      diff: {
        date: validated.date,
        hours_worked: validated.hoursWorked,
        status: validated.status,
        note: validated.note,
      },
    })

    revalidatePath("/hrms/attendance")
    return { success: true }
  } catch (error) {
    console.error("[v0] correctEntry error:", error)
    return { error: error instanceof Error ? error.message : "Failed to correct entry" }
  }
}

export async function exportAttendanceCsv(input: z.infer<typeof getAttendanceSchema>) {
  try {
    const validated = getAttendanceSchema.parse(input)
    const supabase = await createServerClient()

    // Check feature flags
    const features = await hasFeatures(["exports.allowed"])
    if (!features["exports.allowed"]) {
      return { error: "Export feature not enabled" }
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Fetch attendance data
    const { data, error } = await supabase
      .from("hrms_attendance_days")
      .select("*, hrms_employees!inner(employee_no, first_name, last_name, department)")
      .gte("date", validated.from)
      .lte("date", validated.to)
      .order("date", { ascending: false })

    if (error) throw error

    // Generate CSV
    const headers = ["Date", "Employee No", "Name", "Department", "Status", "Hours Worked", "Notes"]
    const rows = data.map((d: any) => [
      d.date,
      d.hrms_employees.employee_no,
      `${d.hrms_employees.first_name} ${d.hrms_employees.last_name}`,
      d.hrms_employees.department || "",
      d.status,
      d.hours_worked || 0,
      d.notes || "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

    // Audit log
    await appendAudit({
      tenantId: user.id, // Should be tenant_id from context
      actorUserId: user.id,
      action: "export:attendance",
      entity: "hrms_attendance_days",
      entityId: null,
      diff: { from: validated.from, to: validated.to, rows: data.length },
    })

    return { success: true, csv }
  } catch (error) {
    console.error("[v0] exportAttendanceCsv error:", error)
    return { error: error instanceof Error ? error.message : "Failed to export attendance" }
  }
}
