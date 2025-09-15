"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  Users,
  Target,
  DollarSign,
  Calendar,
  Briefcase,
  Plus,
  Search,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Send,
  Phone,
  MapPin,
  Award,
  Zap,
} from "lucide-react"

export default function UrgentRequirementsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock urgent requirements data
  const urgentRequirements = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      client: "TechCorp Inc.",
      clientLogo: "/placeholder.svg?height=40&width=40",
      deadline: "3 days",
      priority: "Critical",
      budget: "$120k - $150k",
      candidates: 8,
      status: "Active Search",
      requirements: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
      description: "Looking for a senior full-stack developer to lead our new product development team.",
      location: "San Francisco, CA",
      jobType: "Full-time",
      remote: "Hybrid",
      experience: "5+ years",
      recruiter: "John Smith",
      datePosted: "2 days ago",
      applications: 24,
      interviews: 5,
      offers: 1,
      urgencyReason: "Critical product launch deadline",
      clientContact: "Sarah Johnson",
      clientEmail: "sarah@techcorp.com",
      clientPhone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      title: "Cloud Architect",
      client: "CloudFirst Solutions",
      clientLogo: "/placeholder.svg?height=40&width=40",
      deadline: "1 week",
      priority: "High",
      budget: "$140k - $180k",
      candidates: 5,
      status: "Screening",
      requirements: ["AWS", "Terraform", "Microservices", "Kubernetes", "Python"],
      description: "Seeking an experienced cloud architect to design and implement scalable cloud infrastructure.",
      location: "Austin, TX",
      jobType: "Full-time",
      remote: "Remote",
      experience: "7+ years",
      recruiter: "Jane Doe",
      datePosted: "1 week ago",
      applications: 18,
      interviews: 3,
      offers: 0,
      urgencyReason: "Infrastructure migration project",
      clientContact: "Mike Wilson",
      clientEmail: "mike@cloudfirst.com",
      clientPhone: "+1 (555) 234-5678",
    },
    {
      id: 3,
      title: "Data Scientist",
      client: "Analytics Pro",
      clientLogo: "/placeholder.svg?height=40&width=40",
      deadline: "5 days",
      priority: "High",
      budget: "$110k - $140k",
      candidates: 12,
      status: "Interview Phase",
      requirements: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
      description: "Data scientist needed to develop ML models for predictive analytics platform.",
      location: "New York, NY",
      jobType: "Full-time",
      remote: "On-site",
      experience: "4+ years",
      recruiter: "Bob Wilson",
      datePosted: "3 days ago",
      applications: 31,
      interviews: 8,
      offers: 2,
      urgencyReason: "Client presentation deadline",
      clientContact: "Lisa Chen",
      clientEmail: "lisa@analyticspro.com",
      clientPhone: "+1 (555) 345-6789",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      client: "StartupXYZ",
      clientLogo: "/placeholder.svg?height=40&width=40",
      deadline: "2 weeks",
      priority: "Medium",
      budget: "$100k - $130k",
      candidates: 15,
      status: "Active Search",
      requirements: ["Docker", "Jenkins", "AWS", "Linux", "Monitoring"],
      description: "DevOps engineer to streamline our deployment pipeline and infrastructure automation.",
      location: "Seattle, WA",
      jobType: "Full-time",
      remote: "Hybrid",
      experience: "3+ years",
      recruiter: "Alice Brown",
      datePosted: "5 days ago",
      applications: 42,
      interviews: 6,
      offers: 0,
      urgencyReason: "Scaling infrastructure needs",
      clientContact: "Tom Davis",
      clientEmail: "tom@startupxyz.com",
      clientPhone: "+1 (555) 456-7890",
    },
    {
      id: 5,
      title: "Product Manager",
      client: "InnovateCorp",
      clientLogo: "/placeholder.svg?height=40&width=40",
      deadline: "1 week",
      priority: "Critical",
      budget: "$130k - $160k",
      candidates: 6,
      status: "Client Review",
      requirements: ["Product Strategy", "Agile", "Analytics", "Leadership", "B2B SaaS"],
      description: "Senior product manager to drive product strategy and roadmap for our flagship SaaS platform.",
      location: "Boston, MA",
      jobType: "Full-time",
      remote: "Hybrid",
      experience: "6+ years",
      recruiter: "Chris Davis",
      datePosted: "1 week ago",
      applications: 19,
      interviews: 4,
      offers: 1,
      urgencyReason: "Product roadmap planning",
      clientContact: "Emma Wilson",
      clientEmail: "emma@innovatecorp.com",
      clientPhone: "+1 (555) 567-8901",
    },
    {
      id: 6,
      title: "Security Engineer",
      client: "SecureTech Ltd",
      clientLogo: "/placeholder.svg?height=40&width=40",
      deadline: "4 days",
      priority: "Critical",
      budget: "$125k - $155k",
      candidates: 4,
      status: "Urgent Hiring",
      requirements: ["Cybersecurity", "Penetration Testing", "CISSP", "Network Security", "Incident Response"],
      description:
        "Cybersecurity engineer needed immediately to address security vulnerabilities and implement security measures.",
      location: "Washington, DC",
      jobType: "Full-time",
      remote: "On-site",
      experience: "5+ years",
      recruiter: "David Kim",
      datePosted: "1 day ago",
      applications: 12,
      interviews: 2,
      offers: 0,
      urgencyReason: "Security incident response",
      clientContact: "Rachel Green",
      clientEmail: "rachel@securetech.com",
      clientPhone: "+1 (555) 678-9012",
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
      case "urgent hiring":
        return "bg-red-100 text-red-800"
      case "active search":
        return "bg-orange-100 text-orange-800"
      case "screening":
        return "bg-yellow-100 text-yellow-800"
      case "interview phase":
        return "bg-blue-100 text-blue-800"
      case "client review":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeadlineUrgency = (deadline: string) => {
    const days = Number.parseInt(deadline.split(" ")[0])
    if (days <= 3) return "text-red-600"
    if (days <= 7) return "text-orange-600"
    return "text-yellow-600"
  }

  const filteredRequirements = urgentRequirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requirements.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPriority = filterPriority === "all" || req.priority.toLowerCase() === filterPriority.toLowerCase()
    const matchesStatus = filterStatus === "all" || req.status.toLowerCase().includes(filterStatus.toLowerCase())

    return matchesSearch && matchesPriority && matchesStatus
  })

  const requirementsByCategory = {
    all: filteredRequirements,
    critical: filteredRequirements.filter((r) => r.priority === "Critical"),
    high: filteredRequirements.filter((r) => r.priority === "High"),
    urgent: filteredRequirements.filter((r) => Number.parseInt(r.deadline.split(" ")[0]) <= 3),
    escalated: filteredRequirements.filter((r) => r.status === "Urgent Hiring" || r.priority === "Critical"),
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
          <h1 className="text-3xl font-bold text-gray-900">Urgent Requirements</h1>
          <p className="text-gray-600 mt-1">Critical job requirements needing immediate attention</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
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
            placeholder="Search requirements by title, client, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/50"
          />
        </div>
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-white/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="urgent">Urgent Hiring</SelectItem>
            <SelectItem value="active">Active Search</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="interview">Interview Phase</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Requirements Categories Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="all">All ({requirementsByCategory.all.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({requirementsByCategory.critical.length})</TabsTrigger>
            <TabsTrigger value="high">High Priority ({requirementsByCategory.high.length})</TabsTrigger>
            <TabsTrigger value="urgent">Urgent ({requirementsByCategory.urgent.length})</TabsTrigger>
            <TabsTrigger value="escalated">Escalated ({requirementsByCategory.escalated.length})</TabsTrigger>
          </TabsList>

          {Object.entries(requirementsByCategory).map(([category, requirements]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4">
                {requirements.map((requirement, index) => (
                  <motion.div
                    key={requirement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {requirement.client.charAt(0)}
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900">{requirement.title}</h3>
                                  <p className="text-gray-600 font-medium">{requirement.client}</p>
                                  <p className="text-sm text-gray-500 mt-1">{requirement.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getPriorityColor(requirement.priority)}`}>
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {requirement.priority}
                                  </Badge>
                                  <Badge className={`${getStatusColor(requirement.status)}`}>
                                    {requirement.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Clock className={`h-4 w-4 ${getDeadlineUrgency(requirement.deadline)}`} />
                                    <span className={`text-sm font-medium ${getDeadlineUrgency(requirement.deadline)}`}>
                                      Deadline: {requirement.deadline}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{requirement.location}</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">{requirement.budget}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm">
                                      {requirement.jobType} • {requirement.remote}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm">{requirement.candidates} candidates</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm">{requirement.experience} experience</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-indigo-600" />
                                    <span className="text-sm">{requirement.applications} applications</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-teal-600" />
                                    <span className="text-sm">{requirement.interviews} interviews</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Zap className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-medium">Required Skills:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {requirement.requirements.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                  <span className="text-sm font-medium text-red-800">Urgency Reason:</span>
                                </div>
                                <p className="text-sm text-red-700">{requirement.urgencyReason}</p>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>Recruiter: {requirement.recruiter}</span>
                                  <span>•</span>
                                  <span>Posted: {requirement.datePosted}</span>
                                  <span>•</span>
                                  <span>Contact: {requirement.clientContact}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Send className="h-4 w-4 mr-1" />
                                    Contact
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
