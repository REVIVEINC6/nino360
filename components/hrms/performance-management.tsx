"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Users, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function PerformanceManagement() {
  return (
    <Tabs defaultValue="goals" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="goals">
          <Target className="mr-2 h-4 w-4" />
          Goals
        </TabsTrigger>
        <TabsTrigger value="reviews">
          <TrendingUp className="mr-2 h-4 w-4" />
          Reviews
        </TabsTrigger>
        <TabsTrigger value="360">
          <Users className="mr-2 h-4 w-4" />
          360 Feedback
        </TabsTrigger>
      </TabsList>

      <TabsContent value="goals" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Performance Goals</h3>
              <p className="text-sm text-muted-foreground">Track individual and team goals</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Set Goal
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { title: "Complete Q1 Product Launch", owner: "Sarah Johnson", progress: 75, status: "On Track" },
              { title: "Improve Customer Satisfaction", owner: "Mike Chen", progress: 60, status: "At Risk" },
              { title: "Reduce Response Time", owner: "Emily Davis", progress: 90, status: "Ahead" },
            ].map((goal) => (
              <Card key={goal.title} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium">{goal.title}</p>
                    <p className="text-sm text-muted-foreground">{goal.owner}</p>
                  </div>
                  <Badge
                    variant={
                      goal.status === "On Track" ? "default" : goal.status === "At Risk" ? "destructive" : "secondary"
                    }
                  >
                    {goal.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} />
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Performance Reviews</h3>
              <p className="text-sm text-muted-foreground">Annual and quarterly review cycles</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Start Review
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Pending Reviews</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-orange-600">Due this month</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
              <p className="text-2xl font-bold">4.2/5</p>
              <p className="text-xs text-green-600">+0.3 from last quarter</p>
            </Card>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="360" className="space-y-4">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">360° Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Multi-rater feedback from peers, managers, and direct reports
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Active Cycles</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">In progress</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-xs text-green-600">Above target</p>
            </Card>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
