"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeatures } from "@/lib/fbac"

export async function getOffboardingOverview() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: true,
        data: {
          activeExits: 0,
          pendingTasks: 0,
          completedThisQuarter: 0,
        },
      }
    }

    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

    if (!member) {
      return {
        success: true,
        data: {
          activeExits: 0,
          pendingTasks: 0,
          completedThisQuarter: 0,
        },
      }
    }

    // Check FBAC
    const features = await hasFeatures(["hrms.offboarding.read"])
    if (!features["hrms.offboarding.read"]) {
      return {
        success: true,
        data: {
          activeExits: 0,
          pendingTasks: 0,
          completedThisQuarter: 0,
        },
      }
    }

    // Get active exits count
    const { count: activeCount } = await supabase
      .from("hrms_offboarding")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "IN_PROGRESS")

    // Get pending tasks count
    const { count: pendingCount } = await supabase
      .from("hrms_offboarding_tasks")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "PENDING")

    // Get completed this quarter
    const quarterStart = new Date()
    quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1)
    quarterStart.setHours(0, 0, 0, 0)

    const { count: completedCount } = await supabase
      .from("hrms_offboarding")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "COMPLETED")
      .gte("completed_at", quarterStart.toISOString())

    // Audit read
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "offboarding:overview",
      entity: "hrms_offboarding",
      diff: { activeCount, pendingCount, completedCount },
    })

    return {
      success: true,
      data: {
        activeExits: activeCount || 0,
        pendingTasks: pendingCount || 0,
        completedThisQuarter: completedCount || 0,
      },
    }
  } catch (error) {
    console.error("[v0] Error getting offboarding overview:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get offboarding overview",
    }
  }
}

export async function getExitChecklists() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: true, data: [] }
    }

    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

    if (!member) {
      return { success: true, data: [] }
    }

    // Check FBAC
    const features = await hasFeatures(["hrms.offboarding.read"])
    if (!features["hrms.offboarding.read"]) {
      return { success: true, data: [] }
    }

    // Get exit checklists with employee details
    const { data, error } = await supabase
      .from("hrms_offboarding")
      .select(
        `
        id,
        employee_id,
        last_day,
        status,
        progress,
        employees:hrms_employees!employee_id(
          first_name,
          last_name,
          job_title
        )
      `,
      )
      .eq("tenant_id", member.tenant_id)
      .in("status", ["PENDING", "IN_PROGRESS"])
      .order("last_day", { ascending: true })
      .limit(10)

    if (error) throw error

    // Calculate urgency (last day within 7 days)
    const today = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)

    const enrichedData = (data || []).map((exit) => ({
      ...exit,
      urgent: new Date(exit.last_day) <= sevenDaysFromNow,
    }))

    // Audit read
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "offboarding:list_exits",
      entity: "hrms_offboarding",
      diff: { count: data?.length || 0 },
    })

    return {
      success: true,
      data: enrichedData,
    }
  } catch (error) {
    console.error("[v0] Error getting exit checklists:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get exit checklists",
    }
  }
}
