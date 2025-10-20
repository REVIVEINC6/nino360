import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { BillingManagement } from "@/components/admin/billing-management"

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Billing & Invoicing
          </h1>
          <p className="text-muted-foreground">Provider sync, disputes, and subscription management</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <BillingManagement />
        </Suspense>
      </div>
    </div>
  )
}
