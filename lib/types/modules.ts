export interface Module {
  id: string
  name: string
  description: string
  icon: string
  status: "live" | "beta" | "deprecated" | "coming-soon"
  tier: "free" | "pro" | "enterprise" | "custom"
  version: string
  category: string
  activeTenants: number
  totalTenants: number
  usageScore: number
  lastUpdated: Date
  createdAt: Date
  features: string[]
  dependencies: string[]
  pricing?: {
    monthly: number
    yearly: number
  }
  metadata: {
    developer: string
    supportUrl: string
    documentationUrl: string
  }
}

export interface TenantModule {
  id: string
  tenantId: string
  moduleId: string
  enabled: boolean
  configOverrides: Record<string, any>
  enabledAt: Date
  lastUsed?: Date
  usageCount: number
}

export interface ModuleUsageAnalytics {
  moduleId: string
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  featureUsage: Record<string, number>
  performanceMetrics: {
    loadTime: number
    errorRate: number
    satisfaction: number
  }
}

export interface AIInsight {
  id: string
  type: "churn-risk" | "upgrade-opportunity" | "usage-optimization" | "feature-request"
  moduleId?: string
  tenantId?: string
  title: string
  description: string
  confidence: number
  actionable: boolean
  createdAt: Date
}
