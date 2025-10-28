import { PerformanceManagementContent } from "@/components/hrms/performance/performance-management-content"

export default async function PerformancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Performance Management
          </h1>
          <p className="text-slate-600 mt-2">Goals, reviews, 360 feedback, and performance tracking with AI insights</p>
        </div>

        <PerformanceManagementContent />
      </div>
    </div>
  )
}
