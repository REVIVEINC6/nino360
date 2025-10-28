"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AccountsPayableManagementProps {
  view: "bills" | "approvals" | "payments" | "vendors"
}

export function AccountsPayableManagement({ view }: AccountsPayableManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts Payable - {view}</CardTitle>
        <CardDescription>Manage vendor bills and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} management interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
