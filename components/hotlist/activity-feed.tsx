"use client"
import { formatDistanceToNow } from "date-fns"
import { Send, UserPlus, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
  user_name: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const iconMap: Record<string, any> = {
    campaign: Send,
    candidate: UserPlus,
    placement: CheckCircle2,
    alert: AlertCircle,
    match: Sparkles,
  }

  const colorMap: Record<string, string> = {
    campaign: "text-blue-400",
    candidate: "text-green-400",
    placement: "text-purple-400",
    alert: "text-orange-400",
    match: "text-yellow-400",
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
      ) : (
        activities.map((activity) => {
          const Icon = iconMap[activity.type] || AlertCircle
          const color = colorMap[activity.type] || "text-muted-foreground"

          return (
            <div key={activity.id} className="flex gap-3">
              <div className={`p-2 rounded-lg bg-card h-fit ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user_name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
