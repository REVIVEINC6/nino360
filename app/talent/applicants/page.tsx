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
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Eye,
  Download,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  FileText,
  ThumbsUp,
  TrendingUp,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Application {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  candidateAvatar: string
  jobId: string
  jobTitle: string
  department: string
  appliedDate: string
  status: "New" | "Screening" | "Interview" | "Assessment" | "Offer" | "Hired" | "Rejected"
  stage: number
  totalStages: number
  score: number
  notes: string
  resumeUrl: string
  coverLetterUrl?: string
  experience: number
  skills: string[]
  location: string
  expectedSalary: number
  availability: string
  source: string
  recruiter: string
  lastActivity: string
  priority: "Low" | "Medium" | "High"
}

const mockApplications: Application[] = [
  {
    id: "app-001",
    candidateId: "cand-001",
    candidateName: "Sarah Johnson",
    candidateEmail: "sarah.johnson@email.com",
    candidatePhone: "+1 (555) 123-4567",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobId: "job-001",
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
    appliedDate: "2024-01-15",
    status: "Interview",
    stage: 3,
    totalStages: 5,
    score: 85,
    notes: "Strong technical background, excellent communication skills",
    resumeUrl: "/documents/sarah-johnson-resume.pdf",
    coverLetterUrl: "/documents/sarah-johnson-cover-letter.pdf",
    experience: 6,
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    location: "San Francisco, CA",
    expectedSalary: 160000,
    availability: "2 weeks",
    source: "LinkedIn",
    recruiter: "John Smith",
    lastActivity: "2024-01-20",
    priority: "High",
  },
  {
    id: "app-002",
    candidateId: "cand-002",
    candidateName: "Michael Chen",
    candidateEmail: "michael.chen@email.com",
    candidatePhone: "+1 (555) 987-6543",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobId: "job-002",
    jobTitle: "Product Manager",
    department: "Product",
    appliedDate: "2024-01-18",
    status: "Screening",
    stage: 2,
    totalStages: 5,
    score: 78,
    notes: "Good product sense, needs more technical depth",
    resumeUrl: "/documents/michael-chen-resume.pdf",
    experience: 4,
    skills: ["Product Strategy", "Analytics", "Agile", "SQL"],
    location: "New York, NY",
    expectedSalary: 140000,
    availability: "1 month",
    source: "Company Website",
    recruiter: "Emily Davis",
    lastActivity: "2024-01-19",
    priority: "Medium",
  },
  {
    id: "app-003",
    candidateId: "cand-003",
    candidateName: "Emily Rodriguez",
    candidateEmail: "emily.rodriguez@email.com",
    candidatePhone: "+1 (555) 456-7890",
  candidateAvatar: "/nino360-primary.png?height=40&width=40",
    jobId: "job-003",
    jobTitle: "UX Designer",
    department: "Design",
    appliedDate: "2024-01-20",
    status: "New",
    stage: 1,
    totalStages: 4,
    score: 92,
    notes: "Outstanding portfolio, perfect cultural fit",
    resumeUrl: "/documents/emily-rodriguez-resume.pdf",
    experience: 5,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    location: "Austin, TX",
    expectedSalary: 110000,
    availability: "Immediate",
    source: "Referral",
    recruiter: "Alex Rodriguez",
    lastActivity: "2024-01-20",
    priority: "High",
  },
]

const applicationStages = [
  { name: "Applied", icon: FileText },
  { name: "Screening", icon: Eye },
  { name: "Interview", icon: MessageSquare },
  { name: "Assessment", icon: CheckCircle },
  { name: "Offer", icon: Star },
  { name: "Hired", icon: ThumbsUp },
]

export default function ApplicantTracking() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(mockApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter applications
  useEffect(() => {
    let filtered = applications

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.department.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status.toLowerCase() === statusFilter)
    }

    if (jobFilter !== "all") {
      filtered = filtered.filter((app) => app.jobTitle.toLowerCase().includes(jobFilter.toLowerCase()))
    }

    setFilteredApplications(filtered)
  }, [applications, searchQuery, statusFilter, jobFilter])

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
    setIsDetailOpen(true)
  }

  const handleUpdateStatus = (applicationId: string, newStatus: Application["status"]) => {
    setApplications(
      applications.map((app) => {
        if (app.id === applicationId) {
          const stageMap = {
            New: 1,
            Screening: 2,
            Interview: 3,
            Assessment: 4,
            Offer: 5,
            Hired: 6,
            Rejected: 0,
          }
          return {
            ...app,
            status: newStatus,
            stage: stageMap[newStatus] || app.stage,
            lastActivity: new Date().toISOString().split("T")[0],
          }
        }
        return app
      }),
    )
    toast({
      title: "Status Updated",
      description: `Application status updated to ${newStatus}`,
    })
  }

  const handleScheduleInterview = (application: Application) => {
    toast({
      title: "Interview Scheduled",
      description: `Interview scheduled for ${application.candidateName}`,
    })
  }

  const handleSendMessage = (application: Application) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${application.candidateName}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Screening":
        return "bg-yellow-100 text-yellow-800"
      case "Interview":
        return "bg-purple-100 text-purple-800"
      case "Assessment":
        return "bg-orange-100 text-orange-800"
      case "Offer":
        return "bg-green-100 text-green-800"
      case "Hired":
        return "bg-emerald-100 text-emerald-800"
      case "Rejected":
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicant Tracking</h1>
          <p className="text-gray-600">Track and manage job applications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="flex items-center border rounded-lg">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              Grid
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Application Pipeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Application Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            {applicationStages.map((stage, index) => {
              const count = applications.filter((app) => {
                const stageNames = ["New", "Screening", "Interview", "Assessment", "Offer", "Hired"]
                return app.status === stageNames[index]
              }).length

              return (
                <div key={stage.name} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 rounded-full bg-blue-100">
                      <stage.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{stage.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications by candidate name, job title, or department..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="senior software engineer">Senior Software Engineer</SelectItem>
                <SelectItem value="product manager">Product Manager</SelectItem>
                <SelectItem value="ux designer">UX Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
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
                          src={application.candidateAvatar || "/nino360-primary.png"}
                          alt={application.candidateName}
                        />
                        <AvatarFallback>
                          {application.candidateName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{application.candidateName}</CardTitle>
                        <p className="text-sm text-gray-600">{application.jobTitle}</p>
                        <p className="text-xs text-gray-500">{application.department}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                      <Badge className={getPriorityColor(application.priority)}>{application.priority}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{application.experience}y exp</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Application Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(application.score)}`}>
                        {application.score}/100
                      </span>
                    </div>
                    <Progress value={application.score} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        {application.stage}/{application.totalStages}
                      </span>
                    </div>
                    <Progress value={(application.stage / application.totalStages) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Applied: {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                    <span className="text-gray-500">
                      Last activity: {new Date(application.lastActivity).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewApplication(application)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleScheduleInterview(application)}>
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendMessage(application)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Candidate</th>
                    <th className="text-left p-4 font-medium">Job</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Score</th>
                    <th className="text-left p-4 font-medium">Applied</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={application.candidateAvatar || "/nino360-primary.png"}
                              alt={application.candidateName}
                            />
                            <AvatarFallback>
                              {application.candidateName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{application.candidateName}</p>
                            <p className="text-sm text-gray-600">{application.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{application.jobTitle}</p>
                        <p className="text-sm text-gray-600">{application.department}</p>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${getScoreColor(application.score)}`}>{application.score}/100</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewApplication(application)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleScheduleInterview(application)}>
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSendMessage(application)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={selectedApplication.candidateAvatar || "/nino360-primary.png"}
                      alt={selectedApplication.candidateName}
                    />
                    <AvatarFallback>
                      {selectedApplication.candidateName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedApplication.candidateName}</h2>
                    <p className="text-gray-600">Applied for {selectedApplication.jobTitle}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Application Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge className={getStatusColor(selectedApplication.status)}>
                              {selectedApplication.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Score:</span>
                            <span className={`font-bold ${getScoreColor(selectedApplication.score)}`}>
                              {selectedApplication.score}/100
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Priority:</span>
                            <Badge className={getPriorityColor(selectedApplication.priority)}>
                              {selectedApplication.priority}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Applied:</span>
                            <span>{new Date(selectedApplication.appliedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Source:</span>
                            <span>{selectedApplication.source}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recruiter:</span>
                            <span>{selectedApplication.recruiter}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Candidate Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedApplication.candidateEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedApplication.candidatePhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{selectedApplication.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span>{selectedApplication.experience} years experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Available in {selectedApplication.availability}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
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
                          {["Screening", "Interview", "Assessment", "Offer", "Hired", "Rejected"].map((status) => (
                            <Button
                              key={status}
                              variant={selectedApplication.status === status ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(selectedApplication.id, status as Application["status"])
                              }
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Application Documents</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Resume</p>
                              <p className="text-sm text-gray-600">PDF • 2.3 MB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        {selectedApplication.coverLetterUrl && (
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium">Cover Letter</p>
                                <p className="text-sm text-gray-600">PDF • 1.1 MB</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Application Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium">Application Submitted</p>
                              <p className="text-sm text-gray-600">
                                {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium">Initial Screening</p>
                              <p className="text-sm text-gray-600">2 days ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                              <p className="font-medium">Phone Interview Scheduled</p>
                              <p className="text-sm text-gray-600">1 day ago</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recruiter Notes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          placeholder="Add notes about this candidate..."
                          value={selectedApplication.notes}
                          rows={4}
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
                  <Button variant="outline" onClick={() => handleScheduleInterview(selectedApplication)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button
                    onClick={() => handleSendMessage(selectedApplication)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
