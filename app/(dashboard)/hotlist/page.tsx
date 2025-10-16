import { HotlistDashboard } from "@/components/hotlist/hotlist-dashboard"

export default function HotlistPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hotlist Dashboard</h1>
        <p className="text-muted-foreground">
          Priority talent market - Response rate, time-to-submit, conversion metrics
        </p>
      </div>

      <HotlistDashboard />
    </div>
  )
}
