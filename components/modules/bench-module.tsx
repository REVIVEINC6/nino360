"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Activity,
  Users,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  Plus,
  Search,
  Brain,
  Zap,
  BarChart3,
  DollarSign,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Eye,
} from "lucide-react"

interface Resource {
  id: string
  name: string
  email: string
  phone: string
  location: string
  department: string
  role: string
  level: string
  skills: string[]
  certifications: string[]
  status: "available" | "allocated" | "on-leave" | "training"
  benchDays: number
  utilizationRate: number
  hourlyRate: number
  avatar?: string
  joinDate: string
  lastProject: string
  performance: number
  availability: string
}

interface Allocation {
  id: string
  resourceId: string
  resourceName: string
  projectName: string
  clientName: string
  startDate: string
  endDate: string
  allocation: number
  status: "active" | "pending" | "completed" | "cancelled"
  revenue: number
  role: string
}

interface BenchMetrics {
  totalResources: number
  availableResources: number
  allocatedResources: number
  averageBenchTime: number
  utilizationRate: number
  totalRevenue: number
  costSavings: number
  efficiency: number
}

const mockResources: Resource[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    department: "Engineering",
    role: "Senior Developer",
    level: "Senior",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    certifications: ["AWS Solutions Architect", "Scrum Master"],
    status: "available",
    benchDays: 15,
    utilizationRate: 85,
    hourlyRate: 120,
    joinDate: "2022-03-15",
    lastProject: "E-commerce Platform",
    performance: 92,
    availability: "Immediate",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    department: "Design",
    role: "UX Designer",
    level: "Mid",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    certifications: ["Google UX Design", "Adobe Certified Expert"],
    status: "allocated",
    benchDays: 0,
    utilizationRate: 95,
    hourlyRate: 95,
    joinDate: "2021-08-20",
    lastProject: "Mobile Banking App",
    performance: 88,
    availability: "2 weeks",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    department: "Data Science",
    role: "Data Analyst",
    level: "Junior",
    skills: ["Python", "SQL", "Tableau", "Machine Learning"],
    certifications: ["Tableau Desktop Specialist"],
    status: "available",
    benchDays: 8,
    utilizationRate: 78,
    hourlyRate: 75,
    joinDate: "2023-01-10",
    lastProject: "Customer Analytics Dashboard",
    performance: 85,
    availability: "Immediate",
  },
]

const mockAllocations: Allocation[] = [
  {
    id: "1",
    resourceId: "2",
    resourceName: "Michael Chen",
    projectName: "Digital Transformation",
    clientName: "TechCorp Inc.",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    allocation: 100,
    status: "active",
    revenue: 45000,
    role: "Lead UX Designer",
  },
  {
    id: "2",
    resourceId: "1",
    resourceName: "Sarah Johnson",
    projectName: "Cloud Migration",
    clientName: "Enterprise Solutions",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    allocation: 80,
    status: "pending",
    revenue: 38400,
    role: "Senior Developer",
  },
]

const mockMetrics: BenchMetrics = {
  totalResources: 45,
  availableResources: 12,
  allocatedResources: 33,
  averageBenchTime: 18,
  utilizationRate: 87,
  totalRevenue: 2450000,
  costSavings: 125000,
  efficiency: 94,
}

export function BenchModule() {
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [allocations, setAllocations] = useState<Allocation[]>(mockAllocations)
  const [metrics, setMetrics] = useState<BenchMetrics>(mockMetrics)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false)
  const [isAllocateOpen, setIsAllocateOpen] = useState(false)
  const { toast } = useToast()

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || resource.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || resource.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "allocated":
        return "bg-blue-100 text-blue-800"
      case "on-leave":
        return "bg-yellow-100 text-yellow-800"
      case "training":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAllocationStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddResource = () => {
    toast({
      title: "Resource Added",
      description: "New resource has been added to the pool successfully.",
    })
    setIsAddResourceOpen(false)
  }

  const handleAllocateResource = () => {
    toast({
      title: "Resource Allocated",
      description: "Resource has been allocated to the project successfully.",
    })
    setIsAllocateOpen(false)
  }

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id))
    toast({
      title: "Resource Removed",
      description: "Resource has been removed from the pool.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bench Management</h1>
          <p className="text-muted-foreground">Manage your resource pool and allocations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>Add a new resource to the bench pool</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Enter role" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input id="hourlyRate" type="number" placeholder="Enter hourly rate" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input id="skills" placeholder="React, Node.js, TypeScript..." />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea id="certifications" placeholder="List certifications..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddResourceOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>Add Resource</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalResources}</div>
            <p className="text-xs text-muted-foreground">{metrics.availableResources} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.utilizationRate}%</div>
            <Progress value={metrics.utilizationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bench Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageBenchTime} days</div>
            <p className="text-xs text-muted-foreground">-2 days from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">+12% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Resource Pool</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources by name or skills..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="allocated">Allocated</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={resource.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {resource.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{resource.name}</CardTitle>
                          <CardDescription>{resource.role}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(resource.status)}>{resource.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-medium">{resource.department}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Level</p>
                        <p className="font-medium">{resource.level}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bench Days</p>
                        <p className="font-medium">{resource.benchDays}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rate</p>
                        <p className="font-medium">${resource.hourlyRate}/hr</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {resource.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resource.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilization</span>
                        <span>{resource.utilizationRate}%</span>
                      </div>
                      <Progress value={resource.utilizationRate} />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedResource(resource)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1" disabled={resource.status !== "available"}>
                            <Target className="h-4 w-4 mr-1" />
                            Allocate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Allocate Resource</DialogTitle>
                            <DialogDescription>Allocate {resource.name} to a project</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="project">Project Name</Label>
                              <Input id="project" placeholder="Enter project name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="client">Client Name</Label>
                              <Input id="client" placeholder="Enter client name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="date" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="date" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="allocation">Allocation %</Label>
                              <Input id="allocation" type="number" placeholder="100" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="projectRole">Project Role</Label>
                              <Input id="projectRole" placeholder="Enter project role" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAllocateOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAllocateResource}>Allocate</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteResource(resource.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Allocations</CardTitle>
              <CardDescription>Active and pending resource allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allocations.map((allocation) => (
                  <div key={allocation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {allocation.resourceName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{allocation.resourceName}</p>
                        <p className="text-sm text-muted-foreground">{allocation.role}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{allocation.projectName}</p>
                      <p className="text-sm text-muted-foreground">{allocation.clientName}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{allocation.allocation}%</p>
                      <p className="text-sm text-muted-foreground">Allocation</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${allocation.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                    <Badge className={getAllocationStatusColor(allocation.status)}>{allocation.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilization Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Utilization chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Revenue chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Optimize Allocation</p>
                      <p className="text-sm text-blue-700">
                        Sarah Johnson has been on bench for 15 days. Consider allocating to the upcoming Cloud Migration
                        project.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Skill Gap Analysis</p>
                      <p className="text-sm text-green-700">
                        High demand for React developers. Consider upskilling 3 available resources.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Utilization Alert</p>
                      <p className="text-sm text-yellow-700">
                        Design team utilization is at 95%. Consider hiring or reallocating resources.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bench Efficiency</span>
                    <span className="text-sm font-medium">{metrics.efficiency}%</span>
                  </div>
                  <Progress value={metrics.efficiency} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cost Savings</span>
                    <span className="text-sm font-medium">${metrics.costSavings.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Saved through optimized resource allocation</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Time to Allocation</span>
                    <span className="text-sm font-medium">12 days</span>
                  </div>
                  <p className="text-xs text-muted-foreground">3 days improvement from last quarter</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Resource Detail Dialog */}
      {selectedResource && (
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedResource.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedResource.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {selectedResource.name}
              </DialogTitle>
              <DialogDescription>
                {selectedResource.role} • {selectedResource.department}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedResource.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedResource.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {selectedResource.location}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Certifications</h4>
                  <div className="space-y-1">
                    {selectedResource.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance Score</span>
                        <span>{selectedResource.performance}%</span>
                      </div>
                      <Progress value={selectedResource.performance} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilization Rate</span>
                        <span>{selectedResource.utilizationRate}%</span>
                      </div>
                      <Progress value={selectedResource.utilizationRate} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Join Date</p>
                    <p className="font-medium">{selectedResource.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Project</p>
                    <p className="font-medium">{selectedResource.lastProject}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bench Days</p>
                    <p className="font-medium">{selectedResource.benchDays}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Availability</p>
                    <p className="font-medium">{selectedResource.availability}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
