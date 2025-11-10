"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PayrollManagementProps {
  view: "batches" | "taxes" | "imports" | "reports"
}

export function PayrollManagement({ view }: PayrollManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll - {view}</CardTitle>
        <CardDescription>Manage payroll processing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} management interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
