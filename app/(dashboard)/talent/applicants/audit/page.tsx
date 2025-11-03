import { Suspense } from "react"
import { getBlockchainAuditLogs, getContext } from "../actions"
import { AuditView } from "@/components/talent-applicants/audit-view"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"

export const dynamic = "force-dynamic"

export default async function AuditPage() {
  const [response, context] = await Promise.all([getBlockchainAuditLogs(), getContext()])
  const auditLogs = response.success ? response.data : []

  return (
    <>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Audit</h1>
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <AuditView auditLogs={auditLogs} />
      </Suspense>
    </>
  )
}
