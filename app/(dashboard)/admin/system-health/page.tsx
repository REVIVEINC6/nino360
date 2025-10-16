import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SystemHealthMonitoring } from "@/components/admin/system-health-monitoring"

export default function SystemHealthPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
        <p className="text-muted-foreground">Jobs, queues, errors</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <SystemHealthMonitoring />
      </Suspense>
    </div>
  )
}
