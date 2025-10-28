import { Section } from "@/components/settings/section"
import { NotificationsForm } from "@/components/settings/notifications-form"

export default function NotificationsPage() {
  return (
    <div className="p-8 space-y-8">
      <Section title="Notifications" description="Configure how and when you receive notifications">
        <NotificationsForm />
      </Section>
    </div>
  )
}
