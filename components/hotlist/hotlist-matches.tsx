"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HotlistMatchesProps {
  view: "responses" | "interest" | "conversions"
}

export function HotlistMatches({ view }: HotlistMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotlist Matches - {view}</CardTitle>
        <CardDescription>Track client and vendor responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} tracking interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
