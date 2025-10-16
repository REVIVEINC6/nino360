import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SupportTicketsManagement } from "@/components/admin/support-tickets-management"

export default function SupportTicketsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted-foreground">Triage</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <SupportTicketsManagement />
      </Suspense>
    </div>
  )
}
