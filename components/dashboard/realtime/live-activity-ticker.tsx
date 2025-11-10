"use client"

import { useEffect, useRef } from "react"
import { useDashboardRealtime } from "./dashboard-realtime-context"

export function LiveActivityTicker() {
  const { events } = useDashboardRealtime()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.scrollTop = 0
  }, [events])

  return (
    <div className="h-48 overflow-auto rounded-md bg-black/5 p-3 text-sm">
      {events.map((e) => (
        <div key={e.id} className="py-1 border-b border-white/10">
          <div className="font-medium">{e.title}</div>
          {e.detail && <div className="text-muted-foreground">{e.detail}</div>}
          <div className="text-xs text-muted-foreground">{new Date(e.ts).toLocaleTimeString()}</div>
        </div>
      ))}
      {events.length === 0 && <div className="text-center text-muted-foreground">Waiting for live events…</div>}
    </div>
  )
}

export default LiveActivityTicker
