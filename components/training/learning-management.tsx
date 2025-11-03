"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, BookOpen, Clock, CheckCircle2 } from "lucide-react"

export function LearningManagement() {
  return (
    <Tabs defaultValue="enrollments" className="space-y-4">
      <TabsList>
        <TabsTrigger value="enrollments">My Enrollments</TabsTrigger>
        <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="enrollments" className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search enrollments..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Advanced React Patterns",
              progress: 65,
              status: "in-progress",
              dueDate: "2024-02-15",
              modules: 12,
              completed: 8,
            },
            {
              title: "TypeScript Fundamentals",
              progress: 100,
              status: "completed",
              completedDate: "2024-01-20",
              modules: 8,
              completed: 8,
            },
            {
              title: "System Design Principles",
              progress: 25,
              status: "in-progress",
              dueDate: "2024-03-01",
              modules: 16,
              completed: 4,
            },
          ].map((enrollment, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{enrollment.title}</CardTitle>
                  <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
                    {enrollment.status === "completed" ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {enrollment.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <CardDescription>
                  {enrollment.completed} of {enrollment.modules} modules completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{enrollment.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                  </div>
                  {enrollment.status === "in-progress" && (
                    <p className="text-xs text-muted-foreground">Due: {enrollment.dueDate}</p>
                  )}
                  {enrollment.status === "completed" && (
                    <p className="text-xs text-muted-foreground">Completed: {enrollment.completedDate}</p>
                  )}
                  <Button className="w-full" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {enrollment.status === "completed" ? "Review" : "Continue"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="paths" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personalized Learning Paths</CardTitle>
            <CardDescription>AI-recommended learning paths based on your role and skill gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Learning paths would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="progress" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Track completion and time-to-proficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Progress tracking would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Personalized course recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Recommendations would go here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
