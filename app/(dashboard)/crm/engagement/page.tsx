import { EngagementHeader } from "@/components/crm-engagement/engagement-header"
import { EngagementContent } from "@/components/crm-engagement/engagement-content"
import { EngagementStats } from "@/components/crm-engagement/engagement-stats"
import { getEngagementAnalytics } from "@/app/(dashboard)/crm/actions/engagement"

export default async function EngagementPage() {
  const analytics = await getEngagementAnalytics()

  return (
    <div className="min-h-screen ai-gradient-bg p-6 space-y-6">
      <EngagementHeader />
      <EngagementStats analytics={analytics} />
      <EngagementContent />
    </div>
  )
}
