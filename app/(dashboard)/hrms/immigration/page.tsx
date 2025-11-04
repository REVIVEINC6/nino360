import { Suspense } from "react"
import { ImmigrationManagementContent } from "@/components/hrms/immigration/immigration-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function ImmigrationPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <Suspense fallback={<div>Loading...</div>}>
        <ImmigrationManagementContent />
      </Suspense>
    </TwoPane>
  )
}
