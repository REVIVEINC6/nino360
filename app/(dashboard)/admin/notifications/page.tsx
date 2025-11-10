import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { NotificationsManagement } from "@/components/admin/notifications-management"
import { TwoPane } from "@/components/layout/two-pane"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default function NotificationsPage() {
  return (
    <TwoPane right={<AdminSidebar />}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-2">Manage notification templates, channels, and rate limits</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <NotificationsManagement />
        </Suspense>
      </div>
    </TwoPane>
  )
}
