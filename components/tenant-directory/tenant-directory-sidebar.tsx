"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Activity,
  Globe,
  Shield,
  RefreshCw,
  Plus,
  Search,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react"
import type { TenantListItem } from "@/app/(dashboard)/tenant/directory/actions"
import { CreateTenantDialog } from "./create-tenant-dialog"
import { RequestAccessDialog } from "./request-access-dialog"

interface TenantDirectorySidebarProps {
  tenants: TenantListItem[]
  onRefresh: () => void
}

export function TenantDirectorySidebar({ tenants, onRefresh }: TenantDirectorySidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [requestAccessOpen, setRequestAccessOpen] = useState(false)

  // Calculate stats
  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    invited: tenants.filter((t) => t.inviteStatus === "invited").length,
    regions: new Set(tenants.map((t) => t.region).filter(Boolean)).size,
  }

  // Get recent tenants
  const recentTenants = tenants.slice(0, 5)

  if (collapsed) {
    return (
      <div className="relative w-16 border-l border-white/10 bg-black/40 backdrop-blur-xl flex flex-col items-center py-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/60 hover:text-white"
          onClick={() => setCollapsed(false)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Separator className="bg-white/10" />
        <Building2 className="h-5 w-5 text-[#8B5CF6]" />
        <Activity className="h-5 w-5 text-white/40" />
        <Sparkles className="h-5 w-5 text-white/40" />
      </div>
    )
  }

  return (
    <>
      <div className="relative w-80 border-l border-white/10 bg-black/40 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#8B5CF6]" />
            <h2 className="font-semibold text-white">Directory</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white"
              onClick={() => setCollapsed(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Quick Stats */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Total Tenants</span>
                  <Badge variant="outline" className="border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]">
                    {stats.total}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Active</span>
                  <Badge variant="outline" className="border-[#D0FF00]/30 bg-[#D0FF00]/10 text-[#D0FF00]">
                    {stats.active}
                  </Badge>
                </div>
                {stats.invited > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Pending Invites</span>
                    <Badge variant="outline" className="border-[#F81CE5]/30 bg-[#F81CE5]/10 text-[#F81CE5]">
                      {stats.invited}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Regions</span>
                  <Badge variant="outline" className="border-white/20 bg-white/5 text-white">
                    {stats.regions}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/10 bg-linear-to-r from-[#4F46E5]/20 to-[#8B5CF6]/20 text-white hover:from-[#4F46E5]/30 hover:to-[#8B5CF6]/30"
                  size="sm"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tenant
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/10 bg-transparent text-white hover:bg-white/5"
                  size="sm"
                  onClick={() => setRequestAccessOpen(true)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Request Access
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-white/10 bg-transparent text-white hover:bg-white/5"
                  size="sm"
                  asChild
                >
                  <a href="/tenant/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Tenant Settings
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Tenants */}
            {recentTenants.length > 0 && (
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                    <Activity className="h-4 w-4" />
                    Recent Tenants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTenants.map((tenant, index) => (
                    <div key={tenant.id}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#4F46E5] to-[#8B5CF6]">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{tenant.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-white/20 bg-white/5 text-[10px] text-white/60">
                              {tenant.role}
                            </Badge>
                            {tenant.region && (
                              <span className="text-[10px] text-white/40 flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {tenant.region}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {index < recentTenants.length - 1 && <Separator className="mt-3 bg-white/10" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* AI Insights */}
            <Card className="border-[#8B5CF6]/30 bg-linear-to-br from-[#4F46E5]/10 to-[#8B5CF6]/10 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4 text-[#D0FF00]" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-xs text-white/60">
                  Smart recommendations for your tenants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/80">
                    You have {stats.invited} pending invitation{stats.invited !== 1 ? "s" : ""}. Accept them to access
                    more features.
                  </p>
                </div>
                {stats.total > 3 && (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-white/80">
                      Managing {stats.total} tenants across {stats.regions} region{stats.regions !== 1 ? "s" : ""}.
                      Consider consolidating for better efficiency.
                    </p>
                  </div>
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get More Insights
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-white">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Activity
                  </span>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tenants.slice(0, 3).map((tenant, index) => (
                  <div key={tenant.id}>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#D0FF00] mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm text-white">{tenant.name}</p>
                        <p className="text-xs text-white/60">{tenant.lastAction?.action || "No recent activity"}</p>
                      </div>
                    </div>
                    {index < 2 && <Separator className="mt-3 bg-white/10" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Analytics Preview */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Tenant Growth</span>
                    <span className="text-[#D0FF00]">+12%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-linear-to-r from-[#4F46E5] to-[#8B5CF6]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Active Users</span>
                    <span className="text-[#D0FF00]">+8%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div className="h-full w-2/3 rounded-full bg-linear-to-r from-[#6D28D9] to-[#A855F7]" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-white/60 hover:text-white" asChild>
                  <a href="/tenant/analytics">View Full Analytics →</a>
                </Button>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                  <Shield className="h-4 w-4 text-[#D0FF00]" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">All tenants secured</span>
                  <Badge variant="outline" className="border-[#D0FF00]/30 bg-[#D0FF00]/10 text-[#D0FF00]">
                    ✓
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">2FA Enabled</span>
                  <Badge variant="outline" className="border-[#D0FF00]/30 bg-[#D0FF00]/10 text-[#D0FF00]">
                    ✓
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Audit Logs</span>
                  <Badge variant="outline" className="border-[#D0FF00]/30 bg-[#D0FF00]/10 text-[#D0FF00]">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      <CreateTenantDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <RequestAccessDialog open={requestAccessOpen} onOpenChange={setRequestAccessOpen} />
    </>
  )
}
