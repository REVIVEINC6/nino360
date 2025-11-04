"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Laptop, Mail, Key } from "lucide-react"

interface ProvisionEvent {
  id: string
  type: string
  provider?: string
  status: string
  meta?: Record<string, any>
  created_at: string
}

interface EquipmentPanelProps {
  events: ProvisionEvent[]
  onRequest?: (type: string, meta: Record<string, any>) => void
  onPoll?: (eventId: string) => void
}

export function EquipmentPanel({ events, onRequest, onPoll }: EquipmentPanelProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "device_request":
        return Laptop
      case "email_setup":
        return Mail
      case "software_access":
        return Key
      default:
        return Package
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    }
  }

  return (
    <Card className="bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            <CardTitle>Equipment & Access</CardTitle>
          </div>
          <Button size="sm" variant="outline" onClick={() => onRequest?.("device_request", { device: "laptop" })}>
            Request Device
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No provisioning requests yet</div>
        ) : (
          events.map((event) => {
            const Icon = getTypeIcon(event.type)
            return (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/30">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{event.type.replace("_", " ")}</div>
                    <div className="text-sm text-muted-foreground">{event.provider || "Internal"}</div>
                  </div>
                </div>

                <Badge variant="outline" className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
