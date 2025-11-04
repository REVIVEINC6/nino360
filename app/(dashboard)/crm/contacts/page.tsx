export const dynamic = "force-dynamic"

import { ContactsManagement } from "@/components/crm/contacts-management"
import { listContacts } from "./actions"

export default async function ContactsPage() {
  // Fetch an initial page of contacts on the server so the client shows fast content and
  // avoids an unauthenticated runtime error when rendered in edge/dev without a session.
  const resp = await listContacts({ page: 1, pageSize: 50 })
  const initialRows = resp.success ? resp.rows : []
  const total = resp.success ? resp.total : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Management</h1>
        <p className="text-muted-foreground">360° contact view, communications, and timeline</p>
      </div>

      <ContactsManagement initialRows={initialRows} total={total} />
    </div>
  )
}
