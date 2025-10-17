"use client"

import { Card } from "@/components/ui/card"

interface InterviewPlanPanelProps {
  requisitionId: string
}

export function InterviewPlanPanel({ requisitionId }: InterviewPlanPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Interview Plan</h3>
      <p className="text-sm text-muted-foreground">
        Interview plan panel - define interview steps, panels, and scorecards
      </p>
    </Card>
  )
}
