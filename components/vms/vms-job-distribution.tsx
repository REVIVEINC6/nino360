"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VMSJobDistributionProps {
  view: "jobs" | "distribution" | "responses" | "templates"
}

export function VMSJobDistribution({ view }: VMSJobDistributionProps) {
  if (view === "jobs") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Jobs</CardTitle>
          <CardDescription>Jobs available for vendor distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Vendors</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  title: "Senior Java Developer",
                  client: "Acme Corp",
                  location: "Remote",
                  rate: "$85/hr",
                  vendors: 5,
                  submissions: 12,
                },
                {
                  title: "DevOps Engineer",
                  client: "TechStart",
                  location: "NYC",
                  rate: "$95/hr",
                  vendors: 3,
                  submissions: 8,
                },
              ].map((job, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.client}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.rate}</TableCell>
                  <TableCell>{job.vendors}</TableCell>
                  <TableCell>{job.submissions}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Distribute
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

  if (view === "distribution") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribution Management</CardTitle>
          <CardDescription>Track job distributions to vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { job: "Senior Java Developer", vendor: "TechStaff Inc", sent: "2024-01-15", status: "pending" },
              { job: "DevOps Engineer", vendor: "IT Solutions", sent: "2024-01-14", status: "responded" },
            ].map((dist, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-semibold">{dist.job}</p>
                  <p className="text-sm text-muted-foreground">
                    {dist.vendor} • Sent {dist.sent}
                  </p>
                </div>
                <Badge variant={dist.status === "responded" ? "default" : "secondary"}>{dist.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (view === "responses") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Responses</CardTitle>
          <CardDescription>Track vendor interest and response times</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  job: "Senior Java Developer",
                  vendor: "TechStaff Inc",
                  time: "2 hours",
                  interest: "high",
                  submissions: 3,
                },
                { job: "DevOps Engineer", vendor: "IT Solutions", time: "4 hours", interest: "medium", submissions: 2 },
              ].map((response, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{response.job}</TableCell>
                  <TableCell>{response.vendor}</TableCell>
                  <TableCell>{response.time}</TableCell>
                  <TableCell>
                    <Badge variant={response.interest === "high" ? "default" : "secondary"}>{response.interest}</Badge>
                  </TableCell>
                  <TableCell>{response.submissions}</TableCell>
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
        <CardTitle>Distribution Templates</CardTitle>
        <CardDescription>Manage job distribution templates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { name: "Standard IT Role", vendors: 8, usage: 45 },
            { name: "Executive Search", vendors: 3, usage: 12 },
          ].map((template, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-semibold">{template.name}</p>
                <p className="text-sm text-muted-foreground">
                  {template.vendors} vendors • Used {template.usage} times
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
