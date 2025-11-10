"use client"
import React, { useState, useCallback } from "react"
import { ModuleUsage } from "./module-usage"
import { AuditTimeline } from "./audit-timeline"
import { AiDigest } from "./ai-digest"
import { RealtimeListener } from "./realtime-listener"

export function TenantDashboardClient({ initialModules, initialAudit, initialDigest, dateRange }: any) {
  const [modules, setModules] = useState<any[]>(initialModules || [])
  const [auditEntries, setAuditEntries] = useState<any[]>(initialAudit || [])

  const handleModuleUpdate = useCallback((newRow: any) => {
    setModules((prev: any[]) => {
      const found = prev.find((p) => p.module === newRow.module)
      if (found) {
        return prev.map((p) => (p.module === newRow.module ? { ...p, events: newRow.events } : p))
      }
      return [newRow, ...prev]
    })
  }, [])

  const handleAuditInsert = useCallback((entry: any) => {
    setAuditEntries((prev: any[]) => [entry, ...prev].slice(0, 50))
  }, [])

  return (
    <div className="space-y-4">
      <ModuleUsage data={modules} />
      <AuditTimeline entries={auditEntries} />
      <AiDigest initialDigest={initialDigest} dateRange={dateRange} />
      <RealtimeListener onModuleUpdate={handleModuleUpdate} onAuditInsert={handleAuditInsert} />
    </div>
  )
}
