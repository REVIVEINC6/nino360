import { getAutomationRules } from "../actions/campaigns"
import { AutomationView } from "@/components/hotlist/automation-view"
import { TwoPane } from "@/components/layout/two-pane"
import { HotlistSidebar } from "@/components/hotlist/hotlist-sidebar"

export const dynamic = "force-dynamic"

export default async function HotlistAutomationPage() {
  const result = await getAutomationRules()
  const rules = result.success ? result.data : []

  return (
    <TwoPane right={<HotlistSidebar />}>
      <AutomationView initialRules={rules} />
    </TwoPane>
  )
}
