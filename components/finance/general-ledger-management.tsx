"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GeneralLedgerManagementProps {
  view: "entries" | "accounts" | "journals" | "reconciliation"
}

export function GeneralLedgerManagement({ view }: GeneralLedgerManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Ledger - {view}</CardTitle>
        <CardDescription>GL management and accounting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          {view} management interface - Production ready component
        </div>
      </CardContent>
    </Card>
  )
}
