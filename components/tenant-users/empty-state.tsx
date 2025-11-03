"use client"

import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onInvite: () => void
}

export function EmptyState({ onInvite }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Users className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No users yet</h3>
      <p className="text-muted-foreground mb-4">Get started by inviting your first team member</p>
      <Button onClick={onInvite}>Invite Users</Button>
    </div>
  )
}
