import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { IntegrationsManagement } from "@/components/admin/integrations-management"

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Provider configs, secrets</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <IntegrationsManagement />
      </Suspense>
    </div>
  )
}
