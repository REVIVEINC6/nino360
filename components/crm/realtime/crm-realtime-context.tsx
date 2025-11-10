"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface CRMEvent {
  id: string
  type: "lead_created" | "opportunity_updated" | "deal_closed" | "meeting_scheduled" | "call_completed"
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

interface CRMRealtimeContextType {
  events: CRMEvent[]
  isConnected: boolean
  connectionStatus: "connecting" | "connected" | "disconnected"
}

const CRMRealtimeContext = createContext<CRMRealtimeContextType>({
  events: [],
  isConnected: false,
  connectionStatus: "disconnected",
})

export function useCRMRealtime() {
  const context = useContext(CRMRealtimeContext)
  if (!context) {
    throw new Error("useCRMRealtime must be used within CRMRealtimeProvider")
  }
  return context
}

interface CRMRealtimeProviderProps {
  children: React.ReactNode
}

export function CRMRealtimeProvider({ children }: CRMRealtimeProviderProps) {
  const [events, setEvents] = useState<CRMEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")

  useEffect(() => {
    let supabase: any = null
    let channel: any = null
    
    try {
      supabase = createClient()
      setConnectionStatus("connecting")
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      setConnectionStatus("disconnected")
      return
    }

    // Subscribe to CRM-related database changes
    channel = supabase
      .channel("crm-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_leads",
        },
        (payload: any) => {
          const newEvent: CRMEvent = {
            id: `lead-${payload.new?.id || payload.old?.id}-${Date.now()}`,
            type: "lead_created",
            title: payload.eventType === "INSERT" ? "New Lead Created" : "Lead Updated",
            description: `Lead: ${payload.new?.name || payload.old?.name || "Unknown"}`,
            timestamp: new Date().toISOString(),
            metadata: payload,
          }
          setEvents((prev) => [newEvent, ...prev.slice(0, 49)]) // Keep last 50 events
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_opportunities",
        },
        (payload: any) => {
          const newEvent: CRMEvent = {
            id: `opportunity-${payload.new?.id || payload.old?.id}-${Date.now()}`,
            type: "opportunity_updated",
            title: payload.eventType === "INSERT" ? "New Opportunity Created" : "Opportunity Updated",
            description: `Deal: ${payload.new?.name || payload.old?.name || "Unknown"}`,
            timestamp: new Date().toISOString(),
            metadata: payload,
          }
          setEvents((prev) => [newEvent, ...prev.slice(0, 49)])
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "crm_activities",
        },
        (payload: any) => {
          const activityType = payload.new?.type || payload.old?.type
          const newEvent: CRMEvent = {
            id: `activity-${payload.new?.id || payload.old?.id}-${Date.now()}`,
            type: activityType === "meeting" ? "meeting_scheduled" : "call_completed",
            title: `${activityType === "meeting" ? "Meeting Scheduled" : "Activity Logged"}`,
            description: `${payload.new?.subject || payload.old?.subject || "New activity"}`,
            timestamp: new Date().toISOString(),
            metadata: payload,
          }
          setEvents((prev) => [newEvent, ...prev.slice(0, 49)])
        }
      )
      .subscribe((status: any) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true)
          setConnectionStatus("connected")
        } else if (status === "CHANNEL_ERROR") {
          setIsConnected(false)
          setConnectionStatus("disconnected")
        }
      })

    // Add some initial demo events
    const demoEvents: CRMEvent[] = [
      {
        id: "demo-1",
        type: "lead_created",
        title: "New Lead from Website",
        description: "Sarah Johnson - Enterprise Software",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-2",
        type: "opportunity_updated",
        title: "Deal Moved to Negotiation",
        description: "TechCorp - $45,000 opportunity",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-3",
        type: "meeting_scheduled",
        title: "Demo Call Scheduled",
        description: "Follow-up with ABC Inc for Q1 2024",
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      },
    ]
    setEvents(demoEvents)

    return () => {
      if (channel && supabase) {
        try {
          supabase.removeChannel(channel)
        } catch (error) {
          console.warn("Error removing channel:", error)
        }
      }
    }
  }, [])

  return (
    <CRMRealtimeContext.Provider value={{ events, isConnected, connectionStatus }}>
      {children}
    </CRMRealtimeContext.Provider>
  )
}
