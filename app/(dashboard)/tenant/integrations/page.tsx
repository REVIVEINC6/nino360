import { Suspense } from "react"
import { IntegrationsHub } from "@/components/tenant/integrations-hub"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TenantIntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 border-white/20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Integrations Hub
            </h1>
            <p className="text-muted-foreground mt-2">
              Connect external services, configure AI providers, and manage API integrations with blockchain
              verification
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">Blockchain Secured</span>
          </div>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-xl" />}>
        <IntegrationsHub />
      </Suspense>
    </div>
  )
}
