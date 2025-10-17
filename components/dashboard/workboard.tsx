"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, Play, Pause } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const tasks = [
  { id: 1, title: "Approve timesheet for John Doe", type: "approval", due: "Today", priority: "high" },
  { id: 2, title: "Review candidate profile", type: "task", due: "Today", priority: "medium" },
  { id: 3, title: "Sign vendor contract", type: "approval", due: "Tomorrow", priority: "high" },
]

const tickets = [
  { id: 1, title: "I-9 verification overdue", module: "HRMS", sla: "Breached", severity: "critical" },
  { id: 2, title: "Interview scheduling conflict", module: "Talent", sla: "2h remaining", severity: "warning" },
]

const automations = [
  { id: 1, name: "Weekly invoice generation", trigger: "Schedule", status: "running", retries: 0 },
  { id: 2, name: "Candidate email follow-up", trigger: "Event", status: "paused", retries: 2 },
]

export function Workboard() {
  const [activeTab, setActiveTab] = useState("today")
  const router = useRouter()
  const { toast } = useToast()

  const handleTaskClick = (task: (typeof tasks)[0]) => {
    if (task.type === "approval") {
      router.push("/admin/approvals")
    } else {
      toast({
        title: "Task Details",
        description: task.title,
      })
    }
  }

  const handleTicketClick = (ticket: (typeof tickets)[0]) => {
    const routes = {
      HRMS: "/hrms/compliance",
      Talent: "/talent/interviews",
      Finance: "/finance/dashboard",
      CRM: "/crm/opportunities",
    }
    router.push(routes[ticket.module as keyof typeof routes] || "/dashboard")
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">My Tasks & Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-2 mt-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.due}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Open Tickets / SLAs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
              onClick={() => handleTicketClick(ticket)}
            >
              <AlertTriangle
                className={cn(
                  "h-4 w-4 mt-0.5",
                  ticket.severity === "critical" ? "text-destructive" : "text-yellow-500",
                )}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{ticket.title}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {ticket.module}
                  </Badge>
                  <span className={cn("text-xs", ticket.sla === "Breached" ? "text-destructive" : "text-yellow-500")}>
                    {ticket.sla}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Automation Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {automations.map((auto, index) => (
            <motion.div
              key={auto.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{auto.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {auto.trigger}
                  </Badge>
                  {auto.retries > 0 && <span className="text-xs text-yellow-500">{auto.retries} retries</span>}
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                {auto.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
