import { Suspense } from "react"
import { HRMSDashboardContent } from "@/components/hrms/hrms-dashboard-content"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"

export default function HRMSDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Suspense fallback={<DashboardSkeleton />}>
        <HRMSDashboardContent />
      </Suspense>
    </div>
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
