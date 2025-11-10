import { getSecuritySettings } from "../actions/security"
import { SecurityForm } from "@/components/tenant/security-form"

export default async function TenantSecurityPage() {
  const settings = await getSecuritySettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage security controls for your organization</p>
      </div>

      <SecurityForm initialSettings={settings} />
    </div>
  )
}
