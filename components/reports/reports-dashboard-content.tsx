"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Share2, Download, Clock, TrendingUp, Plus, Search } from "lucide-react"
import { getReportsOverview } from "@/app/(dashboard)/reports/actions"
import { Input } from "@/components/ui/input"

export function ReportsDashboardContent() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getReportsOverview()
        setData(result)
      } catch (error) {
        console.error("Failed to load reports:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {data.totalReports}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {data.scheduledReports}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-50 to-blue-50 border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Shared</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                {data.sharedReports}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center">
              <Share2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search reports..." className="pl-10" />
          </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reports */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Reports</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {data.recentReports.map((report: any) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50/50 to-purple-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {report.type}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(report.lastRun).toLocaleDateString()}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Reports */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Popular Reports</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {data.popularReports.map((report: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50/50 to-pink-50/50"
              >
                <span className="font-medium">{report.name}</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100">
                  {report.runs} runs
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
