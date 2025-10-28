"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, Plus, Play, Settings, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react"
import { toggleAutomationWorkflow } from "@/app/(dashboard)/talent/applicants/actions"
import { useToast } from "@/hooks/use-toast"
import { CreateWorkflowDialog } from "./create-workflow-dialog"

interface AutomationViewProps {
  workflows: any[]
  logs: any[]
}

export function AutomationView({ workflows: initialWorkflows, logs }: AutomationViewProps) {
  const [workflows, setWorkflows] = useState(initialWorkflows)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  const handleToggle = async (workflowId: string, currentStatus: boolean) => {
    const response = await toggleAutomationWorkflow(workflowId, !currentStatus)

    if (response.success) {
      setWorkflows((prev) => prev.map((w) => (w.id === workflowId ? { ...w, is_active: !currentStatus } : w)))
      toast({
        title: "Workflow updated",
        description: `Workflow ${!currentStatus ? "activated" : "deactivated"} successfully`,
      })
    } else {
      toast({
        title: "Update failed",
        description: response.error || "Failed to update workflow",
        variant: "destructive",
      })
    }
  }

  const stats = {
    total: workflows.length,
    active: workflows.filter((w) => w.is_active).length,
    executions: logs.length,
    successful: logs.filter((l) => l.status === "success").length,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-yellow-500" />
            RPA Automation
          </h1>
          <p className="text-muted-foreground">Automated workflows for applicant processing</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Workflows</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <Play className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Executions</p>
              <p className="text-2xl font-bold">{stats.executions}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">
                {stats.executions > 0 ? Math.round((stats.successful / stats.executions) * 100) : 0}%
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Workflows */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Automation Workflows</h2>
        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                    <Badge variant={workflow.is_active ? "default" : "secondary"}>
                      {workflow.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{workflow.trigger_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>

                  {/* Trigger Conditions */}
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <span className="text-muted-foreground">Trigger:</span>
                    <code className="px-2 py-1 bg-muted rounded text-xs">
                      {JSON.stringify(workflow.trigger_conditions)}
                    </code>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Actions:</span>
                    <div className="flex flex-wrap gap-1">
                      {workflow.actions?.map((action: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {action.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={workflow.is_active}
                    onCheckedChange={() => handleToggle(workflow.id, workflow.is_active)}
                  />
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm pt-4 border-t">
                <div>
                  <span className="text-muted-foreground">Executions:</span>
                  <span className="ml-2 font-medium">{workflow.execution_count || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last run:</span>
                  <span className="ml-2 font-medium">
                    {workflow.last_executed_at ? new Date(workflow.last_executed_at).toLocaleString() : "Never"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Executions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Executions</h2>
        <Card className="p-6">
          <div className="space-y-3">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{log.workflow_name}</span>
                    {log.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {log.status === "failed" && <XCircle className="h-4 w-4 text-red-600" />}
                    {log.status === "running" && <Clock className="h-4 w-4 text-yellow-600 animate-spin" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(log.executed_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      log.status === "success" ? "default" : log.status === "failed" ? "destructive" : "secondary"
                    }
                  >
                    {log.status}
                  </Badge>
                  {log.execution_time_ms && (
                    <p className="text-xs text-muted-foreground mt-1">{log.execution_time_ms}ms</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <CreateWorkflowDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
