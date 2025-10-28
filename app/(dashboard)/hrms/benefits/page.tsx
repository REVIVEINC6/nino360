import { BenefitsManagementContent } from "@/components/hrms/benefits/benefits-management-content"

export default async function BenefitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-6 space-y-6">
        <div className="glass-card p-6 rounded-xl border border-white/20 shadow-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Benefits Management
          </h1>
          <p className="text-gray-600 mt-2">Plans, enrollment, and claims management</p>
        </div>

        <BenefitsManagementContent />
      </div>
    </div>
  )
}
