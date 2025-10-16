import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AuditAILogsManagement } from "@/components/admin/audit-ai-logs-management"

export default function AuditAILogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit & AI Logs</h1>
        <p className="text-muted-foreground">Cross-tenant view</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <AuditAILogsManagement />
      </Suspense>
    </div>
  )
}
