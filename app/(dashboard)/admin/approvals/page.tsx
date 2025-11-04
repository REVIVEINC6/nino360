import { listApprovals } from "../actions/approvals"
import { ApprovalQueue } from "@/components/admin/approval-queue"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function ApprovalsPage() {
  const approvals = await listApprovals()

  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Approval Workflows
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and manage pending approval requests with AI-powered insights
          </p>
        </div>

        <ApprovalQueue approvals={approvals} />
      </div>
    </TwoPane>
  )
}
