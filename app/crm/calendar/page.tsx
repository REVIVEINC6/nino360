"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Plus, Clock, Users, Video, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

const meetings = [
  {
    id: 1,
    title: "Product Demo - TechCorp Inc.",
    type: "demo",
    time: "10:00 AM - 11:00 AM",
    date: "Today",
    attendees: [
      { name: "John Smith", avatar: "/placeholder.svg?height=24&width=24&text=JS" },
      { name: "Jane Doe", avatar: "/placeholder.svg?height=24&width=24&text=JD" },
    ],
    location: "Zoom Meeting",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Discovery Call - DataFlow Solutions",
    type: "call",
    time: "2:00 PM - 2:30 PM",
    date: "Today",
    attendees: [{ name: "Sarah Johnson", avatar: "/placeholder.svg?height=24&width=24&text=SJ" }],
    location: "Phone Call",
    status: "confirmed",
  },
  {
    id: 3,
    title: "Contract Review - CloudTech Ltd.",
    type: "meeting",
    time: "4:00 PM - 5:00 PM",
    date: "Tomorrow",
    attendees: [
      { name: "Mike Chen", avatar: "/placeholder.svg?height=24&width=24&text=MC" },
      { name: "Lisa Wang", avatar: "/placeholder.svg?height=24&width=24&text=LW" },
    ],
    location: "Conference Room A",
    status: "pending",
  },
]

const tasks = [
  {
    id: 1,
    title: "Prepare demo materials for TechCorp",
    dueTime: "9:00 AM",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Send follow-up email to DataFlow",
    dueTime: "3:00 PM",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Review contract terms for CloudTech",
    dueTime: "3:30 PM",
    priority: "High",
    completed: true,
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "demo":
        return <Video className="h-4 w-4 text-blue-500" />
      case "call":
        return <Phone className="h-4 w-4 text-green-500" />
      case "meeting":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Integrated calendar with meetings, tasks, and AI suggestions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Meetings</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 confirmed, 1 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 meetings, 4 calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Calendar View */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>January 2024</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Today
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6 + 1
                  const isToday = day === 15
                  const hasMeeting = [15, 16, 18, 22].includes(day)

                  return (
                    <div
                      key={i}
                      className={`p-2 text-center text-sm cursor-pointer hover:bg-gray-100 rounded ${
                        isToday ? "bg-blue-100 text-blue-800 font-semibold" : ""
                      } ${day < 1 || day > 31 ? "text-muted-foreground" : ""}`}
                    >
                      {day > 0 && day <= 31 ? day : ""}
                      {hasMeeting && day > 0 && day <= 31 && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(meeting.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{meeting.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {meeting.date} • {meeting.time}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {meeting.attendees.slice(0, 3).map((attendee, index) => (
                        <Avatar key={index} className="h-5 w-5">
                          <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                          <AvatarFallback className="text-xs">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.attendees.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{meeting.attendees.length - 3}</span>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(meeting.status)} mt-2`} size="sm">
                      {meeting.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <input type="checkbox" checked={task.completed} className="mt-1" onChange={() => {}} />
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{task.dueTime}</span>
                      <Badge className={getPriorityColor(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
