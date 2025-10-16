import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getContext } from "./actions"
import { AnalyticsContent } from "@/components/tenant-analytics/analytics-content"
import { LoadingSkeleton } from "@/components/tenant-analytics/loading-skeleton"

export default async function TenantAnalyticsPage() {
  const context = await getContext()

  if ("error" in context) {
    redirect("/signin")
  }

  if (!context.features.analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Analytics Not Available</h2>
          <p className="text-muted-foreground">Analytics access is not enabled for your tenant.</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AnalyticsContent context={context} />
    </Suspense>
  )
}
