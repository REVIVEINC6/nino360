import { AnchorBadge } from "@/components/finance-pay-on-pay/AnchorBadge"
import { BlockchainAnchorCard } from "@/components/finance-pay-on-pay/blockchain-anchor-card"
import { MappingWorkbench } from "@/components/finance-pay-on-pay/MappingWorkbench"
import { PayoutInstructionsTable } from "@/components/finance-pay-on-pay/payout-instructions-table"
import { SettlementKpis } from "@/components/finance-pay-on-pay/settlement-kpis"
import { Button } from "@/components/ui/button"
import { AnchorRunButton } from "@/components/finance-pay-on-pay/AnchorRunButton"
import { getSettlementRunDetail, getPayOnPayAnalytics, listPayoutInstructions, submitPayoutForSigning } from "../actions"

export const dynamic = "force-dynamic"

export default async function RunDetailPage({ params }: { params: { runId: string } }) {
  // Fetch data server-side
  const [detail, analytics, payouts] = await Promise.all([
    getSettlementRunDetail(params.runId),
    getPayOnPayAnalytics(),
    listPayoutInstructions(params.runId),
  ])

  const run = detail.success ? (detail.data as any).run : null
  const anchor = detail.success ? (detail.data as any).anchor : undefined
  const payoutsData = payouts.success ? payouts.data : []
  const kpis = analytics.success
    ? analytics.data
    : { totalRuns: 0, completedRuns: 0, totalClientReceipts: 0, totalVendorPayouts: 0, totalFees: 0, anchoredRuns: 0 }

  async function signFirst() {
    "use server"
    if (payoutsData && payoutsData[0]) await submitPayoutForSigning(payoutsData[0].id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settlement Run {run?.run_number}</h1>
          <p className="text-muted-foreground text-sm">Run date: {run?.run_date}</p>
        </div>
        <AnchorBadge status={run?.anchor_status} />
      </div>

      <SettlementKpis data={kpis as any} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <PayoutInstructionsTable payouts={payoutsData as any} onSubmitForSigning={async () => { await signFirst() }} />
        </div>
        <div className="space-y-4">
          <AnchorRunButton runId={params.runId} />
          <BlockchainAnchorCard anchor={anchor as any} onVerify={() => {}} />
        </div>
      </div>

      <MappingWorkbench runId={params.runId} />
    </div>
  )
}
