"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  AlertCircle,
  Building2,
  Clock,
  FileText,
  Shield,
  DollarSign,
  Receipt,
  Award,
  CreditCard,
  Heart,
  UserPlus,
  Package,
  Globe,
  Briefcase,
  Target,
  Star,
  MessageSquare,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Copy,
  TrendingUp,
  RefreshCw,
  Settings,
  GitBranch,
  Zap,
  X,
  Users,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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

interface HRMSLayoutWrapperProps {
  children: React.ReactNode
}

// Comprehensive HRMS pages configuration
const hrmsPages: PageItem[] = [
  // Core Dashboard
  {
    id: "hrms-dashboard",
    title: "HRMS Dashboard",
    href: "/hrms",
    icon: Building2,
    description: "HRMS overview and key metrics",
    category: "Dashboard",
    status: "active",
  },

  // Employee Management
  {
    id: "hrms-employees",
    title: "Employee Management",
    href: "/hrms/employees",
    icon: Building2,
    description: "Manage employee records and profiles",
    category: "Employee Management",
    status: "active",
    notifications: 3,
    children: [
      {
        id: "hrms-employees-directory",
        title: "Employee Directory",
        href: "/hrms/employees/directory",
        icon: Building2,
        description: "Browse all employees",
        category: "Employee Management",
      },
      {
        id: "hrms-employees-profiles",
        title: "Employee Profiles",
        href: "/hrms/employees/profiles",
        icon: Building2,
        description: "Detailed employee profiles",
        category: "Employee Management",
      },
      {
        id: "hrms-employees-hierarchy",
        title: "Organization Chart",
        href: "/hrms/employees/hierarchy",
        icon: Building2,
        description: "Company organizational structure",
        category: "Employee Management",
      },
    ],
  },
  {
    id: "hrms-teams",
    title: "Team Management",
    href: "/hrms/teams",
    icon: Building2,
    description: "Manage teams and departments",
    category: "Employee Management",
    status: "active",
  },
  {
    id: "hrms-organization",
    title: "Organization Structure",
    href: "/hrms/organization",
    icon: Building2,
    description: "Company structure and hierarchy",
    category: "Employee Management",
    status: "active",
  },

  // Workforce Management
  {
    id: "hrms-attendance",
    title: "Attendance Management",
    href: "/hrms/attendance",
    icon: Clock,
    description: "Track employee attendance and time",
    category: "Workforce Management",
    status: "active",
    notifications: 5,
    children: [
      {
        id: "hrms-attendance-tracking",
        title: "Time Tracking",
        href: "/hrms/attendance/tracking",
        icon: Clock,
        description: "Real-time attendance tracking",
        category: "Workforce Management",
      },
      {
        id: "hrms-attendance-reports",
        title: "Attendance Reports",
        href: "/hrms/attendance/reports",
        icon: FileText,
        description: "Attendance analytics and reports",
        category: "Workforce Management",
      },
      {
        id: "hrms-attendance-policies",
        title: "Attendance Policies",
        href: "/hrms/attendance/policies",
        icon: Shield,
        description: "Configure attendance rules",
        category: "Workforce Management",
      },
    ],
  },
  {
    id: "hrms-timesheets",
    title: "Timesheet Management",
    href: "/hrms/timesheets",
    icon: Clock,
    description: "Employee timesheet tracking and approval",
    category: "Workforce Management",
    status: "active",
    notifications: 8,
  },
  {
    id: "hrms-assignments",
    title: "Work Assignments",
    href: "/hrms/assignments",
    icon: FileText,
    description: "Project assignments and task management",
    category: "Workforce Management",
    status: "active",
  },

  // Payroll & Compensation
  {
    id: "hrms-payroll",
    title: "Payroll Management",
    href: "/hrms/payroll",
    icon: DollarSign,
    description: "Process payroll and manage compensation",
    category: "Payroll & Finance",
    status: "active",
    notifications: 2,
    children: [
      {
        id: "hrms-payroll-processing",
        title: "Payroll Processing",
        href: "/hrms/payroll/processing",
        icon: DollarSign,
        description: "Run payroll calculations",
        category: "Payroll & Finance",
      },
      {
        id: "hrms-payroll-reports",
        title: "Payroll Reports",
        href: "/hrms/payroll/reports",
        icon: FileText,
        description: "Payroll analytics and reports",
        category: "Payroll & Finance",
      },
      {
        id: "hrms-payroll-taxes",
        title: "Tax Management",
        href: "/hrms/payroll/taxes",
        icon: Receipt,
        description: "Tax calculations and filing",
        category: "Payroll & Finance",
      },
    ],
  },
  {
    id: "hrms-compensation",
    title: "Compensation Management",
    href: "/hrms/compensation",
    icon: Award,
    description: "Salary planning and compensation analysis",
    category: "Payroll & Finance",
    status: "active",
  },
  {
    id: "hrms-invoices",
    title: "Invoice Management",
    href: "/hrms/invoices",
    icon: Receipt,
    description: "Process and track invoices",
    category: "Payroll & Finance",
    status: "active",
  },
  {
    id: "hrms-accounts-payable",
    title: "Accounts Payable",
    href: "/hrms/accounts-payable",
    icon: CreditCard,
    description: "Manage vendor payments and expenses",
    category: "Payroll & Finance",
    status: "active",
  },
  {
    id: "hrms-pay-on-pay",
    title: "Pay-on-Pay",
    href: "/hrms/pay-on-pay",
    icon: DollarSign,
    description: "Pay-on-pay structure management",
    category: "Payroll & Finance",
    status: "active",
  },

  // Benefits & Compliance
  {
    id: "hrms-benefits",
    title: "Benefits Administration",
    href: "/hrms/benefits",
    icon: Heart,
    description: "Manage employee benefits and enrollment",
    category: "Benefits & Compliance",
    status: "active",
    children: [
      {
        id: "hrms-benefits-enrollment",
        title: "Benefits Enrollment",
        href: "/hrms/benefits/enrollment",
        icon: UserPlus,
        description: "Employee benefits enrollment",
        category: "Benefits & Compliance",
      },
      {
        id: "hrms-benefits-plans",
        title: "Benefits Plans",
        href: "/hrms/benefits/plans",
        icon: Package,
        description: "Configure benefits packages",
        category: "Benefits & Compliance",
      },
      {
        id: "hrms-benefits-claims",
        title: "Claims Management",
        href: "/hrms/benefits/claims",
        icon: FileText,
        description: "Process benefits claims",
        category: "Benefits & Compliance",
      },
    ],
  },
  {
    id: "hrms-immigration",
    title: "US Immigration",
    href: "/hrms/immigration",
    icon: Globe,
    description: "Immigration status and visa management",
    category: "Benefits & Compliance",
    status: "active",
    notifications: 1,
  },
  {
    id: "hrms-i9-compliance",
    title: "I9 Compliance",
    href: "/hrms/i9-compliance",
    icon: Shield,
    description: "I9 form compliance and verification",
    category: "Benefits & Compliance",
    status: "active",
  },
  {
    id: "hrms-compliance",
    title: "Compliance Management",
    href: "/hrms/compliance",
    icon: Shield,
    description: "Overall compliance tracking",
    category: "Benefits & Compliance",
    status: "active",
  },

  // Talent & Performance
  {
    id: "hrms-recruitment",
    title: "Recruitment",
    href: "/hrms/recruitment",
    icon: Building2,
    description: "Hiring and recruitment processes",
    category: "Talent & Performance",
    status: "active",
    children: [
      {
        id: "hrms-recruitment-jobs",
        title: "Job Postings",
        href: "/hrms/recruitment/jobs",
        icon: Briefcase,
        description: "Manage job postings",
        category: "Talent & Performance",
      },
      {
        id: "hrms-recruitment-candidates",
        title: "Candidate Pipeline",
        href: "/hrms/recruitment/candidates",
        icon: Building2,
        description: "Track recruitment candidates",
        category: "Talent & Performance",
      },
      {
        id: "hrms-recruitment-interviews",
        title: "Interview Scheduling",
        href: "/hrms/recruitment/interviews",
        icon: Clock,
        description: "Schedule and manage interviews",
        category: "Talent & Performance",
      },
    ],
  },
  {
    id: "hrms-job-management",
    title: "Job Management",
    href: "/hrms/job-management",
    icon: Briefcase,
    description: "Job posting and position management",
    category: "Talent & Performance",
    status: "active",
  },
  {
    id: "hrms-performance",
    title: "Performance Management",
    href: "/hrms/performance",
    icon: Target,
    description: "Employee performance reviews and goals",
    category: "Talent & Performance",
    status: "active",
    notifications: 4,
    children: [
      {
        id: "hrms-performance-reviews",
        title: "Performance Reviews",
        href: "/hrms/performance/reviews",
        icon: Star,
        description: "Conduct performance evaluations",
        category: "Talent & Performance",
      },
      {
        id: "hrms-performance-goals",
        title: "Goal Management",
        href: "/hrms/performance/goals",
        icon: Target,
        description: "Set and track employee goals",
        category: "Talent & Performance",
      },
      {
        id: "hrms-performance-feedback",
        title: "360° Feedback",
        href: "/hrms/performance/feedback",
        icon: MessageSquare,
        description: "Multi-source feedback system",
        category: "Talent & Performance",
      },
    ],
  },

  // Learning & Development
  {
    id: "hrms-training",
    title: "Training & Development",
    href: "/hrms/training",
    icon: GraduationCap,
    description: "Employee learning and skill development",
    category: "Learning & Development",
    status: "active",
    isNew: true,
    children: [
      {
        id: "hrms-training-courses",
        title: "Training Courses",
        href: "/hrms/training/courses",
        icon: BookOpen,
        description: "Available training programs",
        category: "Learning & Development",
      },
      {
        id: "hrms-training-certifications",
        title: "Certifications",
        href: "/hrms/training/certifications",
        icon: Award,
        description: "Professional certifications",
        category: "Learning & Development",
      },
      {
        id: "hrms-training-skills",
        title: "Skills Assessment",
        href: "/hrms/training/skills",
        icon: Target,
        description: "Evaluate employee skills",
        category: "Learning & Development",
      },
    ],
  },

  // Employee Lifecycle
  {
    id: "hrms-onboarding",
    title: "Employee Onboarding",
    href: "/hrms/onboarding",
    icon: UserPlus,
    description: "New employee onboarding workflows",
    category: "Employee Lifecycle",
    status: "active",
    notifications: 6,
    children: [
      {
        id: "hrms-onboarding-checklist",
        title: "Onboarding Checklist",
        href: "/hrms/onboarding/checklist",
        icon: CheckCircle,
        description: "New hire task checklist",
        category: "Employee Lifecycle",
      },
      {
        id: "hrms-onboarding-documents",
        title: "Onboarding Documents",
        href: "/hrms/onboarding/documents",
        icon: FileText,
        description: "Required onboarding paperwork",
        category: "Employee Lifecycle",
      },
      {
        id: "hrms-onboarding-orientation",
        title: "Orientation Program",
        href: "/hrms/onboarding/orientation",
        icon: GraduationCap,
        description: "Employee orientation sessions",
        category: "Employee Lifecycle",
      },
    ],
  },
  {
    id: "hrms-offboarding",
    title: "Employee Offboarding",
    href: "/hrms/offboarding",
    icon: Building2,
    description: "Employee exit and separation process",
    category: "Employee Lifecycle",
    status: "active",
  },

  // Documents & Communication
  {
    id: "hrms-documents",
    title: "Document Management",
    href: "/hrms/documents",
    icon: FileText,
    description: "HR document storage and management",
    category: "Documents & Communication",
    status: "active",
    children: [
      {
        id: "hrms-documents-employee",
        title: "Employee Documents",
        href: "/hrms/documents/employee",
        icon: Building2,
        description: "Individual employee files",
        category: "Documents & Communication",
      },
      {
        id: "hrms-documents-policies",
        title: "HR Policies",
        href: "/hrms/documents/policies",
        icon: BookOpen,
        description: "Company policies and procedures",
        category: "Documents & Communication",
      },
      {
        id: "hrms-documents-templates",
        title: "Document Templates",
        href: "/hrms/documents/templates",
        icon: Copy,
        description: "HR document templates",
        category: "Documents & Communication",
      },
    ],
  },
  {
    id: "hrms-helpdesk",
    title: "HR Help Desk",
    href: "/hrms/helpdesk",
    icon: MessageSquare,
    description: "Employee support and HR tickets",
    category: "Documents & Communication",
    status: "active",
    notifications: 12,
  },

  // Analytics & Reporting
  {
    id: "hrms-analytics",
    title: "HR Analytics",
    href: "/hrms/analytics",
    icon: Building2,
    description: "HR metrics and workforce analytics",
    category: "Analytics & Reporting",
    status: "active",
    children: [
      {
        id: "hrms-analytics-workforce",
        title: "Workforce Analytics",
        href: "/hrms/analytics/workforce",
        icon: Building2,
        description: "Employee demographics and trends",
        category: "Analytics & Reporting",
      },
      {
        id: "hrms-analytics-performance",
        title: "Performance Analytics",
        href: "/hrms/analytics/performance",
        icon: TrendingUp,
        description: "Performance metrics and insights",
        category: "Analytics & Reporting",
      },
      {
        id: "hrms-analytics-turnover",
        title: "Turnover Analysis",
        href: "/hrms/analytics/turnover",
        icon: RefreshCw,
        description: "Employee retention analytics",
        category: "Analytics & Reporting",
      },
    ],
  },
  {
    id: "hrms-reports",
    title: "HR Reports",
    href: "/hrms/reports",
    icon: FileText,
    description: "Comprehensive HR reporting suite",
    category: "Analytics & Reporting",
    status: "active",
    children: [
      {
        id: "hrms-reports-compliance",
        title: "Compliance Reports",
        href: "/hrms/reports/compliance",
        icon: Shield,
        description: "Regulatory compliance reports",
        category: "Analytics & Reporting",
      },
      {
        id: "hrms-reports-payroll",
        title: "Payroll Reports",
        href: "/hrms/reports/payroll",
        icon: DollarSign,
        description: "Payroll and compensation reports",
        category: "Analytics & Reporting",
      },
      {
        id: "hrms-reports-custom",
        title: "Custom Reports",
        href: "/hrms/reports/custom",
        icon: Settings,
        description: "Build custom HR reports",
        category: "Analytics & Reporting",
      },
    ],
  },

  // AI & Automation
  {
    id: "hrms-ai-assistant",
    title: "AI Assistant",
    href: "/hrms/ai-assistant",
    icon: Zap,
    description: "AI-powered HR assistance and insights",
    category: "AI & Automation",
    status: "beta",
    isNew: true,
  },

  // Configuration
  {
    id: "hrms-settings",
    title: "HRMS Settings",
    href: "/hrms/settings",
    icon: Settings,
    description: "HRMS configuration and preferences",
    category: "Configuration",
    status: "active",
    children: [
      {
        id: "hrms-settings-general",
        title: "General Settings",
        href: "/hrms/settings/general",
        icon: Settings,
        description: "Basic HRMS configuration",
        category: "Configuration",
      },
      {
        id: "hrms-settings-permissions",
        title: "User Permissions",
        href: "/hrms/settings/permissions",
        icon: Shield,
        description: "Manage user access and roles",
        category: "Configuration",
      },
      {
        id: "hrms-settings-workflows",
        title: "Workflow Configuration",
        href: "/hrms/settings/workflows",
        icon: GitBranch,
        description: "Configure HR workflows",
        category: "Configuration",
      },
      {
        id: "hrms-settings-integrations",
        title: "Integrations",
        href: "/hrms/settings/integrations",
        icon: Zap,
        description: "Third-party integrations",
        category: "Configuration",
      },
    ],
  },
]

export function HRMSLayoutWrapper({ children }: HRMSLayoutWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, loading, refreshProfile } = useAuth()
  const [initLoading, setInitLoading] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
  const [isModuleSidebarCollapsed, setIsModuleSidebarCollapsed] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to login")
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    async function checkAccess() {
      if (loading || !user) return

      setInitLoading(true)
      setInitError(null)

      try {
        console.log("Initializing user and tenant for HRMS access")
        const result = await initializeUserAndTenant(user.id, user.email || "", user.user_metadata || {})

        if (result.success && result.tenantId) {
          setTenantId(result.tenantId)
          console.log("HRMS access initialized successfully")
        } else {
          console.error("Failed to initialize HRMS access:", result.error)
          setInitError(result.error || "Failed to initialize HRMS access")
        }
      } catch (err) {
        console.error("Error initializing HRMS access:", err)
        setInitError("An unexpected error occurred while setting up HRMS access")
      } finally {
        setInitLoading(false)
      }
    }

    checkAccess()
  }, [user, loading])

  useEffect(() => {
    setIsAIPanelOpen(false)
  }, [pathname])

  const toggleAIPanel = () => setIsAIPanelOpen(!isAIPanelOpen)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshProfile()
    } catch (error) {
      console.error("Error refreshing profile:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Show loading state
  if (loading || initLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show authentication required state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-blue-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
              <p className="text-gray-600">Please sign in to access the HRMS module.</p>
            </div>

            <Button onClick={() => (window.location.href = "/login")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show profile loading/error state
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Profile Setup Required</h2>
              <p className="text-gray-600">We're setting up your profile and workspace. This may take a moment.</p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full">
                {isRefreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Setup
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={() => (window.location.href = "/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role-based access
  const allowedRoles = ["admin", "hr_manager", "recruitment_manager", "master_admin", "super_admin", "employee"]
  const hasAccess = allowedRoles.includes(profile.role)

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
              <p className="text-gray-600">Your role ({profile.role}) doesn't have access to the HRMS module.</p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Contact your administrator to request HRMS access permissions.</AlertDescription>
            </Alert>

            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render the HRMS content
  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
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
              <h1 className="text-3xl font-bold text-gray-900">HRMS</h1>
              <p className="text-lg text-gray-600 mt-2">Human Resource Management System</p>
            </div>
            <Button
              onClick={toggleAIPanel}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
            >
              <Zap className="h-4 w-4 mr-2" />
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
