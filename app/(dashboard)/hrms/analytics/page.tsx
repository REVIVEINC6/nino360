import { Suspense } from "react"
import { HRMSAnalyticsContent } from "@/components/hrms/analytics/hrms-analytics-content"
import { PageSkeleton } from "@/components/hrms/page-skeleton"

export default async function HRMSAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-6 space-y-6">
        <Suspense fallback={<PageSkeleton />}>
          <HRMSAnalyticsContent />
        </Suspense>
      </div>
    </div>
  )
}
