import { AnalyticsStats } from "./analytics-stats"
import { AnalyticsTabs } from "./analytics-tabs"

interface AnalyticsContentProps {
  opportunities: any[]
}

export function AnalyticsContent({ opportunities }: AnalyticsContentProps) {
  return (
    <div className="space-y-6">
      <AnalyticsStats opportunities={opportunities} />
      <AnalyticsTabs />
    </div>
  )
}
