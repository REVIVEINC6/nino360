"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Clock, Award, Plus, Filter, Download, Calendar, TrendingUp } from "lucide-react"

const hrmsStats = [
  {
    title: "Total Employees",
    value: "1,247",
    change: "+12",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Present Today",
    value: "1,156",
    change: "92.7%",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Avg. Hours/Week",
    value: "42.5",
    change: "+2.1",
    icon: Clock,
    color: "text-purple-600",
  },
  {
    title: "Performance Score",
    value: "8.4/10",
    change: "+0.3",
    icon: Award,
    color: "text-emerald-600",
  },
]

const recentActivities = [
  { employee: "John Doe", action: "Checked In", time: "9:00 AM", department: "Engineering" },
  { employee: "Jane Smith", action: "Leave Request", time: "8:45 AM", department: "Marketing" },
  { employee: "Mike Johnson", action: "Performance Review", time: "Yesterday", department: "Sales" },
  { employee: "Sarah Wilson", action: "Training Completed", time: "2 days ago", department: "HR" },
]

export default function HRMSPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HRMS Dashboard</h1>
          <p className="text-muted-foreground">Human Resource Management System overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hrmsStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.employee}</p>
                    <p className="text-sm text-muted-foreground">{activity.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: "Engineering", count: 245, attendance: "94%" },
                { dept: "Sales", count: 156, attendance: "91%" },
                { dept: "Marketing", count: 89, attendance: "96%" },
                { dept: "HR", count: 34, attendance: "98%" },
                { dept: "Finance", count: 67, attendance: "93%" },
              ].map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{dept.dept}</p>
                    <p className="text-xs text-muted-foreground">{dept.count} employees</p>
                  </div>
                  <Badge variant="outline">{dept.attendance}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Plus className="h-6 w-6" />
              Add Employee
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Calendar className="h-6 w-6" />
              Schedule Review
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Clock className="h-6 w-6" />
              Attendance Report
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Award className="h-6 w-6" />
              Performance Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
