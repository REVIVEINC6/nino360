"use client"

import { useEffect, useState } from "react"
import { listTenants, acceptInvite, declineInvite, quickLinks, type TenantListItem } from "./actions"
import { DirectoryToolbar } from "@/components/tenant-directory/directory-toolbar"
import { TenantCard } from "@/components/tenant-directory/tenant-card"
import { InviteBanner } from "@/components/tenant-directory/invite-banner"
import { EmptyState } from "@/components/tenant-directory/empty-state"
import { ErrorState } from "@/components/tenant-directory/error-state"
import { LoadingSkeleton } from "@/components/tenant-directory/loading-skeleton"
import { TenantDirectorySidebar } from "@/components/tenant-directory/tenant-directory-sidebar"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function TenantDirectoryPage() {
  const [tenants, setTenants] = useState<TenantListItem[]>([])
  const [filteredTenants, setFilteredTenants] = useState<TenantListItem[]>([])
  const [links, setLinks] = useState<Record<string, Record<string, string>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
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
      <div className="flex min-h-screen">
        <div className="flex-1 space-y-6 p-8">
          <div>
            <h1 className="text-balance text-3xl font-bold text-white">Your Tenants</h1>
            <p className="text-pretty text-white/60">Manage and switch between your organizations</p>
          </div>
          <LoadingSkeleton />
        </div>
        <TenantDirectorySidebar tenants={[]} onRefresh={loadTenants} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 space-y-6 p-8">
          <div>
            <h1 className="text-balance text-3xl font-bold text-white">Your Tenants</h1>
            <p className="text-pretty text-white/60">Manage and switch between your organizations</p>
          </div>
          <ErrorState onRetry={loadTenants} />
        </div>
        <TenantDirectorySidebar tenants={[]} onRefresh={loadTenants} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 space-y-6 p-8">
        {/* Header with particle effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-r from-[#4F46E5]/10 via-[#8B5CF6]/10 to-[#A855F7]/10 blur-3xl" />
          <h1 className="text-balance text-3xl font-bold text-white">Your Tenants</h1>
          <p className="text-pretty text-white/60">Manage and switch between your organizations</p>
        </motion.div>

        {/* Invite Banner */}
        {inviteCount > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <InviteBanner count={inviteCount} onAcceptAll={handleAcceptAll} onDismiss={() => {}} />
          </motion.div>
        )}

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <DirectoryToolbar
            onSearch={(q) => setFilters({ ...filters, q })}
            onFilterRole={(role) => setFilters({ ...filters, role: role === "all" ? "" : role })}
            onFilterStatus={(status) => setFilters({ ...filters, status: status === "all" ? "" : (status as any) })}
            onFilterRegion={(region) => setFilters({ ...filters, region: region === "all" ? "" : region })}
          />
        </motion.div>

        {/* Tenant Grid */}
        {filteredTenants.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <EmptyState onCreateTenant={() => {}} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTenants.map((tenant, index) => (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <TenantCard
                  tenant={tenant}
                  quickLinks={links[tenant.id]}
                  onAccept={() => handleAccept(tenant.id)}
                  onDecline={() => handleDecline(tenant.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Right Sidebar */}
      <TenantDirectorySidebar tenants={filteredTenants} onRefresh={loadTenants} />
    </div>
  )
}
