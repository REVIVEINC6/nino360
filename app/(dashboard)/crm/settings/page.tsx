import { CRMSettings } from "@/components/crm/crm-settings"

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CRM Settings</h1>
        <p className="text-muted-foreground">Configure stages, reasons, SLAs, and dedupe rules</p>
      </div>

      <CRMSettings />
    </div>
  )
}
