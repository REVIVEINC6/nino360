import { KpiCard } from "./kpi-card"

interface KpiGridProps {
  kpis: {
    users: number
    featuresEnabled: number
    copilotPrompts: number
    openAuditFindings: number
  }
  features: {
    copilot: boolean
    audit_chain: boolean
  }
}

export function KpiGrid({ kpis, features }: KpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard title="Active Users" value={kpis.users} iconName="users" />
      <KpiCard title="Features Enabled" value={kpis.featuresEnabled} iconName="zap" />
      {features.copilot && <KpiCard title="Copilot Usage" value={kpis.copilotPrompts} iconName="bot" />}
      {features.audit_chain && (
        <KpiCard title="Audit Entries" value={kpis.openAuditFindings} iconName="shield" />
      )}
    </div>
  )
}
