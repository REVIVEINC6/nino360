"use client"

import { useState } from "react"
import { UsersTable } from "./users-table"
import { Toolbar } from "./toolbar"
import { InviteDialog } from "./invite-dialog"
import { BulkImportDialog } from "./bulk-import-dialog"
import { AuditDrawer } from "./audit-drawer"
import { UsersSidebar } from "./users-sidebar"
import { StatsCards } from "./stats-cards"
import { AiInsightsPanel } from "./ai-insights-panel"

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
  const [showAiInsights, setShowAiInsights] = useState(false)

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
              Users & Access
            </h1>
            <p className="text-muted-foreground mt-2">Manage team members, roles, and permissions with AI assistance</p>
          </div>
        </div>

        <StatsCards data={initialData} />

        {context.canManage && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAiInsights(!showAiInsights)}
              className="text-sm text-[#D0FF00] hover:underline flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D0FF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D0FF00]"></span>
              </span>
              {showAiInsights ? "Hide" : "Show"} AI Insights
            </button>
          </div>
        )}

        {showAiInsights && <AiInsightsPanel tenantId={context.tenantId} />}

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

      <UsersSidebar context={context} stats={initialData} />
    </div>
  )
}
