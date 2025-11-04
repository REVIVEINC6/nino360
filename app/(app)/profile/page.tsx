import { redirect } from "next/navigation"
import { getProfile } from "./actions"
import { Section } from "@/components/profile/section"
import { AvatarUploader } from "@/components/profile/avatar-uploader"
import { ProfileForm } from "@/components/profile/profile-form"
import { SecurityCard } from "@/components/profile/security-card"
import { SessionsTable } from "@/components/profile/sessions-table"
import { ConnectedAccounts } from "@/components/profile/connected-accounts"
import { NotificationToggles } from "@/components/profile/notification-toggles"
import { AiPrivacyCard } from "@/components/profile/ai-privacy-card"
import { ActivityTable } from "@/components/profile/activity-table"
import { DangerZone } from "@/components/profile/danger-zone"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const data = await getProfile()

  if ("error" in data) {
    redirect("/login")
  }

  const { user, profile, preferences, logs } = data

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-muted-foreground mt-2">Manage your personal information, security, and preferences</p>
        </div>

        {/* Row 1: Profile & Security */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Section title="Profile" description="Update your personal information">
              <AvatarUploader currentUrl={profile.avatar_url || undefined} fullName={profile.full_name} />
              <div className="mt-6">
                <ProfileForm
                  initialData={{
                    full_name: profile.full_name,
                    title: profile.title || "",
                    phone: profile.phone || "",
                    locale: profile.locale || "en",
                    timezone: profile.timezone || "America/New_York",
                    avatar_url: profile.avatar_url || "",
                  }}
                />
              </div>
            </Section>
          </div>

          <div className="lg:col-span-8">
            <Section title="Security" description="Manage your account security and sessions">
              <SecurityCard email={user.email} lastLogin={user.last_login_at} totpEnabled={false} />
              <div className="mt-6">
                <SessionsTable sessions={[]} />
              </div>
            </Section>
          </div>
        </div>

        {/* Row 2: Connected Accounts & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="Connected Accounts" description="Manage your external integrations">
            <ConnectedAccounts providers={[]} />
          </Section>

          <Section title="Notifications" description="Control how you receive updates">
            <NotificationToggles initialPrefs={preferences.notifications || {}} />
          </Section>
        </div>

        {/* Row 3: AI Privacy & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section title="AI & Privacy" description="Configure AI features and data privacy">
            <AiPrivacyCard initialConfig={preferences.ai_config || {}} />
          </Section>

          <Section title="Recent Activity" description="Your recent actions with hash-chain verification">
            <ActivityTable logs={logs} />
          </Section>
        </div>

        {/* Row 4: Danger Zone */}
        <Section title="Danger Zone" description="Irreversible account actions" className="border-red-500/20">
          <DangerZone />
        </Section>
      </div>
    </div>
  )
}
