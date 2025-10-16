import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, Calendar } from "lucide-react"
import { getDashboardKPIs } from "../actions/consultants"

async function DashboardStats() {
  const kpis = await getDashboardKPIs()

  const stats = [
    {
      title: "On Bench",
      value: kpis.on_bench,
      icon: Users,
      description: "Available consultants",
      color: "text-blue-600",
    },
    {
      title: "Avg Bench Days",
      value: kpis.avg_bench_days,
      icon: Clock,
      description: "Average time on bench",
      color: "text-orange-600",
    },
    {
      title: "Active Allocations",
      value: kpis.active_allocations,
      icon: CheckCircle,
      description: "Currently allocated",
      color: "text-green-600",
    },
    {
      title: "Upcoming Roll-offs",
      value: kpis.upcoming_rolloffs,
      icon: Calendar,
      description: "Next 30 days",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function BenchDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bench Dashboard</h1>
        <p className="text-muted-foreground">Overview of bench resources and allocations</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            AI-powered recommendations for matching consultants to open jobs will appear here.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity feed will show recent consultant status changes, allocations, and placements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
