import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { MarketplaceManagement } from "@/components/admin/marketplace-management"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function MarketplacePage() {
  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Marketplace
          </h1>
          <p className="text-muted-foreground">Add-ons, SKUs, and marketplace offerings</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <MarketplaceManagement />
        </Suspense>
      </div>
    </TwoPane>
  )
}
