import { Suspense } from "react"
import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats"
import { AdminDashboardCharts } from "@/components/admin/admin-dashboard-charts"
import { AdminDashboardActivity } from "@/components/admin/admin-dashboard-activity"
import { AdminDashboardAI } from "@/components/admin/admin-dashboard-ai"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

console.log("[v0] AdminDashboardStats:", AdminDashboardStats)
console.log("[v0] AdminDashboardCharts:", AdminDashboardCharts)
console.log("[v0] AdminDashboardActivity:", AdminDashboardActivity)
console.log("[v0] AdminDashboardAI:", AdminDashboardAI)

export default function AdminDashboardPage() {
  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-xl border border-white/20 shadow-xl backdrop-blur-md bg-white/70">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">System-wide metrics, AI insights, and operational controls</p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <AdminDashboardStats />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          <Suspense
            fallback={
              <Card className="p-6">
                <Skeleton className="h-[350px] w-full" />
              </Card>
            }
          >
            <AdminDashboardCharts />
          </Suspense>

          <Suspense
            fallback={
              <Card className="p-6">
                <Skeleton className="h-[350px] w-full" />
              </Card>
            }
          >
            <AdminDashboardAI />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <Card className="p-6">
              <Skeleton className="h-[400px] w-full" />
            </Card>
          }
        >
          <AdminDashboardActivity />
        </Suspense>
      </div>
    </TwoPane>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    </div>
  )
}
