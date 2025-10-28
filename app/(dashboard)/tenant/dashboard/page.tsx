import { redirect } from "next/navigation"
import {
  getTenantContext,
  getKpis,
  getModuleUsage,
  getAuditTimeline,
  getAiDigest,
  getForecasts,
  getTrustMetrics,
  getMlInsights,
  getRpaStatus,
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
import { RpaAutomationHub } from "@/components/dashboard/rpa-automation-hub"
import { MlInsightsPanel } from "@/components/tenant-dashboard/ml-insights-panel"

export const dynamic = "force-dynamic"

export default async function TenantDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const context = await getTenantContext()

  if ("error" in context) {
    redirect("/login")
  }

  const params = await searchParams
  const dateRange = {
    from: params.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    to: params.to || new Date().toISOString(),
  }

  const [
    kpisResult,
    moduleUsageResult,
    auditTimelineResult,
    aiDigestResult,
    forecastsResult,
    trustMetricsResult,
    mlInsightsResult,
    rpaStatusResult,
  ] = await Promise.all([
    getKpis(dateRange),
    getModuleUsage(dateRange),
    getAuditTimeline({ limit: 12 }),
    context.features.copilot ? getAiDigest(dateRange) : Promise.resolve(null),
    getForecasts(dateRange),
    getTrustMetrics(),
    getMlInsights(),
    getRpaStatus(),
  ])

  if ("error" in kpisResult) {
    return <ErrorState message={kpisResult.error} />
  }

  if ("error" in moduleUsageResult) {
    return <ErrorState message={moduleUsageResult.error} />
  }

  const auditEntries = Array.isArray(auditTimelineResult) ? auditTimelineResult : []
  const moduleUsage = Array.isArray(moduleUsageResult) ? moduleUsageResult : []

  // Normalize AI digest result shape for AiDigest component
  const aiInitial =
    context.features.copilot && aiDigestResult && !("error" in aiDigestResult)
      ? {
          text: aiDigestResult.text || "",
          tokens: typeof aiDigestResult.tokens === "number" ? aiDigestResult.tokens : 0,
          cost: typeof aiDigestResult.cost === "number" ? aiDigestResult.cost : 0,
        }
      : undefined

  // Normalize forecast shapes to match ForecastData (date, value, lower, upper)
  const normalizeForecast = (arr: any[] | undefined) =>
    Array.isArray(arr)
      ? arr.map((it) => ({
          date: it.date ?? it.month ?? new Date().toISOString(),
          value: typeof it.value === "number" ? it.value : typeof it.forecast === "number" ? it.forecast : 0,
          lower: typeof it.lower === "number" ? it.lower : 0,
          upper: typeof it.upper === "number" ? it.upper : 0,
        }))
      : []

  const activityForecast = normalizeForecast(forecastsResult?.activity)
  const userGrowthForecast = normalizeForecast(forecastsResult?.userGrowth)

  // Normalize trust metrics shape expected by TrustBadges
  const trustMetrics =
    trustMetricsResult && !("error" in trustMetricsResult)
      ? {
          auditTrail: {
            enabled: trustMetricsResult.auditTrail?.enabled || false,
            totalEntries:
              typeof trustMetricsResult.auditTrail?.entriesCount === "number"
                ? trustMetricsResult.auditTrail.entriesCount
                : 0,
            lastVerified: trustMetricsResult.auditTrail?.lastVerified ?? null,
          },
          encryption: {
            enabled: trustMetricsResult.encryption?.enabled || false,
            algorithm: trustMetricsResult.encryption?.algorithm || "",
          },
          compliance: {
            soc2: !!trustMetricsResult.compliance?.soc2,
            gdpr: !!trustMetricsResult.compliance?.gdpr,
            hipaa: !!trustMetricsResult.compliance?.hipaa,
          },
          uptime: {
            percentage: trustMetricsResult.uptime?.percentage ?? 0,
            lastIncident: trustMetricsResult.uptime?.lastIncident ?? null,
          },
        }
      : undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
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
            {context.features.copilot && aiInitial ? (
              <AiDigest initialDigest={aiInitial} dateRange={dateRange} />
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

        {mlInsightsResult && !("error" in mlInsightsResult) && mlInsightsResult.insights.length > 0 && (
          <MlInsightsPanel insights={mlInsightsResult.insights} />
        )}

        {forecastsResult && !("error" in forecastsResult) && (
          <ForecastsChart activityForecast={activityForecast} userGrowthForecast={userGrowthForecast} />
        )}

        {rpaStatusResult && !("error" in rpaStatusResult) && <RpaAutomationHub />}

        {trustMetricsResult && !("error" in trustMetricsResult) && trustMetrics && (
          <TrustBadges metrics={trustMetrics} />
        )}

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

        <QuickActions features={context.features} tenantSlug={context.slug} tenantId={context.tenantId} />
      </div>
    </div>
  )
}
