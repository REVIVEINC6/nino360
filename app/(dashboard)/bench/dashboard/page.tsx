import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, Calendar } from "lucide-react"
import { getDashboardKPIs } from "../actions/consultants"
import { TwoPane } from "@/components/layout/two-pane"
import { BenchSidebar } from "@/components/bench/bench-sidebar"

function DashboardStats({ kpis }: { kpis: any }) {

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
      {stats.map((stat: any) => (
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

export default async function BenchDashboard() {
  const kpis = await getDashboardKPIs()

  return (
  <TwoPane right={<BenchSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bench Dashboard</h1>
          <p className="text-muted-foreground">Overview of bench resources and allocations</p>
        </div>

        <DashboardStats kpis={kpis} />

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
    </TwoPane>
  )
}
