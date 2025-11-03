import { getRequirements } from "../actions/requirements"
import { UrgentRequirementsView } from "@/components/hotlist/urgent-requirements-view"
import { TwoPane } from "@/components/layout/two-pane"
import { HotlistSidebar } from "@/components/hotlist/hotlist-sidebar"

export const dynamic = "force-dynamic"

export default async function UrgentRequirementsPage() {
  let requirements: any[] = []
  try {
    // Use the correct filter key expected by the validator: 'urgency'
    const result = await getRequirements({ urgency: "high" } as any)
    // Handle both structured and direct returns
    if ((result as any)?.requirements) {
      requirements = (result as any).requirements
    } else if ((result as any)?.success) {
      requirements = (result as any).data || []
    } else if (Array.isArray(result)) {
      requirements = result as any[]
    }
  } catch (e) {
    // Permission/tenant errors should not crash the page in dev
    requirements = []
  }

  return (
    <TwoPane right={<HotlistSidebar />}>
      <UrgentRequirementsView initialRequirements={requirements} />
    </TwoPane>
  )
}
