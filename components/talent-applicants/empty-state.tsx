"use client"

import { Inbox } from "lucide-react"
import { Card } from "@/components/ui/card"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full p-8 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
        <p className="text-sm text-muted-foreground">
          Applications will appear here once candidates start applying to your job postings.
        </p>
      </Card>
    </div>
  )
}
