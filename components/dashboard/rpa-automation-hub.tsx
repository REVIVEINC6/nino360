"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Play, Pause, Settings, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Automation {
  id: string
  name: string
  description: string
  status: "running" | "paused" | "completed" | "failed"
  progress: number
  trigger: string
  lastRun: string
  nextRun?: string
  executionCount: number
  successRate: number
}

export function RpaAutomationHub() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: "Weekly Invoice Generation",
      description: "Automatically generate and send invoices for approved timesheets",
      status: "running",
      progress: 65,
      trigger: "Schedule: Every Monday 9 AM",
      lastRun: "2 hours ago",
      nextRun: "In 5 days",
      executionCount: 47,
      successRate: 98,
    },
    {
      id: "2",
      name: "Candidate Email Follow-up",
      description: "Send personalized follow-up emails to candidates after interviews",
      status: "paused",
      progress: 0,
      trigger: "Event: Interview Completed",
      lastRun: "1 day ago",
      executionCount: 234,
      successRate: 95,
    },
    {
      id: "3",
      name: "Bench Consultant Matching",
      description: "Match available consultants with open job requirements using AI",
      status: "running",
      progress: 42,
      trigger: "Event: New Job Posted",
      lastRun: "30 minutes ago",
      nextRun: "Continuous",
      executionCount: 156,
      successRate: 87,
    },
    {
      id: "4",
      name: "Compliance Document Expiry Alerts",
      description: "Notify HR team about expiring I-9, visa, and certification documents",
      status: "completed",
      progress: 100,
      trigger: "Schedule: Daily 8 AM",
      lastRun: "4 hours ago",
      nextRun: "Tomorrow 8 AM",
      executionCount: 89,
      successRate: 100,
    },
  ])

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id
          ? {
              ...auto,
              status: auto.status === "running" ? "paused" : "running",
              progress: auto.status === "paused" ? 0 : auto.progress,
            }
          : auto,
      ),
    )
  }

  const getStatusIcon = (status: Automation["status"]) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Pause className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: Automation["status"]) => {
    switch (status) {
      case "running":
        return "border-blue-500/30 bg-blue-500/5"
      case "completed":
        return "border-green-500/30 bg-green-500/5"
      case "failed":
        return "border-red-500/30 bg-red-500/5"
      default:
        return "border-primary/10 bg-background/50"
    }
  }

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              RPA Automation Hub
            </span>
            <Badge variant="secondary" className="gap-1">
              {automations.filter((a) => a.status === "running").length} Active
            </Badge>
          </CardTitle>
          <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="h-4 w-4" />
            New Automation
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          {automations.map((automation, index) => (
            <motion.div
              key={automation.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn("p-4 rounded-lg border transition-all", getStatusColor(automation.status))}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(automation.status)}
                      <h4 className="text-sm font-semibold">{automation.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{automation.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleAutomation(automation.id)}
                    >
                      {automation.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {automation.status === "running" && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{automation.progress}%</span>
                    </div>
                    <Progress value={automation.progress} className="h-1.5" />
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{automation.executionCount}</span>
                    <span>runs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-green-500">{automation.successRate}%</span>
                    <span>success</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-primary/10 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trigger:</span>
                    <Badge variant="outline" className="text-xs">
                      {automation.trigger}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last run:</span>
                    <span>{automation.lastRun}</span>
                  </div>
                  {automation.nextRun && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Next run:</span>
                      <span>{automation.nextRun}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
