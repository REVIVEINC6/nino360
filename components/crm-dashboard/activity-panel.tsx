"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, Calendar, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityPanelProps {
  activities: Array<{
    ts: string
    type: string
    subject: string
    owner: string
    entity: string
    entity_id: string
  }>
}

export function ActivityPanel({ activities }: ActivityPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "call":
        return Phone
      case "email":
        return Mail
      case "meeting":
        return Calendar
      default:
        return FileText
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "call":
        return "text-blue-500"
      case "email":
        return "text-green-500"
      case "meeting":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => {
            const Icon = getIcon(activity.type)
            const colorClass = getColor(activity.type)

            return (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className={`p-2 rounded-lg bg-background/50 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.subject}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.owner}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(activity.ts), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
