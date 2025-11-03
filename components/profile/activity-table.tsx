"use client"

import { Copy, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface AuditLog {
  id: string
  action: string
  entity?: string | null
  entity_id?: string | null
  hash?: string | null
  prev_hash?: string | null
  created_at: string
}

interface ActivityTableProps {
  logs: AuditLog[]
}

export function ActivityTable({ logs }: ActivityTableProps) {
  const { toast } = useToast()

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    toast({
      title: "Copied",
      description: "Hash copied to clipboard",
    })
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#8B5CF6]/30 text-[#8B5CF6]">
                {log.action}
              </Badge>
              {log.entity && (
                <span className="text-xs text-muted-foreground">
                  {log.entity}
                  {log.entity_id && ` • ${log.entity_id.slice(0, 8)}`}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{new Date(log.created_at).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            {log.prev_hash && <LinkIcon className="h-3 w-3 text-[#D0FF00]" />}
            {log.hash && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyHash(log.hash!)}
                className="h-8 px-2 text-xs hover:bg-white/10"
              >
                <Copy className="h-3 w-3 mr-1" />
                {log.hash.slice(0, 8)}...
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
