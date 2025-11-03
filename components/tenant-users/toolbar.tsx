"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Upload } from "lucide-react"

interface ToolbarProps {
  canManage: boolean
  onInvite: () => void
  onBulkImport: () => void
}

export function Toolbar({ canManage, onInvite, onBulkImport }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-10" />
        </div>
      </div>
      {canManage && (
        <div className="flex items-center gap-2">
          <Button onClick={onBulkImport} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button onClick={onInvite}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Users
          </Button>
        </div>
      )}
    </div>
  )
}
