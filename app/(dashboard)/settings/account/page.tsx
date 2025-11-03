import { Section } from "@/components/settings/section"
import { AccountForm } from "@/components/settings/account-form"

export default function AccountPage() {
  return (
    <div className="p-8 space-y-8">
      <Section title="Account & Identity" description="Manage your personal information and connected accounts">
        <AccountForm />
      </Section>
    </div>
  )
}
