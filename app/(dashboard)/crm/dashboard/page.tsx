import { Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert, TrendingUp, Users, Target, Zap } from "lucide-react"
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
import { CRMRealtimeProvider } from "@/components/crm/realtime/crm-realtime-context"
import { LiveCRMKpiStrip } from "@/components/crm/realtime/live-crm-kpi-strip"
import { CRMActivityTicker } from "@/components/crm/realtime/crm-activity-ticker"
import { AIPoweredInsights } from "@/components/crm/ai/ai-powered-insights"
import { CRMCockpit } from "@/components/crm/cockpit/crm-cockpit"

// This page reads auth context and server data; force dynamic to avoid SSG issues
export const dynamic = "force-dynamic"

export default async function CRMDashboardPage({
  searchParams,
}: {
  searchParams: { owner?: string; from?: string; to?: string }
}) {
  // Check permission but don't hard-redirect in dev; render minimal view when missing
  const canView = await hasPermission(PERMISSIONS.CRM_DASHBOARD_VIEW)

  // Consolidated dev bypass flag(s). Respect the new NEXT_PUBLIC_ENABLE_DEV_AUTH toggle
  const devBypass =
    process.env.RBAC_BYPASS === "1" || process.env.ADMIN_BYPASS === "1" || process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === "1"

  // Effective view permissions in dev/test environments
  const canViewEffective = canView || devBypass

  // Check analytics permission separately so we can show a limited dashboard view
  const canViewAnalytics = await hasPermission(PERMISSIONS.REPORTS_ANALYTICS_VIEW)
  const canViewAnalyticsEffective = canViewAnalytics || devBypass

  // Get context and features
  const context = await getContext().catch(() => ({
    features: { copilot: true, reports: true, audit: true, ai_insights: true, realtime: true },
  }))

  // Default date range: last 30 days
  const to = searchParams.to || new Date().toISOString()
  const from = searchParams.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  return (
    <CRMRealtimeProvider>
      <TwoPane right={<CRMDashboardSidebar />}>
        <div className="space-y-6">
          {!canViewEffective && (
            <Alert variant="destructive" className="max-w-3xl">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <AlertDescription>
                Viewing CRM analytics requires permissions. Showing a limited dashboard view.
              </AlertDescription>
            </Alert>
          )}

          {/* Futuristic Header with AI Status */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    CRM Command Center
                  </h1>
                  <p className="text-gray-600 mt-1">AI-Powered Customer Relationship Intelligence</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    AI Assistant Active
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Zap className="w-3 h-3" />
                    Real-time Updates
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Activity Ticker */}
          <CRMActivityTicker />

          {canViewEffective ? (
            <Suspense fallback={<LoadingSkeleton />}>
                <DashboardContent from={from} to={to} features={context.features} canViewAnalytics={canViewAnalyticsEffective} />
              </Suspense>
          ) : (
            // Limited view: lightweight placeholders without hitting server actions
            <div className="space-y-6">
              <LoadingSkeleton />
            </div>
          )}
        </div>
      </TwoPane>
    </CRMRealtimeProvider>
  )
}

async function DashboardContent({
  from,
  to,
  features,
  canViewAnalytics,
}: {
  from: string
  to: string
  features: { copilot: boolean; reports: boolean; audit: boolean; ai_insights?: boolean; realtime?: boolean }
  canViewAnalytics: boolean
}) {
  // Fetch all data in parallel
  const [kpis, pipeline, forecast, activities, tasks, topDeals, atRisk, auditMini] = await Promise.all([
    // Only fetch analytics-heavy resources when the user has analytics permission
    canViewAnalytics ? getKpis({ from, to }) : Promise.resolve({}),
    canViewAnalytics ? getPipelineHealth({ from, to }) : Promise.resolve(null),
    features.reports && canViewAnalytics ? getForecast({ horizonDays: 90 }) : Promise.resolve(null),
    getActivities({ limit: 20 }),
    getTasks({ myOnly: true }),
    canViewAnalytics ? getTopDeals({ limit: 10 }) : Promise.resolve([]),
    canViewAnalytics ? getAtRisk({ limit: 10 }) : Promise.resolve([]),
    features.audit && canViewAnalytics ? getAuditMini({ limit: 6 }) : Promise.resolve(null),
  ])

  return (
    <>
      {/* Live KPI Strip with Real-time Updates */}
      {features.realtime ? (
        <LiveCRMKpiStrip initialKpis={kpis} />
      ) : (
        <KpiStrip kpis={kpis} />
      )}

      {/* AI-Powered Insights Section */}
      {features.ai_insights && canViewAnalytics && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AIPoweredInsights kpis={kpis} pipeline={pipeline} />
          </div>
          <div className="lg:col-span-4">
            <CRMCockpit />
          </div>
        </div>
      )}

      {/* Enhanced Pipeline & Forecast with Glass Morphism */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 rounded-2xl" />
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <PipelineHealth data={pipeline} />
            </div>
          </div>
        </div>
        {features.reports && forecast && canViewAnalytics && (
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-emerald-500/5 rounded-2xl" />
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <ForecastCard data={forecast} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Activities & Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-orange-500/5 rounded-2xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <ActivityPanel activities={activities} />
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <TaskList tasks={tasks} />
          </div>
        </div>
      </div>

      {/* Enhanced Top Deals & At-Risk */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-blue-500/5 rounded-2xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            {canViewAnalytics ? <TopDeals deals={topDeals} /> : <div className="p-6 text-sm text-muted-foreground">Top deals are hidden</div>}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-pink-500/5 rounded-2xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            {canViewAnalytics ? <AtRisk deals={atRisk} /> : <div className="p-6 text-sm text-muted-foreground">At-risk deals are hidden</div>}
          </div>
        </div>
      </div>

      {/* Enhanced AI Copilot & Audit */}
      <div className="grid gap-6 lg:grid-cols-12">
        {features.copilot && (
          <div className="lg:col-span-8">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-purple-500/5 rounded-2xl" />
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <AiCopilot from={from} to={to} />
              </div>
            </div>
          </div>
        )}
        {features.audit && auditMini && canViewAnalytics && (
          <div className={features.copilot ? "lg:col-span-4" : "lg:col-span-12"}>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-slate-500/5 to-gray-500/5 rounded-2xl" />
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <AuditMini audits={auditMini} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
