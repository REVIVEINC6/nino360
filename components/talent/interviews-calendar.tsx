"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Video, Phone, MapPin, Clock } from "lucide-react"

const interviews = [
  {
    id: "1",
    candidate: "Michael Johnson",
    position: "DevOps Engineer",
    client: "HealthTech Solutions",
    type: "Technical",
    mode: "video",
    date: "Today",
    time: "2:00 PM",
    duration: "60 min",
    interviewer: "Sarah Williams",
  },
  {
    id: "2",
    candidate: "Jane Smith",
    position: "Full Stack Developer",
    client: "FinanceHub LLC",
    type: "Final Round",
    mode: "onsite",
    date: "Tomorrow",
    time: "10:00 AM",
    duration: "90 min",
    interviewer: "John Admin",
  },
  {
    id: "3",
    candidate: "David Brown",
    position: "Frontend Developer",
    client: "TechCorp Inc",
    type: "Phone Screen",
    mode: "phone",
    date: "Friday",
    time: "3:30 PM",
    duration: "30 min",
    interviewer: "Lisa Manager",
  },
  {
    id: "4",
    candidate: "Emily Davis",
    position: "Product Designer",
    client: "EduLearn Platform",
    type: "Portfolio Review",
    mode: "video",
    date: "Monday",
    time: "11:00 AM",
    duration: "45 min",
    interviewer: "Mike Finance",
  },
]

const modeIcons = {
  video: Video,
  phone: Phone,
  onsite: MapPin,
}

export function InterviewsCalendar() {
  return (
    <div className="space-y-4">
      {interviews.map((interview) => {
        const ModeIcon = modeIcons[interview.mode as keyof typeof modeIcons]
        return (
          <Card key={interview.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                    <AvatarFallback>
                      {interview.candidate
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold">{interview.candidate}</h3>
                      <p className="text-sm text-muted-foreground">
                        {interview.position} • {interview.client}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {interview.date}, {interview.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{interview.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ModeIcon className="h-4 w-4" />
                        <span className="capitalize">{interview.mode}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{interview.type}</Badge>
                      <span className="text-sm text-muted-foreground">with {interview.interviewer}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button size="sm">Join</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
