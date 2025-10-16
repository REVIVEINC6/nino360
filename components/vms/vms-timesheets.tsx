"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VMSTimesheetsProps {
  view: "timesheets" | "approvals" | "disputes" | "tracking"
}

export function VMSTimesheets({ view }: VMSTimesheetsProps) {
  if (view === "timesheets") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Timesheets</CardTitle>
          <CardDescription>Review and manage vendor contractor timesheets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Week Ending</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "Jane Smith",
                  vendor: "IT Solutions",
                  week: "2024-01-12",
                  hours: 40,
                  amount: "$3,600",
                  status: "pending",
                },
                {
                  name: "Mike Johnson",
                  vendor: "TechStaff Inc",
                  week: "2024-01-12",
                  hours: 38,
                  amount: "$3,230",
                  status: "approved",
                },
              ].map((timesheet, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{timesheet.name}</TableCell>
                  <TableCell>{timesheet.vendor}</TableCell>
                  <TableCell>{timesheet.week}</TableCell>
                  <TableCell>{timesheet.hours}</TableCell>
                  <TableCell>{timesheet.amount}</TableCell>
                  <TableCell>
                    <Badge variant={timesheet.status === "approved" ? "default" : "secondary"}>
                      {timesheet.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {timesheet.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm">
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (view === "approvals") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Timesheets awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                contractor: "Jane Smith",
                vendor: "IT Solutions",
                hours: 40,
                amount: "$3,600",
                submitted: "2024-01-13",
              },
              {
                contractor: "Bob Wilson",
                vendor: "TechStaff Inc",
                hours: 42,
                amount: "$3,570",
                submitted: "2024-01-13",
              },
            ].map((approval, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-semibold">{approval.contractor}</p>
                  <p className="text-sm text-muted-foreground">
                    {approval.vendor} • {approval.hours} hours • {approval.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">Submitted: {approval.submitted}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm">Approve</Button>
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (view === "disputes") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timesheet Disputes</CardTitle>
          <CardDescription>Manage disputed timesheets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">Hours Discrepancy</p>
                  <p className="text-sm text-muted-foreground">Jane Smith - IT Solutions</p>
                </div>
                <Badge variant="destructive">Open</Badge>
              </div>
              <p className="text-sm mb-3">Submitted 42 hours but client approved only 40 hours</p>
              <div className="flex items-center gap-2">
                <Button size="sm">Resolve</Button>
                <Button size="sm" variant="outline">
                  Contact Vendor
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>On-time Tracking</CardTitle>
        <CardDescription>Monitor vendor timesheet submission compliance</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>On-time Rate</TableHead>
              <TableHead>Late Submissions</TableHead>
              <TableHead>Avg Delay</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { vendor: "IT Solutions", onTime: 95, late: 2, delay: "0.5 days", trend: "improving" },
              { vendor: "TechStaff Inc", onTime: 88, late: 5, delay: "1.2 days", trend: "stable" },
            ].map((tracking, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{tracking.vendor}</TableCell>
                <TableCell>{tracking.onTime}%</TableCell>
                <TableCell>{tracking.late}</TableCell>
                <TableCell>{tracking.delay}</TableCell>
                <TableCell>
                  <Badge variant={tracking.trend === "improving" ? "default" : "secondary"}>{tracking.trend}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
