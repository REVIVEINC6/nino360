"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getReportsOverview() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get tenant ID
  const { data: membership } = await supabase.from("user_tenants").select("tenant_id").eq("user_id", user.id).single()

  const tenantId = membership?.tenant_id

  // Query real report statistics
  const { data: reports, count: totalReports } = await supabase
    .from("reports")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)

  const { data: scheduledReports, count: scheduledCount } = await supabase
    .from("reports")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .eq("is_scheduled", true)

  const { data: sharedReports, count: sharedCount } = await supabase
    .from("reports")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .not("shared_with", "is", null)

  // Get recent reports
  const { data: recentReports } = await supabase
    .from("reports")
    .select("id, name, type, last_run_at, status, file_size")
    .eq("tenant_id", tenantId)
    .order("last_run_at", { ascending: false })
    .limit(10)

  // Get popular reports
  const { data: popularReports } = await supabase
    .from("reports")
    .select("name, run_count")
    .eq("tenant_id", tenantId)
    .order("run_count", { ascending: false })
    .limit(10)

  return {
    totalReports: totalReports || 0,
    scheduledReports: scheduledCount || 0,
    sharedReports: sharedCount || 0,
    recentReports: (recentReports || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      lastRun: r.last_run_at,
      status: r.status,
      size: r.file_size ? `${(r.file_size / 1024 / 1024).toFixed(1)} MB` : "0 MB",
    })),
    popularReports: (popularReports || []).map((r: any) => ({
      name: r.name,
      runs: r.run_count || 0,
    })),
  }
}
