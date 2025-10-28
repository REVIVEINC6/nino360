"use server"

import { createServerClient } from "@/lib/supabase/server"
import { appendAudit } from "@/lib/hash"
import { hasFeatures } from "@/lib/fbac"

export async function getOnboardingOverview() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: true,
        data: {
          activeOnboarding: 0,
          completionRate: 0,
          avgDays: 0,
        },
      }
    }

    const { data: member } = await supabase.from("tenant_members").select("tenant_id").eq("user_id", user.id).single()

    if (!member) {
      return {
        success: true,
        data: {
          activeOnboarding: 0,
          completionRate: 0,
          avgDays: 0,
        },
      }
    }

    // Check FBAC
    const features = await hasFeatures(["hrms.onboarding.read"])
    if (!features["hrms.onboarding.read"]) {
      return {
        success: true,
        data: {
          activeOnboarding: 0,
          completionRate: 0,
          avgDays: 0,
        },
      }
    }

    // Get active onboarding count
    const { count: activeCount } = await supabase
      .from("hrms_onboarding")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", member.tenant_id)
      .eq("status", "IN_PROGRESS")

    // Get completion rate (last 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const { data: recentOnboarding } = await supabase
      .from("hrms_onboarding")
      .select("status, completed_at")
      .eq("tenant_id", member.tenant_id)
      .gte("created_at", ninetyDaysAgo.toISOString())

    const completed = recentOnboarding?.filter((o) => o.status === "COMPLETED").length || 0
    const total = recentOnboarding?.length || 1
    const completionRate = Math.round((completed / total) * 100)

    // Calculate average days to complete
    const completedOnboarding = recentOnboarding?.filter((o) => o.status === "COMPLETED" && o.completed_at) || []
    const avgDays =
      completedOnboarding.length > 0
        ? Math.round(
            completedOnboarding.reduce((sum, o) => {
              const start = new Date(o.created_at)
              const end = new Date(o.completed_at!)
              return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            }, 0) / completedOnboarding.length,
          )
        : 0

    // Audit read
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "onboarding:overview",
      entity: "hrms_onboarding",
      diff: { activeCount, completionRate, avgDays },
    })

    return {
      success: true,
      data: {
        activeOnboarding: activeCount || 0,
        completionRate,
        avgDays,
      },
    }
  } catch (error) {
    console.error("[v0] Error getting onboarding overview:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get onboarding overview",
    }
  }
}

export async function getNewHires() {
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
    const features = await hasFeatures(["hrms.onboarding.read"])
    if (!features["hrms.onboarding.read"]) {
      return { success: true, data: [] }
    }

    // Get new hires with onboarding status
    const { data, error } = await supabase
      .from("hrms_onboarding")
      .select(
        `
        id,
        employee_id,
        start_date,
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
      .order("start_date", { ascending: true })
      .limit(10)

    if (error) throw error

    // Audit read
    await appendAudit({
      tenantId: member.tenant_id,
      actorUserId: user.id,
      action: "onboarding:list_new_hires",
      entity: "hrms_onboarding",
      diff: { count: data?.length || 0 },
    })

    return {
      success: true,
      data: data || [],
    }
  } catch (error) {
    console.error("[v0] Error getting new hires:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get new hires",
    }
  }
}
