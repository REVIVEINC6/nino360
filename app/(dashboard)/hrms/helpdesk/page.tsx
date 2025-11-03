import { HelpdeskManagementContent } from "@/components/hrms/helpdesk/helpdesk-management-content"
import { TwoPane } from "@/components/layout/two-pane"
import { HRMSSidebar } from "@/components/hrms/hrms-sidebar"

export default async function HelpDeskPage() {
  return (
    <TwoPane right={<HRMSSidebar />}>
      <div className="space-y-6 p-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HR Help Desk
          </h1>
          <p className="text-muted-foreground mt-2">
            Employee cases, tickets, and SLA management with AI-powered triage
          </p>
        </div>

        <HelpdeskManagementContent />
      </div>
    </TwoPane>
  )
}
