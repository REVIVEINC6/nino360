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
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  BarChart3,
  Grid3X3,
  List,
  Download,
  Upload,
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
  experience: number
  projects: number
  rating: number
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
    experience: 5,
    projects: 12,
    rating: 4.8,
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
    experience: 3,
    projects: 8,
    rating: 4.6,
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
    experience: 1,
    projects: 3,
    rating: 4.4,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    department: "Engineering",
    role: "DevOps Engineer",
    level: "Senior",
    skills: ["Kubernetes", "Docker", "Jenkins", "Terraform", "AWS"],
    certifications: ["AWS DevOps Professional", "Kubernetes Administrator"],
    status: "training",
    benchDays: 5,
    utilizationRate: 90,
    hourlyRate: 130,
    joinDate: "2020-11-08",
    lastProject: "Infrastructure Modernization",
    performance: 94,
    availability: "1 week",
    experience: 6,
    projects: 15,
    rating: 4.9,
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    phone: "+1 (555) 567-8901",
    location: "Boston, MA",
    department: "Marketing",
    role: "Digital Marketing Specialist",
    level: "Mid",
    skills: ["SEO", "Google Ads", "Analytics", "Content Strategy"],
    certifications: ["Google Ads Certified", "HubSpot Inbound Marketing"],
    status: "on-leave",
    benchDays: 0,
    utilizationRate: 82,
    hourlyRate: 85,
    joinDate: "2022-07-12",
    lastProject: "Brand Awareness Campaign",
    performance: 87,
    availability: "3 weeks",
    experience: 4,
    projects: 10,
    rating: 4.5,
  },
]

export default function ResourcePoolPage() {
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false)
  const [isEditResourceOpen, setIsEditResourceOpen] = useState(false)
  const { toast } = useToast()

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      resource.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || resource.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || resource.department === departmentFilter
    const matchesLevel = levelFilter === "all" || resource.level === levelFilter
    return matchesSearch && matchesStatus && matchesDepartment && matchesLevel
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Junior":
        return "bg-green-100 text-green-800"
      case "Mid":
        return "bg-blue-100 text-blue-800"
      case "Senior":
        return "bg-purple-100 text-purple-800"
      case "Lead":
        return "bg-orange-100 text-orange-800"
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

  const handleEditResource = () => {
    toast({
      title: "Resource Updated",
      description: "Resource information has been updated successfully.",
    })
    setIsEditResourceOpen(false)
  }

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id))
    toast({
      title: "Resource Removed",
      description: "Resource has been removed from the pool.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Resource data export has been initiated.",
    })
  }

  const handleImportData = () => {
    toast({
      title: "Import Started",
      description: "Resource data import has been initiated.",
    })
  }

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
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
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(resource.status)} variant="secondary">
                    {resource.status}
                  </Badge>
                  <Badge className={getLevelColor(resource.level)} variant="secondary">
                    {resource.level}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{resource.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">{resource.projects} projects</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-medium">{resource.department}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Experience</p>
              <p className="font-medium">{resource.experience} years</p>
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
            <p className="text-sm text-muted-foreground mb-2">Top Skills</p>
            <div className="flex flex-wrap gap-1">
              {resource.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {resource.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
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

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Performance</span>
              <span>{resource.performance}%</span>
            </div>
            <Progress value={resource.performance} />
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedResource(resource)
                setIsEditResourceOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDeleteResource(resource.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const ResourceListItem = ({ resource }: { resource: Resource }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={resource.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {resource.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{resource.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {resource.role} • {resource.department}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <Badge className={getStatusColor(resource.status)} variant="secondary">
                  {resource.status}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{resource.benchDays} days</p>
                <p className="text-xs text-muted-foreground">Bench</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{resource.utilizationRate}%</p>
                <p className="text-xs text-muted-foreground">Utilization</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">${resource.hourlyRate}/hr</p>
                <p className="text-xs text-muted-foreground">Rate</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{resource.rating}</span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setSelectedResource(resource)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedResource(resource)
                    setIsEditResourceOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteResource(resource.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Resource Pool</h1>
          <p className="text-muted-foreground">Manage your talent pool and resource capabilities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportData}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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
                <DialogDescription>Add a new resource to the talent pool</DialogDescription>
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter location" />
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">
              {resources.filter((r) => r.status === "available").length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(resources.reduce((sum, r) => sum + r.utilizationRate, 0) / resources.length)}%
            </div>
            <Progress
              value={Math.round(resources.reduce((sum, r) => sum + r.utilizationRate, 0) / resources.length)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(resources.reduce((sum, r) => sum + r.performance, 0) / resources.length)}%
            </div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bench Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(resources.reduce((sum, r) => sum + r.benchDays, 0) / resources.length)} days
            </div>
            <p className="text-xs text-muted-foreground">-3 days from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources by name, role, or skills..."
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
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Junior">Junior</SelectItem>
            <SelectItem value="Mid">Mid</SelectItem>
            <SelectItem value="Senior">Senior</SelectItem>
            <SelectItem value="Lead">Lead</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button size="sm" variant={viewMode === "grid" ? "default" : "ghost"} onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant={viewMode === "list" ? "default" : "ghost"} onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resources Display */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <ResourceListItem key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Matrix</CardTitle>
              <CardDescription>Overview of skills across the resource pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["React", "Node.js", "Python", "AWS", "Docker", "Figma", "SQL"].map((skill) => {
                  const resourcesWithSkill = resources.filter((r) => r.skills.includes(skill))
                  const percentage = (resourcesWithSkill.length / resources.length) * 100

                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill}</span>
                        <span className="text-sm text-muted-foreground">
                          {resourcesWithSkill.length} resources ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Engineering", "Design", "Data Science", "Marketing"].map((dept) => {
                    const deptResources = resources.filter((r) => r.department === dept)
                    const percentage = (deptResources.length / resources.length) * 100

                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{dept}</span>
                          <span className="text-sm text-muted-foreground">{deptResources.length} resources</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Experience Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Junior", "Mid", "Senior", "Lead"].map((level) => {
                    const levelResources = resources.filter((r) => r.level === level)
                    const percentage = (levelResources.length / resources.length) * 100

                    return (
                      <div key={level} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{level}</span>
                          <span className="text-sm text-muted-foreground">{levelResources.length} resources</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
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
                <Badge className={getStatusColor(selectedResource.status)}>{selectedResource.status}</Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedResource.role} • {selectedResource.department} • {selectedResource.level} Level
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
                  <h4 className="font-medium mb-2">Skills & Expertise</h4>
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
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{selectedResource.rating} Rating</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Join Date</p>
                    <p className="font-medium">{selectedResource.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{selectedResource.experience} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projects Completed</p>
                    <p className="font-medium">{selectedResource.projects}</p>
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
                  <div>
                    <p className="text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">${selectedResource.hourlyRate}/hr</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Resource Dialog */}
      {selectedResource && (
        <Dialog open={isEditResourceOpen} onOpenChange={setIsEditResourceOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
              <DialogDescription>Update resource information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input id="editName" defaultValue={selectedResource.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input id="editEmail" type="email" defaultValue={selectedResource.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input id="editPhone" defaultValue={selectedResource.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLocation">Location</Label>
                <Input id="editLocation" defaultValue={selectedResource.location} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <Select defaultValue={selectedResource.department.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="editRole">Role</Label>
                <Input id="editRole" defaultValue={selectedResource.role} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLevel">Level</Label>
                <Select defaultValue={selectedResource.level.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="editHourlyRate">Hourly Rate ($)</Label>
                <Input id="editHourlyRate" type="number" defaultValue={selectedResource.hourlyRate} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="editSkills">Skills (comma-separated)</Label>
                <Input id="editSkills" defaultValue={selectedResource.skills.join(", ")} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="editCertifications">Certifications</Label>
                <Textarea id="editCertifications" defaultValue={selectedResource.certifications.join("\n")} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditResourceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditResource}>Update Resource</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
