"use client"
import React from "react"
import { KpiCard } from "@/components/dashboard/kpi-card"

interface KpiGridProps {
  kpis: {
    users?: number
    featuresEnabled?: number
    copilotPrompts?: number
    openAuditFindings?: number
  }
  features?: Record<string, boolean>
}

export function KpiGrid({ kpis, features }: KpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard title="Active Users" value={kpis?.users || 0} iconName="user-check" />
      <KpiCard title="Features Enabled" value={kpis?.featuresEnabled || 0} iconName="zap" />
      {features && features["tenant.copilot"] && (
        <KpiCard title="Copilot Usage" value={kpis?.copilotPrompts || 0} iconName="sparkles" />
      )}
      <KpiCard title="Audit Entries" value={kpis?.openAuditFindings || 0} iconName="zap" />
    </div>
  )
}
