"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Play } from "lucide-react"
import { executeQuery } from "../actions/charts"

const DATASETS = [
  { value: "rpt.kpis_current", label: "Current KPIs" },
  { value: "rpt.kpi_ats_daily", label: "ATS Daily" },
  { value: "rpt.kpi_bench_daily", label: "Bench Daily" },
  { value: "rpt.kpi_finance_daily", label: "Finance Daily" },
  { value: "rpt.kpi_projects_daily", label: "Projects Daily" },
  { value: "rpt.fact_revenue", label: "Revenue Facts" },
  { value: "rpt.fact_expense", label: "Expense Facts" },
  { value: "rpt.fact_timesheet", label: "Timesheet Facts" },
]

export default function ReportsExplorer() {
  const [dataset, setDataset] = useState("rpt.kpis_current")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [limit, setLimit] = useState("100")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleExecute = async () => {
    setLoading(true)
    try {
      const sql = `SELECT * FROM ${dataset} ${
        dateFrom && dateTo ? `WHERE d >= '${dateFrom}' AND d <= '${dateTo}'` : ""
      } LIMIT ${limit}`

      const data = await executeQuery(sql)
      setResults(data)
    } catch (error) {
      console.error("Query error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!results?.rows) return

    const csv = [
      results.cols.join(","),
      ...results.rows.map((row: any) => results.cols.map((col: string) => row[col]).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dataset}-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Explorer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Dataset</Label>
              <Select value={dataset} onValueChange={setDataset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATASETS.map((ds) => (
                    <SelectItem key={ds.value} value={ds.value}>
                      {ds.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Limit</Label>
              <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} min="1" max="10000" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExecute} disabled={loading}>
              <Play className="mr-2 h-4 w-4" />
              Execute Query
            </Button>
            {results && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Results ({results.rows.length} rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {results.cols.map((col: string) => (
                      <th key={col} className="p-2 text-left font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row: any, i: number) => (
                    <tr key={i} className="border-b">
                      {results.cols.map((col: string) => (
                        <td key={col} className="p-2">
                          {row[col]?.toString() || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
