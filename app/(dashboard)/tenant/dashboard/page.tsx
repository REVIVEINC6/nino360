import { getTenantContext, getKpis, getModuleUsage, getAuditTimeline, getAiDigest } from "./actions"
import { TenantHeader } from "@/components/tenant-dashboard/tenant-header"
import { KpiGrid } from "@/components/tenant-dashboard/kpi-grid"
import { ModuleUsage } from "@/components/tenant-dashboard/module-usage"
import { AiDigest } from "@/components/tenant-dashboard/ai-digest"
import { AuditTimeline } from "@/components/tenant-dashboard/audit-timeline"
import { QuickActions } from "@/components/tenant-dashboard/quick-actions"
import { ErrorState } from "@/components/tenant-dashboard/error-state"

export const dynamic = "force-dynamic"

export default async function TenantDashboardPage({ searchParams }: { searchParams?: { from?: string; to?: string } }) {
  const ctx = await getTenantContext()
  if ((ctx as any)?.error) return <ErrorState message="Unable to load tenant context" />

  const fromParam = searchParams?.from
  const toParam = searchParams?.to
  const from = fromParam || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const to = toParam || new Date().toISOString()

  const [kpis, usage, timeline] = await Promise.all([
    getKpis({ from, to }),
    getModuleUsage({ from, to }),
    getAuditTimeline({ limit: 12 }),
  ])

  const copilotAllowed = !!(ctx as any).features?.["tenant.copilot"]
  const digest = copilotAllowed ? await getAiDigest({ from, to }) : { error: 403 as const }

  return (
    <main className="space-y-6">
      <section aria-label="Tenant header" className="glass">
        <TenantHeader tenantName={(ctx as any).name} slug={(ctx as any).slug} />
      </section>

      <section aria-label="KPIs" className="glass">
        <KpiGrid kpis={kpis} features={(ctx as any).features} />
      </section>

      <section aria-label="Usage and AI digest" className="grid md:grid-cols-12 gap-4">
        <div className="md:col-span-7 glass">
          <ModuleUsage data={Array.isArray(usage) ? usage : []} />
        </div>
        <div className="md:col-span-5 glass">
          {copilotAllowed ? (
            <AiDigest initialDigest={"error" in (digest as any) ? undefined : (digest as any)} dateRange={{ from, to }} />
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Copilot disabled for this tenant.</div>
          )}
        </div>
      </section>

      <section aria-label="Audit timeline" className="glass">
        <AuditTimeline entries={Array.isArray(timeline) ? timeline : []} />
      </section>

      <section aria-label="Quick actions" className="glass">
        <QuickActions features={(ctx as any).features} tenantSlug={(ctx as any).slug} tenantId={(ctx as any).tenantId} />
      </section>
    </main>
  )
}
