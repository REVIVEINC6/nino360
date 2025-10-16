"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Award, TrendingUp, Users } from "lucide-react"

export function TrainingDashboard() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="completion">Completion</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">8 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Popular Courses</CardTitle>
              <CardDescription>Most enrolled courses this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Advanced React Patterns", enrollments: 234, completion: 82 },
                  { name: "TypeScript Fundamentals", enrollments: 198, completion: 91 },
                  { name: "System Design", enrollments: 176, completion: 68 },
                  { name: "AWS Solutions Architect", enrollments: 145, completion: 74 },
                ].map((course, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.enrollments} enrollments</p>
                    </div>
                    <div className="text-sm font-medium">{course.completion}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Certifications</CardTitle>
              <CardDescription>Latest certifications awarded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", cert: "AWS Solutions Architect", date: "2 hours ago" },
                  { name: "Michael Chen", cert: "React Advanced", date: "5 hours ago" },
                  { name: "Emily Davis", cert: "TypeScript Expert", date: "1 day ago" },
                  { name: "James Wilson", cert: "System Design Pro", date: "2 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.cert}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="completion" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Completion Trends</CardTitle>
            <CardDescription>Course completion rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Completion trend chart would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="certifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Certification Coverage</CardTitle>
            <CardDescription>Certification status by role and department</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Certification coverage chart would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="engagement" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Learner Engagement</CardTitle>
            <CardDescription>Time spent learning and activity patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Engagement metrics would go here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
