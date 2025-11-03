"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, Upload } from "lucide-react"

interface EmptyStateProps {
  onCreateContact: () => void
  onImport: () => void
  hasFilters: boolean
}

export function EmptyState({ onCreateContact, onImport, hasFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <UserPlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
        <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-linear-to-br from-[#4F46E5] to-[#8B5CF6] p-3 mb-4">
        <UserPlus className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Get started by creating your first contact or importing from a CSV file
      </p>
      <div className="flex gap-2">
        <Button onClick={onCreateContact}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Contact
        </Button>
        <Button variant="outline" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import Contacts
        </Button>
      </div>
    </div>
  )
}
