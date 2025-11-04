"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Clock, TrendingUp, Search, Filter, Download } from "lucide-react"
import Link from "next/link"

interface BenchMetrics {
  totalBench: number
  readyToDeploy: number
  avgBenchDays: number
  placementRate: number
}

interface BenchConsultant {
  id: string
  employee: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  skills: string[]
  bench_days: number
  ready_to_deploy: boolean
  availability_date: string
  status: string
}

interface BenchDashboardContentProps {
  metrics: BenchMetrics
  consultants: BenchConsultant[]
}

export function BenchDashboardContent({ metrics, consultants }: BenchDashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-linear-to-br from-blue-50/50 to-purple-50/50 border-blue-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total on Bench</p>
              <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {metrics.totalBench}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-purple-50/50 to-pink-50/50 border-purple-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ready to Deploy</p>
              <p className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {metrics.readyToDeploy}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-pink-50/50 to-orange-50/50 border-pink-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Bench Days</p>
              <p className="text-3xl font-bold bg-linear-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                {metrics.avgBenchDays}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-pink-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-orange-50/50 to-blue-50/50 border-orange-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Placements (30d)</p>
              <p className="text-3xl font-bold bg-linear-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                {metrics.placementRate}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-orange-500 to-blue-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Available Consultants */}
      <Card className="p-6 bg-white/50 backdrop-blur-sm border-gray-200/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Available Consultants</h2>
            <p className="text-sm text-muted-foreground mt-1">Top consultants on bench by duration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {consultants.map((consultant) => (
            <div
              key={consultant.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-linear-to-r from-gray-50/50 to-white/50 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {consultant.employee.first_name[0]}
                    {consultant.employee.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {consultant.employee.first_name} {consultant.employee.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{consultant.employee.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Skills</p>
                  <div className="flex gap-1 mt-1">
                    {consultant.skills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {consultant.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{consultant.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Bench Days</p>
                  <p className="font-semibold text-lg">{consultant.bench_days}</p>
                </div>

                <div>
                  {consultant.ready_to_deploy ? (
                    <Badge className="bg-green-500">Ready</Badge>
                  ) : (
                    <Badge variant="secondary">In Training</Badge>
                  )}
                </div>

                <Button size="sm" asChild>
                  <Link href={`/bench/consultants/${consultant.id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {consultants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No consultants on bench</p>
          </div>
        )}
      </Card>
    </div>
  )
}
