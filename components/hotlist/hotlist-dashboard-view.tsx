"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Briefcase,
  Send,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3,
  Activity,
} from "lucide-react"
import { PerformanceChart } from "./performance-chart"
import { ActivityFeed } from "./activity-feed"
import { QuickActions } from "./quick-actions"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface KPI {
  label: string
  value: number
  change: number
  trend: "up" | "down"
  icon: string
}

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  user_name: string
}

interface HotlistDashboardViewProps {
  initialKPIs: KPI[]
  initialActivities: ActivityItem[]
}

export function HotlistDashboardView({ initialKPIs, initialActivities }: HotlistDashboardViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d")

  const iconMap: Record<string, any> = {
    users: Users,
    briefcase: Briefcase,
    send: Send,
    trending: TrendingUp,
    clock: Clock,
    check: CheckCircle2,
    alert: AlertCircle,
    sparkles: Sparkles,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hotlist Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Priority talent market overview and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/hotlist/priority">
              <Users className="h-4 w-4 mr-2" />
              Priority Candidates
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hotlist/requirements">
              <Briefcase className="h-4 w-4 mr-2" />
              Urgent Requirements
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {initialKPIs.map((kpi) => {
          const Icon = iconMap[kpi.icon] || Users
          const isPositive = kpi.trend === "up"

          return (
            <Card key={kpi.label} className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className={cn("h-3 w-3", isPositive ? "text-green-500" : "text-red-500 rotate-180")} />
                  <span className={cn(isPositive ? "text-green-500" : "text-red-500")}>{Math.abs(kpi.change)}%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
                <div className="flex gap-2">
                  {(["7d", "30d", "90d"] as const).map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PerformanceChart period={selectedPeriod} />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/40 bg-linear-to-br from-blue-500/10 to-purple-500/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Sparkles className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AI Matches</p>
                    <p className="text-2xl font-bold">847</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-linear-to-br from-green-500/10 to-emerald-500/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Placements</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-linear-to-br from-orange-500/10 to-red-500/10 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-500/20">
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="text-2xl font-bold">4.2h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions />
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={initialActivities} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Campaigns</p>
                  <p className="text-3xl font-bold">156</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                  <p className="text-3xl font-bold">68%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Response Rate</p>
                  <p className="text-3xl font-bold">42%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold">18%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="candidates" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Active Candidates</p>
                  <p className="text-3xl font-bold">342</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Readiness Score</p>
                  <p className="text-3xl font-bold">8.2/10</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Immediately Available</p>
                  <p className="text-3xl font-bold">127</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Rate</p>
                  <p className="text-3xl font-bold">$85/hr</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Open Requirements</p>
                  <p className="text-3xl font-bold">89</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Critical Urgency</p>
                  <p className="text-3xl font-bold">23</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg Time to Fill</p>
                  <p className="text-3xl font-bold">12 days</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Fill Rate</p>
                  <p className="text-3xl font-bold">76%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conversion" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Contact to Interview</p>
                  <p className="text-3xl font-bold">34%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interview to Offer</p>
                  <p className="text-3xl font-bold">52%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Offer to Placement</p>
                  <p className="text-3xl font-bold">89%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Overall Conversion</p>
                  <p className="text-3xl font-bold">16%</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
