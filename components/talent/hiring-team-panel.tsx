"use client"

import { Card } from "@/components/ui/card"

interface HiringTeamPanelProps {
  requisitionId: string
}

export function HiringTeamPanel({ requisitionId }: HiringTeamPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Hiring Team</h3>
      <p className="text-sm text-muted-foreground">
        Hiring team panel - manage HM, recruiters, coordinators, interviewers
      </p>
    </Card>
  )
}
