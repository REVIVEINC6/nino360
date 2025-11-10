"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, CheckCircle2, Clock, AlertCircle, User } from "lucide-react"

interface TaskCardProps {
  task: {
    id: string
    key: string
    label: string
    description?: string
    kind: string
    status: string
    due_at?: string
    sla_due_at?: string
    owner?: {
      email: string
    }
  }
  onStatusChange?: (taskId: string, status: string) => void
  onViewDetails?: (taskId: string) => void
}

export function TaskCard({ task, onStatusChange, onViewDetails }: TaskCardProps) {
  const getKindIcon = (kind: string) => {
    switch (kind) {
      case "form":
        return FileText
      case "approval":
        return CheckCircle2
      case "training":
        return User
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "blocked":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const isOverdue = task.due_at && new Date(task.due_at) < new Date() && task.status !== "completed"

  const Icon = getKindIcon(task.kind)

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={(checked) => onStatusChange?.(task.id, checked ? "completed" : "pending")}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">{task.label}</h4>
                </div>
                {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
              </div>

              <Badge variant="outline" className={getStatusColor(task.status)}>
                {task.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              {task.owner && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{task.owner.email}</span>
                </div>
              )}

              {task.due_at && (
                <div className="flex items-center gap-1">
                  {isOverdue ? <AlertCircle className="h-3 w-3 text-red-500" /> : <Clock className="h-3 w-3" />}
                  <span className={isOverdue ? "text-red-500" : ""}>
                    Due {new Date(task.due_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {task.kind === "form" && task.status === "pending" && (
              <Button
                size="sm"
                variant="outline"
                className="mt-3 bg-transparent"
                onClick={() => onViewDetails?.(task.id)}
              >
                Complete Form
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
