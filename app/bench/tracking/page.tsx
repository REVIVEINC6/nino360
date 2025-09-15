"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import { DialogContent } from "@/components/ui/dialog"

import { Dialog } from "@/components/ui/dialog"

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
import { useToast } from "@/hooks/use-toast"
import {
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Search,
  Download,
  Bell,
  Eye,
  Brain,
  Zap,
  Target,
  DollarSign,
} from "lucide-react"

interface ResourceStatus {
  id: string
  name: string
  avatar?: string
  department: string
  role: string
  status: "available" | "allocated" | "on-leave" | "training"
  benchDays: number
  lastActivity: string
  nextAvailable: string
  utilizationRate: number
  performance: number
  currentProject?: string
  benchHistory: BenchPeriod[]
  alerts: Alert[]
  skills: string[]
  hourlyRate: number
}

interface BenchPeriod {
  startDate: string
  endDate?: string
  duration: number
  reason: string
  status: "active" | "completed"
}

interface Alert {
  id: string
  type: "warning" | "info" | "critical"
  message: string
  timestamp: string
  acknowledged: boolean
}

interface TrackingMetrics {
  totalBenchDays: number
  averageBenchTime: number
  benchCost: number
  utilizationTrend: number
  alertsCount: number
  availableResources: number
}

const mockResourceStatuses: ResourceStatus[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    department: "Engineering",
    role: "Senior Developer",
    status: "available",
    benchDays: 15,
    lastActivity: "2024-01-20",
    nextAvailable: "Immediate",
    utilizationRate: 85,
    performance: 92,
    benchHistory: [
      { startDate: "2024-01-05", endDate: "2024-01-20", duration: 15, reason: "Between projects", status: "active" },
      { startDate: "2023-11-10", endDate: "2023-11-25", duration: 15, reason: "Client delay", status: "completed" },
    ],
    alerts: [
      { id: "1", type: "warning", message: "On bench for 15 days", timestamp: "2024-01-20", acknowledged: false },
    ],
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    hourlyRate: 120,
  },
  {
    id: "2",
    name: "Michael Chen",
    department: "Design",
    role: "UX Designer",
    status: "allocated",
    benchDays: 0,
    lastActivity: "2024-01-15",
    nextAvailable: "2024-04-15",
    utilizationRate: 95,
    performance: 88,
    currentProject: "Digital Transformation",
    benchHistory: [
      {
        startDate: "2023-12-01",
        endDate: "2023-12-10",
        duration: 9,
        reason: "Project completion",
        status: "completed",
      },
    ],
    alerts: [],
    skills: ["Figma", "Adobe XD", "User Research"],
    hourlyRate: 95,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    department: "Data Science",
    role: "Data Analyst",
    status: "available",
    benchDays: 8,
    lastActivity: "2024-01-12",
    nextAvailable: "Immediate",
    utilizationRate: 78,
    performance: 85,
    benchHistory: [{ startDate: "2024-01-12", duration: 8, reason: "Project ended early", status: "active" }],
    alerts: [
      { id: "2", type: "info", message: "Available for new projects", timestamp: "2024-01-12", acknowledged: true },
    ],
    skills: ["Python", "SQL", "Tableau"],
    hourlyRate: 75,
  },
  {
    id: "4",
    name: "David Kim",
    department: "Engineering",
    role: "DevOps Engineer",
    status: "training",
    benchDays: 5,
    lastActivity: "2024-01-15",
    nextAvailable: "2024-01-25",
    utilizationRate: 90,
    performance: 94,
    benchHistory: [{ startDate: "2024-01-15", duration: 5, reason: "Skills training", status: "active" }],
    alerts: [
      {
        id: "3",
        type: "info",
        message: "Completing Kubernetes certification",
        timestamp: "2024-01-15",
        acknowledged: true,
      },
    ],
    skills: ["Kubernetes", "Docker", "Jenkins"],
    hourlyRate: 130,
  },
  {
    id: "5",
    name: "Lisa Wang",
    department: "Marketing",
    role: "Digital Marketing Specialist",
    status: "on-leave",
    benchDays: 0,
    lastActivity: "2024-01-01",
    nextAvailable: "2024-02-01",
    utilizationRate: 82,
    performance: 87,
    benchHistory: [],
    alerts: [{ id: "4", type: "info", message: "On maternity leave", timestamp: "2024-01-01", acknowledged: true }],
    skills: ["SEO", "Google Ads", "Analytics"],
    hourlyRate: 85,
  },
]

const mockMetrics: TrackingMetrics = {
  totalBenchDays: 28,
  averageBenchTime: 12,
  benchCost: 45600,
  utilizationTrend: -3,
  alertsCount: 3,
  availableResources: 2,
}

export default function ResourceTrackingPage() {
  const [resources, setResources] = useState<ResourceStatus[]>(mockResourceStatuses)
  const [metrics, setMetrics] = useState<TrackingMetrics>(mockMetrics)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [selectedResource, setSelectedResource] = useState<ResourceStatus | null>(null)
  const [timeRange, setTimeRange] = useState<string>("30d")
  const { toast } = useToast()

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const handleAcknowledgeAlert = (resourceId: string, alertId: string) => {
    setResources(
      resources.map((resource) =>
        resource.id === resourceId
          ? {
              ...resource,
              alerts: resource.alerts.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)),
            }
          : resource,
      ),
    )
    toast({
      title: "Alert Acknowledged",
      description: "Alert has been marked as acknowledged.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Resource tracking data export has been initiated.",
    })
  }

  const getBenchTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-red-600" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-green-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Tracking</h1>
          <p className="text-muted-foreground">Monitor resource availability and bench status in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bench Days</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalBenchDays}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getBenchTrendIcon(metrics.utilizationTrend)}
              <span>{Math.abs(metrics.utilizationTrend)}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bench Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageBenchTime} days</div>
            <p className="text-xs text-muted-foreground">Target: 10 days or less</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bench Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.benchCost / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Monthly bench overhead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.alertsCount}</div>
            <p className="text-xs text-muted-foreground">{metrics.availableResources} resources available</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
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
                          <h3 className="font-semibold text-lg">{resource.name}</h3>
                          <p className="text-muted-foreground">
                            {resource.role} • {resource.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(resource.status)}>{resource.status}</Badge>
                        {resource.alerts.filter((a) => !a.acknowledged).length > 0 && (
                          <Badge variant="destructive">
                            {resource.alerts.filter((a) => !a.acknowledged).length} alerts
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Bench Status</p>
                        <p className="font-medium">
                          {resource.status === "available"
                            ? `${resource.benchDays} days`
                            : resource.status === "allocated"
                              ? resource.currentProject || "Allocated"
                              : resource.status === "training"
                                ? "In Training"
                                : "On Leave"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {resource.status === "available"
                            ? "On bench"
                            : resource.status === "allocated"
                              ? `Until ${resource.nextAvailable}`
                              : `Available ${resource.nextAvailable}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Activity</p>
                        <p className="font-medium">{resource.lastActivity}</p>
                        <p className="text-sm text-muted-foreground">Last project end</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Utilization Rate</p>
                        <p className="font-medium">{resource.utilizationRate}%</p>
                        <Progress value={resource.utilizationRate} className="mt-1" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <p className="font-medium">{resource.performance}%</p>
                        <p className="text-sm text-muted-foreground">${resource.hourlyRate}/hr</p>
                      </div>
                    </div>

                    {resource.alerts.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Active Alerts</p>
                        <div className="space-y-2">
                          {resource.alerts.slice(0, 2).map((alert) => (
                            <div
                              key={alert.id}
                              className={`flex items-center justify-between p-2 rounded-lg border ${
                                alert.acknowledged ? "opacity-60" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {getAlertIcon(alert.type)}
                                <span className="text-sm">{alert.message}</span>
                                <Badge className={getAlertColor(alert.type)} variant="secondary">
                                  {alert.type}
                                </Badge>
                              </div>
                              {!alert.acknowledged && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAcknowledgeAlert(resource.id, alert.id)}
                                >
                                  Acknowledge
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Skills:</span>
                        <div className="flex gap-1">
                          {resource.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {resource.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{resource.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setSelectedResource(resource)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Timeline</CardTitle>
              <CardDescription>Historical view of resource bench periods and allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resources.map((resource) => (
                  <div key={resource.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resource.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {resource.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-sm text-muted-foreground">{resource.role}</p>
                      </div>
                    </div>
                    <div className="ml-11 space-y-2">
                      {resource.benchHistory.map((period, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{period.reason}</p>
                            <p className="text-xs text-muted-foreground">
                              {period.startDate} - {period.endDate || "Present"} ({period.duration} days)
                            </p>
                          </div>
                          <Badge
                            className={
                              period.status === "active"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {period.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>All alerts and notifications for resource tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources
                  .flatMap((resource) =>
                    resource.alerts.map((alert) => ({
                      ...alert,
                      resourceName: resource.name,
                      resourceId: resource.id,
                    })),
                  )
                  .map((alert) => (
                    <div
                      key={`${alert.resourceId}-${alert.id}`}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        alert.acknowledged ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <p className="font-medium">{alert.resourceName}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getAlertColor(alert.type)}>{alert.type}</Badge>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.resourceId, alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
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
                <CardTitle>Bench Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Bench trend chart would be displayed here</p>
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
                    const deptResources = resources.filter((r) => r.department === dept)
                    const avgUtilization =
                      deptResources.length > 0
                        ? Math.round(
                            deptResources.reduce((sum, r) => sum + r.utilizationRate, 0) / deptResources.length,
                          )
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
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">High Bench Alert</p>
                      <p className="text-sm text-red-700">
                        Sarah Johnson has been on bench for 15 days. Consider immediate allocation to reduce costs.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Optimization Opportunity</p>
                      <p className="text-sm text-blue-700">
                        Pattern detected: Resources with React skills have 40% shorter bench times.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Utilization Target</p>
                      <p className="text-sm text-green-700">
                        Current utilization is 87%. Target of 90% is achievable with better allocation planning.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bench Efficiency</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Alert Response Time</span>
                    <span className="text-sm font-medium">2.3 hours</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Average time to acknowledge alerts</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Prediction Accuracy</span>
                    <span className="text-sm font-medium">91%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">AI prediction accuracy for bench duration</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Key Insight:</strong> Resources with diverse skill sets have 35% shorter bench periods.
                  </p>
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
                {selectedResource.role} • {selectedResource.department}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedResource.status)}>{selectedResource.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bench Days:</span>
                      <span>{selectedResource.benchDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Available:</span>
                      <span>{selectedResource.nextAvailable}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Activity:</span>
                      <span>{selectedResource.lastActivity}</span>
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
                  <h4 className="font-medium mb-2">Bench History</h4>
                  <div className="space-y-2">
                    {selectedResource.benchHistory.map((period, index) => (
                      <div key={index} className="p-2 bg-muted rounded">
                        <p className="text-sm font-medium">{period.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {period.startDate} - {period.endDate || "Present"} ({period.duration} days)
                        </p>
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
                        <span>Utilization Rate</span>
                        <span>{selectedResource.utilizationRate}%</span>
                      </div>
                      <Progress value={selectedResource.utilizationRate} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance Score</span>
                        <span>{selectedResource.performance}%</span>
                      </div>
                      <Progress value={selectedResource.performance} />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Active Alerts</h4>
                  <div className="space-y-2">
                    {selectedResource.alerts.length > 0 ? (
                      selectedResource.alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <div>
                              <p className="text-sm">{alert.message}</p>
                              <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                            </div>
                          </div>
                          <Badge className={getAlertColor(alert.type)}>{alert.type}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No active alerts</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">${selectedResource.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedResource.department}</p>
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
