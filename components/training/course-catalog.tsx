"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, BookOpen, Clock, Users, Star } from "lucide-react"

export function CourseCatalog() {
  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All Courses</TabsTrigger>
        <TabsTrigger value="technical">Technical</TabsTrigger>
        <TabsTrigger value="soft-skills">Soft Skills</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
      </TabsList>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <TabsContent value="all" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Advanced React Patterns",
              category: "Technical",
              level: "Advanced",
              duration: "8 hours",
              enrollments: 234,
              rating: 4.8,
              instructor: "Sarah Johnson",
            },
            {
              title: "TypeScript Fundamentals",
              category: "Technical",
              level: "Beginner",
              duration: "6 hours",
              enrollments: 456,
              rating: 4.9,
              instructor: "Michael Chen",
            },
            {
              title: "Leadership Essentials",
              category: "Soft Skills",
              level: "Intermediate",
              duration: "4 hours",
              enrollments: 189,
              rating: 4.7,
              instructor: "Emily Davis",
            },
            {
              title: "System Design Principles",
              category: "Technical",
              level: "Advanced",
              duration: "12 hours",
              enrollments: 312,
              rating: 4.9,
              instructor: "James Wilson",
            },
            {
              title: "Data Privacy & GDPR",
              category: "Compliance",
              level: "Beginner",
              duration: "3 hours",
              enrollments: 567,
              rating: 4.6,
              instructor: "Lisa Anderson",
            },
            {
              title: "AWS Solutions Architect",
              category: "Technical",
              level: "Advanced",
              duration: "16 hours",
              enrollments: 278,
              rating: 4.8,
              instructor: "David Brown",
            },
          ].map((course, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{course.title}</CardTitle>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <CardDescription>by {course.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrollments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      {course.rating}
                    </div>
                  </div>
                  <Badge variant="secondary">{course.category}</Badge>
                  <Button className="w-full" size="sm">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="technical" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Technical Courses</CardTitle>
            <CardDescription>Programming, architecture, and technical skills</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Technical courses would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="soft-skills" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Soft Skills Courses</CardTitle>
            <CardDescription>Leadership, communication, and interpersonal skills</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Soft skills courses would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="compliance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Courses</CardTitle>
            <CardDescription>Required compliance and regulatory training</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Compliance courses would go here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
