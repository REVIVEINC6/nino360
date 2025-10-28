"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface FeedbackCenterProps {
  feedbacks: Array<{
    interview: any
    candidate: string
    panel: any[]
    avg_score: number
    consensus: "agree" | "disagree" | "partial"
    overdue: boolean
  }>
}

export function FeedbackCenter({ feedbacks }: FeedbackCenterProps) {
  const consensusIcons = {
    agree: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    disagree: <XCircle className="h-4 w-4 text-red-500" />,
    partial: <AlertCircle className="h-4 w-4 text-amber-500" />,
  }

  const consensusColors = {
    agree: "bg-emerald-500/10 text-emerald-600",
    disagree: "bg-red-500/10 text-red-600",
    partial: "bg-amber-500/10 text-amber-600",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Center</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Interview</TableHead>
              <TableHead>Panel</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Consensus</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((fb, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{fb.candidate}</TableCell>
                <TableCell>{fb.interview.round_name}</TableCell>
                <TableCell>{fb.panel.length} reviewers</TableCell>
                <TableCell>
                  <Badge variant="outline">{fb.avg_score.toFixed(1)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {consensusIcons[fb.consensus]}
                    <Badge variant="outline" className={consensusColors[fb.consensus]}>
                      {fb.consensus}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {fb.overdue && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600">
                      Overdue
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
