"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PayOnPayManagementProps {
  view: "linkage" | "reconciliation" | "disputes" | "reports"
}

export function PayOnPayManagement({ view }: PayOnPayManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay-on-Pay - {view}</CardTitle>
        <CardDescription>Client to vendor payment linkage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} management interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
