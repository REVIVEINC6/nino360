"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Mail, Download, Trash2, UserX, Tag, RefreshCw } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onMessage: () => void
  onExport: () => void
  onRefresh?: () => void
  canUpdate: boolean
  canDelete: boolean
  canExport: boolean
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onMessage,
  onExport,
  onRefresh,
  canUpdate,
  canDelete,
  canExport,
}: BulkActionsBarProps) {
  return (
    <div className="border-t bg-primary/5 px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="default">{selectedCount} selected</Badge>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          {canUpdate && (
            <>
              <Button variant="outline" size="sm" onClick={onMessage}>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Add Tags
              </Button>
              <Button variant="outline" size="sm">
                <UserX className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </>
          )}
          {canExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
          )}
          {canDelete && (
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onRefresh?.()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}
