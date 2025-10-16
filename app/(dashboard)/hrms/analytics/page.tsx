import { Suspense } from "react"
import { HRAnalytics } from "@/components/hrms/hr-analytics"
import { PageHeader } from "@/components/hrms/page-header"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp } from "lucide-react"

export default async function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="HR Analytics"
        description="Headcount trends, attrition analysis, and workforce insights"
        actions={
          <>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Trends
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </>
        }
      />

      <Suspense fallback={<PageSkeleton />}>
        <HRAnalytics />
      </Suspense>
    </div>
  )
}
