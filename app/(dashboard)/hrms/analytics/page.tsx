import { Suspense } from "react"
import { HRMSAnalyticsContent } from "@/components/hrms/analytics/hrms-analytics-content"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function HRMSAnalyticsPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="space-y-6">
        <Suspense fallback={<PageSkeleton />}>
          <HRMSAnalyticsContent />
        </Suspense>
      </div>
    </TwoPane>
  )
}
