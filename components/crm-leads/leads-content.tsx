import { LeadsStats } from "./leads-stats"
import { LeadsTable } from "./leads-table"
import { LeadsAIPanel } from "./leads-ai-panel"

interface LeadsContentProps {
  leads: any[]
}

export function LeadsContent({ leads }: LeadsContentProps) {
  return (
    <div className="space-y-6">
      <LeadsStats leads={leads} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeadsTable leads={leads} />
        </div>

        <div className="lg:col-span-1">
          <LeadsAIPanel leads={leads} />
        </div>
      </div>
    </div>
  )
}
