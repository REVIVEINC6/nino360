import { Suspense } from "react"
import { getAutomationWorkflows, getAutomationLogs } from "../actions"
import { AutomationView } from "@/components/talent-applicants/automation-view"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"

export const dynamic = "force-dynamic"

export default async function AutomationPage() {
  const [workflowsResponse, logsResponse] = await Promise.all([getAutomationWorkflows(), getAutomationLogs()])

  const workflows = workflowsResponse.success ? workflowsResponse.data : []
  const logs = logsResponse.success ? logsResponse.data : []

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AutomationView workflows={workflows} logs={logs} />
    </Suspense>
  )
}
