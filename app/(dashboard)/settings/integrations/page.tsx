import { Section } from "@/components/settings/section"
import { IntegrationsGrid } from "@/components/settings/integrations-grid"

export default function IntegrationsPage() {
  return (
    <div className="p-8 space-y-8">
      <Section title="Integrations" description="Connect your personal accounts with external services">
        <IntegrationsGrid />
      </Section>
    </div>
  )
}
