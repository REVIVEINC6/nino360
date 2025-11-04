import { Suspense } from "react"
import { I9ComplianceContent } from "@/components/hrms/i9/i9-compliance-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function I9CompliancePage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <Suspense fallback={<div>Loading...</div>}>
        <I9ComplianceContent />
      </Suspense>
    </TwoPane>
  )
}
