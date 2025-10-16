import { Section } from "@/components/settings/section"
import { SecuritySettings } from "@/components/settings/security-settings"

export default function SecurityPage() {
  return (
    <div className="p-8 space-y-8">
      <Section
        title="Security & Sessions"
        description="Manage your security settings, active sessions, and two-factor authentication"
      >
        <SecuritySettings />
      </Section>
    </div>
  )
}
