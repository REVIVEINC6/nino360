import { getKPITiles, getActivityStream } from "./actions/analytics"
import { HotlistDashboardView } from "@/components/hotlist/hotlist-dashboard-view"
import { TwoPane } from "@/components/layout/two-pane"
import { HotlistSidebar } from "@/components/hotlist/hotlist-sidebar"

export const dynamic = "force-dynamic"

export default async function HotlistPage() {
  const [kpisResult, activitiesResult] = await Promise.all([getKPITiles(), getActivityStream()])

  const kpis = kpisResult.success ? kpisResult.data : []
  const activities = activitiesResult.success ? activitiesResult.data : []

  return (
    <TwoPane right={<HotlistSidebar />}>
      <HotlistDashboardView initialKPIs={kpis} initialActivities={activities} />
    </TwoPane>
  )
}
