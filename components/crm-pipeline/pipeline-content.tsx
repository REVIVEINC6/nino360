import { PipelineStats } from "./pipeline-stats"
import { PipelineKanban } from "./pipeline-kanban"
import { PipelineAIPanel } from "./pipeline-ai-panel"

interface PipelineContentProps {
  opportunities: any[]
  stages: any[]
}

export function PipelineContent({ opportunities, stages }: PipelineContentProps) {
  return (
    <div className="space-y-6">
      <PipelineStats opportunities={opportunities} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <PipelineKanban opportunities={opportunities} stages={stages} />
        <PipelineAIPanel opportunities={opportunities} />
      </div>
    </div>
  )
}
