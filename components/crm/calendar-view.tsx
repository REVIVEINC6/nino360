"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CalendarView() {
  return (
    <Tabs defaultValue="tasks" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tasks">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Tasks
        </TabsTrigger>
        <TabsTrigger value="meetings">
          <Calendar className="mr-2 h-4 w-4" />
          Meetings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Tasks & Reminders</h3>
              <p className="text-sm text-muted-foreground">Manage your daily tasks and follow-ups</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Follow up with Acme Corp",
                due: "Today, 2:00 PM",
                priority: "High",
                status: "pending",
              },
              {
                title: "Send proposal to TechStart",
                due: "Tomorrow, 10:00 AM",
                priority: "Medium",
                status: "pending",
              },
              {
                title: "Review contract terms",
                due: "Jan 20, 3:00 PM",
                priority: "Low",
                status: "completed",
              },
            ].map((task, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{task.due}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="meetings" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
              <p className="text-sm text-muted-foreground">Schedule and manage meetings</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Sales Demo - Acme Corp",
                time: "Today, 2:00 PM - 3:00 PM",
                attendees: 3,
                type: "Video Call",
              },
              {
                title: "Proposal Review",
                time: "Tomorrow, 10:00 AM - 11:00 AM",
                attendees: 5,
                type: "In Person",
              },
            ].map((meeting, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{meeting.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meeting.time}
                      </div>
                      <Badge variant="outline">{meeting.type}</Badge>
                      <span>{meeting.attendees} attendees</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Join
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
