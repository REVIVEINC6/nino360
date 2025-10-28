import { IntegrationsHub } from "@/components/tenant/integrations-hub"

export default async function TenantIntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect external services, configure AI providers, and manage API integrations
        </p>
      </div>

      <IntegrationsHub />
    </div>
  )
}
