"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HotlistAnalyticsProps {
  view: "overview" | "response" | "conversion" | "trends"
}

export function HotlistAnalytics({ view }: HotlistAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotlist Analytics - {view}</CardTitle>
        <CardDescription>Performance metrics and insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} analytics interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
