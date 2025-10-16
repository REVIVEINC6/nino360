import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { BillingManagement } from "@/components/admin/billing-management"

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Invoicing</h1>
        <p className="text-muted-foreground">Provider sync, disputes</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <BillingManagement />
      </Suspense>
    </div>
  )
}
