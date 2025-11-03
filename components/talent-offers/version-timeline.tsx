"use client"

import { FileText, GitBranch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Version {
  id: string
  version: number
  diff: Record<string, any>
  pdf_path?: string
  created_at: string
  created_by?: {
    full_name: string
  }
}

interface VersionTimelineProps {
  versions: Version[]
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <div key={version.id} className="flex items-start gap-4 p-4 rounded-lg bg-black/20 border border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30">
            <GitBranch className="h-5 w-5 text-purple-400" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Version {version.version}</p>
                <p className="text-sm text-muted-foreground">
                  by {version.created_by?.full_name || "Unknown"} •{" "}
                  {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                </p>
              </div>
              <Badge variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                {version.pdf_path ? "PDF" : "Draft"}
              </Badge>
            </div>

            {Object.keys(version.diff).length > 0 && (
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">Changes:</p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                  {Object.entries(version.diff).map(([key, value]) => (
                    <li key={key}>
                      {key}: {JSON.stringify(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
