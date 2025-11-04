"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, AlertTriangle, DollarSign, UserCheck, Activity } from "lucide-react"
import { useDashboardRealtime } from "./dashboard-realtime-context"

export function LiveKpiStrip() {
  const { events } = useDashboardRealtime()
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    if (events.length > 0) {
      setBlink(true)
      const t = setTimeout(() => setBlink(false), 600)
      return () => clearTimeout(t)
    }
  }, [events])

  const top = useMemo(() => events.slice(0, 5), [events])

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
      {top.map((e) => (
        <Card key={e.id} className={`p-3 flex items-center gap-2 ${blink ? "ring-1 ring-primary/50" : ""}`}>
          {e.type === "audit" ? (
            <Activity className="h-4 w-4 text-blue-500" />
          ) : e.type === "insight" ? (
            <TrendingUp className="h-4 w-4 text-purple-500" />
          ) : e.type === "rpa" ? (
            <UserCheck className="h-4 w-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <div className="truncate">
            <div className="text-sm font-medium truncate">{e.title}</div>
            {e.detail && <div className="text-xs text-muted-foreground truncate">{e.detail}</div>}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default LiveKpiStrip
