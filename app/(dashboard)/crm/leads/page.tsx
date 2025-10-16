import { LeadsManagement } from "@/components/crm/leads-management"

export default async function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <p className="text-muted-foreground">Capture, score, assign, and convert leads</p>
      </div>

      <LeadsManagement />
    </div>
  )
}
