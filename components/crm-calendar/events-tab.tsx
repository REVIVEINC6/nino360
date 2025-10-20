"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Video, Users } from "lucide-react"
import { getEvents, updateEventStatus } from "@/app/(dashboard)/crm/actions/calendar"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"
import { motion } from "framer-motion"
import { format } from "date-fns"

export function EventsTab() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      const data = await getEvents({ status: "scheduled" })
      setEvents(data)
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(eventId: string, status: string) {
    try {
      await updateEventStatus(eventId, status)
      loadEvents()
    } catch (error) {
      console.error("Failed to update event:", error)
    }
  }

  if (loading) {
    return <div className="glass-card p-6">Loading events...</div>
  }

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <Card className="glass-card p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No upcoming events</p>
        </Card>
      ) : (
        events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    {event.blockchain_hash && <BlockchainBadge hash={event.blockchain_hash} />}
                  </div>
                  {event.description && <p className="text-sm text-muted-foreground mb-3">{event.description}</p>}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(event.start_time), "MMM d, h:mm a")} -{" "}
                      {format(new Date(event.end_time), "h:mm a")}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    {event.meeting_url && (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Video Call
                      </div>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees.length} attendees
                      </div>
                    )}
                  </div>

                  {event.contact && (
                    <div className="mt-3">
                      <Badge variant="outline">
                        {event.contact.first_name} {event.contact.last_name}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Badge
                    className={
                      event.event_type === "demo"
                        ? "bg-blue-500"
                        : event.event_type === "call"
                          ? "bg-green-500"
                          : event.event_type === "meeting"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                    }
                  >
                    {event.event_type}
                  </Badge>
                  {event.meeting_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={event.meeting_url} target="_blank" rel="noopener noreferrer">
                        Join
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleStatusChange(event.id, "completed")}>
                    Complete
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}
