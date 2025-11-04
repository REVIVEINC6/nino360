import { Suspense } from "react"
import { getAutomationWorkflows, getAutomationLogs, getContext } from "../actions"
import { AutomationView } from "@/components/talent-applicants/automation-view"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"

export const dynamic = "force-dynamic"

export default async function AutomationPage() {
  const [workflowsResponse, logsResponse, context] = await Promise.all([
    getAutomationWorkflows(),
    getAutomationLogs(),
    getContext(),
  ])

  const workflows = workflowsResponse.success ? workflowsResponse.data : []
  const logs = logsResponse.success ? logsResponse.data : []

  return (
    <>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Automation</h1>
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <AutomationView workflows={workflows} logs={logs} />
      </Suspense>
    </>
  )
}
