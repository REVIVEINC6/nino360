"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { getUserAudit } from "@/app/(app)/tenant/users/actions"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface AuditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
}

export function AuditDrawer({ open, onOpenChange, userId }: AuditDrawerProps) {
  const [audit, setAudit] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && userId) {
      setLoading(true)
      getUserAudit(userId).then((data) => {
        setAudit(data || [])
        setLoading(false)
      })
    }
  }, [open, userId])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Audit Timeline</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : audit.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No audit entries found</div>
          ) : (
            audit.map((entry) => (
              <div key={entry.id} className="border-l-2 border-white/10 pl-4 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline">{entry.action}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{entry.resource}</div>
                {entry.hash && (
                  <div className="text-xs font-mono text-muted-foreground mt-1">Hash: {entry.hash.slice(0, 16)}...</div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
