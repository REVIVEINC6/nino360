"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Building2, Users, CheckCircle, XCircle } from "lucide-react"
import type { Module } from "@/lib/types/modules"
import { toast } from "sonner"

interface Tenant {
  id: string
  name: string
  plan: "free" | "pro" | "enterprise"
  status: "active" | "inactive" | "suspended"
  userCount: number
  hasAccess: boolean
  lastActive: Date
}

interface TenantAssignmentModalProps {
  module: Module | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock tenant data
const mockTenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "Acme Corporation",
    plan: "enterprise",
    status: "active",
    userCount: 150,
    hasAccess: true,
    lastActive: new Date("2024-01-20"),
  },
  {
    id: "tenant-2",
    name: "TechStart Inc",
    plan: "pro",
    status: "active",
    userCount: 45,
    hasAccess: false,
    lastActive: new Date("2024-01-19"),
  },
  {
    id: "tenant-3",
    name: "Global Solutions Ltd",
    plan: "enterprise",
    status: "active",
    userCount: 320,
    hasAccess: true,
    lastActive: new Date("2024-01-21"),
  },
  {
    id: "tenant-4",
    name: "StartupCo",
    plan: "free",
    status: "active",
    userCount: 12,
    hasAccess: false,
    lastActive: new Date("2024-01-18"),
  },
  {
    id: "tenant-5",
    name: "Enterprise Corp",
    plan: "enterprise",
    status: "inactive",
    userCount: 200,
    hasAccess: false,
    lastActive: new Date("2024-01-10"),
  },
]

export function TenantAssignmentModal({ module, open, onOpenChange }: TenantAssignmentModalProps) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedTenants, setSelectedTenants] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setTenants(mockTenants)
        setSelectedTenants(mockTenants.filter((t) => t.hasAccess).map((t) => t.id))
        setLoading(false)
      }, 500)
    }
  }, [open])

  const filteredTenants = tenants.filter((tenant) => tenant.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleTenantToggle = (tenantId: string, checked: boolean) => {
    if (checked) {
      setSelectedTenants((prev) => [...prev, tenantId])
    } else {
      setSelectedTenants((prev) => prev.filter((id) => id !== tenantId))
    }
  }

  const handleSelectAll = () => {
    const eligibleTenants = filteredTenants.filter((tenant) => canAccessModule(tenant, module))
    setSelectedTenants(eligibleTenants.map((t) => t.id))
  }

  const handleDeselectAll = () => {
    setSelectedTenants([])
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // Simulate API call to update tenant assignments
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setTenants((prev) =>
        prev.map((tenant) => ({
          ...tenant,
          hasAccess: selectedTenants.includes(tenant.id),
        })),
      )

      toast.success(`Module access updated for ${selectedTenants.length} tenants`)
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update tenant assignments")
    } finally {
      setLoading(false)
    }
  }

  const canAccessModule = (tenant: Tenant, module: Module | null) => {
    if (!module) return false

    // Free tier modules can be accessed by all
    if (module.tier === "free") return true

    // Pro modules require pro or enterprise plan
    if (module.tier === "pro") return ["pro", "enterprise"].includes(tenant.plan)

    // Enterprise modules require enterprise plan
    if (module.tier === "enterprise") return tenant.plan === "enterprise"

    return true
  }

  const getPlanBadge = (plan: Tenant["plan"]) => {
    const variants = {
      free: { variant: "outline" as const, label: "Free" },
      pro: { variant: "default" as const, label: "Pro" },
      enterprise: { variant: "secondary" as const, label: "Enterprise" },
    }

    const config = variants[plan]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusIcon = (status: Tenant["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  if (!module) return null

  const eligibleTenants = filteredTenants.filter((tenant) => canAccessModule(tenant, module))
  const ineligibleTenants = filteredTenants.filter((tenant) => !canAccessModule(tenant, module))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Assign Tenants - {module.name}</DialogTitle>
          <DialogDescription>
            Manage which tenants have access to this module. Only tenants with compatible plans can be assigned.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedTenants.length} of {eligibleTenants.length} eligible tenants selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All Eligible
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>
          </div>

          {/* Tenant List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {/* Eligible Tenants */}
              {eligibleTenants.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Eligible Tenants ({eligibleTenants.length})
                    </CardTitle>
                    <CardDescription>Tenants that can access this {module.tier} tier module</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {eligibleTenants.map((tenant) => (
                      <div key={tenant.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={selectedTenants.includes(tenant.id)}
                          onCheckedChange={(checked) => handleTenantToggle(tenant.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{tenant.name}</span>
                            {getPlanBadge(tenant.plan)}
                            {getStatusIcon(tenant.status)}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {tenant.userCount} users
                            </span>
                            <span>Last active: {tenant.lastActive.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Ineligible Tenants */}
              {ineligibleTenants.length > 0 && (
                <Card className="opacity-60">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Ineligible Tenants ({ineligibleTenants.length})
                    </CardTitle>
                    <CardDescription>Tenants that cannot access this {module.tier} tier module</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ineligibleTenants.map((tenant) => (
                      <div key={tenant.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/50">
                        <Checkbox disabled />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{tenant.name}</span>
                            {getPlanBadge(tenant.plan)}
                            {getStatusIcon(tenant.status)}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {tenant.userCount} users
                            </span>
                            <span className="text-red-600">Requires {module.tier} plan</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
