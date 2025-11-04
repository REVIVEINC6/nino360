"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProjectRisksManagementProps {
  view: "risks" | "issues" | "mitigation" | "ai-insights"
}

export function ProjectRisksManagement({ view }: ProjectRisksManagementProps) {
  if (view === "risks") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Risks</CardTitle>
          <CardDescription>Identified risks across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  risk: "Key resource leaving",
                  project: "Cloud Migration",
                  probability: "medium",
                  impact: "high",
                  status: "active",
                },
                {
                  risk: "Third-party API delays",
                  project: "Mobile App",
                  probability: "high",
                  impact: "medium",
                  status: "active",
                },
                {
                  risk: "Budget overrun",
                  project: "Data Pipeline",
                  probability: "high",
                  impact: "high",
                  status: "critical",
                },
              ].map((risk, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{risk.risk}</TableCell>
                  <TableCell>{risk.project}</TableCell>
                  <TableCell>
                    <Badge variant={risk.probability === "high" ? "destructive" : "secondary"}>
                      {risk.probability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={risk.impact === "high" ? "destructive" : "secondary"}>{risk.impact}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={risk.status === "critical" ? "destructive" : "default"}>{risk.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Mitigate
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

  if (view === "issues") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Issues</CardTitle>
          <CardDescription>Current project issues requiring resolution</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  issue: "Database performance degradation",
                  project: "Data Pipeline",
                  severity: "high",
                  assignedTo: "Tech Lead",
                  status: "in-progress",
                },
                {
                  issue: "UI inconsistencies",
                  project: "Mobile App",
                  severity: "medium",
                  assignedTo: "Design Team",
                  status: "open",
                },
              ].map((issue, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{issue.issue}</TableCell>
                  <TableCell>{issue.project}</TableCell>
                  <TableCell>
                    <Badge variant={issue.severity === "high" ? "destructive" : "secondary"}>{issue.severity}</Badge>
                  </TableCell>
                  <TableCell>{issue.assignedTo}</TableCell>
                  <TableCell>
                    <Badge>{issue.status}</Badge>
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

  if (view === "mitigation") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mitigation Plans</CardTitle>
          <CardDescription>Risk mitigation strategies and action plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                risk: "Key resource leaving",
                plan: "Cross-train team members and document critical processes",
                status: "in-progress",
              },
              {
                risk: "Budget overrun",
                plan: "Reduce scope and prioritize critical features",
                status: "planned",
              },
            ].map((mitigation, idx) => (
              <div key={idx} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{mitigation.risk}</h4>
                  <Badge>{mitigation.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{mitigation.plan}</p>
                <Button size="sm" variant="outline">
                  View Full Plan
                </Button>
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
        <CardTitle>AI Risk Insights</CardTitle>
        <CardDescription>AI-powered risk identification from project notes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
            <p className="font-semibold mb-2">Potential Risk Detected</p>
            <p className="text-sm text-muted-foreground mb-3">
              AI analysis of recent status updates suggests potential resource constraints in Q2
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm">Create Risk</Button>
              <Button size="sm" variant="outline">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
