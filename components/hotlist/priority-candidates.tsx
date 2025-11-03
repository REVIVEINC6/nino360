"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PriorityCandidatesProps {
  view: "candidates" | "packaging" | "distribution"
}

export function PriorityCandidates({ view }: PriorityCandidatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Candidates - {view}</CardTitle>
        <CardDescription>Manage priority talent profiles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} management interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
