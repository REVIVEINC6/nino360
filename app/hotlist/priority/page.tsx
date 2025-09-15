"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  Target,
  Users,
  Plus,
  Search,
  Eye,
  MessageSquare,
  Phone,
  Briefcase,
  Calendar,
  Award,
  Download,
  Edit,
  MoreHorizontal,
} from "lucide-react"

export default function PriorityCandidatesPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Mock priority candidates data
  const priorityCandidates = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior React Developer",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      experience: "5+ years",
      location: "San Francisco, CA",
      availability: "Immediate",
      priority: "Critical",
      matchScore: 98,
      lastContact: "2 hours ago",
      status: "Interview Scheduled",
      avatar: "/placeholder.svg?height=40&width=40",
      salary: "$140k - $160k",
      phone: "+1 (555) 123-4567",
      email: "sarah.chen@email.com",
      linkedIn: "linkedin.com/in/sarahchen",
      notes: "Excellent technical skills, strong cultural fit",
      interviewDate: "Tomorrow 2:00 PM",
      recruiter: "John Smith",
      client: "TechCorp Inc.",
      jobTitle: "Senior Frontend Developer",
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "DevOps Engineer",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Python"],
      experience: "7+ years",
      location: "Austin, TX",
      availability: "2 weeks",
      priority: "High",
      matchScore: 95,
      lastContact: "1 day ago",
      status: "Client Review",
      avatar: "/placeholder.svg?height=40&width=40",
      salary: "$130k - $150k",
      phone: "+1 (555) 234-5678",
      email: "michael.rodriguez@email.com",
      linkedIn: "linkedin.com/in/mrodriguez",
      notes: "Strong DevOps background, AWS certified",
      interviewDate: "Pending",
      recruiter: "Jane Doe",
      client: "CloudFirst Solutions",
      jobTitle: "Senior DevOps Engineer",
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Product Manager",
      skills: ["Strategy", "Analytics", "Agile", "Roadmapping", "Leadership"],
      experience: "6+ years",
      location: "New York, NY",
      availability: "Immediate",
      priority: "Critical",
      matchScore: 97,
      lastContact: "30 minutes ago",
      status: "Offer Pending",
      avatar: "/placeholder.svg?height=40&width=40",
      salary: "$120k - $140k",
      phone: "+1 (555) 345-6789",
      email: "emily.johnson@email.com",
      linkedIn: "linkedin.com/in/emilyjohnson",
      notes: "Exceptional product leadership experience",
      interviewDate: "Completed",
      recruiter: "Bob Wilson",
      client: "ProductCo",
      jobTitle: "Senior Product Manager",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Data Scientist",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
      experience: "4+ years",
      location: "Seattle, WA",
      availability: "1 week",
      priority: "High",
      matchScore: 92,
      lastContact: "3 hours ago",
      status: "Technical Assessment",
      avatar: "/placeholder.svg?height=40&width=40",
      salary: "$110k - $130k",
      phone: "+1 (555) 456-7890",
      email: "david.kim@email.com",
      linkedIn: "linkedin.com/in/davidkim",
      notes: "Strong ML background, PhD in Statistics",
      interviewDate: "Next Week",
      recruiter: "Alice Brown",
      client: "DataTech Solutions",
      jobTitle: "Senior Data Scientist",
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "UX Designer",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability"],
      experience: "5+ years",
      location: "Los Angeles, CA",
      availability: "Immediate",
      priority: "Medium",
      matchScore: 89,
      lastContact: "1 day ago",
      status: "Portfolio Review",
      avatar: "/placeholder.svg?height=40&width=40",
      salary: "$95k - $115k",
      phone: "+1 (555) 567-8901",
      email: "lisa.wang@email.com",
      linkedIn: "linkedin.com/in/lisawang",
      notes: "Award-winning designer, strong portfolio",
      interviewDate: "This Friday",
      recruiter: "Chris Davis",
      client: "DesignStudio Pro",
      jobTitle: "Senior UX Designer",
    },
    {
      id: 6,
      name: "James Thompson",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "PostgreSQL", "MongoDB", "Docker"],
      experience: "6+ years",
      location: "Chicago, IL",
      availability: "3 weeks",
      priority: "High",
      matchScore: 94,
      lastContact: "4 hours ago",
      status: "Reference Check",
      avatar: "/placeholder.svg?height=40&width=40",
      salary: "$125k - $145k",
      phone: "+1 (555) 678-9012",
      email: "james.thompson@email.com",
      linkedIn: "linkedin.com/in/jamesthompson",
      notes: "Full-stack expertise, team lead experience",
      interviewDate: "Completed",
      recruiter: "Emma Wilson",
      client: "StartupXYZ",
      jobTitle: "Lead Full Stack Developer",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "offer pending":
        return "bg-green-100 text-green-800"
      case "interview scheduled":
        return "bg-blue-100 text-blue-800"
      case "client review":
        return "bg-purple-100 text-purple-800"
      case "technical assessment":
        return "bg-indigo-100 text-indigo-800"
      case "portfolio review":
        return "bg-pink-100 text-pink-800"
      case "reference check":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCandidates = priorityCandidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = filterStatus === "all" || candidate.status.toLowerCase().includes(filterStatus.toLowerCase())
    const matchesPriority =
      filterPriority === "all" || candidate.priority.toLowerCase() === filterPriority.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority
  })

  const candidatesByCategory = {
    all: filteredCandidates,
    critical: filteredCandidates.filter((c) => c.priority === "Critical"),
    high: filteredCandidates.filter((c) => c.priority === "High"),
    immediate: filteredCandidates.filter((c) => c.availability === "Immediate"),
    topPerformers: filteredCandidates.filter((c) => c.matchScore >= 95),
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-red-50 to-pink-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Priority Candidates</h1>
          <p className="text-gray-600 mt-1">High-priority candidates requiring immediate attention</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/20"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name, role, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/50"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-white/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="interview">Interview Scheduled</SelectItem>
            <SelectItem value="offer">Offer Pending</SelectItem>
            <SelectItem value="review">Client Review</SelectItem>
            <SelectItem value="assessment">Technical Assessment</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-48 bg-white/50">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Priority Categories Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="all">All ({candidatesByCategory.all.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({candidatesByCategory.critical.length})</TabsTrigger>
            <TabsTrigger value="high">High Priority ({candidatesByCategory.high.length})</TabsTrigger>
            <TabsTrigger value="immediate">Immediate ({candidatesByCategory.immediate.length})</TabsTrigger>
            <TabsTrigger value="topPerformers">
              Top Performers ({candidatesByCategory.topPerformers.length})
            </TabsTrigger>
          </TabsList>

          {Object.entries(candidatesByCategory).map(([category, candidates]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4">
                {candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-lg">
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                                  <p className="text-gray-600 font-medium">{candidate.role}</p>
                                  <p className="text-sm text-gray-500">
                                    {candidate.location} • {candidate.experience}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getPriorityColor(candidate.priority)}`}>
                                    {candidate.priority}
                                  </Badge>
                                  <Badge className={`${getStatusColor(candidate.status)}`}>{candidate.status}</Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">Match Score: {candidate.matchScore}%</span>
                                  </div>
                                  <Progress value={candidate.matchScore} className="h-2" />
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-green-600" />
                                    <span className="text-sm">Available: {candidate.availability}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm">{candidate.salary}</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm">Interview: {candidate.interviewDate}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-600" />
                                    <span className="text-sm">Recruiter: {candidate.recruiter}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Award className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-medium">Skills:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.skills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>Last contact: {candidate.lastContact}</span>
                                  <span>•</span>
                                  <span>Client: {candidate.client}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Call
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  )
}
