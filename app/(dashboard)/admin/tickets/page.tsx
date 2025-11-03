import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SupportTicketsManagement } from "@/components/admin/support-tickets-management"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default function SupportTicketsPage() {
  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Support Tickets
          </h1>
          <p className="text-muted-foreground">Triage and manage customer support requests</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <SupportTicketsManagement />
        </Suspense>
      </div>
    </TwoPane>
  )
}
