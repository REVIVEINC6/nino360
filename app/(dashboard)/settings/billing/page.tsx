import { Section } from "@/components/settings/section"
import { BillingOverview } from "@/components/settings/billing-overview"

export default function BillingPage() {
  return (
    <div className="p-8 space-y-8">
      <Section
        title="Billing & Linked Tenants"
        description="View your billing information and manage tenant subscriptions"
      >
        <BillingOverview />
      </Section>
    </div>
  )
}
