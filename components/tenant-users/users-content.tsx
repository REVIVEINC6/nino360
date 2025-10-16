"use client"

import { useState } from "react"
import { UsersTable } from "./users-table"
import { Toolbar } from "./toolbar"
import { InviteDialog } from "./invite-dialog"
import { BulkImportDialog } from "./bulk-import-dialog"
import { AuditDrawer } from "./audit-drawer"

interface UsersContentProps {
  initialData: {
    rows: any[]
    total: number
  }
  context: {
    tenantId: string
    slug: string
    myRole: string
    features: Record<string, boolean>
    canManage: boolean
  }
}

export function UsersContent({ initialData, context }: UsersContentProps) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [bulkImportOpen, setBulkImportOpen] = useState(false)
  const [auditOpen, setAuditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users & Access</h1>
          <p className="text-muted-foreground mt-2">Manage team members, roles, and permissions</p>
        </div>
      </div>

      <Toolbar
        canManage={context.canManage}
        onInvite={() => setInviteOpen(true)}
        onBulkImport={() => setBulkImportOpen(true)}
      />

      <UsersTable
        initialData={initialData}
        canManage={context.canManage}
        onOpenAudit={(userId) => {
          setSelectedUser(userId)
          setAuditOpen(true)
        }}
      />

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <BulkImportDialog open={bulkImportOpen} onOpenChange={setBulkImportOpen} />
      <AuditDrawer open={auditOpen} onOpenChange={setAuditOpen} userId={selectedUser} />
    </div>
  )
}
