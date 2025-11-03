import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AuditAILogsManagement } from "@/components/admin/audit-ai-logs-management"
import { getAuditLogs, getAILogs, getAuditStats } from "./actions"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AuditAILogsPage() {
  const [auditLogs, aiLogs, stats] = await Promise.all([
    getAuditLogs().catch(() => []),
    getAILogs().catch(() => []),
    getAuditStats().catch(() => ({ totalAudit: 0, totalAI: 0, totalSecurity: 0, avgResponseTime: 0 })),
  ])

  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Audit & AI Logs
          </h1>
          <p className="text-muted-foreground">Cross-tenant audit trail and AI interaction logs</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <AuditAILogsManagement auditLogs={auditLogs} aiLogs={aiLogs} stats={stats} />
        </Suspense>
      </div>
    </TwoPane>
  )
}
