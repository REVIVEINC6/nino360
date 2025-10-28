import { Suspense } from "react"
import { getBenchAnalytics } from "./actions"
import BenchAnalyticsContent from "@/components/bench/bench-analytics-content"
import { Skeleton } from "@/components/ui/skeleton"

export default async function BenchAnalyticsPage() {
  const data = await getBenchAnalytics()

  return (
    <Suspense fallback={<BenchAnalyticsSkeleton />}>
      <BenchAnalyticsContent data={data} />
    </Suspense>
  )
}

function BenchAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    </div>
  )
}
