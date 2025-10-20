import { Suspense } from "react"
import { getKpis, getAuditTimeline, getWeeklyDigest, getFeatureFlags, getUserPreferences } from "./actions"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { CopilotRibbon } from "@/components/dashboard/copilot-ribbon"
import { ForecastCard } from "@/components/dashboard/forecast-card"
import { Workboard } from "@/components/dashboard/workboard"
import { PipelineStage } from "@/components/dashboard/pipeline-stage"
import { HiringFunnel } from "@/components/dashboard/hiring-funnel"
import { BenchHotlist } from "@/components/dashboard/bench-hotlist"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, DollarSign, Briefcase, UserCheck, Sparkles, Brain, Zap } from "lucide-react"
import { ParticleBg } from "@/components/dashboard/particle-bg"
import { InvoiceList } from "@/components/dashboard/invoice-list"
import { ProjectHealth } from "@/components/dashboard/project-health"
import { VendorScorecard } from "@/components/dashboard/vendor-scorecard"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ArApAging } from "@/components/dashboard/ar-ap-aging"
import { TrustBadge } from "@/components/dashboard/trust-badge"
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel"
import { BlockchainAuditTrail } from "@/components/dashboard/blockchain-audit-trail"
import { RpaAutomationHub } from "@/components/dashboard/rpa-automation-hub"
import { PersonalizedInsightsPanel } from "@/components/dashboard/personalized-insights-panel"
import { PredictiveAnalyticsWidget } from "@/components/dashboard/predictive-analytics-widget"
import { AnomalyDetectionPanel } from "@/components/dashboard/anomaly-detection-panel"
import { AdaptiveLearningWidget } from "@/components/dashboard/adaptive-learning-widget"
import { SmartRecommendations } from "@/components/dashboard/smart-recommendations"

export const metadata = {
  title: "Dashboard | Nino360",
  description: "AI-native multi-tenant dashboard with advanced AI, ML, Blockchain, and RPA",
}

async function DashboardContent() {
  const [kpis, auditEntries, digest, featureFlags, userPreferences] = await Promise.all([
    getKpis(),
    getAuditTimeline({ limit: 15 }),
    getWeeklyDigest(),
    getFeatureFlags(),
    getUserPreferences().catch(() => null),
  ])

  const hasAtsAccess = featureFlags.talent
  const hasBenchAccess = featureFlags.bench
  const hasFinanceAccess = featureFlags.finance
  const hasHrmsAccess = featureFlags.hrms
  const hasCopilotAccess = true
  const hasAnalyticsAccess = featureFlags.analytics

  return (
    <>
      <ParticleBg />
      <div className="relative z-10 space-y-6">
        {hasCopilotAccess && (
          <div className="glass-card rounded-xl p-1 shadow-lg">
            <CopilotRibbon className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hasFinanceAccess && kpis.finance && (
            <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
              <KpiCard
                title="Revenue (MTD)"
                value={`$${(kpis.finance.arBalance / 1000).toFixed(1)}K`}
                icon={<DollarSign className="h-4 w-4 text-green-600" />}
                trend={{ value: 12, direction: "up" }}
                href="/finance"
                className="bg-transparent border-0 shadow-none"
              />
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Brain className="h-3 w-3 text-purple-500" />
                <span>AI-Enhanced</span>
              </div>
            </div>
          )}
          {hasAtsAccess && (
            <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
              <KpiCard
                title="Pipeline Value"
                value="$9.4M"
                icon={<Briefcase className="h-4 w-4 text-blue-600" />}
                trend={{ value: 6, direction: "up" }}
                href="/crm/pipeline"
                className="bg-transparent border-0 shadow-none"
              />
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-blue-500" />
                <span>ML Predicted</span>
              </div>
            </div>
          )}
          {hasAtsAccess && (
            <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
              <KpiCard
                title="Win Rate"
                value="28%"
                icon={<TrendingUp className="h-4 w-4 text-orange-600" />}
                trend={{ value: 2, direction: "down" }}
                href="/crm/analytics"
                className="bg-transparent border-0 shadow-none"
              />
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span>Real-time</span>
              </div>
            </div>
          )}
          {hasBenchAccess && kpis.bench && (
            <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 group">
              <KpiCard
                title="Bench Utilization"
                value={`${Math.round((kpis.bench.activeAllocations / (kpis.bench.activeAllocations + kpis.bench.onBench)) * 100)}%`}
                icon={<UserCheck className="h-4 w-4 text-purple-600" />}
                trend={{ value: 5, direction: "up" }}
                href="/bench/tracking"
                className="bg-transparent border-0 shadow-none"
              />
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Brain className="h-3 w-3 text-purple-500" />
                <span>AI Optimized</span>
              </div>
            </div>
          )}
        </div>

        {hasAnalyticsAccess && (
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <PersonalizedInsightsPanel />
          </div>
        )}

        <div className="glass-card rounded-xl p-6 shadow-lg">
          <AiInsightsPanel kpis={kpis} digest={digest} />
        </div>

        {hasAnalyticsAccess && (
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <AnomalyDetectionPanel kpis={kpis} />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <ForecastCard title="Sales Forecast (90-day)" type="sales" />
          </div>
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <ForecastCard title="Cashflow Projection" type="cashflow" />
          </div>
        </div>

        {hasAnalyticsAccess && (
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <PredictiveAnalyticsWidget />
          </div>
        )}

        <div className="glass-card rounded-xl p-6 shadow-lg">
          <Workboard />
        </div>

        {hasAnalyticsAccess && (
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <SmartRecommendations />
          </div>
        )}

        <div className="glass-card rounded-xl p-6 shadow-lg">
          <RpaAutomationHub />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {hasAtsAccess && (
            <div className="glass-card rounded-xl p-6 shadow-lg">
              <PipelineStage />
            </div>
          )}
          {hasAtsAccess && (
            <div className="glass-card rounded-xl p-6 shadow-lg">
              <HiringFunnel />
            </div>
          )}
        </div>

        {hasBenchAccess && (
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <BenchHotlist />
          </div>
        )}

        {hasAnalyticsAccess && (
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <AdaptiveLearningWidget />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {hasFinanceAccess && (
            <>
              <div className="glass-card rounded-xl p-6 shadow-lg">
                <ArApAging />
              </div>
              <div className="glass-card rounded-xl p-6 shadow-lg">
                <InvoiceList />
              </div>
            </>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <ProjectHealth />
          </div>
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <VendorScorecard />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-lg">
          <BlockchainAuditTrail auditEntries={auditEntries} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 glass-card rounded-xl p-6 shadow-lg">
            <ActivityFeed />
          </div>
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <TrustBadge />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 text-center shadow-lg">
          <p className="text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            © 2025 Nino360 — Powered by Advanced AI, ML, Blockchain & RPA
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Designed with Intelligence • Secured by Blockchain • Automated by RPA
          </p>
        </div>
      </div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
