"use server"

import { createClient } from "@/lib/supabase/server"

export async function getVMSDashboardData() {
  const supabase = await createClient()

  // Get vendor metrics
  const { data: vendors } = await supabase
    .from("vendors")
    .select("id, status")
    .eq("tenant_id", (await supabase.auth.getUser()).data.user?.id)

  const totalVendors = vendors?.length || 0
  const activeVendors = vendors?.filter((v) => v.status === "active").length || 0

  // Get submission metrics
  const { data: submissions } = await supabase
    .from("vendor_submissions")
    .select("id, status")
    .eq("tenant_id", (await supabase.auth.getUser()).data.user?.id)

  const totalSubmissions = submissions?.length || 0
  const pendingSubmissions = submissions?.filter((s) => s.status === "pending").length || 0

  // Get timesheet metrics
  const { data: timesheets } = await supabase
    .from("vendor_timesheets")
    .select("id, status, hours")
    .eq("tenant_id", (await supabase.auth.getUser()).data.user?.id)

  const pendingTimesheets = timesheets?.filter((t) => t.status === "pending").length || 0
  const totalHours = timesheets?.reduce((sum, t) => sum + (t.hours || 0), 0) || 0

  return {
    totalVendors,
    activeVendors,
    totalSubmissions,
    pendingSubmissions,
    pendingTimesheets,
    totalHours,
  }
}
