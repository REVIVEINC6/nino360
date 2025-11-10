import { Suspense } from "react"
import { DocumentsManagementContent } from "@/components/hrms/documents/documents-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function DocumentsPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <Suspense fallback={<div>Loading...</div>}>
        <DocumentsManagementContent />
      </Suspense>
    </TwoPane>
  )
}
