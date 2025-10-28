import { getAutomationRules } from "../actions/campaigns"
import { AutomationView } from "@/components/hotlist/automation-view"

export const dynamic = "force-dynamic"

export default async function HotlistAutomationPage() {
  const result = await getAutomationRules()
  const rules = result.success ? result.data : []

  return <AutomationView initialRules={rules} />
}
