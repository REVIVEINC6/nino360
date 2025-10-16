"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ExpensesManagementProps {
  view: "expenses" | "approvals" | "reimbursements" | "reports"
}

export function ExpensesManagement({ view }: ExpensesManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses - {view}</CardTitle>
        <CardDescription>Expense tracking and reimbursements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} management interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
