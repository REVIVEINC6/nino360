"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Upload,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Coffee,
  Home,
} from "lucide-react"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function AttendanceContent({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("overview")

  const data = initialData?.success
    ? initialData
    : { calendarDays: [], kpis: {}, exceptions: [], leaveBalances: [], leaveRequests: [], checkins: [] }

  // Mock data for charts
  const weeklyTrend = [
    { day: "Mon", present: 145, absent: 5, leave: 8, wfh: 12 },
    { day: "Tue", present: 148, absent: 3, leave: 7, wfh: 12 },
    { day: "Wed", present: 142, absent: 6, leave: 10, wfh: 12 },
    { day: "Thu", present: 150, absent: 2, leave: 6, wfh: 12 },
    { day: "Fri", present: 138, absent: 8, leave: 12, wfh: 12 },
  ]

  const departmentData = [
    { name: "Engineering", value: 45 },
    { name: "Sales", value: 30 },
    { name: "Marketing", value: 20 },
    { name: "HR", value: 15 },
    { name: "Finance", value: 10 },
  ]

  const kpis = data.kpis || { present: 0, absent: 0, leave: 0, wfh: 0, exceptions: 0 }
  const totalEmployees = kpis.present + kpis.absent + kpis.leave + kpis.wfh
  const attendanceRate = totalEmployees > 0 ? ((kpis.present / totalEmployees) * 100).toFixed(1) : "0.0"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="mt-2 text-muted-foreground">Track employee attendance, leaves, and work hours</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
              <Calendar className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{kpis.present}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {attendanceRate}% attendance rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle>
                <Coffee className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{kpis.leave}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalEmployees > 0 ? ((kpis.leave / totalEmployees) * 100).toFixed(1) : "0.0"}% of workforce
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Work From Home</CardTitle>
                <Home className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{kpis.wfh}</div>
              <p className="text-xs text-muted-foreground mt-1">Remote workers today</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{kpis.absent}</div>
              <p className="text-xs text-muted-foreground mt-1">Unplanned absences</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Exceptions</CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{kpis.exceptions}</div>
              <p className="text-xs text-muted-foreground mt-1">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-blue-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
            <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Weekly Trend */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Weekly Attendance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="present"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="wfh"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="leave"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="absent"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Department Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Check-ins */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.checkins?.slice(0, 5).map((checkin: any) => (
                    <div
                      key={checkin.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {checkin.hrms_employees?.first_name?.[0]}
                          {checkin.hrms_employees?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">
                            {checkin.hrms_employees?.first_name} {checkin.hrms_employees?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{checkin.hrms_employees?.employee_no}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={checkin.kind === "IN" ? "default" : "secondary"} className="mb-1">
                          {checkin.kind}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{new Date(checkin.ts).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Calendar view coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.leaveRequests?.slice(0, 10).map((request: any) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                    >
                      <div>
                        <p className="font-medium">
                          {request.hrms_employees?.first_name} {request.hrms_employees?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.leave_type} • {request.days} days
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.start_date} to {request.end_date}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exceptions">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Attendance Exceptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.exceptions?.length > 0 ? (
                  <div className="space-y-3">
                    {data.exceptions.map((exception: any, index: number) => (
                      <div key={index} className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                        <p className="font-medium text-orange-900">{exception.type}</p>
                        <p className="text-sm text-orange-700">{exception.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No exceptions found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Advanced analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
