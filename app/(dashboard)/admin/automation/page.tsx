import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AutomationRulesManagement } from "@/components/admin/automation-rules-management"

export default function AutomationRulesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automation Rules</h1>
        <p className="text-muted-foreground">Global rules</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <AutomationRulesManagement />
      </Suspense>
    </div>
  )
}
