"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProjectResourcesManagementProps {
  view: "allocation" | "bench" | "utilization" | "forecast"
}

export function ProjectResourcesManagement({ view }: ProjectResourcesManagementProps) {
  if (view === "allocation") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription>Current resource assignments across projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "John Smith",
                  project: "Cloud Migration",
                  role: "Senior DevOps",
                  allocation: "100%",
                  start: "2024-01-01",
                  end: "2024-06-30",
                },
                {
                  name: "Sarah Johnson",
                  project: "Mobile App",
                  role: "React Native Dev",
                  allocation: "80%",
                  start: "2024-01-15",
                  end: "2024-05-15",
                },
              ].map((resource, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.project}</TableCell>
                  <TableCell>{resource.role}</TableCell>
                  <TableCell>
                    <Badge>{resource.allocation}</Badge>
                  </TableCell>
                  <TableCell>{resource.start}</TableCell>
                  <TableCell>{resource.end}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (view === "bench") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bench Integration</CardTitle>
          <CardDescription>Available resources from bench for project allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Bench Days</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "Mike Chen",
                  skills: "AWS, Kubernetes, Terraform",
                  availability: "Immediate",
                  benchDays: 15,
                },
                {
                  name: "Emily Davis",
                  skills: "React Native, TypeScript",
                  availability: "2 weeks",
                  benchDays: 8,
                },
              ].map((resource, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.skills}</TableCell>
                  <TableCell>{resource.availability}</TableCell>
                  <TableCell>{resource.benchDays} days</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Allocate
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

  if (view === "utilization") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
          <CardDescription>Current utilization rates across all resources</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Current Project</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Billable Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "John Smith",
                  project: "Cloud Migration",
                  utilization: 100,
                  hours: 160,
                  status: "fully-allocated",
                },
                {
                  name: "Sarah Johnson",
                  project: "Mobile App",
                  utilization: 80,
                  hours: 128,
                  status: "partially-available",
                },
                {
                  name: "Mike Chen",
                  project: "None",
                  utilization: 0,
                  hours: 0,
                  status: "available",
                },
              ].map((resource, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.project}</TableCell>
                  <TableCell>{resource.utilization}%</TableCell>
                  <TableCell>{resource.hours}h</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        resource.status === "fully-allocated"
                          ? "default"
                          : resource.status === "available"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {resource.status}
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
        <CardTitle>Resource Forecast</CardTitle>
        <CardDescription>Projected resource needs for upcoming projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Required Resources</TableHead>
              <TableHead>Available Resources</TableHead>
              <TableHead>Gap</TableHead>
              <TableHead>Action Needed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { month: "Feb 2024", required: 15, available: 12, gap: -3, action: "Hire or allocate from bench" },
              { month: "Mar 2024", required: 18, available: 15, gap: -3, action: "Hire or allocate from bench" },
              { month: "Apr 2024", required: 12, available: 15, gap: 3, action: "Excess capacity" },
            ].map((forecast, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{forecast.month}</TableCell>
                <TableCell>{forecast.required}</TableCell>
                <TableCell>{forecast.available}</TableCell>
                <TableCell>
                  <span className={forecast.gap < 0 ? "text-destructive" : "text-green-600"}>
                    {forecast.gap > 0 ? "+" : ""}
                    {forecast.gap}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{forecast.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
