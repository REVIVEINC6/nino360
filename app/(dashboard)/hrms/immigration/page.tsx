import { Suspense } from "react"
import { ImmigrationManagementContent } from "@/components/hrms/immigration/immigration-management-content"

export default async function ImmigrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImmigrationManagementContent />
    </Suspense>
  )
}
