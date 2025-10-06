"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  CalendarIcon,
  Clock,
  Video,
  MapPin,
  Users,
  Plus,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  Mail,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Interview {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  candidateAvatar: string
  jobId: string
  jobTitle: string
  department: string
  interviewType: "Phone" | "Video" | "In-Person" | "Panel"
  round: number
  totalRounds: number
  scheduledDate: string
  scheduledTime: string
  duration: number
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "Rescheduled"
  location?: string
  meetingLink?: string
  interviewers: {
    id: string
    name: string
    role: string
    avatar: string
  }[]
  notes: string
  feedback?: {
    rating: number
    strengths: string[]
    concerns: string[]
    recommendation: "Hire" | "No Hire" | "Maybe"
    comments: string
  }
  createdBy: string
  createdAt: string
  updatedAt: string
}

const mockInterviews: Interview[] = [
  {
    id: "int-001",
    candidateId: "cand-001",
    candidateName: "Sarah Johnson",
    candidateEmail: "sarah.johnson@email.com",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobId: "job-001",
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
    interviewType: "Video",
    round: 2,
    totalRounds: 3,
    scheduledDate: "2024-01-25",
    scheduledTime: "14:00",
    duration: 60,
    status: "Scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewers: [
      {
        id: "int-001",
        name: "John Smith",
        role: "Engineering Manager",
  avatar: "/nino360-primary.png?height=32&width=32",
      },
      {
        id: "int-002",
        name: "Emily Davis",
        role: "Senior Engineer",
  avatar: "/nino360-primary.png?height=32&width=32",
      },
    ],
    notes: "Technical interview focusing on system design and React expertise",
    createdBy: "John Smith",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "int-002",
    candidateId: "cand-002",
    candidateName: "Michael Chen",
    candidateEmail: "michael.chen@email.com",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobId: "job-002",
    jobTitle: "Product Manager",
    department: "Product",
    interviewType: "In-Person",
    round: 1,
    totalRounds: 2,
    scheduledDate: "2024-01-24",
    scheduledTime: "10:00",
    duration: 45,
    status: "Completed",
    location: "Conference Room A",
    interviewers: [
      {
        id: "int-003",
        name: "Alex Rodriguez",
        role: "Product Director",
  avatar: "/nino360-primary.png?height=32&width=32",
      },
    ],
    notes: "Initial screening interview",
    feedback: {
      rating: 4,
      strengths: ["Strong analytical skills", "Good communication", "Relevant experience"],
      concerns: ["Limited technical depth", "Needs more leadership experience"],
      recommendation: "Hire",
      comments: "Solid candidate with good potential. Recommend for next round.",
    },
    createdBy: "Alex Rodriguez",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-24",
  },
  {
    id: "int-003",
    candidateId: "cand-003",
    candidateName: "Emily Rodriguez",
    candidateEmail: "emily.rodriguez@email.com",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobId: "job-003",
    jobTitle: "UX Designer",
    department: "Design",
    interviewType: "Panel",
    round: 1,
    totalRounds: 2,
    scheduledDate: "2024-01-26",
    scheduledTime: "15:30",
    duration: 90,
    status: "Scheduled",
    location: "Design Studio",
    interviewers: [
      {
        id: "int-004",
        name: "Lisa Wang",
        role: "Design Manager",
  avatar: "/nino360-primary.png?height=32&width=32",
      },
      {
        id: "int-005",
        name: "David Kim",
        role: "Senior Designer",
  avatar: "/nino360-primary.png?height=32&width=32",
      },
      {
        id: "int-006",
        name: "Maria Garcia",
        role: "Product Manager",
  avatar: "/nino360-primary.png?height=32&width=32",
      },
    ],
    notes: "Portfolio review and design challenge",
    createdBy: "Lisa Wang",
    createdAt: "2024-01-21",
    updatedAt: "2024-01-21",
  },
]

export default function InterviewManagement() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>(mockInterviews)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")

  // Filter interviews
  useEffect(() => {
    let filtered = interviews

    if (searchQuery) {
      filtered = filtered.filter(
        (interview) =>
          interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          interview.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          interview.department.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((interview) => interview.status.toLowerCase() === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((interview) => interview.interviewType.toLowerCase() === typeFilter)
    }

    setFilteredInterviews(filtered)
  }, [interviews, searchQuery, statusFilter, typeFilter])

  const handleViewInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsDetailOpen(true)
  }

  const handleUpdateStatus = (interviewId: string, newStatus: Interview["status"]) => {
    setInterviews(
      interviews.map((interview) => {
        if (interview.id === interviewId) {
          return {
            ...interview,
            status: newStatus,
            updatedAt: new Date().toISOString().split("T")[0],
          }
        }
        return interview
      }),
    )
    toast({
      title: "Status Updated",
      description: `Interview status updated to ${newStatus}`,
    })
  }

  const handleDeleteInterview = (interviewId: string) => {
    setInterviews(interviews.filter((interview) => interview.id !== interviewId))
    toast({
      title: "Interview Deleted",
      description: "Interview has been deleted successfully.",
    })
  }

  const handleJoinInterview = (interview: Interview) => {
    if (interview.meetingLink) {
      window.open(interview.meetingLink, "_blank")
    }
    toast({
      title: "Joining Interview",
      description: `Joining interview with ${interview.candidateName}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Rescheduled":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Phone":
        return Phone
      case "Video":
        return Video
      case "In-Person":
        return MapPin
      case "Panel":
        return Users
      default:
        return MessageSquare
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return CalendarIcon
      case "In Progress":
        return Clock
      case "Completed":
        return CheckCircle
      case "Cancelled":
        return XCircle
      case "Rescheduled":
        return AlertCircle
      default:
        return CalendarIcon
    }
  }

  const upcomingInterviews = interviews
    .filter((interview) => interview.status === "Scheduled" && new Date(interview.scheduledDate) >= new Date())
    .slice(0, 3)

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
          <p className="text-gray-600">Schedule and manage candidate interviews</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              List
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              Calendar
            </Button>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "Scheduled").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "In Progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{interviews.filter((i) => i.status === "Completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">
                  {
                    interviews.filter((i) => {
                      const interviewDate = new Date(i.scheduledDate)
                      const now = new Date()
                      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                      return interviewDate >= now && interviewDate <= weekFromNow
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingInterviews.map((interview) => {
                const TypeIcon = getTypeIcon(interview.interviewType)
                return (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={interview.candidateAvatar || "/nino360-primary.png"}
                          alt={interview.candidateName}
                        />
                        <AvatarFallback>
                          {interview.candidateName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{interview.candidateName}</p>
                        <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(interview.scheduledDate).toLocaleDateString()} at {interview.scheduledTime}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <TypeIcon className="h-4 w-4" />
                          <span>{interview.interviewType}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinInterview(interview)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search interviews by candidate name, job title, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="panel">Panel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interviews List */}
      {viewMode === "list" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInterviews.map((interview, index) => {
            const TypeIcon = getTypeIcon(interview.interviewType)
            const StatusIcon = getStatusIcon(interview.status)

            return (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={interview.candidateAvatar || "/nino360-primary.png"}
                            alt={interview.candidateName}
                          />
                          <AvatarFallback>
                            {interview.candidateName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{interview.candidateName}</CardTitle>
                          <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                          <p className="text-xs text-gray-500">{interview.department}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(interview.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {interview.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span>{new Date(interview.scheduledDate).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 text-gray-400 ml-2" />
                        <span>{interview.scheduledTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TypeIcon className="h-4 w-4 text-gray-400" />
                        <span>{interview.interviewType}</span>
                        <span className="text-gray-400">•</span>
                        <span>{interview.duration} min</span>
                      </div>
                      {interview.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{interview.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Interviewers</p>
                      <div className="flex -space-x-2">
                        {interview.interviewers.map((interviewer) => (
                          <Avatar key={interviewer.id} className="h-8 w-8 border-2 border-white">
                            <AvatarImage src={interviewer.avatar || "/nino360-primary.png"} alt={interviewer.name} />
                            <AvatarFallback className="text-xs">
                              {interviewer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Round {interview.round} of {interview.totalRounds}
                      </span>
                      {interview.feedback && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{interview.feedback.rating}/5</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleViewInterview(interview)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {interview.status === "Scheduled" && (
                        <Button
                          size="sm"
                          onClick={() => handleJoinInterview(interview)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Join
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleDeleteInterview(interview.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Interview Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <div className="space-y-4">
                <h3 className="font-semibold">Interviews on {selectedDate?.toLocaleDateString()}</h3>
                <div className="space-y-3">
                  {filteredInterviews
                    .filter(
                      (interview) =>
                        selectedDate &&
                        new Date(interview.scheduledDate).toDateString() === selectedDate.toDateString(),
                    )
                    .map((interview) => (
                      <div key={interview.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{interview.candidateName}</p>
                            <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                            <p className="text-sm text-gray-500">{interview.scheduledTime}</p>
                          </div>
                          <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                        </div>
                      </div>
                    ))}
                  {selectedDate &&
                    filteredInterviews.filter(
                      (interview) => new Date(interview.scheduledDate).toDateString() === selectedDate.toDateString(),
                    ).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No interviews scheduled for this date</p>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedInterview && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedInterview.candidateAvatar || "/nino360-primary.png"}
                      alt={selectedInterview.candidateName}
                    />
                    <AvatarFallback>
                      {selectedInterview.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedInterview.candidateName}</h2>
                    <p className="text-gray-600">Interview for {selectedInterview.jobTitle}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Interview Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="font-medium">{selectedInterview.interviewType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Round:</span>
                            <span className="font-medium">
                              {selectedInterview.round} of {selectedInterview.totalRounds}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-medium">
                              {new Date(selectedInterview.scheduledDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-medium">{selectedInterview.scheduledTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">{selectedInterview.duration} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge className={getStatusColor(selectedInterview.status)}>
                              {selectedInterview.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Location & Access</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {selectedInterview.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{selectedInterview.location}</span>
                            </div>
                          )}
                          {selectedInterview.meetingLink && (
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-gray-400" />
                              <a
                                href={selectedInterview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Join Video Call
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedInterview.candidateEmail}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Interviewers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedInterview.interviewers.map((interviewer) => (
                            <div key={interviewer.id} className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={interviewer.avatar || "/nino360-primary.png"} alt={interviewer.name} />
                                <AvatarFallback>
                                  {interviewer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{interviewer.name}</p>
                                <p className="text-sm text-gray-600">{interviewer.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Update Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {["Scheduled", "In Progress", "Completed", "Cancelled", "Rescheduled"].map((status) => (
                            <Button
                              key={status}
                              variant={selectedInterview.status === status ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleUpdateStatus(selectedInterview.id, status as Interview["status"])}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4">
                    {selectedInterview.feedback ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            Interview Feedback
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span>{selectedInterview.feedback.rating}/5</span>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedInterview.feedback.strengths.map((strength, index) => (
                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Concerns</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedInterview.feedback.concerns.map((concern, index) => (
                                <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  {concern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Recommendation</h4>
                            <Badge
                              className={
                                selectedInterview.feedback.recommendation === "Hire"
                                  ? "bg-green-100 text-green-800"
                                  : selectedInterview.feedback.recommendation === "No Hire"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {selectedInterview.feedback.recommendation}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Comments</h4>
                            <p className="text-gray-700">{selectedInterview.feedback.comments}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Add Feedback</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Rating (1-5)</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Poor</SelectItem>
                                <SelectItem value="2">2 - Below Average</SelectItem>
                                <SelectItem value="3">3 - Average</SelectItem>
                                <SelectItem value="4">4 - Good</SelectItem>
                                <SelectItem value="5">5 - Excellent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Recommendation</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recommendation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hire">Hire</SelectItem>
                                <SelectItem value="maybe">Maybe</SelectItem>
                                <SelectItem value="no-hire">No Hire</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Comments</Label>
                            <Textarea placeholder="Add your feedback comments..." rows={4} />
                          </div>
                          <Button>Submit Feedback</Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Interview Notes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          placeholder="Add notes about this interview..."
                          value={selectedInterview.notes}
                          rows={6}
                        />
                        <Button>Save Notes</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                  {selectedInterview.status === "Scheduled" && (
                    <Button
                      onClick={() => handleJoinInterview(selectedInterview)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Interview
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Interview Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Candidate</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cand-001">Sarah Johnson</SelectItem>
                    <SelectItem value="cand-002">Michael Chen</SelectItem>
                    <SelectItem value="cand-003">Emily Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Position</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job-001">Senior Software Engineer</SelectItem>
                    <SelectItem value="job-002">Product Manager</SelectItem>
                    <SelectItem value="job-003">UX Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="panel">Panel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location / Meeting Link</Label>
              <Input placeholder="Conference Room A or https://meet.google.com/..." />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Add any notes about this interview..." rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Schedule Interview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
