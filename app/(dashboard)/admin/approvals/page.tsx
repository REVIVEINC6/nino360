import { listApprovals } from "../actions/approvals"
import { ApprovalQueue } from "@/components/admin/approval-queue"

export default async function ApprovalsPage() {
  const approvals = await listApprovals()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Approval Workflows
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and manage pending approval requests with AI-powered insights
          </p>
        </div>

        <ApprovalQueue approvals={approvals} />
      </div>
    </div>
  )
}
