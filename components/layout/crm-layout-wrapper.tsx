"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, AlertCircle, Users, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Building2,
  Mail,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  MessageSquare,
  Settings,
  Bot,
  X,
} from "lucide-react"
import { TopBar } from "./top-bar"
import { ModuleSidebar } from "@/components/navigation/module-sidebar"
import { PageSidebar } from "./page-sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"
import AIChatInterface from "../ai/ai-chat-interface"
import { initializeUserAndTenant } from "@/app/actions/initialize-user"

interface PageItem {
  id: string
  title: string
  href: string
  icon: any
  description: string
  category?: string
  isNew?: boolean
  isFavorite?: boolean
  lastVisited?: string
  notifications?: number
  status?: "active" | "inactive" | "beta" | "coming-soon"
  children?: PageItem[]
}

interface CRMLayoutWrapperProps {
  children: React.ReactNode
}

// Comprehensive CRM pages configuration
const crmPages: PageItem[] = [
  // Core Dashboard
  {
    id: "crm-dashboard",
    title: "CRM Dashboard",
    href: "/crm/dashboard",
    icon: BarChart3,
    description: "CRM overview and key metrics",
    category: "Dashboard",
    status: "active",
  },
  {
    id: "crm-dashboard-new",
    title: "New Dashboard",
    href: "/crm/dashboard/new",
    icon: BarChart3,
    description: "Create new dashboard view",
    category: "Dashboard",
    status: "active",
    isNew: true,
  },

  // Lead Management
  {
    id: "crm-leads",
    title: "Lead Management",
    href: "/crm/leads",
    icon: Target,
    description: "Manage and track leads",
    category: "Lead Management",
    status: "active",
    notifications: 8,
    children: [
      {
        id: "crm-leads-scoring",
        title: "Lead Scoring",
        href: "/crm/leads/scoring",
        icon: TrendingUp,
        description: "AI-powered lead scoring",
        category: "Lead Management",
      },
      {
        id: "crm-leads-sources",
        title: "Lead Sources",
        href: "/crm/leads/sources",
        icon: Target,
        description: "Track lead source performance",
        category: "Lead Management",
      },
      {
        id: "crm-leads-import",
        title: "Import Leads",
        href: "/crm/leads/import",
        icon: FileText,
        description: "Bulk import lead data",
        category: "Lead Management",
      },
    ],
  },

  // Contact & Company Management
  {
    id: "crm-contacts",
    title: "Contact Management",
    href: "/crm/contacts",
    icon: Users,
    description: "Manage customer contacts",
    category: "Contacts & Companies",
    status: "active",
    notifications: 3,
  },
  {
    id: "crm-companies",
    title: "Company Management",
    href: "/crm/companies",
    icon: Building2,
    description: "Manage company accounts",
    category: "Contacts & Companies",
    status: "active",
    notifications: 5,
  },

  // Sales Pipeline
  {
    id: "crm-pipeline",
    title: "Sales Pipeline",
    href: "/crm/pipeline",
    icon: TrendingUp,
    description: "Visual sales pipeline management",
    category: "Sales Pipeline",
    status: "active",
    notifications: 12,
  },

  // Communication & Engagement
  {
    id: "crm-engagements",
    title: "Customer Engagements",
    href: "/crm/engagements",
    icon: MessageSquare,
    description: "Track customer interactions",
    category: "Communication",
    status: "active",
    notifications: 7,
  },
  {
    id: "crm-campaigns",
    title: "Marketing Campaigns",
    href: "/crm/campaigns",
    icon: Mail,
    description: "Manage marketing campaigns",
    category: "Communication",
    status: "active",
    notifications: 2,
  },
  {
    id: "crm-calendar",
    title: "Calendar & Scheduling",
    href: "/crm/calendar",
    icon: Calendar,
    description: "Schedule meetings and appointments",
    category: "Communication",
    status: "active",
  },

  // Documents & Analytics
  {
    id: "crm-documents",
    title: "Document Management",
    href: "/crm/documents",
    icon: FileText,
    description: "Store and manage CRM documents",
    category: "Documents & Analytics",
    status: "active",
  },
  {
    id: "crm-analytics",
    title: "CRM Analytics",
    href: "/crm/analytics",
    icon: BarChart3,
    description: "Advanced CRM analytics and insights",
    category: "Documents & Analytics",
    status: "active",
  },
  {
    id: "crm-reports",
    title: "CRM Reports",
    href: "/crm/reports",
    icon: FileText,
    description: "Generate CRM reports",
    category: "Documents & Analytics",
    status: "active",
  },

  // AI & Automation
  {
    id: "crm-ai-assistant",
    title: "AI Assistant",
    href: "/crm/ai-assistant",
    icon: Bot,
    description: "AI-powered CRM assistance",
    category: "AI & Automation",
    status: "beta",
    isNew: true,
  },

  // Configuration
  {
    id: "crm-settings",
    title: "CRM Settings",
    href: "/crm/settings",
    icon: Settings,
    description: "Configure CRM preferences",
    category: "Configuration",
    status: "active",
  },
]

export function CRMLayoutWrapper({ children }: CRMLayoutWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, loading } = useAuth()
  const [tenantId, setTenantId] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
  const [isModuleSidebarCollapsed, setIsModuleSidebarCollapsed] = useState(false)

  // Get current page info
  const currentPageId = pathname.split("/").pop() || "dashboard"

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to login")
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    async function checkAccess() {
      if (loading) return

      if (!user) {
        router.push("/login")
        return
      }

      try {
        const result = await initializeUserAndTenant(user.id, user.email || "", user.user_metadata || {})

        if (result.success) {
          setTenantId(result.tenantId)
        } else {
          console.error("Failed to initialize user:", result.error)
        }
      } catch (err) {
        console.error("Error checking access:", err)
      }
    }

    checkAccess()
  }, [user, loading])

  useEffect(() => {
    setIsAIPanelOpen(false)
  }, [pathname])

  const toggleAIPanel = () => setIsAIPanelOpen(!isAIPanelOpen)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading CRM module...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to access the CRM module</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    )
  }

  // Check if user has access to CRM module
  const hasAccess =
    profile?.role && ["admin", "super_admin", "manager", "sales", "crm_user"].includes(profile.role.toLowerCase())

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>You don't have permission to access the CRM module</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Contact your administrator to request CRM access</AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
                Dashboard
              </Button>
              <Button onClick={() => router.push("/profile")} className="flex-1">
                Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Module Sidebar */}
      <div className={`${isModuleSidebarCollapsed ? "w-16" : "w-64"} transition-all duration-300`}>
        <ModuleSidebar collapsed={isModuleSidebarCollapsed} onCollapsedChange={setIsModuleSidebarCollapsed} />
      </div>

      {/* Page Sidebar */}
      <PageSidebar className="w-80 border-r bg-white/80 backdrop-blur-sm" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex-shrink-0 border-b bg-white/80 backdrop-blur-sm">
          <TopBar />
        </div>

        {/* Page Header */}
        <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
              <p className="text-lg text-gray-600 mt-2">Customer Relationship Management</p>
            </div>
            <Button
              onClick={toggleAIPanel}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* AI Panel - Desktop */}
      {isAIPanelOpen && (
        <div className="w-80 border-l bg-card/50 backdrop-blur-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">AI Assistant</h3>
            <Button variant="ghost" size="icon" onClick={toggleAIPanel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AIChatInterface />
        </div>
      )}
    </div>
  )
}
