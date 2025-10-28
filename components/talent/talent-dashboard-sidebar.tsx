"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Brain, Bell, Star, TrendingUp, Users, Calendar, Sparkles, Target, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export function TalentDashboardSidebar() {
  const router = useRouter()

  const notifications = [
    {
      id: 1,
      type: "match",
      message: "5 new high-match candidates for Senior Engineer",
      time: "5m ago",
      priority: "high",
    },
    {
      id: 2,
      type: "interview",
      message: "Interview feedback pending from Sarah W.",
      time: "1h ago",
      priority: "medium",
    },
    { id: 3, type: "offer", message: "Offer accepted by John Smith", time: "2h ago", priority: "high" },
  ]

  const aiSuggestions = [
    {
      icon: Target,
      title: "Optimize Job Description",
      description: "Senior Engineer role has 23% lower apply rate",
      action: "Optimize",
      color: "text-orange-500",
    },
    {
      icon: Users,
      title: "Review Top Matches",
      description: "3 candidates scored 90%+ for PM role",
      action: "Review",
      color: "text-green-500",
    },
    {
      icon: Zap,
      title: "Automate Screening",
      description: "Save 4hrs/week with AI screening",
      action: "Enable",
      color: "text-blue-500",
    },
  ]

  const quickStats = [
    { label: "Active Pipelines", value: "12", trend: "+2" },
    { label: "Pending Reviews", value: "8", trend: "-3" },
    { label: "This Week Hires", value: "3", trend: "+1" },
  ]

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* AI Assistant */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Assistant</h3>
              <Badge variant="secondary" className="ml-auto">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              I'm analyzing your pipeline and finding optimization opportunities.
            </p>
            <Button size="sm" className="w-full" onClick={() => router.push("/talent/ai")}>
              <Sparkles className="mr-2 h-3 w-3" />
              Open AI Console
            </Button>
          </Card>

          {/* Quick Stats */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Quick Stats
            </h3>
            <div className="space-y-2">
              {quickStats.map((stat) => (
                <Card key={stat.label} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{stat.value}</span>
                      <Badge variant="secondary" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* AI Suggestions */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Suggestions
            </h3>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <Card key={index} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <suggestion.icon className={`h-4 w-4 mt-0.5 ${suggestion.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="w-full mt-2 text-xs">
                    {suggestion.action}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </h3>
              <Badge variant="secondary">{notifications.length}</Badge>
            </div>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <Card key={notification.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div
                      className={`h-2 w-2 rounded-full mt-1.5 ${
                        notification.priority === "high" ? "bg-red-500" : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View All Notifications
            </Button>
          </div>

          <Separator />

          {/* Favorites */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Quick Access
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push("/talent/candidates")}
              >
                <Users className="mr-2 h-3 w-3" />
                All Candidates
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push("/talent/interviews")}
              >
                <Calendar className="mr-2 h-3 w-3" />
                Interview Schedule
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push("/talent/analytics")}
              >
                <TrendingUp className="mr-2 h-3 w-3" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push("/talent/automation")}
              >
                <Zap className="mr-2 h-3 w-3" />
                Automation Rules
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
