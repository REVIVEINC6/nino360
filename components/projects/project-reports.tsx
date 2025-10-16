"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProjectReportsProps {
  view: "status" | "burn" | "milestones" | "custom"
}

export function ProjectReports({ view }: ProjectReportsProps) {
  if (view === "status") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Status Reports</CardTitle>
          <CardDescription>AI-generated weekly project status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                project: "Cloud Migration",
                week: "Week of Jan 8, 2024",
                status: "On track",
                highlights: "Completed infrastructure setup, started data migration",
              },
              {
                project: "Mobile App",
                week: "Week of Jan 8, 2024",
                status: "Behind schedule",
                highlights: "UI redesign in progress, API integration delayed",
              },
            ].map((report, idx) => (
              <div key={idx} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{report.project}</h4>
                    <p className="text-sm text-muted-foreground">{report.week}</p>
                  </div>
                  <Badge variant={report.status === "On track" ? "default" : "secondary"}>{report.status}</Badge>
                </div>
                <p className="text-sm mb-3">{report.highlights}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View Full Report
                  </Button>
                  <Button size="sm" variant="outline">
                    AI Draft Next Week
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (view === "burn") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Burn Reports</CardTitle>
          <CardDescription>Budget burn tracking and forecasts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Burn Rate</TableHead>
                <TableHead>Forecast</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  project: "Cloud Migration",
                  budget: "$500,000",
                  spent: "$250,000",
                  remaining: "$250,000",
                  burnRate: "$50k/month",
                  forecast: "On budget",
                },
                {
                  project: "Mobile App",
                  budget: "$300,000",
                  spent: "$200,000",
                  remaining: "$100,000",
                  burnRate: "$60k/month",
                  forecast: "Over budget",
                },
              ].map((burn, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{burn.project}</TableCell>
                  <TableCell>{burn.budget}</TableCell>
                  <TableCell>{burn.spent}</TableCell>
                  <TableCell>{burn.remaining}</TableCell>
                  <TableCell>{burn.burnRate}</TableCell>
                  <TableCell>
                    <Badge variant={burn.forecast === "On budget" ? "default" : "destructive"}>{burn.forecast}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (view === "milestones") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Milestone Tracking</CardTitle>
          <CardDescription>Project milestone progress and completion</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  project: "Cloud Migration",
                  milestone: "Infrastructure Setup",
                  dueDate: "2024-01-31",
                  progress: 100,
                  status: "completed",
                },
                {
                  project: "Cloud Migration",
                  milestone: "Data Migration",
                  dueDate: "2024-03-31",
                  progress: 45,
                  status: "in-progress",
                },
                {
                  project: "Mobile App",
                  milestone: "UI Redesign",
                  dueDate: "2024-02-15",
                  progress: 60,
                  status: "at-risk",
                },
              ].map((milestone, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{milestone.project}</TableCell>
                  <TableCell>{milestone.milestone}</TableCell>
                  <TableCell>{milestone.dueDate}</TableCell>
                  <TableCell>{milestone.progress}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "default"
                          : milestone.status === "at-risk"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {milestone.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Reports</CardTitle>
        <CardDescription>Create and manage custom project reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button>Create New Report</Button>
          <div className="space-y-2">
            {[
              { name: "Executive Summary", lastRun: "2024-01-10" },
              { name: "Resource Utilization", lastRun: "2024-01-09" },
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">Last run: {report.lastRun}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    Run
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
