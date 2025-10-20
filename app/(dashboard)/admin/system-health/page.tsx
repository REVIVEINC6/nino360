import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SystemHealthMonitoring } from "@/components/admin/system-health-monitoring"

export const dynamic = "force-dynamic"

export default function SystemHealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            System Health
          </h1>
          <p className="text-muted-foreground">Monitor services, incidents, and system performance</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <SystemHealthMonitoring />
        </Suspense>
      </div>
    </div>
  )
}
