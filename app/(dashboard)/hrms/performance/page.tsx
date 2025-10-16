import { PerformanceManagementClient } from "@/components/hrms/performance/performance-management-client"

export default async function PerformancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Management</h1>
        <p className="text-muted-foreground">Goals, reviews, 360 feedback, and performance tracking</p>
      </div>

      <PerformanceManagementClient />
    </div>
  )
}
