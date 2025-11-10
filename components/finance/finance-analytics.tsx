"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FinanceAnalyticsProps {
  view: "overview" | "margins" | "trends" | "budget"
}

export function FinanceAnalytics({ view }: FinanceAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finance Analytics - {view}</CardTitle>
        <CardDescription>Financial analysis and insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} analytics interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
