"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function ContentCreation() {
  return (
    <Tabs defaultValue="courses" className="space-y-4">
      <TabsList>
        <TabsTrigger value="courses">My Courses</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
      </TabsList>

      <TabsContent value="courses" className="space-y-4">
        <div className="flex justify-end">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Create with AI
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Authoring</CardTitle>
            <CardDescription>Create and publish courses with AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Course authoring interface would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="modules" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Module Management</CardTitle>
            <CardDescription>Organize course content into modules</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Module management would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="quizzes" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Quiz Generator</CardTitle>
            <CardDescription>Generate quizzes automatically from course content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Quiz generator would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ai-tools" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Content Tools</CardTitle>
            <CardDescription>AI-powered content creation and optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">AI tools would go here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
