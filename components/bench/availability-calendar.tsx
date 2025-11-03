"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const timeline = [
  { name: "Alex Thompson", role: "Full Stack Dev", available: "Jan 15", duration: "Available" },
  { name: "Maria Garcia", role: "DevOps Engineer", available: "Jan 20", duration: "Available" },
  { name: "James Wilson", role: "Data Engineer", available: "Now", duration: "Available" },
  { name: "Sarah Chen", role: "UI/UX Designer", available: "Feb 1", duration: "Interviewing" },
  { name: "Robert Martinez", role: "Cloud Architect", available: "Now", duration: "Available" },
]

export function AvailabilityCalendar() {
  return (
    <div className="space-y-3">
      {timeline.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                  <AvatarFallback>
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">Available from</p>
                  <p className="text-sm text-muted-foreground">{item.available}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    item.duration === "Available"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }
                >
                  {item.duration}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
