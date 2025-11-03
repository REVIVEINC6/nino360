"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Calendar, FileCheck, Send, CheckCircle } from "lucide-react"

export function RecentActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "candidate",
      icon: UserPlus,
      title: "New candidate added",
      description: "John Doe applied for Senior Developer",
      time: "5 minutes ago",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: 2,
      type: "interview",
      icon: Calendar,
      title: "Interview scheduled",
      description: "Jane Smith - Technical Round on Dec 15",
      time: "1 hour ago",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: 3,
      type: "assessment",
      icon: FileCheck,
      title: "Assessment completed",
      description: "Mike Johnson scored 85% on technical test",
      time: "2 hours ago",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: 4,
      type: "offer",
      icon: Send,
      title: "Offer sent",
      description: "Offer letter sent to Sarah Williams",
      time: "3 hours ago",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      id: 5,
      type: "hired",
      icon: CheckCircle,
      title: "Offer accepted",
      description: "David Brown accepted Product Manager role",
      time: "5 hours ago",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
