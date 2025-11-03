import { LeadsStats } from "./leads-stats"
import { LeadsTable } from "./leads-table"

interface LeadsContentProps {
  leads: any[]
}

export function LeadsContent({ leads }: LeadsContentProps) {
  return (
    <div className="space-y-6">
      <LeadsStats leads={leads} />
      <LeadsTable leads={leads} />
    </div>
  )
}
