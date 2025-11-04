import { getOpportunities } from "@/app/(dashboard)/crm/actions/opportunities"
import { OpportunitiesStats } from "./opportunities-stats"
import { OpportunitiesTable } from "./opportunities-table"
import { AIInsightsPanel } from "./ai-insights-panel"

export async function OpportunitiesContent() {
  const opportunities = await getOpportunities()

  return (
    <div className="space-y-6">
      <OpportunitiesStats opportunities={opportunities} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OpportunitiesTable opportunities={opportunities} />
        </div>

        <div className="lg:col-span-1">
          <AIInsightsPanel opportunities={opportunities} />
        </div>
      </div>
    </div>
  )
}
