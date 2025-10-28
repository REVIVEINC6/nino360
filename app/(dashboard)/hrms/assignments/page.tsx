import { Suspense } from "react"
import { AssignmentsManagementContent } from "@/components/hrms/assignments/assignments-management-content"

export default async function AssignmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssignmentsManagementContent />
    </Suspense>
  )
}
