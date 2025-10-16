import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiSeries } from "@/components/reports/kpi-series"
import { Users, Briefcase, DollarSign, FolderKanban } from "lucide-react"

export const dynamic = "force-dynamic"

async function getKpis() {
  const supabase = createServerClient()
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
        <KpiSeries
          title="Revenue vs Collection (30d)"
          view="rpt.kpi_finance_daily"
          yKeys={["ar_invoiced", "ar_collected"]}
          days={30}
        />
        <KpiSeries title="ATS Hires & Offers" view="rpt.kpi_ats_daily" yKeys={["hires", "offers"]} days={30} />
        <KpiSeries
          title="Bench Status"
          view="rpt.kpi_bench_daily"
          yKeys={["bench", "marketing", "deployed"]}
          days={30}
        />
        <KpiSeries
          title="Project Hours"
          view="rpt.kpi_projects_daily"
          yKeys={["logged_hours", "est_hours"]}
          days={30}
        />
      </div>
    </div>
  )
}
