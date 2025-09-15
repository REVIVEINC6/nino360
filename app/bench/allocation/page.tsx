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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import {
  Target,
  CalendarIcon,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Download,
  Brain,
  Zap,
} from "lucide-react"

interface Allocation {
  id: string
  resourceId: string
  resourceName: string
  resourceAvatar?: string
  projectName: string
  clientName: string
  startDate: string
  endDate: string
  allocation: number
  status: "active" | "pending" | "completed" | "cancelled"
  revenue: number
  role: string
  department: string
  skills: string[]
  hourlyRate: number
  totalHours: number
  progress: number
  priority: "high" | "medium" | "low"
  manager: string
}

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
    department: "Design",
    skills: ["Figma", "Adobe XD", "User Research"],
    hourlyRate: 95,
    totalHours: 480,
    progress: 65,
    priority: "high",
    manager: "Sarah Wilson",
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
    department: "Engineering",
    skills: ["React", "Node.js", "AWS"],
    hourlyRate: 120,
    totalHours: 320,
    progress: 0,
    priority: "high",
    manager: "John Smith",
  },
  {
    id: "3",
    resourceId: "3",
    resourceName: "Emily Rodriguez",
    projectName: "Analytics Dashboard",
    clientName: "DataCorp",
    startDate: "2024-01-20",
    endDate: "2024-03-20",
    allocation: 60,
    status: "completed",
    revenue: 18000,
    role: "Data Analyst",
    department: "Data Science",
    skills: ["Python", "SQL", "Tableau"],
    hourlyRate: 75,
    totalHours: 240,
    progress: 100,
    priority: "medium",
    manager: "Lisa Chen",
  },
  {
    id: "4",
    resourceId: "4",
    resourceName: "David Kim",
    projectName: "Infrastructure Setup",
    clientName: "StartupXYZ",
    startDate: "2024-03-01",
    endDate: "2024-04-30",
    allocation: 100,
    status: "active",
    revenue: 52000,
    role: "DevOps Engineer",
    department: "Engineering",
    skills: ["Kubernetes", "Docker", "AWS"],
    hourlyRate: 130,
    totalHours: 400,
    progress: 35,
    priority: "high",
    manager: "John Smith",
  },
]

export default function ResourceAllocationPage() {
  const [allocations, setAllocations] = useState<Allocation[]>(mockAllocations)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedAllocation, setSelectedAllocation] = useState<Allocation | null>(null)
  const [isCreateAllocationOpen, setIsCreateAllocationOpen] = useState(false)
  const [isEditAllocationOpen, setIsEditAllocationOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { toast } = useToast()

  const filteredAllocations = allocations.filter((allocation) => {
    const matchesSearch =
      allocation.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || allocation.status === statusFilter
    const matchesPriority = priorityFilter === "all" || allocation.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const handleCreateAllocation = () => {
    toast({
      title: "Allocation Created",
      description: "New resource allocation has been created successfully.",
    })
    setIsCreateAllocationOpen(false)
  }

  const handleEditAllocation = () => {
    toast({
      title: "Allocation Updated",
      description: "Resource allocation has been updated successfully.",
    })
    setIsEditAllocationOpen(false)
  }

  const handleDeleteAllocation = (id: string) => {
    setAllocations(allocations.filter((a) => a.id !== id))
    toast({
      title: "Allocation Removed",
      description: "Resource allocation has been removed.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Allocation data export has been initiated.",
    })
  }

  const totalRevenue = allocations.reduce((sum, a) => sum + a.revenue, 0)
  const activeAllocations = allocations.filter((a) => a.status === "active").length
  const avgUtilization = Math.round(allocations.reduce((sum, a) => sum + a.allocation, 0) / allocations.length)
  const completionRate = Math.round(
    (allocations.filter((a) => a.status === "completed").length / allocations.length) * 100,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Allocation</h1>
          <p className="text-muted-foreground">Manage resource assignments and project allocations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateAllocationOpen} onOpenChange={setIsCreateAllocationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Allocation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Allocation</DialogTitle>
                <DialogDescription>Allocate a resource to a project</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resource">Resource</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="michael">Michael Chen</SelectItem>
                      <SelectItem value="emily">Emily Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project Name</Label>
                  <Input id="project" placeholder="Enter project name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input id="client" placeholder="Enter client name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Project Role</Label>
                  <Input id="role" placeholder="Enter project role" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allocation">Allocation %</Label>
                  <Input id="allocation" type="number" placeholder="100" min="1" max="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Project Manager</Label>
                  <Input id="manager" placeholder="Enter manager name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input id="hourlyRate" type="number" placeholder="Enter rate" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea id="description" placeholder="Enter project description..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateAllocationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAllocation}>Create Allocation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Allocations</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAllocations}</div>
            <p className="text-xs text-muted-foreground">
              {allocations.filter((a) => a.status === "pending").length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUtilization}%</div>
            <Progress value={avgUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by resource, project, or client..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="allocations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allocations">Current Allocations</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredAllocations.map((allocation) => (
              <motion.div
                key={allocation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={allocation.resourceAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {allocation.resourceName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{allocation.resourceName}</h3>
                          <p className="text-muted-foreground">{allocation.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(allocation.status)}>{allocation.status}</Badge>
                        <Badge className={getPriorityColor(allocation.priority)}>{allocation.priority}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Project</p>
                        <p className="font-medium">{allocation.projectName}</p>
                        <p className="text-sm text-muted-foreground">{allocation.clientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">
                          {allocation.startDate} - {allocation.endDate}
                        </p>
                        <p className="text-sm text-muted-foreground">{allocation.totalHours} hours</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allocation</p>
                        <p className="font-medium">{allocation.allocation}%</p>
                        <p className="text-sm text-muted-foreground">${allocation.hourlyRate}/hr</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-medium">${allocation.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Manager: {allocation.manager}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{allocation.progress}%</span>
                      </div>
                      <Progress value={allocation.progress} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(allocation.status)}
                        <span className="text-sm text-muted-foreground">
                          {allocation.status === "active"
                            ? "In Progress"
                            : allocation.status === "pending"
                              ? "Awaiting Start"
                              : allocation.status === "completed"
                                ? "Completed"
                                : "Cancelled"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedAllocation(allocation)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAllocation(allocation)
                            setIsEditAllocationOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteAllocation(allocation.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAllocations.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No allocations found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allocation Calendar</CardTitle>
              <CardDescription>Timeline view of resource allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Calendar view would be displayed here</p>
                  <p className="text-sm">Showing allocation timeline and conflicts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Revenue trend chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilization by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Engineering", "Design", "Data Science", "Marketing"].map((dept) => {
                    const deptAllocations = allocations.filter((a) => a.department === dept)
                    const avgUtilization =
                      deptAllocations.length > 0
                        ? Math.round(deptAllocations.reduce((sum, a) => sum + a.allocation, 0) / deptAllocations.length)
                        : 0

                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{dept}</span>
                          <span className="text-sm text-muted-foreground">{avgUtilization}% avg utilization</span>
                        </div>
                        <Progress value={avgUtilization} />
                      </div>
                    )
                  })}
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
                        Consider reallocating Sarah Johnson from 80% to 100% on Cloud Migration project to meet
                        deadline.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Resource Conflict</p>
                      <p className="text-sm text-yellow-700">
                        Michael Chen has overlapping allocations in March. Review schedule conflicts.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Revenue Opportunity</p>
                      <p className="text-sm text-green-700">
                        High-performing resources are underutilized. Potential for 15% revenue increase.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Allocation Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Allocation Efficiency</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">On-time Delivery</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Client Satisfaction</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Key Insight:</strong> Projects with 80-100% allocation have 23% higher success rates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Allocation Detail Dialog */}
      {selectedAllocation && (
        <Dialog open={!!selectedAllocation} onOpenChange={() => setSelectedAllocation(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedAllocation.resourceAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedAllocation.resourceName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {selectedAllocation.resourceName} - {selectedAllocation.projectName}
              </DialogTitle>
              <DialogDescription>
                {selectedAllocation.role} • {selectedAllocation.clientName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project:</span>
                      <span>{selectedAllocation.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Client:</span>
                      <span>{selectedAllocation.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manager:</span>
                      <span>{selectedAllocation.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>
                        {selectedAllocation.startDate} - {selectedAllocation.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAllocation.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Allocation Details</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Allocation</span>
                        <span>{selectedAllocation.allocation}%</span>
                      </div>
                      <Progress value={selectedAllocation.allocation} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{selectedAllocation.progress}%</span>
                      </div>
                      <Progress value={selectedAllocation.progress} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">${selectedAllocation.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Hours</p>
                    <p className="font-medium">{selectedAllocation.totalHours}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-medium">${selectedAllocation.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Priority</p>
                    <Badge className={getPriorityColor(selectedAllocation.priority)}>
                      {selectedAllocation.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Allocation Dialog */}
      {selectedAllocation && (
        <Dialog open={isEditAllocationOpen} onOpenChange={setIsEditAllocationOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Allocation</DialogTitle>
              <DialogDescription>Update allocation details</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editProject">Project Name</Label>
                <Input id="editProject" defaultValue={selectedAllocation.projectName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClient">Client Name</Label>
                <Input id="editClient" defaultValue={selectedAllocation.clientName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Project Role</Label>
                <Input id="editRole" defaultValue={selectedAllocation.role} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editManager">Project Manager</Label>
                <Input id="editManager" defaultValue={selectedAllocation.manager} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAllocation">Allocation %</Label>
                <Input id="editAllocation" type="number" defaultValue={selectedAllocation.allocation} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPriority">Priority</Label>
                <Select defaultValue={selectedAllocation.priority}>
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
                <Label htmlFor="editStatus">Status</Label>
                <Select defaultValue={selectedAllocation.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProgress">Progress %</Label>
                <Input id="editProgress" type="number" defaultValue={selectedAllocation.progress} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditAllocationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditAllocation}>Update Allocation</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
