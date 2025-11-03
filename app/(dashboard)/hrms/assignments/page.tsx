import { Suspense } from "react"
import { AssignmentsManagementContent } from "@/components/hrms/assignments/assignments-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function AssignmentsPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <Suspense fallback={<div>Loading...</div>}>
        <AssignmentsManagementContent />
      </Suspense>
    </TwoPane>
  )
}
