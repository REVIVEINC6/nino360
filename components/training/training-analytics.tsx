"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TrainingAnalytics() {
  return (
    <Tabs defaultValue="completion" className="space-y-4">
      <TabsList>
        <TabsTrigger value="completion">Completion Trends</TabsTrigger>
        <TabsTrigger value="proficiency">Time-to-Proficiency</TabsTrigger>
        <TabsTrigger value="skill-gaps">Skill Gap Analysis</TabsTrigger>
        <TabsTrigger value="roi">Training ROI</TabsTrigger>
      </TabsList>

      <TabsContent value="completion" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Completion Trends</CardTitle>
            <CardDescription>Course completion rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Completion trends chart would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="proficiency" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Time-to-Proficiency</CardTitle>
            <CardDescription>Average time to achieve proficiency by skill</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Time-to-proficiency metrics would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skill-gaps" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Identify skill gaps across teams and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Skill gap analysis would go here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="roi" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Training ROI</CardTitle>
            <CardDescription>Measure the return on investment for training programs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Training ROI metrics would go here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
