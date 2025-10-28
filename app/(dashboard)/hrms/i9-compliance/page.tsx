import { Suspense } from "react"
import { I9ComplianceContent } from "@/components/hrms/i9/i9-compliance-content"

export default async function I9CompliancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <I9ComplianceContent />
    </Suspense>
  )
}
