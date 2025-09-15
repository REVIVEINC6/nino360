"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export interface Tenant {
  id: string
  name: string
  domain: string
  logo?: string
  status: "active" | "trial" | "suspended" | "inactive"
  plan: "starter" | "professional" | "enterprise"
  users: number
  revenue: number
  createdAt: string
  lastActive: string
  location: string
  modules: string[]
  health: number
  growth: number
  contact: {
    name: string
    email: string
    phone: string
  }
}

export interface TenantStats {
  total: number
  active: number
  trial: number
  suspended: number
  inactive: number
  totalRevenue: number
  totalUsers: number
}

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [stats, setStats] = useState<TenantStats>({
    total: 0,
    active: 0,
    trial: 0,
    suspended: 0,
    inactive: 0,
    totalRevenue: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate mock data
  const generateMockTenants = useCallback((): Tenant[] => {
    return [
      {
        id: "1",
        name: "Acme Corporation",
        domain: "acme.com",
        logo: "/placeholder.svg?height=32&width=32",
        status: "active",
        plan: "enterprise",
        users: 245,
        revenue: 2990,
        createdAt: "2024-01-15",
        lastActive: "2024-01-20",
        location: "New York, US",
        modules: ["CRM", "HRMS", "Finance"],
        health: 95,
        growth: 12,
        contact: {
          name: "John Smith",
          email: "john@acme.com",
          phone: "+1-555-0123",
        },
      },
      {
        id: "2",
        name: "TechStart Inc",
        domain: "techstart.io",
        logo: "/placeholder.svg?height=32&width=32",
        status: "trial",
        plan: "professional",
        users: 45,
        revenue: 990,
        createdAt: "2024-01-10",
        lastActive: "2024-01-19",
        location: "San Francisco, US",
        modules: ["CRM", "Talent"],
        health: 78,
        growth: 8,
        contact: {
          name: "Sarah Johnson",
          email: "sarah@techstart.io",
          phone: "+1-555-0456",
        },
      },
      {
        id: "3",
        name: "Global Solutions",
        domain: "globalsol.com",
        logo: "/placeholder.svg?height=32&width=32",
        status: "suspended",
        plan: "starter",
        users: 12,
        revenue: 290,
        createdAt: "2024-01-05",
        lastActive: "2024-01-18",
        location: "London, UK",
        modules: ["CRM"],
        health: 45,
        growth: -5,
        contact: {
          name: "Michael Brown",
          email: "michael@globalsol.com",
          phone: "+44-20-7946-0958",
        },
      },
    ]
  }, [])

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockTenants = generateMockTenants()
      setTenants(mockTenants)

      // Calculate stats
      const newStats: TenantStats = {
        total: mockTenants.length,
        active: mockTenants.filter((t) => t.status === "active").length,
        trial: mockTenants.filter((t) => t.status === "trial").length,
        suspended: mockTenants.filter((t) => t.status === "suspended").length,
        inactive: mockTenants.filter((t) => t.status === "inactive").length,
        totalRevenue: mockTenants.reduce((sum, t) => sum + (t.revenue || 0), 0),
        totalUsers: mockTenants.reduce((sum, t) => sum + (t.users || 0), 0),
      }
      setStats(newStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tenants")
      toast.error("Failed to load tenants")
    } finally {
      setLoading(false)
    }
  }, [generateMockTenants])

  const createTenant = useCallback(async (tenantData: Partial<Tenant>) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newTenant: Tenant = {
        id: Date.now().toString(),
        name: tenantData.name || "",
        domain: tenantData.domain || "",
        status: "trial",
        plan: "starter",
        users: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        location: tenantData.location || "Unknown",
        modules: [],
        health: 100,
        growth: 0,
        contact: tenantData.contact || { name: "", email: "", phone: "" },
        ...tenantData,
      }

      setTenants((prev) => [newTenant, ...prev])
      toast.success("Tenant created successfully")
      return newTenant
    } catch (err) {
      toast.error("Failed to create tenant")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTenant = useCallback(async (id: string, updates: Partial<Tenant>) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTenants((prev) => prev.map((tenant) => (tenant.id === id ? { ...tenant, ...updates } : tenant)))
      toast.success("Tenant updated successfully")
    } catch (err) {
      toast.error("Failed to update tenant")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTenant = useCallback(async (id: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTenants((prev) => prev.filter((tenant) => tenant.id !== id))
      toast.success("Tenant deleted successfully")
    } catch (err) {
      toast.error("Failed to delete tenant")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const bulkAction = useCallback(async (tenantIds: string[], action: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTenants(
        (prev) =>
          prev
            .map((tenant) => {
              if (tenantIds.includes(tenant.id)) {
                switch (action) {
                  case "activate":
                    return { ...tenant, status: "active" as const }
                  case "suspend":
                    return { ...tenant, status: "suspended" as const }
                  case "delete":
                    return null
                  default:
                    return tenant
                }
              }
              return tenant
            })
            .filter(Boolean) as Tenant[],
      )

      toast.success(`Bulk action ${action} completed for ${tenantIds.length} tenants`)
    } catch (err) {
      toast.error("Failed to perform bulk action")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const exportTenants = useCallback(
    async (format: "csv" | "xlsx" = "csv") => {
      try {
        // Simulate export
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const data = tenants.map((tenant) => ({
          Name: tenant.name,
          Domain: tenant.domain,
          Status: tenant.status,
          Plan: tenant.plan,
          Users: tenant.users,
          Revenue: tenant.revenue,
          Location: tenant.location,
          "Created At": tenant.createdAt,
          "Last Active": tenant.lastActive,
        }))

        // Create and download file
        const headers = Object.keys(data[0] || {}).join(",")
        const rows = data.map((row) => Object.values(row).join(",")).join("\n")
        const csv = `${headers}\n${rows}`

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `tenants-export-${new Date().toISOString().split("T")[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success(`Tenants exported as ${format.toUpperCase()}`)
      } catch (err) {
        toast.error("Failed to export tenants")
        throw err
      }
    },
    [tenants],
  )

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  return {
    tenants,
    stats,
    loading,
    error,
    refetch: fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    bulkAction,
    exportTenants,
  }
}
