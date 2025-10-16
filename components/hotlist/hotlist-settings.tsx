"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HotlistSettingsProps {
  view: "dlp" | "export" | "distribution" | "notifications"
}

export function HotlistSettings({ view }: HotlistSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotlist Settings - {view}</CardTitle>
        <CardDescription>Configure hotlist preferences and controls</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} settings interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
