import { Suspense } from "react"
import { PipelineHeader } from "@/components/crm-pipeline/pipeline-header"
import { PipelineContent } from "@/components/crm-pipeline/pipeline-content"
import { AILoadingState } from "@/components/shared/ai-loading-state"
import { fetchOpportunities } from "@/app/(dashboard)/crm/analytics/data"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

async function fetchStages() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("crm_stages").select("*").order("order_index")

  if (error) {
    console.error("[v0] Error fetching stages:", error)
    return []
  }

  return data || []
}

export default async function PipelinePage() {
  const [opportunities, stages] = await Promise.all([fetchOpportunities(), fetchStages()])

  return (
    <div className="min-h-screen ai-gradient-bg p-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <PipelineHeader />
        <Suspense fallback={<AILoadingState message="Loading pipeline data..." />}>
          <PipelineContent opportunities={opportunities} stages={stages} />
        </Suspense>
      </div>
    </div>
  )
}
