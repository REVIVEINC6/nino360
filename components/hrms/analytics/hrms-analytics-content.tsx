"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  TrendingDown,
  Clock,
  DollarSign,
  Download,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Award,
  Briefcase,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const headcountData = [
  { month: "Jan", active: 210, joiners: 15, leavers: 8 },
  { month: "Feb", active: 217, joiners: 12, leavers: 5 },
  { month: "Mar", active: 224, joiners: 18, leavers: 11 },
  { month: "Apr", active: 231, joiners: 14, leavers: 7 },
  { month: "May", active: 238, joiners: 16, leavers: 9 },
  { month: "Jun", active: 245, joiners: 13, leavers: 6 },
]

const attritionData = [
  { reason: "Better Opportunity", count: 12, percentage: 35 },
  { reason: "Relocation", count: 8, percentage: 24 },
  { reason: "Compensation", count: 6, percentage: 18 },
  { reason: "Work-Life Balance", count: 5, percentage: 15 },
  { reason: "Other", count: 3, percentage: 8 },
]

const departmentData = [
  { name: "Engineering", value: 89, color: "#3b82f6" },
  { name: "Sales", value: 45, color: "#8b5cf6" },
  { name: "Marketing", value: 23, color: "#ec4899" },
  { name: "Operations", value: 34, color: "#10b981" },
  { name: "HR", value: 12, color: "#f59e0b" },
]

const performanceData = [
  { quarter: "Q1", avgScore: 3.8, topPerformers: 45 },
  { quarter: "Q2", avgScore: 4.0, topPerformers: 52 },
  { quarter: "Q3", avgScore: 4.1, topPerformers: 58 },
  { quarter: "Q4", avgScore: 4.2, topPerformers: 61 },
]

const diversityData = [
  { category: "Female", value: 42, color: "#ec4899" },
  { category: "Male", value: 56, color: "#3b82f6" },
  { category: "Non-binary", value: 2, color: "#8b5cf6" },
]

export function HRMSAnalyticsContent() {
  const [dateRange, setDateRange] = useState("last-6-months")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HRMS Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Comprehensive workforce insights and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="backdrop-blur-sm bg-white/50 border-white/20">
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange === "last-6-months" ? "Last 6 Months" : "Custom Range"}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Headcount</p>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">245</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
              <TrendingUp className="h-3 w-3 mr-1" />
              +16.7%
            </Badge>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Attrition Rate</p>
            <div className="p-2 rounded-lg bg-red-100">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">8.5%</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
              <TrendingDown className="h-3 w-3 mr-1" />
              -1.2%
            </Badge>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Avg Tenure</p>
            <div className="p-2 rounded-lg bg-purple-100">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">3.2 yrs</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 yrs
            </Badge>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </Card>

        <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Cost per Hire</p>
            <div className="p-2 rounded-lg bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">$4.2K</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
              <TrendingDown className="h-3 w-3 mr-1" />
              -$500
            </Badge>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-white/20 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Insights</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Strong Retention</p>
                  <p className="text-xs text-muted-foreground">Engineering team shows 95% retention rate</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hiring Velocity</p>
                  <p className="text-xs text-muted-foreground">Time-to-hire increased by 5 days</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Award className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Performance Trend</p>
                  <p className="text-xs text-muted-foreground">Average performance score up 10%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="workforce" className="space-y-6">
        <TabsList className="backdrop-blur-sm bg-white/50 border-white/20 p-1">
          <TabsTrigger value="workforce" className="data-[state=active]:bg-white">
            <Users className="h-4 w-4 mr-2" />
            Workforce
          </TabsTrigger>
          <TabsTrigger value="attrition" className="data-[state=active]:bg-white">
            <TrendingDown className="h-4 w-4 mr-2" />
            Attrition
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white">
            <Award className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="diversity" className="data-[state=active]:bg-white">
            <Briefcase className="h-4 w-4 mr-2" />
            Diversity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workforce" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Headcount Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={headcountData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} name="Active Employees" />
                  <Line type="monotone" dataKey="joiners" stroke="#10b981" strokeWidth={2} name="New Joiners" />
                  <Line type="monotone" dataKey="leavers" stroke="#ef4444" strokeWidth={2} name="Leavers" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attrition" className="space-y-6">
          <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Attrition by Reason</h3>
            <div className="space-y-4">
              {attritionData.map((item) => (
                <div
                  key={item.reason}
                  className="flex items-center justify-between p-4 rounded-lg backdrop-blur-sm bg-white/50 border border-white/20"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.reason}</p>
                    <p className="text-sm text-muted-foreground">{item.count} employees</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" fill="#3b82f6" name="Avg Performance Score" />
                <Bar dataKey="topPerformers" fill="#8b5cf6" name="Top Performers" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diversityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, value }) => `${category} ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diversityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-white/50 border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Leadership Diversity</h3>
              <div className="space-y-6 mt-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Women in Leadership</span>
                    <span className="text-sm font-bold text-gray-900">38%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: "38%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Underrepresented Groups</span>
                    <span className="text-sm font-bold text-gray-900">25%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: "25%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Diverse Hiring Rate</span>
                    <span className="text-sm font-bold text-gray-900">45%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
