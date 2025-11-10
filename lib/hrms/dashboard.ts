import "server-only"
import { createServerClient } from "@/lib/supabase/server"
import { hasFeatures } from "@/lib/fbac"

export interface DashboardKpis {
  headcount: number
  attrition_pct: number
  time_to_fill_days: number | null
  timesheet_on_time_pct: number
  overtime_anomalies: number
}

export interface ChartDataPoint {
  month?: string
  week?: string
  value?: number
  hires?: number
  exits?: number
  on_time?: number
  late?: number
  missing?: number
}

export interface PendingApproval {
  id: string
  type: string
  employee_name: string
  submitted_at: string
  status: string
}

export interface ComplianceItem {
  id: string
  employee_name: string
  item: string
  due: string
  risk: string
}

export interface Task {
  id: string
  type: string
  employee_name: string
  title: string
  due_date: string | null
  status: string
}

export interface AutomationRun {
  id: string
  workflow_name: string
  status: string
  started_at: string
  completed_at: string | null
}

export interface LedgerProof {
  id: string
  object_type: string
  object_id: string
  hash: string
  block: number | null
  notarized_at: string
}

export interface DashboardData {
  kpis: DashboardKpis
  charts: {
    headcount_trend: ChartDataPoint[]
    attrition_vs_hiring: ChartDataPoint[]
    timesheet_compliance: ChartDataPoint[]
  }
  lists: {
    pending_approvals: PendingApproval[]
    compliance_expiries: ComplianceItem[]
    tasks: Task[]
  }
  rightRail: {
    automation_runs: AutomationRun[]
    ledger_proofs: LedgerProof[]
  }
}

/**
 * Get HRMS dashboard data with RLS enforcement
 */
export async function getDashboardData(params: {
  orgId?: string
  from?: string
  to?: string
}): Promise<DashboardData> {
  const supabase = await createServerClient()

  // Check feature flags
  const features = await hasFeatures([
    "analytics.hr",
    "hrms.timesheets.read",
    "hrms.compliance.read",
    "hrms.immigration.read",
    "automation.timesheets",
    "ledger.notarize",
  ])

  // Get KPIs
  const kpis = await getKpis(supabase, params, features)

  // Get chart data
  const charts = await getCharts(supabase, params, features)

  // Get action lists
  const lists = await getLists(supabase, params, features)

  // Get right rail data
  const rightRail = await getRightRail(supabase, features)

  return { kpis, charts, lists, rightRail }
}

async function getKpis(
  supabase: any,
  params: { from?: string; to?: string },
  features: Record<string, boolean>,
): Promise<DashboardKpis> {
  const now = new Date()
  const endDate = params.to ? new Date(params.to) : now
  const startDate = params.from ? new Date(params.from) : new Date(now.getFullYear(), now.getMonth(), 1)

  // Headcount (active employees as of end date)
  const { count: headcount } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .lte("hire_date", endDate.toISOString().split("T")[0])
    .or(`termination_date.is.null,termination_date.gt.${endDate.toISOString().split("T")[0]}`)

  // Attrition % (exits / avg headcount * 100)
  const { count: exits } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .gte("termination_date", startDate.toISOString().split("T")[0])
    .lte("termination_date", endDate.toISOString().split("T")[0])

  const { count: headcountStart } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .lte("hire_date", startDate.toISOString().split("T")[0])
    .or(`termination_date.is.null,termination_date.gt.${startDate.toISOString().split("T")[0]}`)

  const avgHeadcount = ((headcountStart || 0) + (headcount || 0)) / 2
  const attrition_pct = avgHeadcount > 0 ? ((exits || 0) / avgHeadcount) * 100 : 0

  // Time to Fill (median days from approved to start for requisitions)
  let time_to_fill_days: number | null = null
  if (features["analytics.hr"]) {
    const { data: fills } = await supabase
      .from("requisition_fills")
      .select("approved_at, start_date")
      .gte("start_date", startDate.toISOString().split("T")[0])
      .lte("start_date", endDate.toISOString().split("T")[0])
      .not("approved_at", "is", null)
      .not("start_date", "is", null)

    if (fills && fills.length > 0) {
      const days = fills
        .map((f: any) => {
          const approved = new Date(f.approved_at)
          const started = new Date(f.start_date)
          return Math.floor((started.getTime() - approved.getTime()) / (1000 * 60 * 60 * 24))
        })
        .sort((a: number, b: number) => a - b)

      time_to_fill_days = days[Math.floor(days.length / 2)]
    }
  }

  // Timesheet On-Time %
  let timesheet_on_time_pct = 0
  if (features["hrms.timesheets.read"]) {
    const { count: onTime } = await supabase
      .from("timesheets")
      .select("*", { count: "exact", head: true })
      .gte("week_start", startDate.toISOString().split("T")[0])
      .lte("week_start", endDate.toISOString().split("T")[0])
      .in("status", ["submitted", "approved", "exported"])
      .lte("submitted_at", supabase.rpc("week_start_plus_3_days", { week_start: "week_start" }))

    const { count: total } = await supabase
      .from("timesheets")
      .select("*", { count: "exact", head: true })
      .gte("week_start", startDate.toISOString().split("T")[0])
      .lte("week_start", endDate.toISOString().split("T")[0])

    timesheet_on_time_pct = (total || 0) > 0 ? ((onTime || 0) / (total || 1)) * 100 : 0
  }

  // OT Anomalies
  const { count: overtime_anomalies } = await supabase
    .from("overtime_anomalies")
    .select("*", { count: "exact", head: true })
    .gte("week_start", startDate.toISOString().split("T")[0])
    .lte("week_start", endDate.toISOString().split("T")[0])

  return {
    headcount: headcount || 0,
    attrition_pct: Math.round(attrition_pct * 10) / 10,
    time_to_fill_days,
    timesheet_on_time_pct: Math.round(timesheet_on_time_pct * 10) / 10,
    overtime_anomalies: overtime_anomalies || 0,
  }
}

async function getCharts(
  supabase: any,
  params: { from?: string; to?: string },
  features: Record<string, boolean>,
): Promise<DashboardData["charts"]> {
  // Headcount trend (last 12 months)
  const { data: headcountData } = await supabase
    .from("vw_headcount_monthly")
    .select("month, value")
    .order("month", { ascending: true })
    .limit(12)

  // Attrition vs Hiring
  const { data: attritionData } = await supabase
    .from("vw_attrition_hiring")
    .select("month, hires, exits")
    .order("month", { ascending: true })
    .limit(12)

  // Timesheet compliance
  let timesheetData: ChartDataPoint[] = []
  if (features["hrms.timesheets.read"]) {
    const { data } = await supabase
      .from("vw_timesheet_compliance_weekly")
      .select("week, on_time, late, missing")
      .order("week", { ascending: true })
      .limit(12)

    timesheetData = data || []
  }

  return {
    headcount_trend: headcountData || [],
    attrition_vs_hiring: attritionData || [],
    timesheet_compliance: timesheetData,
  }
}

async function getLists(
  supabase: any,
  params: { from?: string; to?: string },
  features: Record<string, boolean>,
): Promise<DashboardData["lists"]> {
  // Pending approvals (timesheets, leaves, etc.)
  let pending_approvals: PendingApproval[] = []
  if (features["hrms.timesheets.read"]) {
    const { data: timesheets } = await supabase
      .from("timesheets")
      .select(`
        id,
        submitted_at,
        status,
        employee:employees(first_name, last_name)
      `)
      .eq("status", "submitted")
      .order("submitted_at", { ascending: true })
      .limit(10)

    pending_approvals = (timesheets || []).map((ts: any) => ({
      id: ts.id,
      type: "timesheet",
      employee_name: `${ts.employee?.first_name} ${ts.employee?.last_name}`,
      submitted_at: ts.submitted_at,
      status: ts.status,
    }))
  }

  // Compliance expiries (documents, I-9, immigration)
  let compliance_expiries: ComplianceItem[] = []
  if (features["hrms.compliance.read"]) {
    const { data: docs } = await supabase
      .from("documents")
      .select(`
        id,
        title,
        expires_at,
        employee:employees(first_name, last_name)
      `)
      .eq("status", "valid")
      .not("expires_at", "is", null)
      .lte("expires_at", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      .order("expires_at", { ascending: true })
      .limit(10)

    compliance_expiries = (docs || []).map((doc: any) => ({
      id: doc.id,
      employee_name: `${doc.employee?.first_name} ${doc.employee?.last_name}`,
      item: doc.title,
      due: doc.expires_at,
      risk: new Date(doc.expires_at) < new Date() ? "high" : "medium",
    }))
  }

  // Onboarding/Offboarding tasks
  const { data: onboardingTasks } = await supabase
    .from("onboarding_tasks")
    .select(`
      id,
      title,
      due_date,
      status,
      employee:employees(first_name, last_name)
    `)
    .eq("status", "open")
    .order("due_date", { ascending: true, nullsLast: true })
    .limit(10)

  const tasks: Task[] = (onboardingTasks || []).map((task: any) => ({
    id: task.id,
    type: "onboarding",
    employee_name: `${task.employee?.first_name} ${task.employee?.last_name}`,
    title: task.title,
    due_date: task.due_date,
    status: task.status,
  }))

  return {
    pending_approvals,
    compliance_expiries,
    tasks,
  }
}

async function getRightRail(supabase: any, features: Record<string, boolean>): Promise<DashboardData["rightRail"]> {
  // Automation runs
  let automation_runs: AutomationRun[] = []
  if (features["automation.timesheets"]) {
    const { data: runs } = await supabase
      .from("workflow_runs")
      .select("id, workflow_name, status, started_at, completed_at")
      .order("started_at", { ascending: false })
      .limit(5)

    automation_runs = runs || []
  }

  // Ledger proofs
  let ledger_proofs: LedgerProof[] = []
  if (features["ledger.notarize"]) {
    const { data: proofs } = await supabase
      .from("proofs")
      .select("id, object_type, object_id, hash, block, notarized_at")
      .order("notarized_at", { ascending: false })
      .limit(5)

    ledger_proofs = proofs || []
  }

  return {
    automation_runs,
    ledger_proofs,
  }
}
