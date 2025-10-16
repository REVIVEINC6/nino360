import { TalentAnalytics } from "@/components/talent/talent-analytics"

export default async function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Talent Analytics</h1>
        <p className="text-muted-foreground">Funnel metrics, quality of hire, and source ROI</p>
      </div>

      <TalentAnalytics />
    </div>
  )
}
