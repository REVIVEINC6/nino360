import { getRequirements } from "../actions/requirements"
import { UrgentRequirementsView } from "@/components/hotlist/urgent-requirements-view"

export const dynamic = "force-dynamic"

export default async function UrgentRequirementsPage() {
  const result = await getRequirements({ urgency_level: "high" })
  const requirements = result.success ? result.data : []

  return <UrgentRequirementsView initialRequirements={requirements} />
}
