import { Suspense } from "react"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { ComplianceManagementContent } from "@/components/hrms/compliance/compliance-management-content"

export default async function CompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Suspense fallback={<PageSkeleton />}>
        <ComplianceManagementContent />
      </Suspense>
    </div>
  )
}
