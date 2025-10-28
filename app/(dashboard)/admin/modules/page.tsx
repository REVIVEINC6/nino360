import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ModuleAccessManagement } from "@/components/admin/module-access-management"

export default function ModuleAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex flex-col gap-6 p-6">
        <div className="glass-card p-6 backdrop-blur-xl bg-white/70 border border-white/20 rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Module Access
          </h1>
          <p className="text-muted-foreground mt-2">Entitlements per plan</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <ModuleAccessManagement />
        </Suspense>
      </div>
    </div>
  )
}
