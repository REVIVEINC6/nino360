"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
  PlusCircle,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Download,
  Upload,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface TrainingSession {
  id: string
  courseId: string
  courseName: string
  sessionName: string
  startDate: string
  endDate: string
  location: string
  virtualLink?: string
  instructor: string
  maxParticipants: number
  currentParticipants: number
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  materials: string[]
  feedbackSummary?: {
    averageRating: number
    totalResponses: number
    comments: string[]
  }
  createdAt: string
  updatedAt: string
}

interface Course {
  id: string
  title: string
  instructor: string
  durationHours: number
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredSessions, setFilteredSessions] = useState<TrainingSession[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [instructorFilter, setInstructorFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSessions()
    fetchCourses()
  }, [])

  useEffect(() => {
    filterSessions()
  }, [sessions, searchTerm, statusFilter, instructorFilter])

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      const mockSessions: TrainingSession[] = [
        {
          id: "1",
          courseId: "1",
          courseName: "Advanced React Development",
          sessionName: "React Advanced - Spring 2024",
          startDate: "2024-03-01T09:00:00",
          endDate: "2024-03-08T17:00:00",
          location: "Online",
          virtualLink: "https://zoom.us/j/123456789",
          instructor: "Sarah Johnson",
          maxParticipants: 20,
          currentParticipants: 15,
          status: "scheduled",
          materials: ["React Advanced Slides.pdf", "Code Examples.zip", "Assignment 1.docx"],
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
        },
        {
          id: "2",
          courseId: "2",
          courseName: "Project Management Fundamentals",
          sessionName: "PM Fundamentals - Q1 2024",
          startDate: "2024-02-15T10:00:00",
          endDate: "2024-02-17T16:00:00",
          location: "New York Office - Conference Room A",
          instructor: "Michael Chen",
          maxParticipants: 15,
          currentParticipants: 12,
          status: "completed",
          materials: ["PM Guide.pdf", "Templates.zip", "Case Studies.pdf"],
          feedbackSummary: {
            averageRating: 4.6,
            totalResponses: 12,
            comments: ["Excellent practical examples", "Great instructor engagement", "Would recommend to others"],
          },
          createdAt: "2024-01-10",
          updatedAt: "2024-02-17",
        },
        {
          id: "3",
          courseId: "3",
          courseName: "Data Science with Python",
          sessionName: "Data Science - Spring Cohort",
          startDate: "2024-04-01T09:00:00",
          endDate: "2024-04-15T17:00:00",
          location: "Online",
          virtualLink: "https://zoom.us/j/987654321",
          instructor: "Dr. Emily Rodriguez",
          maxParticipants: 25,
          currentParticipants: 22,
          status: "scheduled",
          materials: ["Python Basics.pdf", "Datasets.zip", "Jupyter Notebooks.zip"],
          createdAt: "2024-01-20",
          updatedAt: "2024-01-25",
        },
        {
          id: "4",
          courseId: "4",
          courseName: "Leadership Skills Development",
          sessionName: "Leadership Workshop - February",
          startDate: "2024-02-20T09:00:00",
          endDate: "2024-02-22T17:00:00",
          location: "San Francisco Office - Training Room",
          instructor: "David Wilson",
          maxParticipants: 12,
          currentParticipants: 8,
          status: "in_progress",
          materials: ["Leadership Handbook.pdf", "Assessment Tools.docx"],
          createdAt: "2024-01-25",
          updatedAt: "2024-02-20",
        },
        {
          id: "5",
          courseId: "5",
          courseName: "Cybersecurity Essentials",
          sessionName: "Cybersecurity Bootcamp - Winter",
          startDate: "2024-01-15T10:00:00",
          endDate: "2024-01-19T16:00:00",
          location: "Online",
          virtualLink: "https://zoom.us/j/555666777",
          instructor: "Alex Thompson",
          maxParticipants: 30,
          currentParticipants: 18,
          status: "cancelled",
          materials: ["Security Guide.pdf", "Lab Exercises.zip"],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-10",
        },
      ]
      setSessions(mockSessions)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      // Simulate API call
      const mockCourses: Course[] = [
        { id: "1", title: "Advanced React Development", instructor: "Sarah Johnson", durationHours: 40 },
        { id: "2", title: "Project Management Fundamentals", instructor: "Michael Chen", durationHours: 24 },
        { id: "3", title: "Data Science with Python", instructor: "Dr. Emily Rodriguez", durationHours: 60 },
        { id: "4", title: "Leadership Skills Development", instructor: "David Wilson", durationHours: 16 },
        { id: "5", title: "Cybersecurity Essentials", instructor: "Alex Thompson", durationHours: 32 },
      ]
      setCourses(mockCourses)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      })
    }
  }

  const filterSessions = () => {
    let filtered = sessions

    if (searchTerm) {
      filtered = filtered.filter(
        (session) =>
          session.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((session) => session.status === statusFilter)
    }

    if (instructorFilter !== "all") {
      filtered = filtered.filter((session) => session.instructor === instructorFilter)
    }

    setFilteredSessions(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled", icon: CalendarIcon },
      in_progress: { color: "bg-yellow-100 text-yellow-800", label: "In Progress", icon: Play },
      completed: { color: "bg-green-100 text-green-800", label: "Completed", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled", icon: XCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getSessionDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffInHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return `${diffInHours}h`
  }

  const getUniqueInstructors = () => {
    return Array.from(new Set(sessions.map((session) => session.instructor)))
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Sessions</h1>
          <p className="text-gray-600">Schedule and manage training sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Session</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="course">Course</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="sessionName">Session Name</Label>
                  <Input id="sessionName" placeholder="Enter session name" />
                </div>
                <div>
                  <Label>Start Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" />
                </div>
                <div>
                  <Label>End Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter location or 'Online'" />
                </div>
                <div>
                  <Label htmlFor="virtualLink">Virtual Link (if online)</Label>
                  <Input id="virtualLink" placeholder="https://zoom.us/j/..." />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {getUniqueInstructors().map((instructor) => (
                        <SelectItem key={instructor} value={instructor}>
                          {instructor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input id="maxParticipants" type="number" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes or instructions" />
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Schedule Session</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {sessions.filter((s) => s.status === "scheduled").length} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.filter((s) => s.status === "in_progress").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.reduce((sum, s) => sum + s.currentParticipants, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.length > 0
                ? Math.round((sessions.filter((s) => s.status === "completed").length / sessions.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Sessions completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={instructorFilter} onValueChange={setInstructorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Instructors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Instructors</SelectItem>
                {getUniqueInstructors().map((instructor) => (
                  <SelectItem key={instructor} value={instructor}>
                    {instructor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{session.sessionName}</h3>
                    {getStatusBadge(session.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{session.courseName}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDateTime(session.startDate)} - {formatDateTime(session.endDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getSessionDuration(session.startDate, session.endDate)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {session.currentParticipants}/{session.maxParticipants} participants
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Session
                    </DropdownMenuItem>
                    {session.status === "scheduled" && (
                      <DropdownMenuItem>
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </DropdownMenuItem>
                    )}
                    {session.status === "in_progress" && (
                      <DropdownMenuItem>
                        <Pause className="h-4 w-4 mr-2" />
                        End Session
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </div>
                  <p className="text-sm font-medium">{session.location}</p>
                  {session.virtualLink && (
                    <a
                      href={session.virtualLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Join Virtual Session
                    </a>
                  )}
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Avatar className="h-4 w-4 mr-1">
                      <AvatarFallback className="text-xs">
                        {session.instructor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    Instructor
                  </div>
                  <p className="text-sm font-medium">{session.instructor}</p>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Materials</div>
                  <div className="text-sm">
                    {session.materials.length > 0 ? (
                      <div className="space-y-1">
                        {session.materials.slice(0, 2).map((material, index) => (
                          <div key={index} className="text-xs text-blue-600 hover:underline cursor-pointer">
                            {material}
                          </div>
                        ))}
                        {session.materials.length > 2 && (
                          <div className="text-xs text-gray-500">+{session.materials.length - 2} more files</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">No materials uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              {session.feedbackSummary && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">Session Feedback</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Average Rating</div>
                      <div className="font-medium">{session.feedbackSummary.averageRating}/5.0</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Responses</div>
                      <div className="font-medium">{session.feedbackSummary.totalResponses}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Recent Comments</div>
                      <div className="text-xs text-gray-500">"{session.feedbackSummary.comments[0]}"</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t text-xs text-gray-500">
                <span>Created: {new Date(session.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(session.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sessions found matching your criteria</p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Schedule First Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
