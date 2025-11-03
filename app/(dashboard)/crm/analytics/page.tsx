import { Suspense } from "react"
import { AnalyticsHeader } from "@/components/crm-analytics/analytics-header"
import { AnalyticsContent } from "@/components/crm-analytics/analytics-content"
import { AILoadingState } from "@/components/shared/ai-loading-state"
import { fetchOpportunities } from "./data"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const opportunities: any[] = await fetchOpportunities()

  return (
    <div className="min-h-screen ai-gradient-bg p-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <AnalyticsHeader />
        <Suspense fallback={<AILoadingState message="Analyzing CRM data..." />}>
          <AnalyticsContent opportunities={opportunities as any} />
        </Suspense>
      </div>
    </div>
  )
}
