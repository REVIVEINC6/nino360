"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  UserPlus,
  UserMinus,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Ticket,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
} from "lucide-react"
import { getHRMSDashboardKPIs } from "@/app/(dashboard)/hrms/dashboard/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export function HRMSDashboardContent() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const result = await getHRMSDashboardKPIs()
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || "Failed to load dashboard")
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error || !data) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">HRMS Dashboard</h1>
          <p className="text-muted-foreground">Human Resource Management System overview</p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Failed to Load Dashboard</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>{error}</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Go to Main Dashboard</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const { stats, recentJoiners, departmentDistribution } = data

  // Mock data for charts
  const headcountTrend = [
    { month: "Jan", count: 245 },
    { month: "Feb", count: 252 },
    { month: "Mar", count: 258 },
    { month: "Apr", count: 265 },
    { month: "May", count: 271 },
    { month: "Jun", count: stats.totalEmployees },
  ]

  const turnoverData = [
    { month: "Jan", joiners: 12, leavers: 5 },
    { month: "Feb", joiners: 8, leavers: 3 },
    { month: "Mar", joiners: 15, leavers: 7 },
    { month: "Apr", joiners: 10, leavers: 4 },
    { month: "May", joiners: 14, leavers: 6 },
    { month: "Jun", joiners: stats.joinersThisMonth, leavers: stats.leaversThisMonth },
  ]

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-white/20 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HRMS Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Human Resource Management System overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Brain className="h-3 w-3" />
              AI Insights Active
            </Badge>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joiners (30d)</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.joinersThisMonth}</div>
            <p className="text-xs text-muted-foreground">New hires this month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leavers (30d)</CardTitle>
            <UserMinus className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leaversThisMonth}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              -12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onLeaveToday}</div>
            <p className="text-xs text-muted-foreground">Employees on leave</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Timesheets</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTimesheets}</div>
            <p className="text-xs text-muted-foreground">Awaiting submission</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Docs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringDocs}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">Help desk requests</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <FileText className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <Progress value={stats.avgAttendance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <p className="text-sm font-medium">Retention Risk</p>
              </div>
              <p className="text-xs text-muted-foreground">
                3 employees identified as high flight risk. Consider engagement initiatives.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-sm font-medium">Hiring Forecast</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Predicted need for 12 additional hires in Q3 based on growth trends.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <p className="text-sm font-medium">Skills Gap</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Cloud architecture skills gap detected. Recommend training programs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="headcount" className="space-y-4">
        <TabsList className="glass-card border-white/20">
          <TabsTrigger value="headcount">Headcount Trend</TabsTrigger>
          <TabsTrigger value="turnover">Turnover Analysis</TabsTrigger>
          <TabsTrigger value="departments">Department Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="headcount" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Headcount Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={headcountTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Employees" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turnover" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Joiners vs Leavers (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={turnoverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="joiners" fill="#10b981" name="Joiners" />
                  <Bar dataKey="leavers" fill="#ef4444" name="Leavers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.dept}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {departmentDistribution.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Recent Joiners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJoiners.map((emp: any) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {emp.first_name} {emp.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{emp.department || "Unassigned"}</p>
                  </div>
                  <Badge variant="outline">{emp.hire_date ? new Date(emp.hire_date).toLocaleDateString() : "-"}</Badge>
                </div>
              ))}
              {recentJoiners.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent joiners</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/hrms/employees">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Employees
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/hrms/attendance">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Attendance
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/hrms/timesheets">
                  <Clock className="h-4 w-4 mr-2" />
                  Review Timesheets
                </Link>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" asChild>
                <Link href="/hrms/helpdesk">
                  <Ticket className="h-4 w-4 mr-2" />
                  Help Desk
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
