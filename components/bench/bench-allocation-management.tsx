"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Users, Briefcase, TrendingUp } from "lucide-react"

interface BenchAllocationManagementProps {
  view: "needs" | "matching" | "shortlist" | "approvals"
}

export function BenchAllocationManagement({ view }: BenchAllocationManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")

  if (view === "needs") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search project needs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Need
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Needs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Across 12 projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Resources</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">On bench currently</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <p className="text-xs text-green-600">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Needs</CardTitle>
            <CardDescription>Open positions requiring resource allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Skills Required</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    project: "Cloud Migration",
                    role: "Senior DevOps",
                    skills: "AWS, Kubernetes",
                    start: "2024-02-01",
                    duration: "6 months",
                    priority: "high",
                  },
                  {
                    project: "Mobile App",
                    role: "React Native Dev",
                    skills: "React Native, TypeScript",
                    start: "2024-02-15",
                    duration: "4 months",
                    priority: "medium",
                  },
                  {
                    project: "Data Pipeline",
                    role: "Data Engineer",
                    skills: "Python, Spark",
                    start: "2024-03-01",
                    duration: "3 months",
                    priority: "high",
                  },
                ].map((need, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{need.project}</TableCell>
                    <TableCell>{need.role}</TableCell>
                    <TableCell>{need.skills}</TableCell>
                    <TableCell>{need.start}</TableCell>
                    <TableCell>{need.duration}</TableCell>
                    <TableCell>
                      <Badge variant={need.priority === "high" ? "destructive" : "secondary"}>{need.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Match
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

  if (view === "matching") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Skill Matching</CardTitle>
          <CardDescription>Find the best resource matches for project needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Cloud Migration - Senior DevOps</h4>
                  <p className="text-sm text-muted-foreground">Required: AWS, Kubernetes, Terraform</p>
                </div>
                <Badge>3 matches</Badge>
              </div>
              <div className="space-y-2">
                {[
                  { name: "John Smith", match: 95, skills: "AWS, Kubernetes, Terraform, Docker" },
                  { name: "Sarah Johnson", match: 88, skills: "AWS, Kubernetes, Python" },
                  { name: "Mike Chen", match: 82, skills: "AWS, Docker, CI/CD" },
                ].map((candidate, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.skills}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{candidate.match}% match</Badge>
                      <Button size="sm">Shortlist</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (view === "shortlist") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shortlisted Candidates</CardTitle>
          <CardDescription>Review and approve resource allocations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { project: "Cloud Migration", candidate: "John Smith", role: "Senior DevOps", match: 95 },
              { project: "Mobile App", candidate: "Emily Davis", role: "React Native Dev", match: 92 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-semibold">{item.project}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.candidate} - {item.role}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{item.match}% match</Badge>
                  <Button size="sm" variant="outline">
                    Remove
                  </Button>
                  <Button size="sm">Submit for Approval</Button>
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
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>Resource allocation requests awaiting approval</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                project: "Cloud Migration",
                resource: "John Smith",
                role: "Senior DevOps",
                start: "2024-02-01",
                requestedBy: "PM Team",
                status: "pending",
              },
              {
                project: "Mobile App",
                resource: "Emily Davis",
                role: "React Native Dev",
                start: "2024-02-15",
                requestedBy: "Tech Lead",
                status: "pending",
              },
            ].map((approval, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{approval.project}</TableCell>
                <TableCell>{approval.resource}</TableCell>
                <TableCell>{approval.role}</TableCell>
                <TableCell>{approval.start}</TableCell>
                <TableCell>{approval.requestedBy}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{approval.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
