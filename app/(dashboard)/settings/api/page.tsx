import { Section } from "@/components/settings/section"
import { ApiKeysManager } from "@/components/settings/api-keys-manager"
import { WebhooksManager } from "@/components/settings/webhooks-manager"

export default function ApiPage() {
  return (
    <div className="p-8 space-y-8">
      <Section title="API Keys & Webhooks" description="Manage your personal API keys and webhook endpoints">
        <div className="space-y-8">
          <ApiKeysManager />
          <WebhooksManager />
        </div>
      </Section>
    </div>
  )
}
