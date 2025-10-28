"use client"

import { Card } from "@/components/ui/card"

interface PublishingPanelProps {
  requisitionId: string
}

export function PublishingPanel({ requisitionId }: PublishingPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Publishing & Distribution</h3>
      <p className="text-sm text-muted-foreground">Publishing panel - manage job board distribution and careers page</p>
    </Card>
  )
}
