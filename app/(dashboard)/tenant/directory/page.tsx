"use client"

import { useEffect, useState } from "react"
import { listTenants, acceptInvite, declineInvite, quickLinks, type TenantListItem } from "./actions"
import { DirectoryToolbar } from "@/components/tenant-directory/directory-toolbar"
import { TenantCard } from "@/components/tenant-directory/tenant-card"
import { InviteBanner } from "@/components/tenant-directory/invite-banner"
import { EmptyState } from "@/components/tenant-directory/empty-state"
import { ErrorState } from "@/components/tenant-directory/error-state"
import { LoadingSkeleton } from "@/components/tenant-directory/loading-skeleton"
import { CreateTenantDialog } from "@/components/tenant-directory/create-tenant-dialog"
import { toast } from "sonner"

export default function TenantDirectoryPage() {
  const [tenants, setTenants] = useState<TenantListItem[]>([])
  const [filteredTenants, setFilteredTenants] = useState<TenantListItem[]>([])
  const [links, setLinks] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    q: "",
    role: "",
    status: "",
    region: "",
  })

  const loadTenants = async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await listTenants(filters)
      setTenants(data)
      setFilteredTenants(data)

      // Load quick links for each tenant
      const linksMap: Record<string, Record<string, string>> = {}
      for (const tenant of data) {
        const tenantLinks = await quickLinks(tenant.id)
        linksMap[tenant.id] = tenantLinks
      }
      setLinks(linksMap)
    } catch (err) {
      console.error("[v0] Error loading tenants:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTenants()
  }, [])

  useEffect(() => {
    const applyFilters = async () => {
      const data = await listTenants(filters)
      setFilteredTenants(data)
    }
    applyFilters()
  }, [filters])

  const handleAccept = async (tenantId: string) => {
    const result = await acceptInvite(tenantId)
    if (result.ok) {
      toast.success("Invite accepted!")
      loadTenants()
    } else {
      toast.error(result.error || "Failed to accept invite")
    }
  }

  const handleDecline = async (tenantId: string) => {
    const result = await declineInvite(tenantId)
    if (result.ok) {
      toast.success("Invite declined")
      loadTenants()
    } else {
      toast.error(result.error || "Failed to decline invite")
    }
  }

  const handleAcceptAll = async () => {
    const invites = tenants.filter((t) => t.inviteStatus === "invited")
    for (const tenant of invites) {
      await acceptInvite(tenant.id)
    }
    toast.success("All invites accepted!")
    loadTenants()
  }

  const inviteCount = tenants.filter((t) => t.inviteStatus === "invited").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Tenants</h1>
          <p className="text-white/60">Manage and switch between your organizations</p>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Tenants</h1>
          <p className="text-white/60">Manage and switch between your organizations</p>
        </div>
        <ErrorState onRetry={loadTenants} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-balance text-3xl font-bold text-white">Your Tenants</h1>
        <p className="text-pretty text-white/60">Manage and switch between your organizations</p>
      </div>

      {/* Invite Banner */}
      {inviteCount > 0 && <InviteBanner count={inviteCount} onAcceptAll={handleAcceptAll} onDismiss={() => {}} />}

      {/* Toolbar */}
      <DirectoryToolbar
        onSearch={(q) => setFilters({ ...filters, q })}
        onFilterRole={(role) => setFilters({ ...filters, role: role === "all" ? "" : role })}
        onFilterStatus={(status) => setFilters({ ...filters, status: status === "all" ? "" : (status as any) })}
        onFilterRegion={(region) => setFilters({ ...filters, region: region === "all" ? "" : region })}
      />

      {/* Tenant Grid */}
      {filteredTenants.length === 0 ? (
        <EmptyState onCreateTenant={() => setCreateDialogOpen(true)} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              tenant={tenant}
              quickLinks={links[tenant.id]}
              onAccept={() => handleAccept(tenant.id)}
              onDecline={() => handleDecline(tenant.id)}
            />
          ))}
        </div>
      )}

      <CreateTenantDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
