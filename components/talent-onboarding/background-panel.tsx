"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"

interface BackgroundCheck {
  id: string
  provider: string
  provider_ref: string
  package_key: string
  status: string
  result?: Record<string, any>
  requested_at: string
  completed_at?: string
}

interface BackgroundPanelProps {
  checks: BackgroundCheck[]
  onRequest?: (packageKey: string) => void
  onPoll?: (checkId: string) => void
}

export function BackgroundPanel({ checks, onRequest, onPoll }: BackgroundPanelProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clear":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "consider":
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "consider":
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
    }
  }

  return (
    <Card className="bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            <CardTitle>Background Checks</CardTitle>
          </div>
          <Button size="sm" variant="outline" onClick={() => onRequest?.("standard")}>
            Request Check
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No background checks requested yet</div>
        ) : (
          checks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/30">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium">{check.provider}</div>
                  <div className="text-sm text-muted-foreground">
                    {check.provider_ref} • {check.package_key}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(check.status)}>
                  {check.status}
                </Badge>
                {check.status === "in_progress" && (
                  <Button size="sm" variant="ghost" onClick={() => onPoll?.(check.id)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
