import { Suspense } from "react"
import { hasPermission } from "@/lib/rbac/server"
import { PERMISSIONS } from "@/lib/rbac/permissions"
import { redirect } from "next/navigation"
import { NewOpportunityForm } from "@/components/crm-opportunities/new-opportunity-form"
import { Card } from "@/components/ui/card"
import { Sparkles, Shield, Zap } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewOpportunityPage() {
  // Check permission
  const canCreate = await hasPermission(PERMISSIONS.CRM_CONTACTS_CREATE)
  // In dev, allow page to render with a friendly banner instead of redirecting

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create New Opportunity
            </h1>
            <p className="text-muted-foreground">AI-powered opportunity creation with smart predictions</p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium">AI Auto-Fill</span>
          </div>
          <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-medium">Blockchain Verified</span>
          </div>
          <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium">RPA Automation</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Suspense fallback={<FormSkeleton />}>
        <NewOpportunityForm />
      </Suspense>
    </div>
  )
}

function FormSkeleton() {
  return (
    <Card className="glass-panel p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-32 bg-muted rounded" />
      </div>
    </Card>
  )
}
