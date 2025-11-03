import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { IntegrationsManagement } from "@/components/admin/integrations-management"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default function IntegrationsPage() {
  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="flex flex-col gap-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Integrations
          </h1>
          <p className="text-muted-foreground mt-2">Provider configs, secrets, and third-party connections</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-xl" />}>
          <IntegrationsManagement />
        </Suspense>
      </div>
    </TwoPane>
  )
}
