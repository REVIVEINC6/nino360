"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

/**
 * Real-time subscription hooks for HRMS modules
 */

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*"

interface UseRealtimeOptions<T> {
  table: string
  schema?: string
  event?: RealtimeEvent
  filter?: string
  onInsert?: (record: T) => void
  onUpdate?: (record: T) => void
  onDelete?: (record: T) => void
  onChange?: (payload: any) => void
}

/**
 * Subscribe to real-time changes on a table
 */
export function useRealtime<T = any>(options: UseRealtimeOptions<T>) {
  const { table, schema = "public", event = "*", filter, onInsert, onUpdate, onDelete, onChange } = options

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient()

    const channelName = `${schema}:${table}:${event}${filter ? `:${filter}` : ""}`

    const realtimeChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event,
          schema,
          table,
          filter,
        },
        (payload) => {
          console.log("[v0] Realtime event:", payload)

          if (onChange) {
            onChange(payload)
          }

          if (payload.eventType === "INSERT" && onInsert) {
            onInsert(payload.new as T)
          } else if (payload.eventType === "UPDATE" && onUpdate) {
            onUpdate(payload.new as T)
          } else if (payload.eventType === "DELETE" && onDelete) {
            onDelete(payload.old as T)
          }
        },
      )
      .subscribe((status) => {
        console.log("[v0] Realtime subscription status:", status)

        if (status === "SUBSCRIBED") {
          setIsConnected(true)
        } else if (status === "CHANNEL_ERROR") {
          setError(new Error("Failed to subscribe to realtime channel"))
          setIsConnected(false)
        } else if (status === "TIMED_OUT") {
          setError(new Error("Realtime subscription timed out"))
          setIsConnected(false)
        }
      })

    setChannel(realtimeChannel)

    return () => {
      console.log("[v0] Unsubscribing from realtime channel:", channelName)
      supabase.removeChannel(realtimeChannel)
    }
  }, [table, schema, event, filter])

  return { channel, error, isConnected }
}

/**
 * Subscribe to employee directory changes
 */
export function useEmployeeRealtime(onUpdate: (employees: any[]) => void) {
  return useRealtime({
    table: "employees",
    schema: "hr",
    onChange: (payload) => {
      // Trigger a refetch or update local state
      onUpdate([])
    },
  })
}

/**
 * Subscribe to attendance changes
 */
export function useAttendanceRealtime(onUpdate: (attendance: any[]) => void) {
  return useRealtime({
    table: "attendance",
    schema: "hrms",
    onChange: (payload) => {
      onUpdate([])
    },
  })
}

/**
 * Subscribe to timesheet changes
 */
export function useTimesheetRealtime(onUpdate: (timesheets: any[]) => void) {
  return useRealtime({
    table: "timesheets",
    schema: "hrms",
    onChange: (payload) => {
      onUpdate([])
    },
  })
}

/**
 * Subscribe to performance review changes
 */
export function usePerformanceRealtime(onUpdate: (reviews: any[]) => void) {
  return useRealtime({
    table: "reviews",
    schema: "perf",
    onChange: (payload) => {
      onUpdate([])
    },
  })
}

/**
 * Subscribe to compensation proposal changes
 */
export function useCompensationRealtime(onUpdate: (proposals: any[]) => void) {
  return useRealtime({
    table: "proposals",
    schema: "comp",
    onChange: (payload) => {
      onUpdate([])
    },
  })
}

/**
 * Subscribe to benefits enrollment changes
 */
export function useBenefitsRealtime(onUpdate: (enrollments: any[]) => void) {
  return useRealtime({
    table: "enrollments",
    schema: "benefits",
    onChange: (payload) => {
      onUpdate([])
    },
  })
}

/**
 * Subscribe to compliance task changes
 */
export function useComplianceRealtime(onUpdate: (tasks: any[]) => void) {
  return useRealtime({
    table: "tasks",
    schema: "compliance",
    onChange: (payload) => {
      onUpdate([])
    },
  })
}

/**
 * Subscribe to helpdesk case changes
 */
export function useHelpdeskRealtime(onUpdate: (cases: any[]) => void) {
  return useRealtime({
    table: "cases",
    schema: "helpdesk",
    onChange: (payload) => {
      onUpdate([])
    },
  })
}
