"use client"

import { Badge } from "@/components/ui/badge"
import { Bot, Play, CheckCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface RPAStatusBadgeProps {
  status: "idle" | "running" | "completed" | "failed" | "scheduled"
  workflowName?: string
}

export function RPAStatusBadge({ status, workflowName }: RPAStatusBadgeProps) {
  const config = {
    idle: { icon: Bot, color: "bg-slate-100 text-slate-700", label: "RPA Idle" },
    running: { icon: Play, color: "bg-blue-100 text-blue-700", label: "RPA Running" },
    completed: { icon: CheckCircle, color: "bg-emerald-100 text-emerald-700", label: "RPA Completed" },
    failed: { icon: XCircle, color: "bg-red-100 text-red-700", label: "RPA Failed" },
    scheduled: { icon: Clock, color: "bg-amber-100 text-amber-700", label: "RPA Scheduled" },
  }

  const { icon: Icon, color, label } = config[status]

  return (
    <Badge variant="secondary" className={cn("gap-1.5", color)}>
      <Icon className="h-3 w-3" />
      {workflowName || label}
    </Badge>
  )
}
