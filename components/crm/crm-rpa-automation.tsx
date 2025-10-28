"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Play, Pause, Settings } from "lucide-react"
import { useState, useEffect, useTransition } from "react"

interface CRMRPAAutomationProps {
  getWorkflows: () => Promise<any>
}

export function CRMRPAAutomation({ getWorkflows }: CRMRPAAutomationProps) {
  const [workflows, setWorkflows] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadWorkflows = async () => {
      const result = await getWorkflows()
      if (result.success) {
        setWorkflows(result.data)
      }
      setLoading(false)
    }

    startTransition(() => {
      loadWorkflows()
    })
  }, [getWorkflows])

  if (loading || isPending) {
    return (
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-amber-500" />
            RPA Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-amber-500" />
          RPA Automation
        </CardTitle>
        <CardDescription>Active workflow automations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email Follow-ups</span>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              <Play className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{workflows?.emailFollowups || "24 emails sent today"}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Lead Enrichment</span>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              <Play className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{workflows?.leadEnrichment || "12 leads enriched"}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Data Sync</span>
            <Badge variant="secondary" className="bg-gray-500/10 text-gray-600">
              <Pause className="h-3 w-3 mr-1" />
              Paused
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Last run: 1 hour ago</p>
        </div>
        <Button size="sm" variant="outline" className="w-full h-7 text-xs mt-2 bg-transparent">
          <Settings className="h-3 w-3 mr-1" />
          Manage Workflows
        </Button>
      </CardContent>
    </Card>
  )
}
