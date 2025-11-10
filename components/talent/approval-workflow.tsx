"use client"

import { Card } from "@/components/ui/card"

interface ApprovalWorkflowProps {
  requisitionId: string
}

export function ApprovalWorkflow({ requisitionId }: ApprovalWorkflowProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>
      <p className="text-sm text-muted-foreground">
        Approval workflow component - shows approval chain, status, and actions
      </p>
    </Card>
  )
}
