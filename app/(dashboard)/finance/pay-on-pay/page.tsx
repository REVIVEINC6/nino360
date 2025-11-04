import { PayOnPayHeader } from "@/components/finance-pay-on-pay/pay-on-pay-header"
import { SettlementKpis } from "@/components/finance-pay-on-pay/settlement-kpis"
import { SettlementRunsTable } from "@/components/finance-pay-on-pay/settlement-runs-table"
import { listSettlementRuns, getPayOnPayAnalytics, updateSettlementRunStatus, anchorSettlementRun } from "./actions"

export const dynamic = "force-dynamic"

export default async function PayOnPayPage() {
  const [runsRes, analyticsRes] = await Promise.all([listSettlementRuns(), getPayOnPayAnalytics()])
  const runs = runsRes.success ? runsRes.data || [] : []
  const analytics =
    analyticsRes.success
      ? analyticsRes.data
      : { totalRuns: 0, completedRuns: 0, totalClientReceipts: 0, totalVendorPayouts: 0, totalFees: 0, anchoredRuns: 0 }

  async function approve(runId: string) {
    "use server"
    await updateSettlementRunStatus(runId, "approved")
  }

  async function anchor(runId: string) {
    "use server"
    await anchorSettlementRun(runId)
  }

  return (
    <div className="flex flex-col gap-6">
      <PayOnPayHeader />
      <SettlementKpis data={analytics as any} />
      <SettlementRunsTable runs={runs as any} onApprove={approve} onAnchor={anchor} />
    </div>
  )
}
