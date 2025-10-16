import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ModuleAccessManagement } from "@/components/admin/module-access-management"

export default function ModuleAccessPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Module Access</h1>
        <p className="text-muted-foreground">Entitlements per plan</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <ModuleAccessManagement />
      </Suspense>
    </div>
  )
}
