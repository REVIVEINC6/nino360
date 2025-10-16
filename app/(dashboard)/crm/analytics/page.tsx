import { CRMAnalytics } from "@/components/crm/crm-analytics"

export default async function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CRM Analytics</h1>
        <p className="text-muted-foreground">Win/loss analysis, stage velocity, and attribution</p>
      </div>

      <CRMAnalytics />
    </div>
  )
}
