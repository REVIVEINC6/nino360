"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageSquare, UserPlus, CheckCircle2, XCircle, AlertCircle, Upload } from "lucide-react"
import { getInterviewTimeline } from "@/app/(dashboard)/talent/interviews/actions"

interface TimelineEvent {
  id: string
  event_type: string
  event_data: any
  created_at: string
  user_name?: string
  user_avatar?: string
}

interface InterviewTimelineProps {
  interviewId: string
}

export function InterviewTimeline({ interviewId }: InterviewTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTimeline()
  }, [interviewId])

  const loadTimeline = async () => {
    const result = await getInterviewTimeline(interviewId)
    if (result.success && result.data) {
      setEvents(result.data)
    }
    setLoading(false)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "scheduled":
        return <Calendar className="h-5 w-5 text-blue-400" />
      case "rescheduled":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "panel_added":
        return <UserPlus className="h-5 w-5 text-green-400" />
      case "feedback_submitted":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case "no_show":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "recording_uploaded":
        return <Upload className="h-5 w-5 text-purple-400" />
      case "note_added":
        return <MessageSquare className="h-5 w-5 text-cyan-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-slate-400" />
    }
  }

  const getEventTitle = (event: TimelineEvent) => {
    switch (event.event_type) {
      case "scheduled":
        return "Interview Scheduled"
      case "rescheduled":
        return "Interview Rescheduled"
      case "panel_added":
        return `${event.event_data.name} added to panel`
      case "feedback_submitted":
        return "Feedback Submitted"
      case "completed":
        return "Interview Completed"
      case "no_show":
        return "Candidate No-Show"
      case "cancelled":
        return "Interview Cancelled"
      case "recording_uploaded":
        return "Recording Uploaded"
      case "note_added":
        return "Note Added"
      default:
        return event.event_type
    }
  }

  if (loading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <CardContent className="py-8 text-center text-slate-400">Loading timeline...</CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Interview Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent" />

          {events.map((event, idx) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-800 bg-slate-900">
                {getEventIcon(event.event_type)}
              </div>

              {/* Content */}
              <div className="flex-1 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-white">{getEventTitle(event)}</h4>
                    <p className="text-sm text-slate-400">{new Date(event.created_at).toLocaleString()}</p>
                  </div>
                  {event.user_name && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.user_avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xs text-white">
                          {event.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-400">{event.user_name}</span>
                    </div>
                  )}
                </div>

                {/* Event-specific details */}
                {event.event_data && (
                  <div className="mt-2 text-sm text-slate-300">
                    {event.event_type === "feedback_submitted" && (
                      <p>
                        Overall Score: {event.event_data.score}/5 • Recommendation: {event.event_data.recommendation}
                      </p>
                    )}
                    {event.event_type === "note_added" && <p>{event.event_data.note}</p>}
                    {event.event_type === "recording_uploaded" && <p>File: {event.event_data.file_name}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
