import { Suspense } from "react"
import { HRMSDashboardContent } from "@/components/hrms/hrms-dashboard-content"
import { Skeleton } from "@/components/ui/skeleton"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export const dynamic = "force-dynamic"

export default function HRMSDashboardPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Suspense fallback={<DashboardSkeleton />}>
          <HRMSDashboardContent />
        </Suspense>
      </div>
    </TwoPane>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  )
}
