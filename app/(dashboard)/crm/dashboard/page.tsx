import { Suspense } from "react"
import { hasPermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { redirect } from "next/navigation"
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

export default async function CRMDashboardPage({
  searchParams,
}: {
  searchParams: { owner?: string; from?: string; to?: string }
}) {
  // Check permission
  const canView = await hasPermission(PERMISSIONS.CRM_DASHBOARD_VIEW)
  if (!canView) {
    redirect("/unauthorized")
  }

  // Get context and features
  const context = await getContext()

  // Default date range: last 30 days
  const to = searchParams.to || new Date().toISOString()
  const from = searchParams.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  return (
    <div className="space-y-6 p-6">
      <Header />

      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent from={from} to={to} features={context.features} />
      </Suspense>
    </div>
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
