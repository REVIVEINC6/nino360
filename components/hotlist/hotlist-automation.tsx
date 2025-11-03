"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HotlistAutomationProps {
  view: "campaigns" | "templates" | "ai" | "rules"
}

export function HotlistAutomation({ view }: HotlistAutomationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotlist Automation - {view}</CardTitle>
        <CardDescription>Automated campaigns and personalization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} automation interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
