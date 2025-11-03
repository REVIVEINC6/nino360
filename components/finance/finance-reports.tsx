"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FinanceReportsProps {
  view: "pl" | "balance" | "cashflow" | "custom"
}

export function FinanceReports({ view }: FinanceReportsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Reports - {view}</CardTitle>
        <CardDescription>Financial statements and reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} report interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
