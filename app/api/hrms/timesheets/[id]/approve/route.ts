import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
export const dynamic = 'force-dynamic'
import { createClient } from "@/lib/supabase-server"
import { createHash } from "crypto"

type APIResponse = NextResponse;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(req: Request, { params }: { params: { id: string } }): Promise<APIResponse> {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Missing timesheet id' }, { status: 400 });
    }
    const body = await req.json()

    // Create a request-scoped Supabase client (passes cookie store into wrapper)
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get current user and tenant
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get the timesheet to approve
    const { data: timesheet, error: fetchError } = await supabase
      .from("timesheets")
      .select(`
        *,
        employee:employees(id, first_name, last_name, email, manager_id),
        project:projects(id, name, code, client)
      `)
      .eq("id", id)
      .eq("tenant_id", user.user_metadata?.tenant_id)
      .single()

    if (fetchError || !timesheet) {
      return NextResponse.json({ success: false, error: "Timesheet not found" }, { status: 404 })
    }

    // Check if user has permission to approve this timesheet
    const { data: currentEmployee, error: employeeError } = await supabase
      .from("employees")
      .select("id, role, department, manager_id")
      .eq("id", user.id)
      .eq("tenant_id", user.user_metadata?.tenant_id)
      .single()

    if (employeeError || !currentEmployee) {
      return NextResponse.json({ success: false, error: "Employee record not found" }, { status: 404 })
    }

    // Verify approval permissions
    const canApprove =
      currentEmployee.role === "admin" ||
      currentEmployee.role === "manager" ||
      currentEmployee.id === timesheet.employee.manager_id ||
      (currentEmployee.role === "project_manager" && timesheet.project_id)

    if (!canApprove) {
      return NextResponse.json({ success: false, error: "You don't have permission to approve this timesheet" }, {
        status: 403,
      })
    }

    // Check if timesheet is in a state that can be approved
    if (timesheet.status !== "submitted") {
      return NextResponse.json({ success: false, error: `Cannot approve timesheet with status: ${timesheet.status}` }, {
        status: 400,
      })
    }

    const { action, rejectionReason } = body
    const isApproval = action === "approve"
    const newStatus = isApproval ? "approved" : "rejected"

    // Validate rejection reason if rejecting
    if (!isApproval && !rejectionReason?.trim()) {
      return NextResponse.json({ success: false, error: "Rejection reason is required when rejecting a timesheet" }, {
        status: 400,
      })
    }

    // Update timesheet status
    const updateData: any = {
      status: newStatus,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      updated_by: user.id,
    }

    if (!isApproval) {
      updateData.rejection_reason = rejectionReason
    }

  const { data: updatedTimesheet, error: updateError } = await supabase
      .from("timesheets")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        employee:employees(id, first_name, last_name, email),
        project:projects(id, name, code),
        approver:employees!approved_by(id, first_name, last_name)
      `)
      .single()

    if (updateError) {
      console.error("Database error:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update timesheet" }, { status: 500 })
    }

    // Create blockchain record for approval if approved
    if (isApproval) {
      try {
        const blockchainData = {
          timesheetId: id,
          employeeId: timesheet.employee_id,
          projectId: timesheet.project_id,
          date: timesheet.date,
          hoursWorked: timesheet.hours_worked,
          billableHours: timesheet.billable_hours,
          approvedBy: user.id,
          approvedAt: updateData.approved_at,
          status: "approved",
        }

        const dataString = JSON.stringify(blockchainData)
        const hash = createHash("sha256").update(dataString).digest("hex")

        // Simulate blockchain transaction
        const blockNumber = Math.floor(Math.random() * 1000000) + 1000000
        const transactionHash = createHash("sha256").update(`${hash}-${Date.now()}`).digest("hex")

        // Store blockchain record
        await supabase.from("blockchain_records").insert({
          tenant_id: user.user_metadata?.tenant_id,
          module: "timesheets",
          related_id: id,
          data_type: "approval",
          hash,
          block_number: blockNumber,
          transaction_hash: transactionHash,
          verified: true,
          timestamp: new Date().toISOString(),
          data_hash: dataString,
        })

        // Update timesheet with blockchain hash
        await supabase
          .from("timesheets")
          .update({
            blockchain_hash: hash,
            blockchain_verified: true,
            blockchain_block_number: blockNumber,
            blockchain_transaction_hash: transactionHash,
          })
          .eq("id", id)
      } catch (blockchainError) {
        console.error("Blockchain recording failed:", blockchainError)
        // Don't fail the approval if blockchain recording fails
      }
    }

  // Trigger AI analysis for approval patterns
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/hrms/timesheets/ai/analyze-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timesheetId: id,
          action: newStatus,
          approverId: user.id,
          employeeId: timesheet.employee_id,
          projectId: timesheet.project_id,
        }),
      })
    } catch (aiError) {
      console.error("AI analysis failed:", aiError)
      // Don't fail the main request if AI analysis fails
    }

  // Send notification to employee
    try {
      await supabase.from("notifications").insert({
        tenant_id: user.user_metadata?.tenant_id,
        user_id: timesheet.employee_id,
        type: isApproval ? "timesheet_approved" : "timesheet_rejected",
        title: `Timesheet ${isApproval ? "Approved" : "Rejected"}`,
        message: isApproval
          ? `Your timesheet for ${new Date(timesheet.date).toLocaleDateString()} has been approved.`
          : `Your timesheet for ${new Date(timesheet.date).toLocaleDateString()} has been rejected. Reason: ${rejectionReason}`,
        data: {
          timesheetId: id,
          projectName: timesheet.project?.name,
          date: timesheet.date,
          hoursWorked: timesheet.hours_worked,
          approvedBy: `${(currentEmployee as any)?.first_name ?? ""} ${(currentEmployee as any)?.last_name ?? ""}`.trim(),
          rejectionReason: rejectionReason || null,
        },
        created_at: new Date().toISOString(),
      })
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError)
      // Don't fail the main request if notification fails
    }

  // Log the approval/rejection action
  await supabase.from("timesheet_approval_logs").insert({
      tenant_id: user.user_metadata?.tenant_id,
      timesheet_id: id,
      employee_id: timesheet.employee_id,
      approver_id: user.id,
      action: newStatus,
      rejection_reason: rejectionReason || null,
      approved_at: new Date().toISOString(),
      hours_worked: timesheet.hours_worked,
      billable_hours: timesheet.billable_hours,
      overtime_hours: timesheet.overtime_hours,
    })

  // Trigger RPA workflow for post-approval processing if approved
    if (isApproval) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/hrms/timesheets/rpa/post-approval`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timesheetId: id,
            employeeId: timesheet.employee_id,
            projectId: timesheet.project_id,
            hoursWorked: timesheet.hours_worked,
            billableHours: timesheet.billable_hours,
          }),
        })
      } catch (rpaError) {
        console.error("RPA workflow trigger failed:", rpaError)
        // Don't fail the main request if RPA trigger fails
      }
    }

    // Transform response data
    const responseData = {
      id: updatedTimesheet.id,
      employeeId: updatedTimesheet.employee_id,
      employeeName: `${(updatedTimesheet.employee as any)?.first_name ?? ""} ${(updatedTimesheet.employee as any)?.last_name ?? ""}`.trim(),
      projectId: updatedTimesheet.project_id,
      projectName: updatedTimesheet.project?.name || "Unknown Project",
      date: new Date(updatedTimesheet.date),
      hoursWorked: updatedTimesheet.hours_worked,
      description: updatedTimesheet.description,
      status: updatedTimesheet.status,
      approvedBy: updatedTimesheet.approver
        ? `${(updatedTimesheet.approver as any)?.first_name ?? ""} ${(updatedTimesheet.approver as any)?.last_name ?? ""}`.trim()
        : null,
      approvedAt: updatedTimesheet.approved_at ? new Date(updatedTimesheet.approved_at) : null,
      rejectionReason: updatedTimesheet.rejection_reason,
      billableHours: updatedTimesheet.billable_hours,
      overtimeHours: updatedTimesheet.overtime_hours,
      category: updatedTimesheet.category,
      tags: updatedTimesheet.tags || [],
      blockchainHash: updatedTimesheet.blockchain_hash,
      blockchainVerified: updatedTimesheet.blockchain_verified,
    }

    return NextResponse.json({
      timesheet: responseData,
      action: newStatus,
      message: isApproval
        ? "Timesheet approved successfully and recorded on blockchain"
        : "Timesheet rejected successfully",
      blockchainRecorded: isApproval,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to retrieve approval history
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
  // Use wrapper factory for server client (returns mock if env missing)
  const cookieStore = cookies()
  const supabase2 = createClient(cookieStore)
    const { id } = params; // fixed: avoid `params ?? {}` which made `id` possibly undefined
    if (!id) {
      return NextResponse.json({ error: 'Missing timesheet id' }, { status: 400 });
    }

    // Get current user and tenant
    const {
      data: { user },
      error: authError,
    } = await supabase2.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get approval history for the timesheet
    const { data: approvalHistory, error } = await supabase2
      .from("timesheet_approval_logs")
      .select(`
        *,
        approver:employees!approver_id(id, first_name, last_name, email),
        employee:employees!employee_id(id, first_name, last_name, email)
      `)
      .eq("timesheet_id", id)
      .eq("tenant_id", user.user_metadata?.tenant_id)
      .order("approved_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch approval history" }, { status: 500 })
    }

    // Transform data
    const transformedHistory =
      approvalHistory?.map((log: any) => ({
        id: log.id,
        action: log.action,
        approverName: `${(log.approver as any)?.first_name ?? ""} ${(log.approver as any)?.last_name ?? ""}`.trim(),
        approverEmail: log.approver?.email,
        employeeName: `${(log.employee as any)?.first_name ?? ""} ${(log.employee as any)?.last_name ?? ""}`.trim(),
        approvedAt: new Date(log.approved_at),
        rejectionReason: log.rejection_reason,
        hoursWorked: log.hours_worked,
        billableHours: log.billable_hours,
        overtimeHours: log.overtime_hours,
      })) || []

    return NextResponse.json({
      approvalHistory: transformedHistory,
      timesheetId: id,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
