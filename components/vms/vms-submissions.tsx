"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VMSSubmissionsProps {
  view: "submissions" | "duplicates" | "shortlist" | "interviews"
}

export function VMSSubmissions({ view }: VMSSubmissionsProps) {
  if (view === "submissions") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Submissions</CardTitle>
          <CardDescription>Review candidate submissions from vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "John Doe",
                  job: "Senior Java Developer",
                  vendor: "TechStaff Inc",
                  date: "2024-01-15",
                  rate: "$80/hr",
                  status: "new",
                },
                {
                  name: "Jane Smith",
                  job: "DevOps Engineer",
                  vendor: "IT Solutions",
                  date: "2024-01-14",
                  rate: "$90/hr",
                  status: "reviewed",
                },
              ].map((submission, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>{submission.job}</TableCell>
                  <TableCell>{submission.vendor}</TableCell>
                  <TableCell>{submission.date}</TableCell>
                  <TableCell>{submission.rate}</TableCell>
                  <TableCell>
                    <Badge variant={submission.status === "new" ? "secondary" : "default"}>{submission.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                      <Button variant="ghost" size="sm">
                        Shortlist
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

  if (view === "duplicates") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Duplicate Detection</CardTitle>
          <CardDescription>AI-powered duplicate submission detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">Potential Duplicate Detected</p>
                  <p className="text-sm text-muted-foreground">95% match confidence</p>
                </div>
                <Badge variant="outline">Needs Review</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Submission 1</p>
                  <p className="text-muted-foreground">John Doe - TechStaff Inc</p>
                  <p className="text-muted-foreground">Submitted: 2024-01-15</p>
                </div>
                <div>
                  <p className="font-medium">Submission 2</p>
                  <p className="text-muted-foreground">J. Doe - IT Solutions</p>
                  <p className="text-muted-foreground">Submitted: 2024-01-16</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm">Mark as Duplicate</Button>
                <Button size="sm" variant="outline">
                  Not a Duplicate
                </Button>
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
          <CardDescription>Candidates selected for client review</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: "Jane Smith", job: "DevOps Engineer", vendor: "IT Solutions", rate: "$90/hr", score: 92 },
                {
                  name: "Mike Johnson",
                  job: "Senior Java Developer",
                  vendor: "TechStaff Inc",
                  rate: "$85/hr",
                  score: 88,
                },
              ].map((candidate, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.job}</TableCell>
                  <TableCell>{candidate.vendor}</TableCell>
                  <TableCell>{candidate.rate}</TableCell>
                  <TableCell>
                    <Badge>{candidate.score}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Schedule Interview
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
        <CardDescription>Manage vendor candidate interviews</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Interview Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Jane Smith",
                job: "DevOps Engineer",
                vendor: "IT Solutions",
                date: "2024-01-20 10:00 AM",
                status: "scheduled",
              },
              {
                name: "Mike Johnson",
                job: "Senior Java Developer",
                vendor: "TechStaff Inc",
                date: "2024-01-21 2:00 PM",
                status: "scheduled",
              },
            ].map((interview, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{interview.name}</TableCell>
                <TableCell>{interview.job}</TableCell>
                <TableCell>{interview.vendor}</TableCell>
                <TableCell>{interview.date}</TableCell>
                <TableCell>
                  <Badge>{interview.status}</Badge>
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
  )
}
