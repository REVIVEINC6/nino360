"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface BenchForecastingManagementProps {
  view: "demand" | "rolloff" | "pipeline" | "scenarios"
}

export function BenchForecastingManagement({ view }: BenchForecastingManagementProps) {
  if (view === "demand") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incoming Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32 roles</div>
              <p className="text-xs text-muted-foreground">Next 3 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Roll-offs</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18 resources</div>
              <p className="text-xs text-muted-foreground">Next 3 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Bench Impact</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+14</div>
              <p className="text-xs text-muted-foreground">Projected increase</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demand Forecast by Month</CardTitle>
            <CardDescription>Projected resource needs for upcoming months</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>New Projects</TableHead>
                  <TableHead>Roles Needed</TableHead>
                  <TableHead>Available Resources</TableHead>
                  <TableHead>Gap</TableHead>
                  <TableHead>Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { month: "Feb 2024", projects: 5, roles: 12, available: 8, gap: -4, confidence: "high" },
                  { month: "Mar 2024", projects: 4, roles: 10, available: 12, gap: 2, confidence: "high" },
                  { month: "Apr 2024", projects: 6, roles: 15, available: 10, gap: -5, confidence: "medium" },
                ].map((forecast) => (
                  <TableRow key={forecast.month}>
                    <TableCell className="font-medium">{forecast.month}</TableCell>
                    <TableCell>{forecast.projects}</TableCell>
                    <TableCell>{forecast.roles}</TableCell>
                    <TableCell>{forecast.available}</TableCell>
                    <TableCell>
                      <span className={forecast.gap < 0 ? "text-destructive" : "text-green-600"}>
                        {forecast.gap > 0 ? "+" : ""}
                        {forecast.gap}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={forecast.confidence === "high" ? "default" : "secondary"}>
                        {forecast.confidence}
                      </Badge>
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

  if (view === "rolloff") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roll-off Predictions</CardTitle>
          <CardDescription>Resources expected to complete assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Current Project</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Expected End Date</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Next Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "Alice Brown",
                  project: "E-commerce Platform",
                  role: "Frontend Dev",
                  endDate: "2024-02-15",
                  confidence: 90,
                },
                {
                  name: "Bob Wilson",
                  project: "API Gateway",
                  role: "Backend Dev",
                  endDate: "2024-02-28",
                  confidence: 85,
                },
                {
                  name: "Carol Martinez",
                  project: "Analytics Dashboard",
                  role: "Full Stack",
                  endDate: "2024-03-10",
                  confidence: 75,
                },
              ].map((resource) => (
                <TableRow key={resource.name}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.project}</TableCell>
                  <TableCell>{resource.role}</TableCell>
                  <TableCell>{resource.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={resource.confidence >= 85 ? "default" : "secondary"}>{resource.confidence}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Plan Redeployment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (view === "pipeline") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Pipeline</CardTitle>
          <CardDescription>Upcoming projects and resource requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "AI Integration", stage: "Planning", roles: 5, start: "Q2 2024", probability: 80 },
              { name: "Mobile Redesign", stage: "Proposal", roles: 3, start: "Q2 2024", probability: 60 },
              { name: "Security Audit", stage: "Discovery", roles: 2, start: "Q3 2024", probability: 40 },
            ].map((project, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {project.roles} roles needed • Starts {project.start}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{project.stage}</Badge>
                  <Badge>{project.probability}% probability</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Planning</CardTitle>
        <CardDescription>Model different demand scenarios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { name: "Best Case", bench: 5, utilization: 95, hiring: 0 },
            { name: "Expected", bench: 12, utilization: 85, hiring: 3 },
            { name: "Worst Case", bench: 25, utilization: 70, hiring: 8 },
          ].map((scenario, idx) => (
            <div key={idx} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{scenario.name}</h4>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Avg Bench Size</p>
                  <p className="font-semibold">{scenario.bench} resources</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Utilization</p>
                  <p className="font-semibold">{scenario.utilization}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">New Hires Needed</p>
                  <p className="font-semibold">{scenario.hiring}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
