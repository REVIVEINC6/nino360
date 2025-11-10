"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, CheckCircle2, XCircle, Settings, Zap } from "lucide-react"
import { useState } from "react"
import { IntegrationConfigDialog } from "./integration-config-dialog"

interface Integration {
  id: string
  name: string
  provider: string
  status: string
  category: string
  config: any
  health_score: number
}

interface IntegrationCardsProps {
  integrations: Integration[]
  onSaveStart?: () => void
  onSaveComplete?: () => void
}

export function IntegrationCards({ integrations, onSaveStart, onSaveComplete }: IntegrationCardsProps) {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  return (
    <>
      <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Integrations</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connect external services like Calendar, Email, and Slack
            </p>
          </div>
          <Badge variant="outline" className="bg-white/5">
            {integrations.length} Connected
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card
              key={integration.id}
              className="p-4 backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Plug className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-xs text-muted-foreground">{integration.category}</p>
                  </div>
                </div>
                {integration.status === "active" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <Badge variant={integration.status === "active" ? "default" : "secondary"} className="text-xs">
                  {integration.status === "active" ? "Active" : "Inactive"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelectedIntegration(integration)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {integration.health_score && (
                <div className="mt-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div className="flex-1">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${integration.health_score}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{integration.health_score}%</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {selectedIntegration && (
        <IntegrationConfigDialog
          integration={selectedIntegration}
          open={!!selectedIntegration}
          onOpenChange={(open) => !open && setSelectedIntegration(null)}
          onSave={() => {
            onSaveStart?.()
            setSelectedIntegration(null)
            onSaveComplete?.()
          }}
        />
      )}
    </>
  )
}
