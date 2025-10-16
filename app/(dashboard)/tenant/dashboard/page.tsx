import { redirect } from "next/navigation"
import {
  getTenantContext,
  getKpis,
  getModuleUsage,
  getAuditTimeline,
  getAiDigest,
  getForecasts,
  getTrustMetrics,
} from "./actions"
import { KpiGrid } from "@/components/tenant-dashboard/kpi-grid"
import { ModuleUsage } from "@/components/tenant-dashboard/module-usage"
import { AiDigest } from "@/components/tenant-dashboard/ai-digest"
import { AuditTimeline } from "@/components/tenant-dashboard/audit-timeline"
import { QuickActions } from "@/components/tenant-dashboard/quick-actions"
import { TenantHeader } from "@/components/tenant-dashboard/tenant-header"
import { ErrorState } from "@/components/tenant-dashboard/error-state"
import { EmptyState } from "@/components/tenant-dashboard/empty-state"
import { ForecastsChart } from "@/components/tenant-dashboard/forecasts-chart"
import { TrustBadges } from "@/components/tenant-dashboard/trust-badges"

export default async function TenantDashboardPage() {
  const context = await getTenantContext()

  if ("error" in context) {
    redirect("/signin")
  }

  const dateRange = {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  }

  const [kpisResult, moduleUsageResult, auditTimelineResult, aiDigestResult, forecastsResult, trustMetricsResult] =
    await Promise.all([
      getKpis(dateRange),
      getModuleUsage(dateRange),
      getAuditTimeline({ limit: 12 }),
      context.features.copilot ? getAiDigest(dateRange) : Promise.resolve(null),
      getForecasts(dateRange),
      getTrustMetrics(),
    ])

  if ("error" in kpisResult) {
    return <ErrorState message={kpisResult.error} />
  }

  if ("error" in moduleUsageResult) {
    return <ErrorState message={moduleUsageResult.error} />
  }

  const auditEntries = Array.isArray(auditTimelineResult) ? auditTimelineResult : []
  const moduleUsage = Array.isArray(moduleUsageResult) ? moduleUsageResult : []

  return (
    <div className="space-y-6 p-6">
      <TenantHeader tenantName={context.name} slug={context.slug} />

      <KpiGrid kpis={kpisResult} features={context.features} />

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          {moduleUsage.length > 0 ? (
            <ModuleUsage data={moduleUsage} />
          ) : (
            <EmptyState title="No Module Usage" description="Start using modules to see usage statistics" />
          )}
        </div>
        <div className="lg:col-span-3">
          {context.features.copilot && aiDigestResult && !("error" in aiDigestResult) ? (
            <AiDigest initialDigest={aiDigestResult} dateRange={dateRange} />
          ) : (
            <EmptyState
              title="AI Digest Unavailable"
              description="Enable Copilot feature to see AI-generated insights"
              actionLabel="Configure Features"
              actionHref="/tenant/configuration"
            />
          )}
        </div>
      </div>

      {forecastsResult && !("error" in forecastsResult) && (
        <ForecastsChart activityForecast={forecastsResult.activity} userGrowthForecast={forecastsResult.userGrowth} />
      )}

      {trustMetricsResult && !("error" in trustMetricsResult) && <TrustBadges metrics={trustMetricsResult} />}

      {auditEntries.length > 0 ? (
        <AuditTimeline entries={auditEntries} />
      ) : (
        <EmptyState
          title="No Audit Entries"
          description="Audit entries will appear here as you use the platform"
          actionLabel="Explore Security & Trust"
          actionHref="/tenant/security"
        />
      )}

      <QuickActions features={context.features} tenantSlug={context.slug} />
    </div>
  )
}
