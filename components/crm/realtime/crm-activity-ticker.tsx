"use client"

import { useState, useEffect } from "react"
import { Bell, Users, Target, Calendar, Phone, X } from "lucide-react"
import { useCRMRealtime } from "./crm-realtime-context"
import { cn } from "@/lib/utils"

const getEventIcon = (type: string) => {
  switch (type) {
    case "lead_created":
      return Users
    case "opportunity_updated":
      return Target
    case "meeting_scheduled":
      return Calendar
    case "call_completed":
      return Phone
    default:
      return Bell
  }
}

const getEventColor = (type: string) => {
  switch (type) {
    case "lead_created":
      return "text-blue-600 bg-blue-100"
    case "opportunity_updated":
      return "text-emerald-600 bg-emerald-100"
    case "meeting_scheduled":
      return "text-purple-600 bg-purple-100"
    case "call_completed":
      return "text-orange-600 bg-orange-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export function CRMActivityTicker() {
  const { events, isConnected } = useCRMRealtime()
  const [visible, setVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate through events
  useEffect(() => {
    if (events.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, 4000) // Rotate every 4 seconds

    return () => clearInterval(interval)
  }, [events.length])

  if (!visible || events.length === 0) {
    return null
  }

  const currentEvent = events[currentIndex]
  const EventIcon = getEventIcon(currentEvent.type)
  const eventColorClass = getEventColor(currentEvent.type)

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl blur-sm" />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-xl border border-white/30 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                )}
              />
              <span className="text-xs font-medium text-gray-600">
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>

            {/* Event Display */}
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", eventColorClass)}>
                <EventIcon className={`w-4 h-4 ${eventColorClass.split(" ")[0]}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{currentEvent.title}</p>
                <p className="text-xs text-gray-600">{currentEvent.description}</p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-500">
              {new Date(currentEvent.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Event Counter */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              {currentIndex + 1} of {events.length}
            </div>
            <button
              onClick={() => setVisible(false)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-linear-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-4000 ease-linear"
            style={{
              width: `${((currentIndex + 1) / events.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
