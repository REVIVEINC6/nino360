import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { NotificationsManagement } from "@/components/admin/notifications-management"

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Templates, rate limits</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <NotificationsManagement />
      </Suspense>
    </div>
  )
}
