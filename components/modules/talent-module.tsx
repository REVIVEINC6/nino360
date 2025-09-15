"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Calendar,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Download,
  RefreshCw,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bot,
  Brain,
  Zap,
  Target,
  Award,
  UserCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  status: "open" | "paused" | "closed" | "draft"
  applicants: number
  posted: string
  deadline: string
  priority: "low" | "medium" | "high" | "urgent"
  hiringManager: string
  budget: number
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  status: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected"
  score: number
  experience: number
  location: string
  appliedDate: string
  lastActivity: string
  skills: string[]
  source: string
}

interface TalentMetrics {
  totalJobs: number
  activeJobs: number
  totalCandidates: number
  hiredThisMonth: number
  avgTimeToHire: number
  offerAcceptanceRate: number
  costPerHire: number
  qualityOfHire: number
}

export function TalentModule() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const [metrics, setMetrics] = useState<TalentMetrics>({
    totalJobs: 47,
    activeJobs: 23,
    totalCandidates: 892,
    hiredThisMonth: 12,
    avgTimeToHire: 28,
    offerAcceptanceRate: 87.5,
    costPerHire: 4200,
    qualityOfHire: 4.2,
  })

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "full-time",
      status: "open",
      applicants: 47,
      posted: "2024-01-15",
      deadline: "2024-02-15",
      priority: "high",
      hiringManager: "Sarah Johnson",
      budget: 150000,
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "full-time",
      status: "open",
      applicants: 23,
      posted: "2024-01-12",
      deadline: "2024-02-12",
      priority: "urgent",
      hiringManager: "Mike Wilson",
      budget: 130000,
    },
    {
      id: "3",
      title: "UX Designer",
      department: "Design",
      location: "New York, NY",
      type: "full-time",
      status: "paused",
      applicants: 31,
      posted: "2024-01-10",
      deadline: "2024-02-10",
      priority: "medium",
      hiringManager: "Lisa Brown",
      budget: 95000,
    },
  ])

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Alex Chen",
      email: "alex.chen@email.com",
      phone: "+1-555-0123",
      position: "Senior Software Engineer",
      status: "interview",
      score: 92,
      experience: 5,
      location: "San Francisco, CA",
      appliedDate: "2024-01-18",
      lastActivity: "2024-01-20",
      skills: ["React", "Node.js", "Python", "AWS"],
      source: "LinkedIn",
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@email.com",
      phone: "+1-555-0456",
      position: "Product Manager",
      status: "offer",
      score: 88,
      experience: 7,
      location: "Austin, TX",
      appliedDate: "2024-01-16",
      lastActivity: "2024-01-19",
      skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
      source: "Company Website",
    },
    {
      id: "3",
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1-555-0789",
      position: "UX Designer",
      status: "screening",
      score: 85,
      experience: 4,
      location: "Seattle, WA",
      appliedDate: "2024-01-14",
      lastActivity: "2024-01-17",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      source: "Referral",
    },
  ])

  const refreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update metrics with slight variations
      setMetrics((prev) => ({
        ...prev,
        totalCandidates: prev.totalCandidates + Math.floor((Math.random() - 0.5) * 20),
        hiredThisMonth: prev.hiredThisMonth + Math.floor(Math.random() * 3),
        avgTimeToHire: Math.max(20, Math.min(40, prev.avgTimeToHire + (Math.random() - 0.5) * 5)),
        offerAcceptanceRate: Math.max(75, Math.min(95, prev.offerAcceptanceRate + (Math.random() - 0.5) * 3)),
      }))

      toast.success("Talent data refreshed successfully")
    } catch (error) {
      toast.error("Failed to refresh talent data")
    } finally {
      setLoading(false)
    }
  }

  const handleJobAction = async (jobId: string, action: string) => {
    try {
      switch (action) {
        case "pause":
          setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: "paused" as const } : job)))
          toast.success("Job paused successfully")
          break
        case "activate":
          setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: "open" as const } : job)))
          toast.success("Job activated successfully")
          break
        case "close":
          setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: "closed" as const } : job)))
          toast.success("Job closed successfully")
          break
        case "edit":
          toast.info("Opening job editor...")
          break
        case "clone":
          const jobToClone = jobs.find((j) => j.id === jobId)
          if (jobToClone) {
            const newJob = { ...jobToClone, id: Date.now().toString(), title: `${jobToClone.title} (Copy)` }
            setJobs((prev) => [newJob, ...prev])
            toast.success("Job cloned successfully")
          }
          break
        case "delete":
          if (confirm("Are you sure you want to delete this job?")) {
            setJobs((prev) => prev.filter((job) => job.id !== jobId))
            toast.success("Job deleted successfully")
          }
          break
        default:
          toast.info(`Action ${action} performed`)
      }
    } catch (error) {
      toast.error("Failed to perform action")
    }
  }

  const handleCandidateAction = async (candidateId: string, action: string) => {
    try {
      switch (action) {
        case "advance":
          setCandidates((prev) =>
            prev.map((candidate) => {
              if (candidate.id === candidateId) {
                const stages = ["applied", "screening", "interview", "offer", "hired"]
                const currentIndex = stages.indexOf(candidate.status)
                const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)]
                return { ...candidate, status: nextStage as any }
              }
              return candidate
            }),
          )
          toast.success("Candidate advanced to next stage")
          break
        case "reject":
          setCandidates((prev) =>
            prev.map((candidate) =>
              candidate.id === candidateId ? { ...candidate, status: "rejected" as const } : candidate,
            ),
          )
          toast.info("Candidate rejected")
          break
        case "schedule":
          toast.info("Opening interview scheduler...")
          break
        case "contact":
          toast.info("Opening contact form...")
          break
        case "hire":
          setCandidates((prev) =>
            prev.map((candidate) =>
              candidate.id === candidateId ? { ...candidate, status: "hired" as const } : candidate,
            ),
          )
          toast.success("Candidate hired!")
          break
        default:
          toast.info(`Action ${action} performed`)
      }
    } catch (error) {
      toast.error("Failed to perform action")
    }
  }

  const exportData = async (type: string) => {
    try {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const data = type === "jobs" ? jobs : type === "candidates" ? candidates : metrics
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `talent-${type}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`${type} data exported successfully`)
    } catch (error) {
      toast.error("Failed to export data")
    } finally {
      setLoading(false)
    }
  }

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800"
      case "screening":
        return "bg-yellow-100 text-yellow-800"
      case "interview":
        return "bg-purple-100 text-purple-800"
      case "offer":
        return "bg-orange-100 text-orange-800"
      case "hired":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "overview") {
        refreshData()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Talent Acquisition</h2>
          <p className="text-muted-foreground">AI-powered recruitment and candidate management platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportData("overview")} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {metrics.totalJobs} total positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCandidates.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />+{metrics.hiredThisMonth} hired this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTimeToHire} days</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              -3 days vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Acceptance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.offerAcceptanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Above industry avg
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Hiring Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Management</TabsTrigger>
          <TabsTrigger value="candidates">Candidate Pipeline</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Hiring Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Hiring Funnel</CardTitle>
                <CardDescription>Candidate progression through stages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { stage: "Applied", count: 892, percentage: 100 },
                  { stage: "Screening", count: 234, percentage: 26 },
                  { stage: "Interview", count: 89, percentage: 10 },
                  { stage: "Offer", count: 23, percentage: 3 },
                  { stage: "Hired", count: 12, percentage: 1.3 },
                ].map((item) => (
                  <div key={item.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.stage}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performing Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Jobs</CardTitle>
                <CardDescription>Jobs with highest application rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Senior Software Engineer", applications: 47, quality: 4.2 },
                  { title: "Product Manager", applications: 23, quality: 4.5 },
                  { title: "UX Designer", applications: 31, quality: 3.8 },
                  { title: "Data Scientist", applications: 19, quality: 4.1 },
                ].map((job, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.applications} applications • {job.quality}/5 quality
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{job.quality}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Job Management</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportData("jobs")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                      {job.title
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job.department} • {job.location}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getJobStatusColor(job.status)}>{job.status}</Badge>
                        <Badge className={getPriorityColor(job.priority)}>{job.priority}</Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applicants} applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {job.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${job.budget.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-sm text-muted-foreground">Manager: {job.hiringManager}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleJobAction(job.id, "edit")}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleJobAction(job.id, job.status === "open" ? "pause" : "activate")}
                          >
                            {job.status === "open" ? "Pause Job" : "Activate Job"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleJobAction(job.id, "clone")}>
                            Clone Job
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleJobAction(job.id, "close")}>
                            Close Job
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleJobAction(job.id, "delete")} className="text-red-600">
                            Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Candidate Pipeline</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportData("candidates")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCandidateStatusColor(candidate.status)}>{candidate.status}</Badge>
                        <Badge variant="outline">{candidate.source}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Score:{" "}
                          <span className={`font-medium ${getScoreColor(candidate.score)}`}>{candidate.score}</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {candidate.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{candidate.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{candidate.experience} years exp</p>
                    <p className="text-sm text-muted-foreground">Applied: {candidate.appliedDate}</p>
                    <p className="text-sm text-muted-foreground">Last activity: {candidate.lastActivity}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCandidateAction(candidate.id, "advance")}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Advance
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleCandidateAction(candidate.id, "schedule")}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCandidateAction(candidate.id, "contact")}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCandidateAction(candidate.id, "hire")}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Hire Candidate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCandidateAction(candidate.id, "reject")}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Candidate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI-Powered Talent Insights</h3>
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              Generate New Insights
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <Badge className="bg-green-100 text-green-800">High Impact</Badge>
                </div>
                <Badge variant="outline">96% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Candidate Quality Optimization</h4>
              <p className="text-sm text-muted-foreground mb-4">
                AI identified top-performing candidate sources and recommends focusing recruitment efforts on LinkedIn
                and employee referrals for 40% better quality scores.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Increase LinkedIn sourcing budget by 30% and implement enhanced referral incentive program.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Implement Strategy
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <Badge className="bg-yellow-100 text-yellow-800">Medium Impact</Badge>
                </div>
                <Badge variant="outline">89% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Interview Process Optimization</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Analysis shows that reducing interview rounds from 4 to 3 could decrease time-to-hire by 12 days while
                maintaining quality standards.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Streamline interview process by combining technical and cultural fit assessments in a single round.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Optimize Process
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <Badge className="bg-blue-100 text-blue-800">Retention Impact</Badge>
                </div>
                <Badge variant="outline">92% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Salary Benchmarking Alert</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Current salary offers for Senior Software Engineers are 8% below market rate, potentially causing 23% of
                candidates to decline offers.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Adjust salary bands to match market rates and consider additional equity compensation packages.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Update Compensation
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <Badge className="bg-red-100 text-red-800">Diversity Alert</Badge>
                </div>
                <Badge variant="outline">85% confidence</Badge>
              </div>
              <h4 className="font-semibold mb-2">Diversity & Inclusion Opportunity</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Current hiring pipeline shows 72% male candidates. AI suggests expanding sourcing to increase diversity
                and improve team performance.
              </p>
              <div className="bg-white/50 p-3 rounded border mb-4">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">
                  Partner with diversity-focused job boards and implement blind resume screening to reduce unconscious
                  bias.
                </p>
              </div>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Enhance Diversity
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
