"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AnalyticsHeader } from "./analytics-header"
import { KpiStrip } from "./kpi-strip"
import { UsageArea } from "./usage-area"
import { SeatsByRole } from "./seats-by-role"
import { FeatureAdoption } from "./feature-adoption"
import { CopilotMetrics } from "./copilot-metrics"
import { AuditRollup } from "./audit-rollup"
import { ExportBar } from "./export-bar"
import { ErrorState } from "./error-state"
import {
  getUsage,
  getSeatsByRole,
  getFeatureAdoption,
  getCopilotMetrics,
  getAuditRollup,
} from "@/app/(dashboard)/tenant/analytics/actions"

interface AnalyticsContentProps {
  context: {
    tenantId: string
    name: string
    features: {
      analytics: boolean
      copilot: boolean
      audit: boolean
      export: boolean
    }
  }
}

export function AnalyticsContent({ context }: AnalyticsContentProps) {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  })
  const [grain, setGrain] = useState<"day" | "week" | "month">("day")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const [usage, seats, adoption, copilot, audit] = await Promise.all([
          getUsage({ ...dateRange, grain }),
          getSeatsByRole(),
          getFeatureAdoption(dateRange),
          context.features.copilot ? getCopilotMetrics(dateRange) : Promise.resolve(null),
          context.features.audit ? getAuditRollup(dateRange) : Promise.resolve(null),
        ])

        if ("error" in usage) throw new Error((usage as any).error || "Usage error")
        if (!Array.isArray(seats) && seats && typeof seats === "object" && "error" in seats) {
          const err = (seats as any).error
          throw new Error(typeof err === "string" ? err : JSON.stringify(err))
        }

        setData({ usage, seats, adoption, copilot, audit })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange, grain, context.features])

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />
  }

  return (
    <div className="space-y-6 p-6">
      <AnalyticsHeader
        tenantName={context.name}
        dateRange={dateRange}
        grain={grain}
        onDateRangeChange={setDateRange}
        onGrainChange={setGrain}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {data && (
          <>
            <KpiStrip usage={data.usage} seats={data.seats} />
            <UsageArea data={data.usage.series} grain={grain} />

            <div className="grid gap-6 lg:grid-cols-2">
              <SeatsByRole data={data.seats} />
              <FeatureAdoption data={data.adoption} />
            </div>

            {context.features.copilot && data.copilot && <CopilotMetrics data={data.copilot} />}

            {context.features.audit && data.audit && <AuditRollup data={data.audit} />}

            {context.features.export && <ExportBar dateRange={dateRange} />}
          </>
        )}
      </motion.div>
    </div>
  )
}
