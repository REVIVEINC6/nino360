"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  TrendingUp,
  Shield,
  Users,
  Calendar,
} from "lucide-react"
import {
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

const statusData = [
  { name: "Complete", value: 218, color: "#10b981" },
  { name: "Pending", value: 12, color: "#f59e0b" },
  { name: "Reverify", value: 5, color: "#ef4444" },
]

const monthlyData = [
  { month: "Jan", completed: 18, pending: 3 },
  { month: "Feb", completed: 22, pending: 2 },
  { month: "Mar", completed: 19, pending: 4 },
  { month: "Apr", completed: 25, pending: 1 },
  { month: "May", completed: 21, pending: 2 },
  { month: "Jun", completed: 23, pending: 3 },
]

const records = [
  {
    id: "1",
    employee: "John Doe",
    empCode: "EMP001",
    status: "complete",
    date: "2024-01-15",
    section1: "2024-01-15",
    section2: "2024-01-17",
    section3: null,
    reverifyDate: null,
    eVerify: "confirmed",
  },
  {
    id: "2",
    employee: "Jane Smith",
    empCode: "EMP002",
    status: "pending",
    date: "2025-01-10",
    section1: "2025-01-10",
    section2: null,
    section3: null,
    reverifyDate: null,
    eVerify: "pending",
  },
  {
    id: "3",
    employee: "Bob Wilson",
    empCode: "EMP003",
    status: "reverify_required",
    date: "2023-06-20",
    section1: "2023-06-20",
    section2: "2023-06-22",
    section3: null,
    reverifyDate: "2025-06-20",
    eVerify: "confirmed",
  },
]

export function I9ComplianceContent() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              I-9 Compliance
            </h1>
            <p className="text-gray-600 mt-1">Manage I-9 forms and employment verification</p>
          </div>
          <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New I-9 Form
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Complete Forms</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                218
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                12
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                  Awaiting completion
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Reverify Required</CardTitle>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-linear-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                5
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                  Action needed
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                97.8%
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Excellent
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-linear-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">5 Forms Need Reverification</p>
                  <p className="text-sm text-gray-600 mt-1">Documents expiring within 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">E-Verify Integration Active</p>
                  <p className="text-sm text-gray-600 mt-1">100% of new hires verified automatically</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Audit-Ready Documentation</p>
                  <p className="text-sm text-gray-600 mt-1">All forms blockchain-verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="records" className="space-y-4">
          <TabsList className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg">
            <TabsTrigger
              value="records"
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              I-9 Records
            </TabsTrigger>
            <TabsTrigger
              value="reverify"
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reverification
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>I-9 Records</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{record.employee}</p>
                          <p className="text-sm text-gray-600">{record.empCode}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Section 1: {record.section1}
                            </Badge>
                            {record.section2 && (
                              <Badge variant="outline" className="text-xs">
                                Section 2: {record.section2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge
                            className={`${
                              record.status === "complete"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : record.status === "pending"
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {record.status.replace("_", " ")}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">E-Verify: {record.eVerify}</p>
                          {record.reverifyDate && (
                            <p className="text-xs text-red-600 mt-1">Reverify by: {record.reverifyDate}</p>
                          )}
                        </div>
                        {record.status === "reverify_required" && <AlertCircle className="h-5 w-5 text-red-600" />}
                        <Button size="sm" variant="outline" className="bg-white/50 backdrop-blur-sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reverify" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Reverification Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records
                    .filter((r) => r.status === "reverify_required")
                    .map((record) => (
                      <div
                        key={record.id}
                        className="p-4 bg-red-50/50 backdrop-blur-sm border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{record.employee}</p>
                            <p className="text-sm text-gray-600">{record.empCode}</p>
                            <p className="text-sm text-red-600 mt-1">Reverify by: {record.reverifyDate}</p>
                          </div>
                          <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Start Reverification
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle>Completion Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(p: any) => `${p.name} ${((Number(p.percent) || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle>Monthly Completion Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
