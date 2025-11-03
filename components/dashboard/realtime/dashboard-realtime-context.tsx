"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type LiveEvent = {
  id: string
  type: "audit" | "insight" | "rpa" | "other"
  title: string
  detail?: string
  ts: number
}

type DashboardRealtimeState = {
  connected: boolean
  events: LiveEvent[]
  pushEvent: (e: LiveEvent) => void
}

const DashboardRealtimeContext = createContext<DashboardRealtimeState | null>(null)

export function useDashboardRealtime() {
  const ctx = useContext(DashboardRealtimeContext)
  if (!ctx) throw new Error("useDashboardRealtime must be used within DashboardRealtimeProvider")
  return ctx
}

export function DashboardRealtimeProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [events, setEvents] = useState<LiveEvent[]>([])
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const channelsRef = useRef<any[]>([])

  const pushEvent = (e: LiveEvent) => {
    setEvents((prev) => {
      const next = [e, ...prev].slice(0, 50)
      return next
    })
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabaseRef.current = supabase

    // Postgres changes: audit_logs (public)
    const auditCh = supabase
      .channel("rt-audit")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audit_logs" },
        (payload: any) => {
          pushEvent({
            id: String(payload.new?.id ?? crypto.randomUUID()),
            type: "audit",
            title: payload.new?.action || payload.new?.event_type || "Audit event",
            detail: payload.new?.resource_type || payload.new?.entity_type || undefined,
            ts: Date.now(),
          })
        },
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED")
      })

    // Postgres changes: ai_insights (public)
    const insightsCh = supabase
      .channel("rt-insights")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ai_insights" },
        (payload: any) => {
          pushEvent({
            id: String(payload.new?.id ?? crypto.randomUUID()),
            type: "insight",
            title: payload.new?.title || "New AI insight",
            detail: payload.new?.description || undefined,
            ts: Date.now(),
          })
        },
      )
      .subscribe()

    // Postgres changes: rpa_executions (public)
    const rpaCh = supabase
      .channel("rt-rpa")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rpa_executions" },
        (payload: any) => {
          const status = payload.new?.execution_status
          pushEvent({
            id: String(payload.new?.id ?? crypto.randomUUID()),
            type: "rpa",
            title: `Workflow ${status ?? "updated"}`,
            detail: payload.new?.workflow_id ? `Workflow ${payload.new.workflow_id}` : undefined,
            ts: Date.now(),
          })
        },
      )
      .subscribe()

    channelsRef.current = [auditCh, insightsCh, rpaCh]

    return () => {
      try {
        channelsRef.current.forEach((ch) => ch && typeof supabase.removeChannel === "function" && supabase.removeChannel(ch))
        channelsRef.current = []
      } catch {}
    }
  }, [])

  const value = useMemo(
    () => ({ connected, events, pushEvent }),
    [connected, events],
  )

  return <DashboardRealtimeContext.Provider value={value}>{children}</DashboardRealtimeContext.Provider>
}
