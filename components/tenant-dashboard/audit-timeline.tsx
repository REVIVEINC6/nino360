"use client"

import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { HashBadge } from "./hash-badge"
import { FileText, User, Settings, MessageSquare, Building2, Shield } from "lucide-react"

interface AuditEntry {
  id: string
  created_at: string
  action: string
  entity: string
  entity_id: string
  hash: string
  prev_hash: string
}

interface AuditTimelineProps {
  entries: AuditEntry[]
}

const iconMap: Record<string, any> = {
  user: User,
  feature: Shield,
  config: Settings,
  document: FileText,
  copilot: MessageSquare,
  tenant: Building2,
  role: Shield,
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  return (
    <Card className="glass-card p-6">
      <h3 className="mb-6 text-lg font-semibold">Audit Timeline</h3>
      <div className="space-y-4">
        {entries.map((entry, index) => {
          const Icon = iconMap[entry.entity] || FileText
          return (
            <div
              key={entry.id}
              className="animate-fade-in flex items-start gap-4 rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{entry.action}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {entry.entity} • {entry.entity_id}
                </p>
              </div>
              <HashBadge hash={entry.hash} prevHash={entry.prev_hash} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
