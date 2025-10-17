"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  title = "No data available",
  description = "Get started by creating your first opportunity",
  actionLabel = "Create Opportunity",
  actionHref = "/crm/opportunities/new",
}: EmptyStateProps) {
  return (
    <Card className="glass-panel">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">{description}</p>
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
