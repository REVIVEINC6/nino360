"use client"

import type React from "react"
import { TopBar } from "./top-bar"
import { DualSidebarLayout } from "./dual-sidebar-layout"
import { ModuleSidebar } from "./module-sidebar"
import { PageSidebar } from "./page-sidebar"
import {
  Building2,
  Users,
  BarChart3,
  Database,
  Settings,
  Shield,
  Lock,
  UserPlus,
  CreditCard,
  Bell,
  FileText,
  Workflow,
  Activity,
  Layers,
  Archive,
  CheckCircle,
  TrendingUp,
  Headphones,
  Code,
  Palette,
  PieChart,
} from "lucide-react"

const tenantPages = [
  {
    id: "tenant-overview",
    title: "Tenant Overview",
    href: "/tenant",
    icon: BarChart3,
    description: "Main tenant dashboard and overview",
    category: "Dashboard",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-dashboard",
    title: "Dashboard",
    href: "/tenant/dashboard",
    icon: PieChart,
    description: "Comprehensive tenant analytics dashboard",
    category: "Dashboard",
    isNew: false,
    notifications: 3,
    status: "active" as const,
  },
  {
    id: "tenant-directory",
    title: "Tenant Directory",
    href: "/tenant/directory",
    icon: Building2,
    description: "Browse and manage all tenants",
    category: "Management",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-onboarding",
    title: "Tenant Onboarding",
    href: "/tenant/onboarding",
    icon: UserPlus,
    description: "Streamlined tenant onboarding process",
    category: "Management",
    isNew: true,
    notifications: 5,
    status: "active" as const,
  },
  {
    id: "user-management",
    title: "User Management",
    href: "/tenant/users",
    icon: Users,
    description: "Manage tenant users and permissions",
    category: "Management",
    isNew: false,
    notifications: 2,
    status: "active" as const,
  },
  {
    id: "tenant-analytics",
    title: "Tenant Analytics",
    href: "/tenant/analytics",
    icon: BarChart3,
    description: "Advanced tenant performance analytics",
    category: "Analytics",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-configuration",
    title: "Configuration",
    href: "/tenant/configuration",
    icon: Settings,
    description: "Tenant-specific configuration settings",
    category: "Configuration",
    isNew: false,
    notifications: 1,
    status: "active" as const,
  },
  {
    id: "security-management",
    title: "Security Management",
    href: "/tenant/security",
    icon: Shield,
    description: "Tenant security policies and controls",
    category: "Security",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "access-control",
    title: "Access Control",
    href: "/tenant/access",
    icon: Lock,
    description: "Role-based access control management",
    category: "Security",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "billing-subscription",
    title: "Billing & Subscription",
    href: "/tenant/billing",
    icon: CreditCard,
    description: "Manage tenant billing and subscriptions",
    category: "Billing",
    isNew: false,
    notifications: 4,
    status: "active" as const,
  },
  {
    id: "data-management",
    title: "Data Management",
    href: "/tenant/data",
    icon: Database,
    description: "Tenant data isolation and management",
    category: "Data",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-integrations",
    title: "Integrations",
    href: "/tenant/integrations",
    icon: Layers,
    description: "Third-party integrations and APIs",
    category: "Integration",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "notification-settings",
    title: "Notifications",
    href: "/tenant/notifications",
    icon: Bell,
    description: "Tenant notification preferences",
    category: "Configuration",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "audit-logs",
    title: "Audit Logs",
    href: "/tenant/audit",
    icon: FileText,
    description: "Comprehensive audit trail and logs",
    category: "Security",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-workflows",
    title: "Workflows",
    href: "/tenant/workflows",
    icon: Workflow,
    description: "Automated tenant workflows",
    category: "Automation",
    isNew: true,
    notifications: 0,
    status: "beta" as const,
  },
  {
    id: "tenant-monitoring",
    title: "System Monitoring",
    href: "/tenant/monitoring",
    icon: Activity,
    description: "Real-time tenant system monitoring",
    category: "Operations",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-reports",
    title: "Reports",
    href: "/tenant/reports",
    icon: FileText,
    description: "Generate tenant performance reports",
    category: "Analytics",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-backup",
    title: "Backup & Recovery",
    href: "/tenant/backup",
    icon: Archive,
    description: "Tenant data backup and recovery",
    category: "Operations",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-compliance",
    title: "Compliance",
    href: "/tenant/compliance",
    icon: Shield,
    description: "Regulatory compliance management",
    category: "Security",
    isNew: false,
    notifications: 1,
    status: "active" as const,
  },
  {
    id: "tenant-support",
    title: "Support Center",
    href: "/tenant/support",
    icon: Headphones,
    description: "Tenant support and help desk",
    category: "Support",
    isNew: false,
    notifications: 2,
    status: "active" as const,
  },
  {
    id: "tenant-api",
    title: "API Management",
    href: "/tenant/api",
    icon: Code,
    description: "Tenant API keys and management",
    category: "Integration",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-customization",
    title: "Customization",
    href: "/tenant/customization",
    icon: Palette,
    description: "Tenant branding and customization",
    category: "Configuration",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-performance",
    title: "Performance Metrics",
    href: "/tenant/performance",
    icon: TrendingUp,
    description: "Tenant performance and optimization",
    category: "Analytics",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
  {
    id: "tenant-scaling",
    title: "Auto Scaling",
    href: "/tenant/scaling",
    icon: TrendingUp,
    description: "Automatic tenant resource scaling",
    category: "Operations",
    isNew: true,
    notifications: 0,
    status: "beta" as const,
  },
  {
    id: "tenant-health",
    title: "Health Check",
    href: "/tenant/health",
    icon: CheckCircle,
    description: "Tenant system health monitoring",
    category: "Operations",
    isNew: false,
    notifications: 0,
    status: "active" as const,
  },
]

interface TenantLayoutWrapperProps {
  children: React.ReactNode
}

export function TenantLayoutWrapper({ children }: TenantLayoutWrapperProps) {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Top Bar */}
      <div className="flex-shrink-0 border-b bg-white/80 backdrop-blur-sm">
        <TopBar />
      </div>

      {/* Page Header */}
      <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b px-6 py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-lg text-gray-600 mt-2">Multi-tenant configuration and management</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <DualSidebarLayout
          leftSidebar={<ModuleSidebar currentModule="tenant" />}
          rightSidebar={
            <PageSidebar pages={tenantPages} currentModule="tenant" moduleTitle="Tenant Management" moduleIcon="🏢" />
          }
          rightSidebarTitle="Tenant Pages"
        >
          <div className="h-full overflow-auto p-6">{children}</div>
        </DualSidebarLayout>
      </main>
    </div>
  )
}
