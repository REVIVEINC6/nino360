"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  Clock,
  TrendingUp,
  Building2,
  FileText,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface JobRequisition {
  id: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  status: "draft" | "open" | "in-progress" | "filled" | "on-hold" | "closed"
  priority: "high" | "medium" | "low"
  salaryMin: number
  salaryMax: number
  applicants: number
  interviews: number
  offers: number
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  closingDate: string
  hiringManager: string
  recruiter: string
}

const mockJobs: JobRequisition[] = [
  {
    id: "job-001",
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "full-time",
    status: "open",
    priority: "high",
    salaryMin: 120000,
    salaryMax: 180000,
    applicants: 45,
    interviews: 12,
    offers: 2,
    description: "We are looking for a Senior Full Stack Developer to join our growing engineering team...",
    requirements: ["5+ years experience", "React/Node.js", "AWS", "TypeScript"],
    benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
    postedDate: "2024-01-15",
    closingDate: "2024-02-15",
    hiringManager: "Sarah Johnson",
    recruiter: "Mike Chen",
  },
  {
    id: "job-002",
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "full-time",
    status: "in-progress",
    priority: "medium",
    salaryMin: 100000,
    salaryMax: 140000,
    applicants: 32,
    interviews: 8,
    offers: 1,
    description: "Join our product team to drive innovation and user experience...",
    requirements: ["3+ years PM experience", "Agile/Scrum", "Analytics", "Leadership"],
    benefits: ["Health Insurance", "401k", "Flexible Hours", "Learning Budget"],
    postedDate: "2024-01-20",
    closingDate: "2024-02-20",
    hiringManager: "Emily Davis",
    recruiter: "John Smith",
  },
  {
    id: "job-003",
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    type: "full-time",
    status: "open",
    priority: "high",
    salaryMin: 80000,
    salaryMax: 120000,
    applicants: 28,
    interviews: 6,
    offers: 0,
    description: "Create beautiful and intuitive user experiences for our products...",
    requirements: ["4+ years design experience", "Figma", "User Research", "Prototyping"],
    benefits: ["Health Insurance", "401k", "Remote Work", "Design Tools Budget"],
    postedDate: "2024-01-10",
    closingDate: "2024-02-10",
    hiringManager: "Lisa Wang",
    recruiter: "David Brown",
  },
]

export default function JobRequisitionsPage() {
  const [jobs, setJobs] = useState<JobRequisition[]>(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState<JobRequisition[]>(mockJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobRequisition | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // New job form state
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time" as const,
    priority: "medium" as const,
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    benefits: "",
    closingDate: "",
    hiringManager: "",
    recruiter: "",
  })

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter)
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((job) => job.department === departmentFilter)
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, statusFilter, departmentFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "open":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "filled":
        return "bg-purple-100 text-purple-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateJob = () => {
    if (!newJob.title || !newJob.department || !newJob.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const job: JobRequisition = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      type: newJob.type,
      status: "draft",
      priority: newJob.priority,
      salaryMin: Number.parseInt(newJob.salaryMin) || 0,
      salaryMax: Number.parseInt(newJob.salaryMax) || 0,
      applicants: 0,
      interviews: 0,
      offers: 0,
      description: newJob.description,
      requirements: newJob.requirements.split("\n").filter((r) => r.trim()),
      benefits: newJob.benefits.split("\n").filter((b) => b.trim()),
      postedDate: new Date().toISOString().split("T")[0],
      closingDate: newJob.closingDate,
      hiringManager: newJob.hiringManager,
      recruiter: newJob.recruiter,
    }

    setJobs([job, ...jobs])
    setIsCreateDialogOpen(false)
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "full-time",
      priority: "medium",
      salaryMin: "",
      salaryMax: "",
      description: "",
      requirements: "",
      benefits: "",
      closingDate: "",
      hiringManager: "",
      recruiter: "",
    })

    toast({
      title: "Success",
      description: "Job requisition created successfully",
    })
  }

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus as JobRequisition["status"] } : job)))
    toast({
      title: "Status Updated",
      description: `Job status changed to ${newStatus}`,
    })
  }

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter((job) => job.id !== jobId))
    toast({
      title: "Job Deleted",
      description: "Job requisition has been deleted",
    })
  }

  const departments = Array.from(new Set(jobs.map((job) => job.department)))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Requisitions</h1>
          <p className="text-muted-foreground">Manage job postings and track hiring progress</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Requisition</DialogTitle>
              <DialogDescription>Fill in the details for the new job posting</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Senior Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                    placeholder="e.g. Engineering"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Employment Type</Label>
                  <Select value={newJob.type} onValueChange={(value) => setNewJob({ ...newJob, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newJob.priority}
                    onValueChange={(value) => setNewJob({ ...newJob, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Min Salary</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={newJob.salaryMin}
                    onChange={(e) => setNewJob({ ...newJob, salaryMin: e.target.value })}
                    placeholder="80000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Max Salary</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={newJob.salaryMax}
                    onChange={(e) => setNewJob({ ...newJob, salaryMax: e.target.value })}
                    placeholder="120000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  placeholder="5+ years experience&#10;React/Node.js&#10;AWS knowledge"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea
                  id="benefits"
                  value={newJob.benefits}
                  onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                  placeholder="Health Insurance&#10;401k&#10;Remote Work"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="closingDate">Closing Date</Label>
                  <Input
                    id="closingDate"
                    type="date"
                    value={newJob.closingDate}
                    onChange={(e) => setNewJob({ ...newJob, closingDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hiringManager">Hiring Manager</Label>
                  <Input
                    id="hiringManager"
                    value={newJob.hiringManager}
                    onChange={(e) => setNewJob({ ...newJob, hiringManager: e.target.value })}
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiter">Recruiter</Label>
                <Input
                  id="recruiter"
                  value={newJob.recruiter}
                  onChange={(e) => setNewJob({ ...newJob, recruiter: e.target.value })}
                  placeholder="e.g. Mike Chen"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob}>Create Job</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs by title, department, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {job.department}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Badge className={getStatusColor(job.status)} variant="secondary">
                    {job.status}
                  </Badge>
                  <Badge className={getPriorityColor(job.priority)} variant="secondary">
                    {job.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />${job.salaryMin.toLocaleString()} - $
                  {job.salaryMax.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">{job.applicants}</p>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">{job.interviews}</p>
                  <p className="text-xs text-muted-foreground">Interviews</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-purple-600">{job.offers}</p>
                  <p className="text-xs text-muted-foreground">Offers</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedJob(job)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Select onValueChange={(value) => handleStatusChange(job.id, value)}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Briefcase className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-600">No Jobs Found</h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || statusFilter !== "all" || departmentFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Create your first job requisition to get started."}
              </p>
            </div>
            {!searchTerm && statusFilter === "all" && departmentFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Job
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedJob.title}
                <Badge className={getStatusColor(selectedJob.status)} variant="secondary">
                  {selectedJob.status}
                </Badge>
                <Badge className={getPriorityColor(selectedJob.priority)} variant="secondary">
                  {selectedJob.priority}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedJob.department} • {selectedJob.location}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="mt-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Salary Range</span>
                      </div>
                      <p className="text-lg font-semibold">
                        ${selectedJob.salaryMin.toLocaleString()} - ${selectedJob.salaryMax.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Posted Date</span>
                      </div>
                      <p className="text-lg font-semibold">{new Date(selectedJob.postedDate).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-muted-foreground">{selectedJob.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Hiring Manager</h4>
                    <p className="text-muted-foreground">{selectedJob.hiringManager}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Recruiter</h4>
                    <p className="text-muted-foreground">{selectedJob.recruiter}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="text-muted-foreground">
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="text-muted-foreground">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="candidates" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">{selectedJob.applicants}</p>
                      <p className="text-sm text-muted-foreground">Total Applicants</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">{selectedJob.interviews}</p>
                      <p className="text-sm text-muted-foreground">Interviews</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-2xl font-bold">{selectedJob.offers}</p>
                      <p className="text-sm text-muted-foreground">Offers Made</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Conversion Rate</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {selectedJob.applicants > 0
                          ? Math.round((selectedJob.interviews / selectedJob.applicants) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-muted-foreground">Application to Interview</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">Days Open</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {Math.floor(
                          (new Date().getTime() - new Date(selectedJob.postedDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Since posting</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
