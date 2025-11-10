"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Video, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface InterviewCardProps {
  interview: any
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const statusColors = {
    scheduled: "bg-blue-500/10 text-blue-600",
    completed: "bg-emerald-500/10 text-emerald-600",
    no_show: "bg-red-500/10 text-red-600",
    cancelled: "bg-gray-500/10 text-gray-600",
  }

  const modeIcons = {
    video: Video,
    phone: Clock,
    onsite: MapPin,
    remote: Video,
  }

  const ModeIcon = modeIcons[interview.mode as keyof typeof modeIcons] || Video

  return (
    <Card className="hover:border-violet-500/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{interview.round_name || `Round ${interview.round_no}`}</h3>
              <Badge variant="outline" className={statusColors[interview.status as keyof typeof statusColors]}>
                {interview.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {interview.application?.candidate?.full_name} • {interview.application?.job?.title}
            </p>
          </div>
          <ModeIcon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(interview.scheduled_start).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(interview.scheduled_start).toLocaleTimeString()} -{" "}
              {new Date(interview.scheduled_end).toLocaleTimeString()}
            </span>
          </div>
          {interview.panel && interview.panel.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {interview.panel.slice(0, 3).map((member: any, idx: number) => (
                  <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">{member.role?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                {interview.panel.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                    +{interview.panel.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/talent/interviews/${interview.id}`}>View Workspace</Link>
          </Button>
          {interview.meet_url && (
            <Button asChild size="sm" variant="outline">
              <a href={interview.meet_url} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4 mr-1" />
                Join
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
