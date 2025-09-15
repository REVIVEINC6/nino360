"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Plus,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Download,
  Upload,
  UserPlus,
  Clock,
  Target,
  Award,
} from "lucide-react"

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  location: string
  title: string
  experience: string
  skills: string[]
  status: "active" | "interviewing" | "offered" | "hired" | "rejected" | "withdrawn"
  rating: number
  source: string
  appliedDate: string
  lastActivity: string
  avatar?: string
  summary: string
  education: string
  expectedSalary: string
  availability: string
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
    portfolio?: string
  }
  applications: {
    jobTitle: string
    status: string
    appliedDate: string
  }[]
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Frontend Developer",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "AWS"],
    status: "interviewing",
    rating: 4.8,
    source: "LinkedIn",
    appliedDate: "2024-01-15",
    lastActivity: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
    summary: "Experienced frontend developer with expertise in React ecosystem and modern web technologies.",
    education: "BS Computer Science, Stanford University",
    expectedSalary: "$120,000 - $140,000",
    availability: "2 weeks notice",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
      portfolio: "https://sarahjohnson.dev",
    },
    applications: [
      { jobTitle: "Senior Frontend Developer", status: "interviewing", appliedDate: "2024-01-15" },
      { jobTitle: "React Developer", status: "applied", appliedDate: "2024-01-10" },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    title: "Full Stack Engineer",
    experience: "7+ years",
    skills: ["Node.js", "Python", "React", "PostgreSQL", "Docker"],
    status: "active",
    rating: 4.6,
    source: "Indeed",
    appliedDate: "2024-01-12",
    lastActivity: "1 day ago",
    summary: "Full-stack engineer with strong backend expertise and cloud architecture experience.",
    education: "MS Software Engineering, MIT",
    expectedSalary: "$130,000 - $150,000",
    availability: "Immediate",
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelchen",
      github: "https://github.com/michaelchen",
    },
    applications: [{ jobTitle: "Full Stack Engineer", status: "active", appliedDate: "2024-01-12" }],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    title: "UX/UI Designer",
    experience: "4+ years",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research", "Design Systems"],
    status: "offered",
    rating: 4.9,
    source: "Dribbble",
    appliedDate: "2024-01-08",
    lastActivity: "3 hours ago",
    summary: "Creative UX/UI designer with a passion for user-centered design and design systems.",
    education: "BFA Graphic Design, RISD",
    expectedSalary: "$85,000 - $100,000",
    availability: "3 weeks notice",
    socialLinks: {
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      portfolio: "https://emilyrodriguez.design",
    },
    applications: [
      { jobTitle: "Senior UX Designer", status: "offered", appliedDate: "2024-01-08" },
      { jobTitle: "Product Designer", status: "interviewing", appliedDate: "2024-01-05" },
    ],
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    title: "DevOps Engineer",
    experience: "6+ years",
    skills: ["Kubernetes", "AWS", "Terraform", "Jenkins", "Monitoring"],
    status: "hired",
    rating: 4.7,
    source: "Referral",
    appliedDate: "2024-01-05",
    lastActivity: "1 week ago",
    summary: "DevOps engineer specializing in cloud infrastructure and CI/CD pipeline optimization.",
    education: "BS Computer Engineering, University of Washington",
    expectedSalary: "$125,000 - $145,000",
    availability: "Hired",
    socialLinks: {
      linkedin: "https://linkedin.com/in/davidkim",
      github: "https://github.com/davidkim",
    },
    applications: [{ jobTitle: "Senior DevOps Engineer", status: "hired", appliedDate: "2024-01-05" }],
  },
]

const statusColors = {
  active: "bg-blue-100 text-blue-800",
  interviewing: "bg-yellow-100 text-yellow-800",
  offered: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
}

export default function CandidateDatabasePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    const matchesSource = sourceFilter === "all" || candidate.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Target className="h-4 w-4" />
      case "interviewing":
        return <Calendar className="h-4 w-4" />
      case "offered":
        return <Award className="h-4 w-4" />
      case "hired":
        return <UserPlus className="h-4 w-4" />
      case "rejected":
        return <Clock className="h-4 w-4" />
      case "withdrawn":
        return <Clock className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const CandidateCard = ({ candidate }: { candidate: Candidate }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => setSelectedCandidate(candidate)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback>
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{candidate.name}</CardTitle>
                <CardDescription className="text-sm">{candidate.title}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{candidate.rating}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={statusColors[candidate.status]}>
              {getStatusIcon(candidate.status)}
              <span className="ml-1 capitalize">{candidate.status}</span>
            </Badge>
            <Badge variant="outline">{candidate.source}</Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{candidate.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{candidate.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Skills</p>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{candidate.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</span>
            <span>Last activity: {candidate.lastActivity}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const CandidateListItem = ({ candidate }: { candidate: Candidate }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
      <Card
        className="hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => setSelectedCandidate(candidate)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback>
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{candidate.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{candidate.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {candidate.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {candidate.experience}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-1 max-w-xs">
                {candidate.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{candidate.skills.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge className={statusColors[candidate.status]}>
                  {getStatusIcon(candidate.status)}
                  <span className="ml-1 capitalize">{candidate.status}</span>
                </Badge>
                <Badge variant="outline">{candidate.source}</Badge>
              </div>

              <div className="text-xs text-muted-foreground text-right">
                <div>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</div>
                <div>Last: {candidate.lastActivity}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidate Database</h1>
          <p className="text-muted-foreground">Manage and track all candidates in your talent pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{candidates.length}</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{candidates.filter((c) => c.status === "interviewing").length}</p>
                <p className="text-sm text-muted-foreground">Interviewing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{candidates.filter((c) => c.status === "offered").length}</p>
                <p className="text-sm text-muted-foreground">Offers Extended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{candidates.filter((c) => c.status === "hired").length}</p>
                <p className="text-sm text-muted-foreground">Hired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates by name, title, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Indeed">Indeed</SelectItem>
                <SelectItem value="Dribbble">Dribbble</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Direct">Direct</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </p>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <CandidateListItem key={candidate.id} candidate={candidate} />
            ))}
          </div>
        )}

        {filteredCandidates.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or add new candidates to your database.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
