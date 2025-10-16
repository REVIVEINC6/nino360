import { Suspense } from "react"
import { getKpis, getAuditTimeline, getWeeklyDigest } from "./actions"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { CopilotRibbon } from "@/components/dashboard/copilot-ribbon"
import { ForecastCard } from "@/components/dashboard/forecast-card"
import { Workboard } from "@/components/dashboard/workboard"
import { PipelineStage } from "@/components/dashboard/pipeline-stage"
import { HiringFunnel } from "@/components/dashboard/hiring-funnel"
import { BenchHotlist } from "@/components/dashboard/bench-hotlist"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, DollarSign, Briefcase, UserCheck } from "lucide-react"
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
import { neonGradientText } from "@/utils/styles"

export const metadata = {
  title: "Dashboard | Nino360",
  description: "AI-native multi-tenant dashboard with cross-module insights",
}

async function DashboardContent() {
  const [kpis, auditEntries, digest] = await Promise.all([
    getKpis(),
    getAuditTimeline({ limit: 15 }),
    getWeeklyDigest(),
  ])

  const hasAtsAccess = true
  const hasBenchAccess = true
  const hasFinanceAccess = true
  const hasHrmsAccess = true
  const hasCopilotAccess = true

  return (
    <>
      <ParticleBg />
      <div className="relative z-10 space-y-6">
        {hasCopilotAccess && <CopilotRibbon className="neon-gradient" />}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hasFinanceAccess && kpis.finance && (
            <KpiCard
              title="Revenue (MTD)"
              value={`$${(kpis.finance.arBalance / 1000).toFixed(1)}K`}
              icon={<DollarSign className="h-4 w-4" />}
              trend={{ value: 12, direction: "up" }}
              href="/finance"
              className="neon-gradient"
            />
          )}
          {hasAtsAccess && (
            <KpiCard
              title="Pipeline Value"
              value="$9.4M"
              icon={<Briefcase className="h-4 w-4" />}
              trend={{ value: 6, direction: "up" }}
              href="/crm/pipeline"
              className="neon-gradient"
            />
          )}
          {hasAtsAccess && (
            <KpiCard
              title="Win Rate"
              value="28%"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: 2, direction: "down" }}
              href="/crm/analytics"
              className="neon-gradient"
            />
          )}
          {hasBenchAccess && kpis.bench && (
            <KpiCard
              title="Bench Utilization"
              value={`${Math.round((kpis.bench.activeAllocations / (kpis.bench.activeAllocations + kpis.bench.onBench)) * 100)}%`}
              icon={<UserCheck className="h-4 w-4" />}
              trend={{ value: 5, direction: "up" }}
              href="/bench/tracking"
              className="neon-gradient"
            />
          )}
        </div>

        <AiInsightsPanel kpis={kpis} digest={digest} />

        <div className="grid gap-4 lg:grid-cols-2">
          <ForecastCard title="Sales Forecast (90-day)" type="sales" />
          <ForecastCard title="Cashflow Projection" type="cashflow" />
        </div>

        <Workboard />

        <RpaAutomationHub />

        <div className="grid gap-4 lg:grid-cols-2">
          {hasAtsAccess && <PipelineStage />}
          {hasAtsAccess && <HiringFunnel />}
        </div>

        {hasBenchAccess && (
          <div className="grid gap-4">
            <BenchHotlist />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {hasFinanceAccess && (
            <>
              <ArApAging />
              <InvoiceList />
            </>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ProjectHealth />
          <VendorScorecard />
        </div>

        <BlockchainAuditTrail auditEntries={auditEntries} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <TrustBadge />
        </div>

        <div className="text-center text-sm text-muted-foreground py-6 border-t border-white/5">
          <p className={neonGradientText} style={{ fontFamily: "Arial, sans-serif" }}>
            © 2025 Nino360 — Designed with Intelligence.
          </p>
        </div>
      </div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
