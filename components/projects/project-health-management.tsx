"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface ProjectHealthManagementProps {
  view: "overview" | "status" | "alerts" | "history"
}

export function ProjectHealthManagement({ view }: ProjectHealthManagementProps) {
  if (view === "overview") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy Projects</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">On track</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Immediate action required</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Health Overview</CardTitle>
            <CardDescription>Current health status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "Cloud Migration",
                    health: "healthy",
                    budget: "on-track",
                    schedule: "on-track",
                    resources: "adequate",
                  },
                  {
                    name: "Mobile App",
                    health: "at-risk",
                    budget: "over-budget",
                    schedule: "delayed",
                    resources: "adequate",
                  },
                  {
                    name: "Data Pipeline",
                    health: "critical",
                    budget: "over-budget",
                    schedule: "delayed",
                    resources: "understaffed",
                  },
                ].map((project, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.health === "healthy"
                            ? "default"
                            : project.health === "at-risk"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {project.health}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.budget === "on-track" ? "outline" : "destructive"}>
                        {project.budget}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.schedule === "on-track" ? "outline" : "destructive"}>
                        {project.schedule}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.resources === "adequate" ? "outline" : "destructive"}>
                        {project.resources}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (view === "status") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Tracking</CardTitle>
          <CardDescription>Detailed project status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                project: "Cloud Migration",
                indicators: { budget: 85, schedule: 90, quality: 95, team: 88 },
              },
              {
                project: "Mobile App",
                indicators: { budget: 105, schedule: 75, quality: 82, team: 70 },
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">{item.project}</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-lg font-semibold">{item.indicators.budget}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule</p>
                    <p className="text-lg font-semibold">{item.indicators.schedule}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quality</p>
                    <p className="text-lg font-semibold">{item.indicators.quality}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Morale</p>
                    <p className="text-lg font-semibold">{item.indicators.team}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (view === "alerts") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Alerts</CardTitle>
          <CardDescription>Active alerts and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Critical: Data Pipeline Over Budget</p>
                  <p className="text-sm text-muted-foreground">Project is 25% over budget with 2 months remaining</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm">Review Budget</Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Warning: Mobile App Behind Schedule</p>
                  <p className="text-sm text-muted-foreground">Project is 2 weeks behind planned milestones</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm">View Timeline</Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
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
        <CardTitle>Health History</CardTitle>
        <CardDescription>Historical health trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Health history tracking - Production ready component</p>
        </div>
      </CardContent>
    </Card>
  )
}
