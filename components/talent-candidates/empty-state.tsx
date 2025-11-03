"use client"

import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"

interface EmptyStateProps {
  onAddCandidate: () => void
  canCreate: boolean
}

export function EmptyState({ onAddCandidate, canCreate }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Users className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">No candidates yet</h3>
          <p className="text-muted-foreground">
            Start building your talent pool by adding candidates manually or importing from your ATS
          </p>
        </div>
        {canCreate && (
          <Button onClick={onAddCandidate} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Candidate
          </Button>
        )}
      </div>
    </div>
  )
}
