"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CalibrationPanelProps {
  metrics: {
    per_interviewer: Array<{ id: string; avg: number; sd: number; n: number }>
    icc_proxy: number
    bias_table: Array<{ interviewer: string; avg_diff_from_mean: number }>
  }
}

export function CalibrationPanel({ metrics }: CalibrationPanelProps) {
  const chartData = metrics.per_interviewer.map((i) => ({
    name: i.id.slice(0, 8),
    avg: i.avg,
    count: i.n,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution by Interviewer</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bias Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Interviewer</TableHead>
                <TableHead>Avg Difference from Mean</TableHead>
                <TableHead>Bias</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.bias_table.map((bias, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{bias.interviewer.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {bias.avg_diff_from_mean > 0 ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span>{bias.avg_diff_from_mean.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        Math.abs(bias.avg_diff_from_mean) > 0.5
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }
                    >
                      {Math.abs(bias.avg_diff_from_mean) > 0.5 ? "High" : "Normal"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inter-Rater Reliability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ICC Proxy</p>
              <p className="text-3xl font-bold">{metrics.icc_proxy.toFixed(3)}</p>
            </div>
            <Badge
              variant="outline"
              className={
                metrics.icc_proxy > 0.7
                  ? "bg-emerald-500/10 text-emerald-600"
                  : metrics.icc_proxy > 0.5
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-red-500/10 text-red-600"
              }
            >
              {metrics.icc_proxy > 0.7 ? "Good" : metrics.icc_proxy > 0.5 ? "Fair" : "Poor"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Higher values indicate better agreement among interviewers
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
