import { EngagementCenter } from "@/components/crm/engagement-center"

export default async function EngagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Engagement</h1>
        <p className="text-muted-foreground">Sequences, templates, and bulk communications</p>
      </div>

      <EngagementCenter />
    </div>
  )
}
