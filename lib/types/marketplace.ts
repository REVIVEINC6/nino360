export interface MarketplaceItem {
  id: string
  name: string
  description: string
  category: "ai" | "integration" | "analytics" | "automation" | "crm" | "hrms" | "finance"
  type: "module" | "ai-pack" | "add-on" | "integration"
  version: string
  status: "active" | "inactive" | "deprecated" | "coming-soon"
  visibility: "public" | "private" | "tenant-specific"
  pricing: {
    model: "free" | "one-time" | "subscription" | "usage-based"
    amount?: number
    currency?: string
    billingCycle?: "monthly" | "yearly"
    freeTrialDays?: number
  }
  features: string[]
  requirements: string[]
  compatibility: string[]
  developer: {
    name: string
    email: string
    website?: string
  }
  media: {
    icon: string
    screenshots: string[]
    video?: string
  }
  stats: {
    totalInstalls: number
    activeInstalls: number
    avgRating: number
    totalReviews: number
    monthlyUsage: number
    revenue: number
  }
  metadata: {
    tags: string[]
    supportUrl?: string
    documentationUrl?: string
    changelogUrl?: string
  }
  tenantRestrictions?: {
    planTiers: string[]
    excludedTenants: string[]
    includedTenants: string[]
  }
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  createdBy: string
  updatedBy: string
}

export interface MarketplacePromotion {
  id: string
  itemId: string
  name: string
  description: string
  type: "discount" | "free-trial" | "bundle" | "upgrade"
  value: number
  valueType: "percentage" | "fixed" | "days"
  startDate: Date
  endDate: Date
  maxUses?: number
  currentUses: number
  targetTenants?: string[]
  conditions?: Record<string, any>
  active: boolean
  createdAt: Date
  createdBy: string
}

export interface MarketplaceAnalytics {
  itemId: string
  period: "daily" | "weekly" | "monthly"
  date: Date
  installs: number
  uninstalls: number
  activeUsers: number
  revenue: number
  conversionRate: number
  churnRate: number
  supportTickets: number
  avgRating: number
}

export interface AIMarketplaceInsight {
  id: string
  type: "forecast" | "pricing" | "bundling" | "promotion" | "lifecycle"
  itemId?: string
  title: string
  description: string
  recommendation: string
  confidence: number
  impact: "low" | "medium" | "high"
  category: string
  data: Record<string, any>
  actionable: boolean
  createdAt: Date
}

export interface MarketplaceFilters {
  search: string
  category: string
  type: string
  status: string
  visibility: string
  pricing: string
  developer: string
  sortBy: "name" | "installs" | "revenue" | "rating" | "updated"
  sortOrder: "asc" | "desc"
}
