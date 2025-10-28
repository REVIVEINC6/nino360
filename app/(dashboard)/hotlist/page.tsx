import { getKPITiles, getActivityStream } from "./actions/analytics"
import { HotlistDashboardView } from "@/components/hotlist/hotlist-dashboard-view"

export const dynamic = "force-dynamic"

export default async function HotlistPage() {
  const [kpisResult, activitiesResult] = await Promise.all([getKPITiles(), getActivityStream()])

  const kpis = kpisResult.success ? kpisResult.data : []
  const activities = activitiesResult.success ? activitiesResult.data : []

  return <HotlistDashboardView initialKPIs={kpis} initialActivities={activities} />
}
