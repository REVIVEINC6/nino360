"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { listSubmissions } from "../actions/submissions"

export default function BenchSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    listSubmissions().then(setSubmissions).catch(console.error)
  }, [])

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-800",
    shortlisted: "bg-purple-100 text-purple-800",
    interview: "bg-orange-100 text-orange-800",
    rejected: "bg-red-100 text-red-800",
    offered: "bg-green-100 text-green-800",
    withdrawn: "bg-gray-100 text-gray-800",
    placed: "bg-emerald-100 text-emerald-800",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultant</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Job Ref</TableHead>
                <TableHead>Pay Rate</TableHead>
                <TableHead>Bill Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">
                      {s.consultant?.first_name} {s.consultant?.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.consultant?.email}</div>
                  </TableCell>
                  <TableCell>{s.client_name}</TableCell>
                  <TableCell className="text-xs">{s.job_ref || "N/A"}</TableCell>
                  <TableCell>
                    ${s.pay_rate} {s.currency}
                  </TableCell>
                  <TableCell>
                    ${s.bill_rate} {s.currency}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[s.status] || ""}>{s.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(s.submission_date).toLocaleDateString()}
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
