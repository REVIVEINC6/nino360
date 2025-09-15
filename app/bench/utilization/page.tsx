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
import { useToast } from "@/hooks/use-toast"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Clock,
  DollarSign,
  Search,
  Download,
  Target,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
} from "lucide-react"

interface UtilizationData {
  resourceId: string
  resourceName: string
  avatar?: string
  department: string
  role: string
  currentUtilization: number
  targetUtilization: number
  utilizationTrend: number[]
  billableHours: number
  totalHours: number
  revenue: number
  efficiency: number
  projects: {
    name: string
    allocation: number
    startDate: string
    endDate: string
  }[]
  benchDays: number
  status: "optimal" | "underutilized" | "overutilized" | "on-bench"
}

interface UtilizationMetrics {
  overallUtilization: number
  targetUtilization: number
  billableRevenue: number
  benchCost: number
  efficiency: number
  utilizationTrend: number
}

const mockUtilizationData: UtilizationData[] = [
  {
    resourceId: "1",
    resourceName: "Sarah Johnson",
    department: "Engineering",
    role: "Senior Developer",
    currentUtilization: 95,
    targetUtilization: 85,
    utilizationTrend: [78, 82, 85, 88, 92, 95, 95],
    billableHours: 152,
    totalHours: 160,
    revenue: 18240,
    efficiency: 92,
    projects: [
      { name: "E-commerce Platform", allocation: 60, startDate: "2024-01-01", endDate: "2024-03-31" },
      { name: "API Development", allocation: 35, startDate: "2024-01-15", endDate: "2024-02-28" },
    ],
    benchDays: 0,
    status: "overutilized",
  },
  {
    resourceId: "2",
    resourceName: "Michael Chen",
    department: "Design",
    role: "UX Designer",
    currentUtilization: 88,
    targetUtilization: 85,
    utilizationTrend: [85, 87, 86, 88, 89, 88, 88],
    billableHours: 140,
    totalHours: 160,
    revenue: 13300,
    efficiency: 95,
    projects: [{ name: "Digital Transformation", allocation: 88, startDate: "2024-01-15", endDate: "2024-04-15" }],
    benchDays: 0,
    status: "optimal",
  },
  {
    resourceId: "3",
    resourceName: "Emily Rodriguez",
    department: "Data Science",
    role: "Data Analyst",
    currentUtilization: 0,
    targetUtilization: 80,
    utilizationTrend: [75, 78, 80, 65, 45, 20, 0],
    billableHours: 0,
    totalHours: 160,
    revenue: 0,
    efficiency: 0,
    projects: [],
    benchDays: 12,
    status: "on-bench",
  },
  {
    resourceId: "4",
    resourceName: "David Kim",
    department: "Engineering",
    role: "DevOps Engineer",
    currentUtilization: 65,
    targetUtilization: 85,
    utilizationTrend: [82, 78, 75, 70, 68, 65, 65],
    billableHours: 104,
    totalHours: 160,
    revenue: 13520,
    efficiency: 78,
    projects: [{ name: "Infrastructure Setup", allocation: 65, startDate: "2024-01-10", endDate: "2024-03-10" }],
    benchDays: 0,
    status: "underutilized",
  },
]

const mockMetrics: UtilizationMetrics = {
  overallUtilization: 62,
  targetUtilization: 85,
  billableRevenue: 45060,
  benchCost: 9600,
  efficiency: 78,
  utilizationTrend: 5,
}

export default function UtilizationAnalyticsPage() {
  const [utilizationData, setUtilizationData] = useState<UtilizationData[]>(mockUtilizationData)
  const [metrics, setMetrics] = useState<UtilizationMetrics>(mockMetrics)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("30d")
  const { toast } = useToast()

  const filteredData = utilizationData.filter((resource) => {
    const matchesSearch =
      resource.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || resource.department === departmentFilter
    const matchesStatus = statusFilter === "all" || resource.status === statusFilter
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800"
      case "underutilized":
        return "bg-yellow-100 text-yellow-800"
      case "overutilized":
        return "bg-red-100 text-red-800"
      case "on-bench":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "underutilized":
        return <TrendingDown className="h-4 w-4 text-yellow-600" />
      case "overutilized":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "on-bench":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Utilization analytics data export has been initiated.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilization Analytics</h1>
          <p className="text-muted-foreground">Monitor and optimize resource utilization across projects</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overallUtilization}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(metrics.utilizationTrend)}
              <span>{Math.abs(metrics.utilizationTrend)}% from last month</span>
            </div>
            <Progress value={metrics.overallUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target vs Actual</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.targetUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {metrics.targetUtilization}% | Gap: {metrics.targetUtilization - metrics.overallUtilization}%
            </p>
            <Progress value={(metrics.overallUtilization / metrics.targetUtilization) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.billableRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bench Cost</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.benchCost / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Non-billable overhead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.efficiency}%</div>
            <Progress value={metrics.efficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="optimal">Optimal</SelectItem>
            <SelectItem value="underutilized">Underutilized</SelectItem>
            <SelectItem value="overutilized">Overutilized</SelectItem>
            <SelectItem value="on-bench">On Bench</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map((resource) => (
              <motion.div
                key={resource.resourceId}
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
                            {resource.resourceName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{resource.resourceName}</h3>
                          <p className="text-muted-foreground">
                            {resource.role} • {resource.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(resource.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(resource.status)}
                            {resource.status}
                          </div>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Utilization</p>
                        <p className="font-medium text-lg">{resource.currentUtilization}%</p>
                        <Progress value={resource.currentUtilization} className="mt-1" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Target vs Actual</p>
                        <p className="font-medium">{resource.targetUtilization}% target</p>
                        <p className="text-sm text-muted-foreground">
                          Gap: {resource.targetUtilization - resource.currentUtilization}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Billable Hours</p>
                        <p className="font-medium">
                          {resource.billableHours}/{resource.totalHours}
                        </p>
                        <p className="text-sm text-muted-foreground">Revenue: ${resource.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Efficiency</p>
                        <p className="font-medium">{resource.efficiency}%</p>
                        {resource.benchDays > 0 && (
                          <p className="text-sm text-orange-600">{resource.benchDays} days on bench</p>
                        )}
                      </div>
                    </div>

                    {resource.projects.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Current Projects</p>
                        <div className="space-y-2">
                          {resource.projects.map((project, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <p className="font-medium text-sm">{project.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {project.startDate} - {project.endDate}
                                </p>
                              </div>
                              <Badge variant="outline">{project.allocation}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilization Trend (7 weeks)</span>
                        <span>{resource.utilizationTrend[resource.utilizationTrend.length - 1]}% current</span>
                      </div>
                      <div className="flex gap-1">
                        {resource.utilizationTrend.map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-gray-200 rounded-sm overflow-hidden"
                            style={{ height: "20px" }}
                          >
                            <div
                              className={`h-full transition-all duration-300 ${
                                value >= resource.targetUtilization
                                  ? value > resource.targetUtilization + 10
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                  : value > 0
                                    ? "bg-yellow-500"
                                    : "bg-gray-400"
                              }`}
                              style={{ width: `${Math.max(value, 5)}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilization Trends</CardTitle>
                <CardDescription>Historical utilization patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Utilization trend chart would be displayed here</p>
                    <p className="text-sm">Showing utilization over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
                <CardDescription>Revenue correlation with utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4" />
                    <p>Revenue impact chart would be displayed here</p>
                    <p className="text-sm">Showing revenue vs utilization correlation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Utilization</CardTitle>
                <CardDescription>Utilization breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Engineering", "Design", "Data Science", "Marketing"].map((dept) => {
                    const deptResources = utilizationData.filter((r) => r.department === dept)
                    const avgUtilization =
                      deptResources.length > 0
                        ? Math.round(
                            deptResources.reduce((sum, r) => sum + r.currentUtilization, 0) / deptResources.length,
                          )
                        : 0

                    return (
                      <div key={dept} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{dept}</span>
                          <span className="text-sm text-muted-foreground">
                            {avgUtilization}% avg • {deptResources.length} resources
                          </span>
                        </div>
                        <Progress value={avgUtilization} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Efficiency and revenue by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Engineering", "Design", "Data Science", "Marketing"].map((dept) => {
                    const deptResources = utilizationData.filter((r) => r.department === dept)
                    const totalRevenue = deptResources.reduce((sum, r) => sum + r.revenue, 0)
                    const avgEfficiency =
                      deptResources.length > 0
                        ? Math.round(deptResources.reduce((sum, r) => sum + r.efficiency, 0) / deptResources.length)
                        : 0

                    return (
                      <div key={dept} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{dept}</span>
                          <span className="text-sm font-medium">${(totalRevenue / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Efficiency: {avgEfficiency}%</span>
                          <span>{deptResources.length} resources</span>
                        </div>
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
                  AI Utilization Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Overutilization Alert</p>
                      <p className="text-sm text-red-700">
                        Sarah Johnson is at 95% utilization, 10% above target. Risk of burnout detected.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Underutilization Opportunity</p>
                      <p className="text-sm text-yellow-700">
                        David Kim at 65% utilization. Potential for additional 20% allocation worth $2,600/month.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Optimization Suggestion</p>
                      <p className="text-sm text-blue-700">
                        Reallocating Emily Rodriguez from bench could increase overall utilization by 12%.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilization Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Optimal Range (80-90%)</span>
                    <span className="text-sm font-medium">25% of resources</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue Efficiency</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Capacity Utilization</span>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                  <Progress value={62} />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Key Insight:</strong> Optimal utilization range (80-90%) correlates with 35% higher client
                    satisfaction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
