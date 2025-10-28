"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Download,
  Search,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Briefcase,
  BarChart3,
} from "lucide-react"
import { getAssignments } from "@/app/(dashboard)/hrms/assignments/actions"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

export function AssignmentsManagementContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setLoading(true)
    const result = await getAssignments({ page: 1, pageSize: 100 })
    if (result.success && result.data) {
      setAssignments(result.data)
    }
    setLoading(false)
  }

  // Calculate KPIs
  const activeAssignments = assignments.filter((a) => a.status === "active").length
  const totalRevenue = assignments
    .filter((a) => a.billable && a.status === "active")
    .reduce((sum, a) => sum + (a.rate?.value || 0), 0)
  const avgUtilization =
    assignments.length > 0
      ? assignments.reduce((sum, a) => sum + (a.allocation_percent || 0), 0) / assignments.length
      : 0
  const billableRate =
    assignments.length > 0 ? (assignments.filter((a) => a.billable).length / assignments.length) * 100 : 0

  // Chart data
  const utilizationData = [
    { month: "Jan", utilization: 85 },
    { month: "Feb", utilization: 88 },
    { month: "Mar", utilization: 82 },
    { month: "Apr", utilization: 90 },
    { month: "May", utilization: 87 },
    { month: "Jun", utilization: 92 },
  ]

  const assignmentsByType = [
    { name: "Hourly", value: assignments.filter((a) => a.rate_type === "hourly").length },
    { name: "Daily", value: assignments.filter((a) => a.rate_type === "daily").length },
    { name: "Monthly", value: assignments.filter((a) => a.rate_type === "monthly").length },
    { name: "Fixed", value: assignments.filter((a) => a.rate_type === "fixed").length },
  ]

  const revenueData = [
    { month: "Jan", revenue: 125000 },
    { month: "Feb", revenue: 132000 },
    { month: "Mar", revenue: 128000 },
    { month: "Apr", revenue: 145000 },
    { month: "May", revenue: 138000 },
    { month: "Jun", revenue: 152000 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assignments
            </h1>
            <p className="text-gray-600 mt-1">Manage employee project and client assignments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{activeAssignments}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">${(totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{avgUtilization.toFixed(0)}%</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +5% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Billable Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{billableRate.toFixed(0)}%</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">AI-Powered Insights</h3>
                <div className="space-y-2 text-sm text-white/90">
                  <p>• 3 employees are under-utilized (below 70%) - consider new assignments</p>
                  <p>• 5 assignments ending next month - start planning replacements</p>
                  <p>• Billable utilization increased by 8% - on track to meet Q2 targets</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 shadow-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Assignments
            </TabsTrigger>
            <TabsTrigger
              value="utilization"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Utilization
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Utilization Trend */}
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={utilizationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="utilization"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ fill: "#8b5cf6", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Assignments by Type */}
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignments by Rate Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assignmentsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assignmentsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Revenue Trend */}
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg lg:col-span-2">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search assignments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading assignments...</div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No assignments found. Create your first assignment to get started.
                    </div>
                  ) : (
                    assignments.map((assignment) => (
                      <Card
                        key={assignment.id}
                        className="bg-gradient-to-r from-white to-gray-50 border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{assignment.role_title}</h4>
                                <Badge
                                  variant={assignment.status === "active" ? "default" : "secondary"}
                                  className="capitalize"
                                >
                                  {assignment.status}
                                </Badge>
                                {assignment.billable && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Billable
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {assignment.employee?.first_name} {assignment.employee?.last_name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(assignment.start_date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {assignment.allocation_percent}% Allocation
                                </span>
                                {assignment.rate && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />${assignment.rate.value}/{assignment.rate_type}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="utilization" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Utilization</h3>
                <div className="text-center py-12 text-gray-500">Utilization details coming soon...</div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
                <div className="text-center py-12 text-gray-500">Advanced analytics coming soon...</div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
