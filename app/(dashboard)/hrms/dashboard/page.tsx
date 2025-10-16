import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, UserMinus, Calendar, Clock, FileText, AlertTriangle, Ticket } from "lucide-react"
import { getHRMSDashboardKPIs } from "./actions"
import { redirect } from "next/navigation"

export default async function HRMSDashboardPage() {
  const result = await getHRMSDashboardKPIs()

  if (!result.success) {
    console.error("[v0] Failed to load HRMS dashboard:", result.error)
    redirect("/dashboard")
  }

  const { stats, recentJoiners, departmentDistribution } = result.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HRMS Dashboard</h1>
        <p className="text-muted-foreground">Human Resource Management System overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active headcount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joiners (30d)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.joinersThisMonth}</div>
            <p className="text-xs text-muted-foreground">New hires this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leavers (30d)</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leaversThisMonth}</div>
            <p className="text-xs text-muted-foreground">Terminations this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onLeaveToday}</div>
            <p className="text-xs text-muted-foreground">Employees on leave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Timesheets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTimesheets}</div>
            <p className="text-xs text-muted-foreground">Awaiting submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Docs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringDocs}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground">Help desk requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Joiners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJoiners.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {emp.first_name} {emp.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{emp.department || "Unassigned"}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {emp.hire_date ? new Date(emp.hire_date).toLocaleDateString() : "-"}
                  </p>
                </div>
              ))}
              {recentJoiners.length === 0 && <p className="text-sm text-muted-foreground">No recent joiners</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentDistribution.map((dept) => (
                <div key={dept.dept} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{dept.dept}</p>
                    <p className="text-sm text-muted-foreground">
                      {dept.count} ({dept.percentage}%)
                    </p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${dept.percentage}%` }} />
                  </div>
                </div>
              ))}
              {departmentDistribution.length === 0 && (
                <p className="text-sm text-muted-foreground">No department data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
