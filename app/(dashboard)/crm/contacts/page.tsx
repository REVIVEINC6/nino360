import { ContactsManagement } from "@/components/crm/contacts-management"

export default async function ContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Management</h1>
        <p className="text-muted-foreground">360° contact view, communications, and timeline</p>
      </div>

      <ContactsManagement />
    </div>
  )
}
