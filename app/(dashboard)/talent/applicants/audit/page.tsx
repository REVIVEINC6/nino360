import { Suspense } from "react"
import { getBlockchainAuditLogs } from "../actions"
import { AuditView } from "@/components/talent-applicants/audit-view"
import { LoadingSkeleton } from "@/components/talent-applicants/loading-skeleton"

export const dynamic = "force-dynamic"

export default async function AuditPage() {
  const response = await getBlockchainAuditLogs()
  const auditLogs = response.success ? response.data : []

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AuditView auditLogs={auditLogs} />
    </Suspense>
  )
}
