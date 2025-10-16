"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hasFeatures } from "@/lib/fbac"

export async function getHRMSDashboardKPIs() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: member } = await supabase
      .from("tenant_members")
      .select("tenant_id, role")
      .eq("user_id", user.id)
      .single()

    if (!member) throw new Error("Tenant not found")

    // Check FBAC
    const features = await hasFeatures(["hrms.dashboard.read"])
    if (!features["hrms.dashboard.read"]) {
      throw new Error("Permission denied: hrms.dashboard.read required")
    }

    // Get total employees
    const { count: totalEmployees } = await supabase
      .from("hrms_employees")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "active")

    // Get joiners this month
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { count: joinersThisMonth } = await supabase
      .from("hrms_employees")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .gte("hire_date", thirtyDaysAgo.toISOString().split("T")[0])

    // Get leavers this month
    const { count: leaversThisMonth } = await supabase
      .from("hrms_employees")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "terminated")
      .gte("termination_date", thirtyDaysAgo.toISOString().split("T")[0])

    // Get on leave today
    const today = new Date().toISOString().split("T")[0]
    const { count: onLeaveToday } = await supabase
      .from("hrms_attendance_days")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("date", today)
      .eq("status", "LEAVE")

    // Get pending timesheets
    const { count: pendingTimesheets } = await supabase
      .from("hrms_timesheets")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "draft")

    // Get expiring docs (next 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const { count: expiringDocs } = await supabase
      .from("hrms_documents")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .lte("expiry_date", thirtyDaysFromNow.toISOString().split("T")[0])
      .gte("expiry_date", today)

    // Get open tickets
    const { count: openTickets } = await supabase
      .from("helpdesk_cases")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .in("status", ["open", "in_progress"])

    // Get avg attendance (last 30 days)
    const { data: attendanceData } = await supabase
      .from("hrms_attendance_days")
      .select("status")
      .eq("tenant_id", member.tenant_id)
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0])

    const presentDays = attendanceData?.filter((d) => d.status === "PRESENT" || d.status === "WFH").length || 0
    const totalDays = attendanceData?.length || 1
    const avgAttendance = ((presentDays / totalDays) * 100).toFixed(1)

    // Get recent joiners
    const { data: recentJoiners } = await supabase
      .from("hrms_employees")
      .select("id, first_name, last_name, department, hire_date")
      .eq("tenant_id", member.tenant_id)
      .eq("status", "active")
      .order("hire_date", { ascending: false })
      .limit(5)

    // Get department distribution
    const { data: deptData } = await supabase
      .from("hrms_employees")
      .select("department")
      .eq("tenant_id", member.tenant_id)
      .eq("status", "active")

    const deptCounts: Record<string, number> = {}
    deptData?.forEach((emp) => {
      const dept = emp.department || "Unassigned"
      deptCounts[dept] = (deptCounts[dept] || 0) + 1
    })

    const departmentDistribution = Object.entries(deptCounts)
      .map(([dept, count]) => ({
        dept,
        count,
        percentage: Math.round((count / (totalEmployees || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      success: true,
      data: {
        stats: {
          totalEmployees: totalEmployees || 0,
          joinersThisMonth: joinersThisMonth || 0,
          leaversThisMonth: leaversThisMonth || 0,
          onLeaveToday: onLeaveToday || 0,
          pendingTimesheets: pendingTimesheets || 0,
          expiringDocs: expiringDocs || 0,
          openTickets: openTickets || 0,
          avgAttendance: Number.parseFloat(avgAttendance),
        },
        recentJoiners: recentJoiners || [],
        departmentDistribution: departmentDistribution || [],
      },
    }
  } catch (error) {
    console.error("[v0] Error getting HRMS dashboard KPIs:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get dashboard KPIs",
    }
  }
}
