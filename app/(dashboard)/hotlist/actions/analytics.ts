"use server"

import { createServerClient } from "@/lib/supabase/server"
import { requirePermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"

/**
 * Get hotlist dashboard KPI tiles
 */
export async function getHotlistAnalyticsTiles() {
  await requirePermission(PERMISSIONS.HOTLIST_DASHBOARD_VIEW)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  // Active campaigns (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { count: activeCampaigns } = await supabase
    .from("bench.hotlist_campaigns")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .in("status", ["sending", "sent"])
    .gte("created_at", sevenDaysAgo.toISOString())

  // Urgent requirements (open)
  const { count: urgentRequirements } = await supabase
    .from("bench.hotlist_requirements")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("status", "open")
    .in("urgency", ["critical", "high"])

  // New replies (last 24 hours)
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const { count: newReplies } = await supabase
    .from("bench.hotlist_replies")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("received_at", oneDayAgo.toISOString())

  // Response rate (last 7 days)
  const { count: totalSent } = await supabase
    .from("bench.hotlist_messages")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("status", "delivered")
    .gte("created_at", sevenDaysAgo.toISOString())

  const { count: totalReplies } = await supabase
    .from("bench.hotlist_replies")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("received_at", sevenDaysAgo.toISOString())

  const responseRate = totalSent && totalSent > 0 ? Math.round(((totalReplies || 0) / totalSent) * 100) : 0

  // Time to submit (median - placeholder calculation)
  const medianTimeToSubmit = 2.3 // days - placeholder

  return {
    activeCampaigns: activeCampaigns || 0,
    urgentRequirements: urgentRequirements || 0,
    newReplies: newReplies || 0,
    responseRate,
    medianTimeToSubmit,
  }
}

/**
 * Get hotlist activity stream
 */
export async function getHotlistActivity(limit = 20) {
  await requirePermission(PERMISSIONS.HOTLIST_DASHBOARD_VIEW)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  // Get recent audit logs for hotlist
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*, user:user_id(email, full_name)")
    .eq("tenant_id", tenantId)
    .like("action", "hotlist.%")
    .order("created_at", { ascending: false })
    .limit(limit)

  return auditLogs || []
}

/**
 * Get campaign performance metrics
 */
export async function getCampaignPerformance(campaignId?: string) {
  await requirePermission(PERMISSIONS.HOTLIST_ANALYTICS_VIEW)

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const tenantId = user.user_metadata?.tenant_id
  if (!tenantId) throw new Error("No tenant found")

  let query = supabase
    .from("bench.hotlist_campaigns")
    .select(
      `
      id,
      name,
      type,
      status,
      total_recipients,
      sent_count,
      delivered_count,
      opened_count,
      replied_count,
      interested_count,
      created_at,
      sent_at
    `,
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })

  if (campaignId) {
    query = query.eq("id", campaignId)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data || []
}

export const getKPITiles = getHotlistAnalyticsTiles
export const getActivityStream = getHotlistActivity
