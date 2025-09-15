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
import {
  Search,
  Plus,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Eye,
  Heart,
  MessageSquare,
  Download,
  Users,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Candidate {
  id: string
  name: string
  title: string
  company: string
  location: string
  experience: number
  skills: string[]
  education: string
  email: string
  phone: string
  linkedin?: string
  github?: string
  portfolio?: string
  avatar: string
  rating: number
  status: "Available" | "Passive" | "Interviewing" | "Not Available"
  salary: {
    current: number
    expected: number
    currency: string
  }
  lastActive: string
  source: "LinkedIn" | "GitHub" | "Referral" | "Job Board" | "Direct"
  matchScore: number
  notes: string
}

const mockCandidates: Candidate[] = [
  {
    id: "cand-001",
    name: "Sarah Johnson",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    experience: 6,
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    education: "BS Computer Science - Stanford",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/sarahjohnson",
    github: "github.com/sarahjohnson",
    portfolio: "sarahjohnson.dev",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
    status: "Available",
    salary: { current: 140000, expected: 160000, currency: "USD" },
    lastActive: "2024-01-15",
    source: "LinkedIn",
    matchScore: 95,
    notes: "Excellent technical skills, strong communication",
  },
  {
    id: "cand-002",
    name: "Michael Chen",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    experience: 4,
    skills: ["Python", "Django", "React", "PostgreSQL", "Docker"],
    education: "MS Software Engineering - MIT",
    email: "michael.chen@email.com",
    phone: "+1 (555) 987-6543",
    linkedin: "linkedin.com/in/michaelchen",
    github: "github.com/michaelchen",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.6,
    status: "Passive",
    salary: { current: 120000, expected: 140000, currency: "USD" },
    lastActive: "2024-01-12",
    source: "GitHub",
    matchScore: 88,
    notes: "Strong backend experience, open to new opportunities",
  },
  {
    id: "cand-003",
    name: "Emily Rodriguez",
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "Austin, TX",
    experience: 5,
    skills: ["Figma", "Sketch", "Prototyping", "User Research", "Design Systems"],
    education: "BFA Graphic Design - RISD",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    linkedin: "linkedin.com/in/emilyrodriguez",
    portfolio: "emilyrodriguez.design",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    status: "Interviewing",
    salary: { current: 95000, expected: 110000, currency: "USD" },
    lastActive: "2024-01-14",
    source: "Referral",
    matchScore: 92,
    notes: "Outstanding portfolio, great cultural fit",
  },
]

const sourcingChannels = [
  { name: "LinkedIn", count: 1247, icon: Linkedin, color: "bg-blue-500" },
  { name: "GitHub", count: 892, icon: Github, color: "bg-gray-800" },
  { name: "Job Boards", count: 634, icon: Globe, color: "bg-green-500" },
  { name: "Referrals", count: 423, icon: Users, color: "bg-purple-500" },
  { name: "Direct Outreach", count: 298, icon: Mail, color: "bg-orange-500" },
]

export default function CandidateSourcing() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(mockCandidates)
  const [searchQuery, setSearchQuery] = useState("")
  const [skillsFilter, setSkillsFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [savedCandidates, setSavedCandidates] = useState<string[]>([])

  // Filter candidates
  useEffect(() => {
    let filtered = candidates

    if (searchQuery) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (skillsFilter) {
      filtered = filtered.filter((candidate) =>
        candidate.skills.some((skill) => skill.toLowerCase().includes(skillsFilter.toLowerCase())),
      )
    }

    if (locationFilter) {
      filtered = filtered.filter((candidate) => candidate.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((candidate) => candidate.status.toLowerCase() === statusFilter)
    }

    setFilteredCandidates(filtered)
  }, [candidates, searchQuery, skillsFilter, locationFilter, statusFilter])

  const handleSaveCandidate = (candidateId: string) => {
    if (savedCandidates.includes(candidateId)) {
      setSavedCandidates(savedCandidates.filter((id) => id !== candidateId))
      toast({
        title: "Candidate Removed",
        description: "Candidate removed from saved list.",
      })
    } else {
      setSavedCandidates([...savedCandidates, candidateId])
      toast({
        title: "Candidate Saved",
        description: "Candidate added to saved list.",
      })
    }
  }

  const handleContactCandidate = (candidate: Candidate) => {
    toast({
      title: "Contact Initiated",
      description: `Reaching out to ${candidate.name}...`,
    })
  }

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsProfileOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Passive":
        return "bg-yellow-100 text-yellow-800"
      case "Interviewing":
        return "bg-blue-100 text-blue-800"
      case "Not Available":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "LinkedIn":
        return Linkedin
      case "GitHub":
        return Github
      case "Referral":
        return Users
      case "Job Board":
        return Globe
      case "Direct":
        return Mail
      default:
        return Search
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Sourcing</h1>
          <p className="text-gray-600">Discover and connect with top talent</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Sourcing Channels Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {sourcingChannels.map((channel, index) => (
          <motion.div
            key={channel.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${channel.color} text-white`}>
                    <channel.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{channel.name}</p>
                    <p className="text-lg font-bold">{channel.count.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates by name, title, skills, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              placeholder="Skills (e.g. React, Python)"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full lg:w-[200px]"
            />
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full lg:w-[180px]"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="passive">Passive</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="not available">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCandidates.map((candidate, index) => {
          const SourceIcon = getSourceIcon(candidate.source)
          const isSaved = savedCandidates.includes(candidate.id)

          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
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
                        <p className="text-sm text-gray-600">{candidate.title}</p>
                        <p className="text-xs text-gray-500">{candidate.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{candidate.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{candidate.experience}y exp</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Match Score</span>
                      <span className="text-sm font-bold text-green-600">{candidate.matchScore}%</span>
                    </div>
                    <Progress value={candidate.matchScore} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Top Skills</p>
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

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <SourceIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{candidate.source}</span>
                    </div>
                    <span className="text-gray-500">Active {new Date(candidate.lastActive).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewProfile(candidate)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveCandidate(candidate.id)}
                      className={isSaved ? "bg-red-50 text-red-600 border-red-200" : ""}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleContactCandidate(candidate)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Candidate Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedCandidate.avatar || "/placeholder.svg"} alt={selectedCandidate.name} />
                    <AvatarFallback>
                      {selectedCandidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                    <p className="text-gray-600">
                      {selectedCandidate.title} at {selectedCandidate.company}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{selectedCandidate.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span>{selectedCandidate.experience} years experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span>{selectedCandidate.education}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(selectedCandidate.status)}>
                              {selectedCandidate.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Match Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Overall Match</span>
                              <span className="font-bold text-green-600">{selectedCandidate.matchScore}%</span>
                            </div>
                            <Progress value={selectedCandidate.matchScore} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Skills Match</span>
                              <span className="font-bold">92%</span>
                            </div>
                            <Progress value={92} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Experience Level</span>
                              <span className="font-bold">88%</span>
                            </div>
                            <Progress value={88} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Salary Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-gray-600">Current Salary</p>
                            <p className="text-lg font-bold">
                              ${selectedCandidate.salary.current.toLocaleString()} {selectedCandidate.salary.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Expected Salary</p>
                            <p className="text-lg font-bold">
                              ${selectedCandidate.salary.expected.toLocaleString()} {selectedCandidate.salary.currency}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Work Experience</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-l-2 border-blue-200 pl-4">
                            <h4 className="font-semibold">{selectedCandidate.title}</h4>
                            <p className="text-gray-600">{selectedCandidate.company}</p>
                            <p className="text-sm text-gray-500">2020 - Present</p>
                            <p className="text-sm mt-2">
                              Leading frontend development initiatives and mentoring junior developers.
                            </p>
                          </div>
                          <div className="border-l-2 border-gray-200 pl-4">
                            <h4 className="font-semibold">Frontend Developer</h4>
                            <p className="text-gray-600">Previous Company</p>
                            <p className="text-sm text-gray-500">2018 - 2020</p>
                            <p className="text-sm mt-2">
                              Developed responsive web applications using React and modern JavaScript.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Technical Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-sm">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{selectedCandidate.email}</span>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedCandidate.phone}</span>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                        {selectedCandidate.linkedin && (
                          <div className="flex items-center gap-3">
                            <Linkedin className="h-4 w-4 text-gray-400" />
                            <span>{selectedCandidate.linkedin}</span>
                            <Button variant="outline" size="sm">
                              <Linkedin className="h-4 w-4 mr-1" />
                              LinkedIn
                            </Button>
                          </div>
                        )}
                        {selectedCandidate.github && (
                          <div className="flex items-center gap-3">
                            <Github className="h-4 w-4 text-gray-400" />
                            <span>{selectedCandidate.github}</span>
                            <Button variant="outline" size="sm">
                              <Github className="h-4 w-4 mr-1" />
                              GitHub
                            </Button>
                          </div>
                        )}
                        {selectedCandidate.portfolio && (
                          <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span>{selectedCandidate.portfolio}</span>
                            <Button variant="outline" size="sm">
                              <Globe className="h-4 w-4 mr-1" />
                              Portfolio
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSaveCandidate(selectedCandidate.id)}
                    className={
                      savedCandidates.includes(selectedCandidate.id) ? "bg-red-50 text-red-600 border-red-200" : ""
                    }
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${savedCandidates.includes(selectedCandidate.id) ? "fill-current" : ""}`}
                    />
                    {savedCandidates.includes(selectedCandidate.id) ? "Saved" : "Save"}
                  </Button>
                  <Button
                    onClick={() => handleContactCandidate(selectedCandidate)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Candidate
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
