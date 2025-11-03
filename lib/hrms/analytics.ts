"use server"

import { createServerClient } from "@/lib/supabase/server"
import { hasFeatures } from "@/lib/fbac"

export type MetricDefinition = {
  key: string
  name: string
  description: string
  formula: string
  unit: string
  category: string
}

export const METRICS_REGISTRY: Record<string, MetricDefinition> = {
  headcount: {
    key: "headcount",
    name: "Headcount",
    description: "Active employees as of period end",
    formula: "SUM(active_count) FROM analytics.fact_headcount",
    unit: "count",
    category: "workforce",
  },
  attrition_pct: {
    key: "attrition_pct",
    name: "Attrition %",
    description: "Leavers / avg(headcount start, end) × 100",
    formula: "(leavers / avg_headcount) × 100",
    unit: "percent",
    category: "workforce",
  },
  utilization_pct: {
    key: "utilization_pct",
    name: "Utilization %",
    description: "Recorded billable hours / capacity hours × 100",
    formula: "(billable_hours / capacity_hours) × 100",
    unit: "percent",
    category: "operations",
  },
  timesheet_ontime_pct: {
    key: "timesheet_ontime_pct",
    name: "Timesheet On-Time %",
    description: "On-time / (on-time + late + missing) × 100",
    formula: "(on_time / (on_time + late + missing)) × 100",
    unit: "percent",
    category: "operations",
  },
  dso: {
    key: "dso",
    name: "DSO",
    description: "Weighted days from issue→paid across invoices",
    formula: "Weighted average of (paid_date - issue_date)",
    unit: "days",
    category: "finance",
  },
  i9_ontime_pct: {
    key: "i9_ontime_pct",
    name: "I-9 On-Time %",
    description: "Completed S1/S2 within deadline / due count × 100",
    formula: "(i9_complete / i9_due) × 100",
    unit: "percent",
    category: "compliance",
  },
  case_breach_pct: {
    key: "case_breach_pct",
    name: "Case Breach %",
    description: "Breached / opened × 100",
    formula: "(breached / opened) × 100",
    unit: "percent",
    category: "operations",
  },
  compa_ratio_median: {
    key: "compa_ratio_median",
    name: "Compa-Ratio (Median)",
    description: "Median(current_base / band_mid) across eligible population",
    formula: "MEDIAN(current_base / band_mid)",
    unit: "ratio",
    category: "compensation",
  },
}

export type FilterInput = {
  from: string
  to: string
  orgId?: string
  locationId?: string
  employeeType?: string
  band?: string
  grade?: string
  managerId?: string
  clientId?: string
  projectId?: string
}

export async function getOverviewKpis(filters: FilterInput) {
  const supabase = await createServerClient()
  const permissions = await hasFeatures(["analytics.hr", "analytics.finance_adjacent"])

  // Fetch headcount
  const { data: headcountData } = await supabase
    .from("fact_headcount")
    .select("active_count, joiners, leavers")
    .gte("date_key", filters.from)
    .lte("date_key", filters.to)

  const totalHeadcount = headcountData?.reduce((sum: number, row: any) => sum + (row.active_count || 0), 0) || 0
  const totalJoiners = headcountData?.reduce((sum: number, row: any) => sum + (row.joiners || 0), 0) || 0
  const totalLeavers = headcountData?.reduce((sum: number, row: any) => sum + (row.leavers || 0), 0) || 0
  const attritionPct = totalHeadcount > 0 ? ((totalLeavers / totalHeadcount) * 100).toFixed(2) : "0.00"

  // Fetch timesheets
  const { data: timesheetData } = await supabase
    .from("fact_timesheets")
    .select("on_time, late, missing, overtime_anomalies")
    .gte("week_key", filters.from)
    .lte("week_key", filters.to)

  const totalOnTime = timesheetData?.reduce((sum: number, row: any) => sum + (row.on_time || 0), 0) || 0
  const totalLate = timesheetData?.reduce((sum: number, row: any) => sum + (row.late || 0), 0) || 0
  const totalMissing = timesheetData?.reduce((sum: number, row: any) => sum + (row.missing || 0), 0) || 0
  const totalTimesheets = totalOnTime + totalLate + totalMissing
  const timesheetOnTimePct = totalTimesheets > 0 ? ((totalOnTime / totalTimesheets) * 100).toFixed(2) : "0.00"

  // Fetch compliance
  const { data: complianceData } = await supabase
    .from("fact_compliance")
    .select("i9_due, i9_complete, policy_assigned, policy_acked")
    .gte("date_key", filters.from)
    .lte("date_key", filters.to)

  const totalI9Due = complianceData?.reduce((sum: number, row: any) => sum + (row.i9_due || 0), 0) || 0
  const totalI9Complete = complianceData?.reduce((sum: number, row: any) => sum + (row.i9_complete || 0), 0) || 0
  const i9OnTimePct = totalI9Due > 0 ? ((totalI9Complete / totalI9Due) * 100).toFixed(2) : "100.00"

  // Fetch helpdesk cases
  const { data: casesData } = await supabase
    .from("fact_cases")
    .select("opened, breached")
    .gte("date_key", filters.from)
    .lte("date_key", filters.to)

  const totalOpened = casesData?.reduce((sum: number, row: any) => sum + (row.opened || 0), 0) || 0
  const totalBreached = casesData?.reduce((sum: number, row: any) => sum + (row.breached || 0), 0) || 0
  const caseBreachPct = totalOpened > 0 ? ((totalBreached / totalOpened) * 100).toFixed(2) : "0.00"

  return {
    headcount: totalHeadcount,
    attritionPct,
    timesheetOnTimePct,
    i9OnTimePct,
    caseBreachPct,
    hasFinanceAccess: permissions["analytics.finance_adjacent"],
  }
}

export async function getHeadcountTrend(filters: FilterInput) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("fact_headcount")
    .select("date_key, active_count, joiners, leavers")
    .gte("date_key", filters.from)
    .lte("date_key", filters.to)
    .order("date_key", { ascending: true })

  return data || []
}

export async function getTimesheetTrend(filters: FilterInput) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("fact_timesheets")
    .select("week_key, on_time, late, missing, overtime_anomalies")
    .gte("week_key", filters.from)
    .lte("week_key", filters.to)
    .order("week_key", { ascending: true })

  return data || []
}

export async function getComplianceTrend(filters: FilterInput) {
  const supabase = await createServerClient()

  const { data } = await supabase
    .from("fact_compliance")
    .select("date_key, i9_due, i9_complete, policy_assigned, policy_acked")
    .gte("date_key", filters.from)
    .lte("date_key", filters.to)
    .order("date_key", { ascending: true })

  return data || []
}
