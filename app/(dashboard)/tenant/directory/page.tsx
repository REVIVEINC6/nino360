import { listTenants, quickLinks } from "./actions"
import { DirectoryToolbar } from "@/components/tenant-directory/directory-toolbar"
import { TenantCard } from "@/components/tenant-directory/tenant-card"
import { InviteBanner } from "@/components/tenant-directory/invite-banner"
import { EmptyState } from "@/components/tenant-directory/empty-state"
import { TenantDirectorySidebar } from "@/components/tenant-directory/tenant-directory-sidebar"

export default async function TenantDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string; region?: string }>
}) {
  const params = await searchParams
  const filters = {
    q: params.q,
    role: params.role,
    status: params.status as "active" | "invited" | undefined,
    region: params.region,
  }

  // Fetch tenants server-side
  const tenants = await listTenants(filters)

  // Load quick links for each tenant
  const linksMap: Record<string, Record<string, string>> = {}
  for (const tenant of tenants) {
    const tenantLinks = await quickLinks(tenant.id)
    linksMap[tenant.id] = tenantLinks
  }

  const inviteCount = tenants.filter((t) => t.inviteStatus === "invited").length


  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 space-y-6 p-8">
        {/* Header with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 h-full w-full bg-linear-to-r from-[#4F46E5]/10 via-[#8B5CF6]/10 to-[#A855F7]/10 blur-3xl" />
          <h1 className="text-balance text-3xl font-bold text-white">Your Tenants</h1>
          <p className="text-pretty text-white/60">Manage and switch between your organizations</p>
        </div>

        {/* Invite Banner */}
        {inviteCount > 0 && (
          <div>
            <InviteBanner count={inviteCount} />
          </div>
        )}

        {/* Toolbar */}
        <div>
          <DirectoryToolbar />
        </div>

        {/* Tenant Grid */}
        {tenants.length === 0 ? (
          <div>
            <EmptyState />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <div key={tenant.id}>
                <TenantCard tenant={tenant} quickLinks={linksMap[tenant.id]} />
              </div>
            ))}
          </div>
        )}
      </div>

    {/* Right Sidebar */}
  <TenantDirectorySidebar tenants={tenants} />
    </div>
  )
}
