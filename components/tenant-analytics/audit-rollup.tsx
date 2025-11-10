"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle2, AlertTriangle } from "lucide-react"

interface AuditRollupProps {
  data: {
    totalEvents: number
    integrityStatus: "valid" | "warning" | "error"
    topActions: Array<{ action: string; count: number }>
  }
}

export function AuditRollup({ data }: AuditRollupProps) {
  const statusConfig = {
    valid: { icon: CheckCircle2, color: "text-green-500", label: "Valid" },
    warning: { icon: AlertTriangle, color: "text-yellow-500", label: "Warning" },
    error: { icon: AlertTriangle, color: "text-red-500", label: "Error" },
  }

  const status = statusConfig[data.integrityStatus]
  const StatusIcon = status.icon

  return (
    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#F81CE5]" />
        <h3 className="text-lg font-semibold">Audit Chain</h3>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Events</p>
          <p className="text-2xl font-bold">{data.totalEvents.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${status.color}`} />
          <Badge variant="outline">{status.label}</Badge>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Top Actions</p>
        <div className="space-y-2">
          {data.topActions.map((item) => (
            <div key={item.action} className="flex items-center justify-between">
              <span className="text-sm">{item.action}</span>
              <span className="text-sm font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
