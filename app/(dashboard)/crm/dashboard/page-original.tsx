import { Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"
import { hasPermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import {
  getContext,
  getKpis,
  getPipelineHealth,
  getForecast,
  getActivities,
  getTasks,
  getTopDeals,
  getAtRisk,
  getAuditMini,
} from "./actions"
import { Header } from "@/components/crm-dashboard/header"
import { KpiStrip } from "@/components/crm-dashboard/kpi-strip"
import { PipelineHealth } from "@/components/crm-dashboard/pipeline-health"
import { ForecastCard } from "@/components/crm-dashboard/forecast-card"
import { ActivityPanel } from "@/components/crm-dashboard/activity-panel"
import { TaskList } from "@/components/crm-dashboard/task-list"
import { TopDeals } from "@/components/crm-dashboard/top-deals"
import { AtRisk } from "@/components/crm-dashboard/at-risk"
import { AiCopilot } from "@/components/crm-dashboard/ai-copilot"
import { AuditMini } from "@/components/crm-dashboard/audit-mini"
import { LoadingSkeleton } from "@/components/crm-dashboard/loading-skeleton"
import { TwoPane } from "@/components/layout/two-pane"
import { CRMDashboardSidebar } from "@/components/crm/crm-dashboard-sidebar"

// This page reads auth context and server data; force dynamic to avoid SSG issues
export const dynamic = "force-dynamic"

export default async function CRMDashboardPage({
  searchParams,
}: {
  searchParams: { owner?: string; from?: string; to?: string }
}) {
  // Check permission but don't hard-redirect in dev; render minimal view when missing
  const canView = await hasPermission(PERMISSIONS.CRM_DASHBOARD_VIEW)
  // Dev bypass flags to allow viewing without RBAC in local/dev
  const canViewEffective = canView || process.env.RBAC_BYPASS === "1" || process.env.ADMIN_BYPASS === "1"

  // Get context and features
  const context = await getContext().catch(() => ({
    features: { copilot: false, reports: false, audit: false },
  }))

  // Default date range: last 30 days
  const to = searchParams.to || new Date().toISOString()
  const from = searchParams.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  return (
    <TwoPane right={<CRMDashboardSidebar />}>
      <div className="space-y-6">
      {!canViewEffective && (
        <Alert variant="destructive" className="max-w-3xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Viewing CRM analytics requires permissions. Showing a limited dashboard view.
          </AlertDescription>
        </Alert>
      )}

      <Header />

      {canViewEffective ? (
        <Suspense fallback={<LoadingSkeleton />}>
          <DashboardContent from={from} to={to} features={context.features} />
        </Suspense>
      ) : (
        // Limited view: lightweight placeholders without hitting server actions
        <div className="space-y-6">
          <LoadingSkeleton />
        </div>
      )}
      </div>
    </TwoPane>
  )
}

async function DashboardContent({
  from,
  to,
  features,
}: {
  from: string
  to: string
  features: { copilot: boolean; reports: boolean; audit: boolean }
}) {
  // Fetch all data in parallel
  const [kpis, pipeline, forecast, activities, tasks, topDeals, atRisk, auditMini] = await Promise.all([
    getKpis({ from, to }),
    getPipelineHealth({ from, to }),
    features.reports ? getForecast({ horizonDays: 90 }) : null,
    getActivities({ limit: 20 }),
    getTasks({ myOnly: true }),
    getTopDeals({ limit: 10 }),
    getAtRisk({ limit: 10 }),
    features.audit ? getAuditMini({ limit: 6 }) : null,
  ])

  return (
    <>
      {/* KPI Strip */}
      <KpiStrip kpis={kpis} />

      {/* Pipeline & Forecast */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <PipelineHealth data={pipeline} />
        </div>
        {features.reports && forecast && (
          <div className="lg:col-span-5">
            <ForecastCard data={forecast} />
          </div>
        )}
      </div>

      {/* Activities & Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityPanel activities={activities} />
        <TaskList tasks={tasks} />
      </div>

      {/* Top Deals & At-Risk */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopDeals deals={topDeals} />
        <AtRisk deals={atRisk} />
      </div>

      {/* AI Copilot & Audit */}
      <div className="grid gap-6 lg:grid-cols-12">
        {features.copilot && (
          <div className="lg:col-span-8">
            <AiCopilot from={from} to={to} />
          </div>
        )}
        {features.audit && auditMini && (
          <div className={features.copilot ? "lg:col-span-4" : "lg:col-span-12"}>
            <AuditMini audits={auditMini} />
          </div>
        )}
      </div>
    </>
  )
}
