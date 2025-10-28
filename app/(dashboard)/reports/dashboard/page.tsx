import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiSeries } from "@/components/reports/kpi-series"
import { getKpiSeries } from "@/app/(dashboard)/reports/actions/charts"
import { Users, Briefcase, DollarSign, FolderKanban } from "lucide-react"

export const dynamic = "force-dynamic"

async function getKpis() {
  const supabase = await createServerClient()
  const { data } = await supabase.from("rpt.kpis_current").select("*").limit(1).single()

  return (
    data || {
      open_jobs: 0,
      bench_pool: 0,
      ar_open: 0,
      ap_open: 0,
      active_projects: 0,
    }
  )
}

export default async function ReportsDashboard() {
  const kpis = await getKpis()
  // Fetch series data in parallel
  const [revenueSeries, atsSeries, benchSeries, projectSeries] = await Promise.all([
    getKpiSeries("rpt.kpi_finance_daily", ["ar_invoiced", "ar_collected"], 30),
    getKpiSeries("rpt.kpi_ats_daily", ["hires", "offers"], 30),
    getKpiSeries("rpt.kpi_bench_daily", ["bench", "marketing", "deployed"], 30),
    getKpiSeries("rpt.kpi_projects_daily", ["logged_hours", "est_hours"], 30),
  ])

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Open Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{kpis.open_jobs}</div>
            <p className="text-muted-foreground text-xs">Active requisitions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Bench Pool</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{kpis.bench_pool}</div>
            <p className="text-muted-foreground text-xs">Available consultants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">AR Open</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">${(kpis.ar_open || 0).toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">Outstanding receivables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">AP Open</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">${(kpis.ap_open || 0).toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">Outstanding payables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{kpis.active_projects}</div>
            <p className="text-muted-foreground text-xs">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <KpiSeries title="Revenue vs Collection (30d)" yKeys={["ar_invoiced", "ar_collected"]} data={revenueSeries} />
        <KpiSeries title="ATS Hires & Offers" yKeys={["hires", "offers"]} data={atsSeries} />
        <KpiSeries title="Bench Status" yKeys={["bench", "marketing", "deployed"]} data={benchSeries} />
        <KpiSeries title="Project Hours" yKeys={["logged_hours", "est_hours"]} data={projectSeries} />
      </div>
    </div>
  )
}
