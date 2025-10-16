"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, AlertCircle, Users, DollarSign, FileText, Settings } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { AuditEntry } from "@/app/(dashboard)/dashboard/actions"

interface AuditTimelineProps {
  entries: AuditEntry[]
}

function getActionIcon(action: string) {
  if (action.includes("create") || action.includes("add")) return <CheckCircle2 className="h-4 w-4" />
  if (action.includes("delete") || action.includes("remove")) return <AlertCircle className="h-4 w-4" />
  if (action.includes("user") || action.includes("employee")) return <Users className="h-4 w-4" />
  if (action.includes("invoice") || action.includes("payment")) return <DollarSign className="h-4 w-4" />
  if (action.includes("job") || action.includes("application")) return <FileText className="h-4 w-4" />
  return <Settings className="h-4 w-4" />
}

function getActionColor(action: string) {
  if (action.includes("create") || action.includes("add")) return "bg-green-500/10 text-green-600"
  if (action.includes("delete") || action.includes("remove")) return "bg-red-500/10 text-red-600"
  if (action.includes("update") || action.includes("edit")) return "bg-blue-500/10 text-blue-600"
  return "bg-primary/10 text-primary"
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates across your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(entry.action)}`}
                >
                  {getActionIcon(entry.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{entry.action.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.resource} • {entry.actor}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
