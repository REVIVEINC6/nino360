import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload } from "lucide-react"
import { getAttendance } from "./actions"

export const dynamic = "force-dynamic"

export default async function AttendancePage() {
  const result = await getAttendance({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">Track employee attendance and work hours</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Failed to load attendance data: {result.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const records = result.data || []
  const presentCount = records.filter((r) => r.status === "present").length
  const onLeaveCount = records.filter((r) => r.status === "leave").length
  const lateCount = records.filter((r) => r.status === "late").length
  const totalEmployees = records.length || 1
  const attendanceRate = ((presentCount / totalEmployees) * 100).toFixed(1)
  const avgHours =
    records.length > 0
      ? (records.reduce((sum, r) => sum + (r.hours_worked || 0), 0) / records.length).toFixed(1)
      : "0.0"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track employee attendance and work hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
            <p className="text-xs text-muted-foreground">{attendanceRate}% attendance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onLeaveCount}</div>
            <p className="text-xs text-muted-foreground">
              {((onLeaveCount / totalEmployees) * 100).toFixed(1)}% of workforce
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateCount}</div>
            <p className="text-xs text-muted-foreground">After 9:30 AM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHours}</div>
            <p className="text-xs text-muted-foreground">Per employee today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Employee</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Hours</th>
                    <th className="text-left py-3 px-4 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 10).map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {record.employee?.first_name} {record.employee?.last_name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "leave"
                                ? "bg-blue-100 text-blue-800"
                                : record.status === "late"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{record.hours_worked || 0}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{record.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No attendance records for today</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
