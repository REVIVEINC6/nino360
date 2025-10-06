"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { Module, ModuleUsageAnalytics, AIInsight } from "@/lib/types/modules"

// Mock data for development
const mockModules: Module[] = [
  {
    id: "crm-core",
    name: "CRM Core",
    description: "Customer relationship management with lead tracking and pipeline management",
    icon: "Users",
    status: "live",
    tier: "free",
    version: "2.1.0",
    category: "Sales",
    activeTenants: 847,
    totalTenants: 1200,
    usageScore: 85,
    lastUpdated: new Date("2024-01-15"),
    createdAt: new Date("2023-06-01"),
    features: ["Lead Management", "Pipeline Tracking", "Contact Management", "Activity Logging"],
    dependencies: [],
      metadata: {
      developer: "Nino360 Team",
      supportUrl: "https://support.nino360.com/crm",
      documentationUrl: "https://docs.nino360.com/crm",
    },
  },
  {
    id: "talent-ats",
    name: "Talent ATS",
    description: "Applicant tracking system with AI-powered candidate matching",
    icon: "UserCheck",
    status: "live",
    tier: "pro",
    version: "1.8.2",
    category: "HR",
    activeTenants: 523,
    totalTenants: 800,
    usageScore: 92,
    lastUpdated: new Date("2024-01-10"),
    createdAt: new Date("2023-08-15"),
    features: ["Job Posting", "Candidate Screening", "Interview Scheduling", "AI Matching"],
    dependencies: ["crm-core"],
    pricing: {
      monthly: 49,
      yearly: 490,
    },
    metadata: {
      developer: "Nino360 Team",
      supportUrl: "https://support.nino360.com/talent",
      documentationUrl: "https://docs.nino360.com/talent",
    },
  },
  {
    id: "finance-pro",
    name: "Finance Pro",
    description: "Advanced financial management with reporting and analytics",
    icon: "DollarSign",
    status: "beta",
    tier: "enterprise",
    version: "0.9.1",
    category: "Finance",
    activeTenants: 156,
    totalTenants: 300,
    usageScore: 78,
    lastUpdated: new Date("2024-01-20"),
    createdAt: new Date("2023-11-01"),
    features: ["Financial Reporting", "Budget Management", "Expense Tracking", "Tax Compliance"],
    dependencies: ["crm-core"],
    pricing: {
      monthly: 199,
      yearly: 1990,
    },
    metadata: {
      developer: "Nino360 Team",
      supportUrl: "https://support.nino360.com/finance",
      documentationUrl: "https://docs.nino360.com/finance",
    },
  },
  {
    id: "ai-insights",
    name: "AI Insights",
    description: "Machine learning powered business intelligence and predictive analytics",
    icon: "Brain",
    status: "coming-soon",
    tier: "enterprise",
    version: "0.1.0",
    category: "Analytics",
    activeTenants: 0,
    totalTenants: 0,
    usageScore: 0,
    lastUpdated: new Date("2024-01-25"),
    createdAt: new Date("2024-01-01"),
    features: ["Predictive Analytics", "Custom Dashboards", "Data Mining", "ML Models"],
    dependencies: ["crm-core", "talent-ats"],
    pricing: {
      monthly: 299,
      yearly: 2990,
    },
    metadata: {
      developer: "Nino360 AI Team",
      supportUrl: "https://support.nino360.com/ai",
      documentationUrl: "https://docs.nino360.com/ai",
    },
  },
]

const mockAIInsights: AIInsight[] = [
  {
    id: "insight-1",
    type: "churn-risk",
    moduleId: "finance-pro",
    title: "Finance Pro showing low engagement",
    description:
      "70% of Finance Pro users haven't logged in for 30+ days. Consider feature improvements or user training.",
    confidence: 0.85,
    actionable: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "insight-2",
    type: "upgrade-opportunity",
    tenantId: "tenant-123",
    title: "Tenant ready for CRM Pro upgrade",
    description: "Acme Corp is hitting Free tier limits consistently. High conversion probability for Pro upgrade.",
    confidence: 0.92,
    actionable: true,
    createdAt: new Date("2024-01-19"),
  },
]

export function useModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Load modules
  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setModules(mockModules)
      } catch (error) {
        toast.error("Failed to load modules")
        console.error("Error loading modules:", error)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

  // Filter modules
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || module.status === statusFilter
    const matchesTier = tierFilter === "all" || module.tier === tierFilter
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter

    return matchesSearch && matchesStatus && matchesTier && matchesCategory
  })

  // Create module
  const createModule = async (moduleData: Partial<Module>) => {
    try {
      const newModule: Module = {
        id: `module-${Date.now()}`,
        name: moduleData.name || "",
        description: moduleData.description || "",
        icon: moduleData.icon || "Package",
        status: moduleData.status || "beta",
        tier: moduleData.tier || "free",
        version: "1.0.0",
        category: moduleData.category || "General",
        activeTenants: 0,
        totalTenants: 0,
        usageScore: 0,
        lastUpdated: new Date(),
        createdAt: new Date(),
        features: moduleData.features || [],
        dependencies: moduleData.dependencies || [],
        pricing: moduleData.pricing,
        metadata: moduleData.metadata || {
          developer: "Nino360 Team",
          supportUrl: "",
          documentationUrl: "",
        },
      }

      setModules((prev) => [...prev, newModule])
      toast.success("Module created successfully")
      return newModule
    } catch (error) {
      toast.error("Failed to create module")
      throw error
    }
  }

  // Update module
  const updateModule = async (moduleId: string, updates: Partial<Module>) => {
    try {
      setModules((prev) =>
        prev.map((module) => (module.id === moduleId ? { ...module, ...updates, lastUpdated: new Date() } : module)),
      )
      toast.success("Module updated successfully")
    } catch (error) {
      toast.error("Failed to update module")
      throw error
    }
  }

  // Delete module
  const deleteModule = async (moduleId: string) => {
    try {
      setModules((prev) => prev.filter((module) => module.id !== moduleId))
      toast.success("Module deleted successfully")
    } catch (error) {
      toast.error("Failed to delete module")
      throw error
    }
  }

  // Toggle module status
  const toggleModuleStatus = async (moduleId: string, enabled: boolean) => {
    try {
      const newStatus = enabled ? "live" : "deprecated"
      await updateModule(moduleId, { status: newStatus })
    } catch (error) {
      toast.error("Failed to toggle module status")
      throw error
    }
  }

  // Bulk actions
  const bulkAction = async (moduleIds: string[], action: string) => {
    try {
      switch (action) {
        case "enable":
          for (const id of moduleIds) {
            await updateModule(id, { status: "live" })
          }
          break
        case "disable":
          for (const id of moduleIds) {
            await updateModule(id, { status: "deprecated" })
          }
          break
        case "delete":
          for (const id of moduleIds) {
            await deleteModule(id)
          }
          break
      }
      toast.success(`Bulk action completed for ${moduleIds.length} modules`)
    } catch (error) {
      toast.error("Bulk action failed")
      throw error
    }
  }

  // Export modules
  const exportModules = async (format: "csv" | "json" = "csv") => {
    try {
      const data = format === "json" ? JSON.stringify(filteredModules, null, 2) : convertToCSV(filteredModules)

      const blob = new Blob([data], {
        type: format === "json" ? "application/json" : "text/csv",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `modules-export.${format}`
      a.click()
      URL.revokeObjectURL(url)

      toast.success("Modules exported successfully")
    } catch (error) {
      toast.error("Failed to export modules")
      throw error
    }
  }

  const convertToCSV = (data: Module[]) => {
    const headers = ["ID", "Name", "Description", "Status", "Tier", "Version", "Active Tenants", "Usage Score"]
    const rows = data.map((module) => [
      module.id,
      module.name,
      module.description,
      module.status,
      module.tier,
      module.version,
      module.activeTenants.toString(),
      module.usageScore.toString(),
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  return {
    modules: filteredModules,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    tierFilter,
    setTierFilter,
    categoryFilter,
    setCategoryFilter,
    createModule,
    updateModule,
    deleteModule,
    toggleModuleStatus,
    bulkAction,
    exportModules,
    totalModules: modules.length,
    activeModules: modules.filter((m) => m.status === "live").length,
    betaModules: modules.filter((m) => m.status === "beta").length,
  }
}

export function useModuleAnalytics(moduleId?: string) {
  const [analytics, setAnalytics] = useState<ModuleUsageAnalytics[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setInsights(mockAIInsights)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [moduleId])

  return {
    analytics,
    insights,
    loading,
  }
}
