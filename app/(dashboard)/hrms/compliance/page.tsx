import { Suspense } from "react"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { ComplianceManagementContent } from "@/components/hrms/compliance/compliance-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function CompliancePage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <Suspense fallback={<PageSkeleton />}>
        <ComplianceManagementContent />
      </Suspense>
    </TwoPane>
  )
}
