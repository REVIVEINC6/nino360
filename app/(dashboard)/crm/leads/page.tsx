import { Suspense } from "react"
import { LeadsHeader } from "@/components/crm-leads/leads-header"
import { LeadsContent } from "@/components/crm-leads/leads-content"
import { AILoadingState } from "@/components/shared/ai-loading-state"
import { fetchLeads } from "./data"
import { TwoPane } from "@/components/layout/two-pane"
import { LeadsAIPanel } from "@/components/crm-leads/leads-ai-panel"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
  const leads = await fetchLeads()

  return (
    <TwoPane right={<LeadsAIPanel leads={leads} />}>
      <div className="min-h-screen ai-gradient-bg p-6 space-y-6">
        <LeadsHeader />
        <Suspense fallback={<AILoadingState message="Loading leads with AI scoring..." />}>
          <LeadsContent leads={leads} />
        </Suspense>
      </div>
    </TwoPane>
  )
}
