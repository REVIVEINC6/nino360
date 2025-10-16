"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UrgentRequirementsProps {
  view: "requirements" | "matching" | "submissions"
}

export function UrgentRequirements({ view }: UrgentRequirementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Urgent Requirements - {view}</CardTitle>
        <CardDescription>Quick-fill job requirements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} management interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
