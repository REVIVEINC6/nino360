import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { BillingManagement } from "@/components/admin/billing-management"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function BillingPage() {
  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Billing & Invoicing
          </h1>
          <p className="text-muted-foreground">Provider sync, disputes, and subscription management</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <BillingManagement />
        </Suspense>
      </div>
    </TwoPane>
  )
}
