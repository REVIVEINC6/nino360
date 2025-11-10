"use server"

import { createServerClient } from "@/lib/supabase/server"
import { queryWarehouse, getWarehouseConfig } from "@/lib/warehouse"

export async function getWarehouseStatus() {
  const config = await getWarehouseConfig()
  return {
    enabled: config.enabled,
    provider: config.provider,
  }
}

export async function executeWarehouseQuery(sql: string) {
  const supabase = await createServerClient()

  // Verify user has warehouse access
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: "Unauthorized" }
  }

  // Validate SQL (only SELECT allowed)
  if (!sql.trim().toLowerCase().startsWith("select")) {
    return { data: null, error: "Only SELECT queries allowed" }
  }

  // Check for dangerous operations
  const dangerous = ["drop", "delete", "update", "insert", "alter", "create", "truncate"]
  if (dangerous.some((op) => sql.toLowerCase().includes(op))) {
    return { data: null, error: "Dangerous operations not allowed" }
  }

  try {
    const result = await queryWarehouse(sql)
    return result
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function getAvailableMarts() {
  const config = await getWarehouseConfig()

  if (!config.enabled) {
    return []
  }

  return [
    { schema: "mart_finance", tables: ["ar_open", "ap_open", "revenue"] },
    { schema: "mart_ats", tables: ["applications", "pipeline", "time_to_hire"] },
    { schema: "mart_bench", tables: ["availability", "utilization", "placements"] },
    { schema: "mart_vms", tables: ["vendor_performance", "compliance"] },
    { schema: "mart_hrms", tables: ["headcount", "attrition", "attendance"] },
    { schema: "mart_projects", tables: ["delivery", "burn_rate", "milestones"] },
    { schema: "mart_crm", tables: ["pipeline", "win_rate", "accounts"] },
    { schema: "mart_hotlist", tables: ["matches", "fill_rate", "time_to_submit"] },
    { schema: "mart_lms", tables: ["completions", "engagement", "certifications"] },
  ]
}
