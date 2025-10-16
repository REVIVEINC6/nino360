import { HRHelpDesk } from "@/components/hrms/hr-helpdesk"

export default async function HelpDeskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HR Help Desk</h1>
        <p className="text-muted-foreground">Employee cases, tickets, and SLA management</p>
      </div>

      <HRHelpDesk />
    </div>
  )
}
