import { CompensationManagementContent } from "@/components/hrms/compensation/compensation-management-content"

export default async function CompensationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="space-y-6 p-6">
        <div className="glass-card p-6 rounded-xl backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Compensation Management
          </h1>
          <p className="text-gray-600 mt-2">
            Salary bands, review cycles, and compensation adjustments with AI-powered equity analysis
          </p>
        </div>

        <CompensationManagementContent />
      </div>
    </div>
  )
}
