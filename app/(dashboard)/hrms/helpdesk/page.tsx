import { HelpdeskManagementContent } from "@/components/hrms/helpdesk/helpdesk-management-content"

export default async function HelpDeskPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="space-y-6 p-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HR Help Desk
          </h1>
          <p className="text-muted-foreground mt-2">
            Employee cases, tickets, and SLA management with AI-powered triage
          </p>
        </div>

        <HelpdeskManagementContent />
      </div>
    </div>
  )
}
