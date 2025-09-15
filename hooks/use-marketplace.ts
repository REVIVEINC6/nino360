"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type {
  MarketplaceItem,
  MarketplacePromotion,
  AIMarketplaceInsight,
  MarketplaceFilters,
} from "@/lib/types/marketplace"

// Mock data for development
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "ai-recruiter-pro",
    name: "AI Recruiter Pro",
    description: "Advanced AI-powered recruitment assistant with candidate matching and interview scheduling",
    category: "ai",
    type: "ai-pack",
    version: "2.1.0",
    status: "active",
    visibility: "public",
    pricing: {
      model: "subscription",
      amount: 99,
      currency: "USD",
      billingCycle: "monthly",
      freeTrialDays: 14,
    },
    features: ["AI Candidate Matching", "Automated Screening", "Interview Scheduling", "Bias Detection"],
    requirements: ["Talent Module", "HRMS Core"],
    compatibility: ["v2.0+"],
    developer: {
      name: "ESG OS AI Team",
      email: "ai-team@esgos.com",
      website: "https://ai.esgos.com",
    },
    media: {
      icon: "Brain",
      screenshots: ["/images/ai-recruiter-1.png", "/images/ai-recruiter-2.png"],
      video: "https://demo.esgos.com/ai-recruiter.mp4",
    },
    stats: {
      totalInstalls: 1247,
      activeInstalls: 892,
      avgRating: 4.8,
      totalReviews: 156,
      monthlyUsage: 15420,
      revenue: 88308,
    },
    metadata: {
      tags: ["AI", "Recruitment", "Automation", "Machine Learning"],
      supportUrl: "https://support.esgos.com/ai-recruiter",
      documentationUrl: "https://docs.esgos.com/ai-recruiter",
      changelogUrl: "https://changelog.esgos.com/ai-recruiter",
    },
    tenantRestrictions: {
      planTiers: ["pro", "enterprise"],
      excludedTenants: [],
      includedTenants: [],
    },
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2024-01-20"),
    publishedAt: new Date("2023-09-01"),
    createdBy: "admin-001",
    updatedBy: "admin-001",
  },
  {
    id: "salesforce-sync",
    name: "Salesforce Integration",
    description: "Bi-directional sync with Salesforce CRM for leads, contacts, and opportunities",
    category: "integration",
    type: "integration",
    version: "1.5.2",
    status: "active",
    visibility: "public",
    pricing: {
      model: "subscription",
      amount: 49,
      currency: "USD",
      billingCycle: "monthly",
    },
    features: ["Real-time Sync", "Custom Field Mapping", "Bulk Operations", "Conflict Resolution"],
    requirements: ["CRM Core"],
    compatibility: ["Salesforce API v54+"],
    developer: {
      name: "ESG OS Integrations",
      email: "integrations@esgos.com",
    },
    media: {
      icon: "Zap",
      screenshots: ["/images/salesforce-sync-1.png"],
    },
    stats: {
      totalInstalls: 634,
      activeInstalls: 521,
      avgRating: 4.6,
      totalReviews: 89,
      monthlyUsage: 8750,
      revenue: 25529,
    },
    metadata: {
      tags: ["Integration", "Salesforce", "CRM", "Sync"],
      supportUrl: "https://support.esgos.com/salesforce",
      documentationUrl: "https://docs.esgos.com/salesforce",
    },
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2024-01-15"),
    publishedAt: new Date("2023-07-01"),
    createdBy: "admin-002",
    updatedBy: "admin-002",
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics Suite",
    description: "Comprehensive business intelligence with custom dashboards and predictive analytics",
    category: "analytics",
    type: "module",
    version: "3.0.1",
    status: "active",
    visibility: "public",
    pricing: {
      model: "subscription",
      amount: 199,
      currency: "USD",
      billingCycle: "monthly",
      freeTrialDays: 30,
    },
    features: ["Custom Dashboards", "Predictive Analytics", "Data Mining", "Export Tools"],
    requirements: ["Platform Core"],
    compatibility: ["v2.0+"],
    developer: {
      name: "ESG OS Analytics Team",
      email: "analytics@esgos.com",
    },
    media: {
      icon: "BarChart3",
      screenshots: ["/images/analytics-1.png", "/images/analytics-2.png", "/images/analytics-3.png"],
    },
    stats: {
      totalInstalls: 423,
      activeInstalls: 387,
      avgRating: 4.9,
      totalReviews: 67,
      monthlyUsage: 12340,
      revenue: 77013,
    },
    metadata: {
      tags: ["Analytics", "BI", "Dashboards", "Reporting"],
      supportUrl: "https://support.esgos.com/analytics",
      documentationUrl: "https://docs.esgos.com/analytics",
    },
    tenantRestrictions: {
      planTiers: ["enterprise"],
      excludedTenants: [],
      includedTenants: [],
    },
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2024-01-18"),
    publishedAt: new Date("2023-11-01"),
    createdBy: "admin-003",
    updatedBy: "admin-003",
  },
]

const mockPromotions: MarketplacePromotion[] = [
  {
    id: "promo-1",
    itemId: "ai-recruiter-pro",
    name: "New Year Special",
    description: "50% off first 3 months for AI Recruiter Pro",
    type: "discount",
    value: 50,
    valueType: "percentage",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    maxUses: 100,
    currentUses: 23,
    active: true,
    createdAt: new Date("2023-12-15"),
    createdBy: "admin-001",
  },
]

const mockInsights: AIMarketplaceInsight[] = [
  {
    id: "insight-1",
    type: "forecast",
    itemId: "ai-recruiter-pro",
    title: "AI Recruiter Pro Growth Forecast",
    description: "Based on current trends, AI Recruiter Pro is expected to see 40% growth in Q2",
    recommendation: "Consider increasing marketing budget and preparing for scale",
    confidence: 0.87,
    impact: "high",
    category: "Growth",
    data: { projectedGrowth: 0.4, timeframe: "Q2 2024" },
    actionable: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "insight-2",
    type: "pricing",
    title: "Pricing Optimization Opportunity",
    description: "Analytics Suite could increase revenue by 25% with tiered pricing model",
    recommendation: "Implement Basic ($99), Pro ($199), Enterprise ($399) tiers",
    confidence: 0.92,
    impact: "high",
    category: "Revenue",
    data: { potentialIncrease: 0.25, suggestedTiers: 3 },
    actionable: true,
    createdAt: new Date("2024-01-19"),
  },
]

export function useMarketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [promotions, setPromotions] = useState<MarketplacePromotion[]>([])
  const [insights, setInsights] = useState<AIMarketplaceInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<MarketplaceFilters>({
    search: "",
    category: "all",
    type: "all",
    status: "all",
    visibility: "all",
    pricing: "all",
    developer: "all",
    sortBy: "name",
    sortOrder: "asc",
  })

  // Load marketplace data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setItems(mockMarketplaceItems)
        setPromotions(mockPromotions)
        setInsights(mockInsights)
      } catch (error) {
        toast.error("Failed to load marketplace data")
        console.error("Error loading marketplace:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter and sort items
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCategory = filters.category === "all" || item.category === filters.category
      const matchesType = filters.type === "all" || item.type === filters.type
      const matchesStatus = filters.status === "all" || item.status === filters.status
      const matchesVisibility = filters.visibility === "all" || item.visibility === filters.visibility
      const matchesPricing =
        filters.pricing === "all" ||
        (filters.pricing === "free" && item.pricing.model === "free") ||
        (filters.pricing === "paid" && item.pricing.model !== "free")

      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesVisibility && matchesPricing
    })
    .sort((a, b) => {
      const order = filters.sortOrder === "asc" ? 1 : -1
      switch (filters.sortBy) {
        case "installs":
          return (a.stats.totalInstalls - b.stats.totalInstalls) * order
        case "revenue":
          return (a.stats.revenue - b.stats.revenue) * order
        case "rating":
          return (a.stats.avgRating - b.stats.avgRating) * order
        case "updated":
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * order
        default:
          return a.name.localeCompare(b.name) * order
      }
    })

  // CRUD operations
  const createItem = async (itemData: Partial<MarketplaceItem>) => {
    try {
      const newItem: MarketplaceItem = {
        id: `item-${Date.now()}`,
        name: itemData.name || "",
        description: itemData.description || "",
        category: itemData.category || "integration",
        type: itemData.type || "module",
        version: "1.0.0",
        status: "inactive",
        visibility: "private",
        pricing: itemData.pricing || { model: "free" },
        features: itemData.features || [],
        requirements: itemData.requirements || [],
        compatibility: itemData.compatibility || [],
        developer: itemData.developer || { name: "ESG OS Team", email: "team@esgos.com" },
        media: itemData.media || { icon: "Package", screenshots: [] },
        stats: {
          totalInstalls: 0,
          activeInstalls: 0,
          avgRating: 0,
          totalReviews: 0,
          monthlyUsage: 0,
          revenue: 0,
        },
        metadata: itemData.metadata || { tags: [] },
        tenantRestrictions: itemData.tenantRestrictions,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "current-admin",
        updatedBy: "current-admin",
      }

      setItems((prev) => [...prev, newItem])
      toast.success("Marketplace item created successfully")
      return newItem
    } catch (error) {
      toast.error("Failed to create marketplace item")
      throw error
    }
  }

  const updateItem = async (itemId: string, updates: Partial<MarketplaceItem>) => {
    try {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, ...updates, updatedAt: new Date(), updatedBy: "current-admin" } : item,
        ),
      )
      toast.success("Marketplace item updated successfully")
    } catch (error) {
      toast.error("Failed to update marketplace item")
      throw error
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      setItems((prev) => prev.filter((item) => item.id !== itemId))
      toast.success("Marketplace item deleted successfully")
    } catch (error) {
      toast.error("Failed to delete marketplace item")
      throw error
    }
  }

  const publishItem = async (itemId: string) => {
    try {
      await updateItem(itemId, {
        status: "active",
        visibility: "public",
        publishedAt: new Date(),
      })
      toast.success("Item published successfully")
    } catch (error) {
      toast.error("Failed to publish item")
      throw error
    }
  }

  const unpublishItem = async (itemId: string) => {
    try {
      await updateItem(itemId, {
        status: "inactive",
        visibility: "private",
      })
      toast.success("Item unpublished successfully")
    } catch (error) {
      toast.error("Failed to unpublish item")
      throw error
    }
  }

  // Promotion management
  const createPromotion = async (promoData: Partial<MarketplacePromotion>) => {
    try {
      const newPromo: MarketplacePromotion = {
        id: `promo-${Date.now()}`,
        itemId: promoData.itemId || "",
        name: promoData.name || "",
        description: promoData.description || "",
        type: promoData.type || "discount",
        value: promoData.value || 0,
        valueType: promoData.valueType || "percentage",
        startDate: promoData.startDate || new Date(),
        endDate: promoData.endDate || new Date(),
        maxUses: promoData.maxUses,
        currentUses: 0,
        targetTenants: promoData.targetTenants,
        conditions: promoData.conditions,
        active: true,
        createdAt: new Date(),
        createdBy: "current-admin",
      }

      setPromotions((prev) => [...prev, newPromo])
      toast.success("Promotion created successfully")
      return newPromo
    } catch (error) {
      toast.error("Failed to create promotion")
      throw error
    }
  }

  // Bulk operations
  const bulkAction = async (itemIds: string[], action: string) => {
    try {
      switch (action) {
        case "publish":
          for (const id of itemIds) {
            await publishItem(id)
          }
          break
        case "unpublish":
          for (const id of itemIds) {
            await unpublishItem(id)
          }
          break
        case "delete":
          for (const id of itemIds) {
            await deleteItem(id)
          }
          break
      }
      toast.success(`Bulk action completed for ${itemIds.length} items`)
    } catch (error) {
      toast.error("Bulk action failed")
      throw error
    }
  }

  // Export functionality
  const exportData = async (format: "csv" | "json" = "csv") => {
    try {
      const data = format === "json" ? JSON.stringify(filteredItems, null, 2) : convertToCSV(filteredItems)

      const blob = new Blob([data], {
        type: format === "json" ? "application/json" : "text/csv",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `marketplace-export.${format}`
      a.click()
      URL.revokeObjectURL(url)

      toast.success("Data exported successfully")
    } catch (error) {
      toast.error("Failed to export data")
      throw error
    }
  }

  const convertToCSV = (data: MarketplaceItem[]) => {
    const headers = ["ID", "Name", "Category", "Type", "Status", "Installs", "Revenue", "Rating"]
    const rows = data.map((item) => [
      item.id,
      item.name,
      item.category,
      item.type,
      item.status,
      item.stats.totalInstalls.toString(),
      item.stats.revenue.toString(),
      item.stats.avgRating.toString(),
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  return {
    items: filteredItems,
    promotions,
    insights,
    loading,
    filters,
    setFilters,
    createItem,
    updateItem,
    deleteItem,
    publishItem,
    unpublishItem,
    createPromotion,
    bulkAction,
    exportData,
    totalItems: items.length,
    activeItems: items.filter((i) => i.status === "active").length,
    totalRevenue: items.reduce((sum, item) => sum + item.stats.revenue, 0),
    totalInstalls: items.reduce((sum, item) => sum + item.stats.totalInstalls, 0),
  }
}
