import { listApprovals } from "../actions/approvals"
import { ApprovalQueue } from "@/components/admin/approval-queue"

export default async function ApprovalsPage() {
  const approvals = await listApprovals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">Review and manage pending approval requests</p>
      </div>

      <ApprovalQueue approvals={approvals} />
    </div>
  )
}
