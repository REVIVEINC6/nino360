import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SystemHealthMonitoring } from "@/components/admin/system-health-monitoring"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default function SystemHealthPage() {
  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            System Health
          </h1>
          <p className="text-muted-foreground">Monitor services, incidents, and system performance</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <SystemHealthMonitoring />
        </Suspense>
      </div>
    </TwoPane>
  )
}
