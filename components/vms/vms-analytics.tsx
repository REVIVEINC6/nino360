"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VMSAnalyticsProps {
  view: "performance" | "sla" | "cost" | "quality"
}

export function VMSAnalytics({ view }: VMSAnalyticsProps) {
  if (view === "performance") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance</CardTitle>
          <CardDescription>Overall vendor performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Placements</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Avg Time to Submit</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  vendor: "IT Solutions",
                  submissions: 45,
                  placements: 12,
                  conversion: 27,
                  time: "2.5 days",
                  rating: 4.5,
                },
                {
                  vendor: "TechStaff Inc",
                  submissions: 38,
                  placements: 8,
                  conversion: 21,
                  time: "3.2 days",
                  rating: 4.2,
                },
              ].map((vendor, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{vendor.vendor}</TableCell>
                  <TableCell>{vendor.submissions}</TableCell>
                  <TableCell>{vendor.placements}</TableCell>
                  <TableCell>{vendor.conversion}%</TableCell>
                  <TableCell>{vendor.time}</TableCell>
                  <TableCell>
                    <Badge>{vendor.rating} ⭐</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (view === "sla") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SLA Metrics</CardTitle>
          <CardDescription>Service level agreement compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Response Time SLA</TableHead>
                <TableHead>Submission Quality SLA</TableHead>
                <TableHead>Timesheet SLA</TableHead>
                <TableHead>Overall Compliance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { vendor: "IT Solutions", response: 95, quality: 92, timesheet: 98, overall: 95 },
                { vendor: "TechStaff Inc", response: 88, quality: 85, timesheet: 90, overall: 88 },
              ].map((sla, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{sla.vendor}</TableCell>
                  <TableCell>{sla.response}%</TableCell>
                  <TableCell>{sla.quality}%</TableCell>
                  <TableCell>{sla.timesheet}%</TableCell>
                  <TableCell>
                    <Badge variant={sla.overall >= 90 ? "default" : "secondary"}>{sla.overall}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (view === "cost") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
          <CardDescription>Vendor cost and spend analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Total Spend</TableHead>
                <TableHead>Avg Rate</TableHead>
                <TableHead>Active Contractors</TableHead>
                <TableHead>Cost per Placement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  vendor: "IT Solutions",
                  spend: "$145,000",
                  rate: "$90/hr",
                  contractors: 5,
                  costPerPlacement: "$12,083",
                },
                {
                  vendor: "TechStaff Inc",
                  spend: "$98,000",
                  rate: "$85/hr",
                  contractors: 3,
                  costPerPlacement: "$12,250",
                },
              ].map((cost, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{cost.vendor}</TableCell>
                  <TableCell>{cost.spend}</TableCell>
                  <TableCell>{cost.rate}</TableCell>
                  <TableCell>{cost.contractors}</TableCell>
                  <TableCell>{cost.costPerPlacement}</TableCell>
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
        <CardTitle>Quality Metrics</CardTitle>
        <CardDescription>Submission and placement quality</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Profile Accuracy</TableHead>
              <TableHead>Interview Show Rate</TableHead>
              <TableHead>Client Satisfaction</TableHead>
              <TableHead>Retention Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { vendor: "IT Solutions", accuracy: 92, showRate: 95, satisfaction: 4.5, retention: 88 },
              { vendor: "TechStaff Inc", accuracy: 88, showRate: 90, satisfaction: 4.2, retention: 85 },
            ].map((quality, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{quality.vendor}</TableCell>
                <TableCell>{quality.accuracy}%</TableCell>
                <TableCell>{quality.showRate}%</TableCell>
                <TableCell>{quality.satisfaction} ⭐</TableCell>
                <TableCell>{quality.retention}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
