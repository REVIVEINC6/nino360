"use client"

import { Card } from "@/components/ui/card"

export function IntegrationCards({ integrations, onSaveStart, onSaveComplete }: any) {
  return (
    <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
      <h2 className="text-2xl font-semibold">Integrations</h2>
      <p className="text-sm text-muted-foreground mt-1">Connect external services like Calendar, Email, and Slack</p>
      {/* Full implementation would include integration cards with connect/test/disconnect */}
    </Card>
  )
}
