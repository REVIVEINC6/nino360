"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Download } from "lucide-react"
import { askCopilot } from "../actions/copilot"
import { AutoViz } from "@/components/reports/auto-viz"

export default function ReportsCopilot() {
  const [query, setQuery] = useState("Show revenue vs collection by week for last quarter")
  const [answer, setAnswer] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)
    try {
      const result = await askCopilot(query)
      setAnswer(result)
    } catch (error) {
      console.error("Copilot error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!answer?.rows) return

    const csv = [
      answer.cols.join(","),
      ...answer.rows.map((row: any) => answer.cols.map((col: string) => row[col]).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `copilot-${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Copilot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about your data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <Button onClick={handleAsk} disabled={loading}>
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </div>

          <div className="space-y-2 text-muted-foreground text-xs">
            <p>Example queries:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Show revenue vs collection by week for last quarter</li>
              <li>What are the top 5 clients by revenue this year?</li>
              <li>How many consultants are on bench vs deployed?</li>
              <li>Show project hours logged vs estimated by month</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {answer && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Results</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-3 font-mono text-xs">{answer.sql}</div>

            <AutoViz payload={answer} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
