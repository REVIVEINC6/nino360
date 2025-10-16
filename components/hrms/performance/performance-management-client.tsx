"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Users, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { usePerformanceData } from "@/lib/hooks/use-hrms-data"

export function PerformanceManagementClient() {
  const { goals, reviews, feedback, isLoading, error } = usePerformanceData()

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Failed to load performance data: {error.message}</p>
      </Card>
    )
  }

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

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading goals...</div>
          ) : goals && goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-medium">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {goal.employee?.first_name} {goal.employee?.last_name}
                      </p>
                    </div>
                    <Badge
                      variant={
                        goal.status === "on_track" ? "default" : goal.status === "at_risk" ? "destructive" : "secondary"
                      }
                    >
                      {goal.status?.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{goal.progress || 0}%</span>
                    </div>
                    <Progress value={goal.progress || 0} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No goals found</div>
          )}
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

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
          ) : reviews ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold">{reviews.pending || 0}</p>
                <p className="text-xs text-orange-600">Due this month</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold">{reviews.completed || 0}</p>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
                <p className="text-2xl font-bold">{reviews.avgRating || "N/A"}</p>
                <p className="text-xs text-green-600">
                  {reviews.ratingChange ? `${reviews.ratingChange > 0 ? "+" : ""}${reviews.ratingChange}` : "-"} from
                  last quarter
                </p>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No review data available</div>
          )}
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

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading feedback...</div>
          ) : feedback ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Active Cycles</p>
                <p className="text-2xl font-bold">{feedback.activeCycles || 0}</p>
                <p className="text-xs text-muted-foreground">In progress</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
                <p className="text-2xl font-bold">{feedback.responseRate || 0}%</p>
                <p className="text-xs text-green-600">
                  {feedback.responseRate && feedback.responseRate >= 80 ? "Above target" : "Below target"}
                </p>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No feedback data available</div>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
