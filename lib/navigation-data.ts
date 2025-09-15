import {
  BarChart3,
  Users,
  FileText,
  Clock,
  Globe,
  Shield,
  UserPlus,
  UserMinus,
  MessageSquare,
  Target,
  Award,
  UserCheck,
  Briefcase,
  Heart,
  Building2,
  Settings,
  Bot,
  Calendar,
  TrendingUp,
  Lock,
  Package,
  Search,
  Brain,
  ImageIcon,
} from "lucide-react"

// Page interface
export interface PageItem {
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
  aiScore?: number
  usageCount?: number
  difficulty?: "beginner" | "intermediate" | "advanced"
  estimatedTime?: string
  tags?: string[]
  children?: PageItem[]
}

// Module navigation interface
export interface ModuleNavigation {
  id: string
  title: string
  name?: string
  description: string
  icon: any
  color: string
  pages: PageItem[]
  categories: string[]
  totalPages: number
  activePages: number
  completionRate: number
  lastUpdated: string
}

// HRMS Navigation Data
const hrmsNavigation: ModuleNavigation = {
  id: "hrms",
  title: "HRMS",
  description: "Human Resource Management System",
  icon: Users,
  color: "bg-orange-500",
  categories: [
    "Dashboard",
    "Employee Management",
    "Workforce Management",
    "Payroll & Finance",
    "Benefits & Compliance",
    "Talent & Performance",
    "Learning & Development",
    "Employee Lifecycle",
    "Documents & Communication",
    "Analytics & Reporting",
    "AI & Automation",
    "Configuration",
  ],
  totalPages: 18,
  activePages: 16,
  completionRate: 89,
  lastUpdated: "2024-01-15",
  pages: [
    // Core Dashboard
    {
      id: "hrms-dashboard",
      title: "HRMS Dashboard",
      href: "/hrms/dashboard",
      icon: BarChart3,
      description: "HRMS overview and key metrics",
      category: "Dashboard",
      status: "active",
      aiScore: 95,
      usageCount: 1247,
      difficulty: "beginner",
      estimatedTime: "5 min",
      tags: ["overview", "metrics", "dashboard"],
    },

    // Employee Management
    {
      id: "hrms-employees",
      title: "Employee Management",
      href: "/hrms/employees",
      icon: Users,
      description: "Manage employee records and profiles",
      category: "Employee Management",
      status: "active",
      notifications: 3,
      aiScore: 92,
      usageCount: 856,
      difficulty: "intermediate",
      estimatedTime: "10 min",
      tags: ["employees", "management", "profiles"],
    },
    {
      id: "hrms-teams",
      title: "Team Management",
      href: "/hrms/teams",
      icon: Building2,
      description: "Manage teams and departments",
      category: "Employee Management",
      status: "active",
      aiScore: 88,
      usageCount: 634,
      difficulty: "intermediate",
      estimatedTime: "8 min",
      tags: ["teams", "departments", "organization"],
    },
    {
      id: "hrms-organization",
      title: "Organization Structure",
      href: "/hrms/organization",
      icon: Building2,
      description: "Company structure and hierarchy",
      category: "Employee Management",
      status: "active",
      aiScore: 85,
      usageCount: 423,
      difficulty: "advanced",
      estimatedTime: "15 min",
      tags: ["organization", "hierarchy", "structure"],
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
      aiScore: 91,
      usageCount: 1123,
      difficulty: "beginner",
      estimatedTime: "7 min",
      tags: ["attendance", "time tracking", "workforce"],
    },
    {
      id: "hrms-payroll",
      title: "Payroll Management",
      href: "/hrms/payroll",
      icon: ImageIcon,
      description: "Process payroll and manage compensation",
      category: "Payroll & Finance",
      status: "active",
      notifications: 2,
      aiScore: 94,
      usageCount: 789,
      difficulty: "advanced",
      estimatedTime: "20 min",
      tags: ["payroll", "compensation", "finance"],
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
      aiScore: 87,
      usageCount: 567,
      difficulty: "intermediate",
      estimatedTime: "12 min",
      tags: ["benefits", "enrollment", "administration"],
    },

    // Talent & Performance
    {
      id: "hrms-performance",
      title: "Performance Management",
      href: "/hrms/performance",
      icon: Target,
      description: "Employee performance reviews and goals",
      category: "Talent & Performance",
      status: "active",
      notifications: 4,
      aiScore: 89,
      usageCount: 678,
      difficulty: "intermediate",
      estimatedTime: "15 min",
      tags: ["performance", "reviews", "goals"],
    },

    // Learning & Development
    {
      id: "hrms-training",
      title: "Training & Development",
      href: "/hrms/training",
      icon: ImageIcon,
      description: "Employee learning and skill development",
      category: "Learning & Development",
      status: "active",
      isNew: true,
      aiScore: 86,
      usageCount: 445,
      difficulty: "beginner",
      estimatedTime: "10 min",
      tags: ["training", "development", "learning"],
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
      aiScore: 90,
      usageCount: 334,
      difficulty: "intermediate",
      estimatedTime: "18 min",
      tags: ["onboarding", "new hire", "workflow"],
    },
    {
      id: "hrms-offboarding",
      title: "Employee Offboarding",
      href: "/hrms/offboarding",
      icon: UserMinus,
      description: "Employee exit and separation process",
      category: "Employee Lifecycle",
      status: "active",
      aiScore: 83,
      usageCount: 156,
      difficulty: "intermediate",
      estimatedTime: "16 min",
      tags: ["offboarding", "exit", "separation"],
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
      aiScore: 84,
      usageCount: 567,
      difficulty: "beginner",
      estimatedTime: "8 min",
      tags: ["documents", "storage", "management"],
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
      aiScore: 88,
      usageCount: 789,
      difficulty: "beginner",
      estimatedTime: "5 min",
      tags: ["helpdesk", "support", "tickets"],
    },

    // Analytics & Reporting
    {
      id: "hrms-analytics",
      title: "HR Analytics",
      href: "/hrms/analytics",
      icon: BarChart3,
      description: "HR metrics and workforce analytics",
      category: "Analytics & Reporting",
      status: "active",
      aiScore: 93,
      usageCount: 445,
      difficulty: "advanced",
      estimatedTime: "25 min",
      tags: ["analytics", "metrics", "workforce"],
    },
    {
      id: "hrms-reports",
      title: "HR Reports",
      href: "/hrms/reports",
      icon: FileText,
      description: "Comprehensive HR reporting suite",
      category: "Analytics & Reporting",
      status: "active",
      aiScore: 91,
      usageCount: 678,
      difficulty: "intermediate",
      estimatedTime: "12 min",
      tags: ["reports", "reporting", "comprehensive"],
    },

    // AI & Automation
    {
      id: "hrms-ai-assistant",
      title: "AI Assistant",
      href: "/hrms/ai-assistant",
      icon: Bot,
      description: "AI-powered HR assistance and insights",
      category: "AI & Automation",
      status: "beta",
      isNew: true,
      aiScore: 96,
      usageCount: 234,
      difficulty: "beginner",
      estimatedTime: "3 min",
      tags: ["ai", "assistant", "automation"],
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
      aiScore: 82,
      usageCount: 345,
      difficulty: "advanced",
      estimatedTime: "20 min",
      tags: ["settings", "configuration", "preferences"],
    },

    // Additional pages to reach 18 total
    {
      id: "hrms-recruitment",
      title: "Recruitment",
      href: "/hrms/recruitment",
      icon: UserCheck,
      description: "Hiring and recruitment processes",
      category: "Talent & Performance",
      status: "active",
      aiScore: 87,
      usageCount: 456,
      difficulty: "intermediate",
      estimatedTime: "14 min",
      tags: ["recruitment", "hiring", "processes"],
    },
    {
      id: "hrms-compensation",
      title: "Compensation Management",
      href: "/hrms/compensation",
      icon: Award,
      description: "Salary planning and compensation analysis",
      category: "Payroll & Finance",
      status: "active",
      aiScore: 89,
      usageCount: 567,
      difficulty: "advanced",
      estimatedTime: "18 min",
      tags: ["compensation", "salary", "planning"],
    },
  ],
}

// Talent Navigation Data
const talentNavigation: ModuleNavigation = {
  id: "talent",
  title: "Talent Acquisition",
  description: "Talent Acquisition & Recruitment",
  icon: UserCheck,
  color: "bg-purple-500",
  categories: [
    "Dashboard",
    "Job Management",
    "Candidate Management",
    "Interview Process",
    "Talent Pipeline",
    "Analytics & Reporting",
    "AI & Automation",
    "Configuration",
  ],
  totalPages: 15,
  activePages: 13,
  completionRate: 87,
  lastUpdated: "2024-01-15",
  pages: [
    {
      id: "talent-dashboard",
      title: "Talent Dashboard",
      href: "/talent/dashboard",
      icon: BarChart3,
      description: "Talent acquisition overview and metrics",
      category: "Dashboard",
      status: "active",
      aiScore: 94,
      usageCount: 1156,
      difficulty: "beginner",
      estimatedTime: "5 min",
      tags: ["dashboard", "overview", "metrics"],
    },
    {
      id: "talent-jobs",
      title: "Job Management",
      href: "/talent/jobs",
      icon: Briefcase,
      description: "Create and manage job postings",
      category: "Job Management",
      status: "active",
      aiScore: 91,
      usageCount: 834,
      difficulty: "intermediate",
      estimatedTime: "12 min",
      tags: ["jobs", "postings", "management"],
    },
    {
      id: "talent-candidates",
      title: "Candidate Management",
      href: "/talent/candidates",
      icon: Users,
      description: "Track and manage candidates",
      category: "Candidate Management",
      status: "active",
      notifications: 8,
      aiScore: 89,
      usageCount: 967,
      difficulty: "intermediate",
      estimatedTime: "15 min",
      tags: ["candidates", "tracking", "management"],
    },
    {
      id: "talent-interviews",
      title: "Interview Scheduling",
      href: "/talent/interviews",
      icon: Calendar,
      description: "Schedule and manage interviews",
      category: "Interview Process",
      status: "active",
      notifications: 3,
      aiScore: 88,
      usageCount: 645,
      difficulty: "beginner",
      estimatedTime: "8 min",
      tags: ["interviews", "scheduling", "calendar"],
    },
    {
      id: "talent-pipeline",
      title: "Talent Pipeline",
      href: "/talent/pipeline",
      icon: TrendingUp,
      description: "Manage talent pipeline and sourcing",
      category: "Talent Pipeline",
      status: "active",
      aiScore: 92,
      usageCount: 523,
      difficulty: "advanced",
      estimatedTime: "20 min",
      tags: ["pipeline", "sourcing", "talent"],
    },
    {
      id: "talent-analytics",
      title: "Talent Analytics",
      href: "/talent/analytics",
      icon: BarChart3,
      description: "Recruitment analytics and insights",
      category: "Analytics & Reporting",
      status: "active",
      aiScore: 95,
      usageCount: 412,
      difficulty: "advanced",
      estimatedTime: "25 min",
      tags: ["analytics", "insights", "recruitment"],
    },
    {
      id: "talent-ai",
      title: "AI Talent Insights",
      href: "/talent/ai",
      icon: Brain,
      description: "AI-powered talent recommendations",
      category: "AI & Automation",
      status: "beta",
      isNew: true,
      aiScore: 97,
      usageCount: 289,
      difficulty: "beginner",
      estimatedTime: "5 min",
      tags: ["ai", "insights", "recommendations"],
    },
    {
      id: "talent-assessments",
      title: "Skills Assessment",
      href: "/talent/assessments",
      icon: Target,
      description: "Candidate skills and assessments",
      category: "Candidate Management",
      status: "active",
      aiScore: 86,
      usageCount: 378,
      difficulty: "intermediate",
      estimatedTime: "18 min",
      tags: ["assessments", "skills", "evaluation"],
    },
    {
      id: "talent-offers",
      title: "Offer Management",
      href: "/talent/offers",
      icon: Award,
      description: "Create and manage job offers",
      category: "Talent Pipeline",
      status: "active",
      notifications: 2,
      aiScore: 90,
      usageCount: 234,
      difficulty: "intermediate",
      estimatedTime: "14 min",
      tags: ["offers", "management", "negotiation"],
    },
    {
      id: "talent-onboarding",
      title: "Talent Onboarding",
      href: "/talent/onboarding",
      icon: UserPlus,
      description: "New hire onboarding process",
      category: "Talent Pipeline",
      status: "active",
      notifications: 5,
      aiScore: 88,
      usageCount: 167,
      difficulty: "intermediate",
      estimatedTime: "16 min",
      tags: ["onboarding", "new hire", "process"],
    },
    {
      id: "talent-sourcing",
      title: "Talent Sourcing",
      href: "/talent/sourcing",
      icon: Search,
      description: "Source and discover talent",
      category: "Talent Pipeline",
      status: "active",
      aiScore: 91,
      usageCount: 445,
      difficulty: "intermediate",
      estimatedTime: "12 min",
      tags: ["sourcing", "discovery", "talent"],
    },
    {
      id: "talent-referrals",
      title: "Employee Referrals",
      href: "/talent/referrals",
      icon: Users,
      description: "Manage employee referral program",
      category: "Talent Pipeline",
      status: "active",
      aiScore: 84,
      usageCount: 298,
      difficulty: "beginner",
      estimatedTime: "10 min",
      tags: ["referrals", "employee", "program"],
    },
    {
      id: "talent-marketplace",
      title: "Talent Marketplace",
      href: "/talent/marketplace",
      icon: Globe,
      description: "External talent marketplace integration",
      category: "Talent Pipeline",
      status: "active",
      aiScore: 87,
      usageCount: 356,
      difficulty: "advanced",
      estimatedTime: "22 min",
      tags: ["marketplace", "external", "integration"],
    },
    {
      id: "talent-automation",
      title: "Recruitment Automation",
      href: "/talent/automation",
      icon: Bot,
      description: "Automate recruitment workflows",
      category: "AI & Automation",
      status: "beta",
      isNew: true,
      aiScore: 93,
      usageCount: 178,
      difficulty: "advanced",
      estimatedTime: "30 min",
      tags: ["automation", "workflows", "recruitment"],
    },
    {
      id: "talent-settings",
      title: "Talent Settings",
      href: "/talent/settings",
      icon: Settings,
      description: "Configure talent acquisition settings",
      category: "Configuration",
      status: "active",
      aiScore: 81,
      usageCount: 234,
      difficulty: "advanced",
      estimatedTime: "18 min",
      tags: ["settings", "configuration", "talent"],
    },
  ],
}

// CRM Navigation Data
const crmNavigation: ModuleNavigation = {
  id: "crm",
  title: "CRM",
  description: "Customer Relationship Management",
  icon: Users,
  color: "bg-blue-500",
  categories: [
    "Dashboard",
    "Lead Management",
    "Contact Management",
    "Customer Engagement",
    "Sales Pipeline",
    "Documents & Proposals",
    "Calendar & Tasks",
    "Analytics & Reporting",
    "AI & Automation",
    "Configuration",
  ],
  totalPages: 10,
  activePages: 10,
  completionRate: 100,
  lastUpdated: "2024-01-15",
  pages: [
    // Core Dashboard
    {
      id: "crm-dashboard",
      title: "CRM Dashboard",
      href: "/crm/dashboard",
      icon: BarChart3,
      description: "CRM overview and sales metrics",
      category: "Dashboard",
      status: "active",
      aiScore: 96,
      usageCount: 1345,
      difficulty: "beginner",
      estimatedTime: "5 min",
      tags: ["dashboard", "sales", "metrics"],
    },

    // Lead Management
    {
      id: "crm-leads",
      title: "Lead Management",
      href: "/crm/leads",
      icon: Target,
      description: "Manage and track sales leads",
      category: "Lead Management",
      status: "active",
      notifications: 7,
      aiScore: 93,
      usageCount: 987,
      difficulty: "intermediate",
      estimatedTime: "12 min",
      tags: ["leads", "management", "tracking"],
    },

    // Contact Management
    {
      id: "crm-contacts",
      title: "Contact Management",
      href: "/crm/contacts",
      icon: Users,
      description: "Manage customer contacts and relationships",
      category: "Contact Management",
      status: "active",
      aiScore: 91,
      usageCount: 1123,
      difficulty: "beginner",
      estimatedTime: "8 min",
      tags: ["contacts", "customers", "relationships"],
    },

    // Customer Engagement
    {
      id: "crm-engagement",
      title: "Customer Engagement",
      href: "/crm/engagement",
      icon: MessageSquare,
      description: "Track customer interactions and engagement",
      category: "Customer Engagement",
      status: "active",
      aiScore: 86,
      usageCount: 456,
      difficulty: "beginner",
      estimatedTime: "10 min",
      tags: ["engagement", "interactions", "tracking"],
    },

    // Sales Pipeline
    {
      id: "crm-pipeline",
      title: "Sales Pipeline",
      href: "/crm/pipeline",
      icon: TrendingUp,
      description: "Visualize and manage sales pipeline",
      category: "Sales Pipeline",
      status: "active",
      aiScore: 94,
      usageCount: 756,
      difficulty: "intermediate",
      estimatedTime: "15 min",
      tags: ["pipeline", "sales", "visualization"],
    },

    // Documents & Proposals
    {
      id: "crm-documents",
      title: "Documents & Proposals",
      href: "/crm/documents",
      icon: FileText,
      description: "Manage CRM documents, contracts and proposals",
      category: "Documents & Proposals",
      status: "active",
      aiScore: 83,
      usageCount: 345,
      difficulty: "beginner",
      estimatedTime: "8 min",
      tags: ["documents", "proposals", "contracts"],
    },

    // Calendar & Tasks
    {
      id: "crm-calendar",
      title: "Calendar & Tasks",
      href: "/crm/calendar",
      icon: Calendar,
      description: "Schedule meetings, appointments and manage tasks",
      category: "Calendar & Tasks",
      status: "active",
      aiScore: 88,
      usageCount: 567,
      difficulty: "beginner",
      estimatedTime: "10 min",
      tags: ["calendar", "tasks", "scheduling"],
    },

    // Analytics & Reporting
    {
      id: "crm-analytics",
      title: "CRM Analytics",
      href: "/crm/analytics",
      icon: BarChart3,
      description: "Sales and customer analytics",
      category: "Analytics & Reporting",
      status: "active",
      aiScore: 95,
      usageCount: 445,
      difficulty: "advanced",
      estimatedTime: "25 min",
      tags: ["analytics", "sales", "customers"],
    },
    {
      id: "crm-reports",
      title: "Reports & Forecasts",
      href: "/crm/reports",
      icon: FileText,
      description: "Generate CRM reports and sales forecasts",
      category: "Analytics & Reporting",
      status: "active",
      aiScore: 92,
      usageCount: 567,
      difficulty: "intermediate",
      estimatedTime: "14 min",
      tags: ["reports", "forecasts", "generation"],
    },

    // AI & Automation
    {
      id: "crm-ai-assistant",
      title: "AI Assistant",
      href: "/crm/ai-assistant",
      icon: Bot,
      description: "AI-powered CRM insights and automation",
      category: "AI & Automation",
      status: "beta",
      isNew: true,
      aiScore: 97,
      usageCount: 267,
      difficulty: "beginner",
      estimatedTime: "5 min",
      tags: ["ai", "assistant", "insights"],
    },
  ],
}

// Admin Navigation Data
const adminNavigation: ModuleNavigation = {
  id: "admin",
  title: "Admin",
  description: "System Administration",
  icon: Shield,
  color: "bg-red-500",
  categories: [
    "Dashboard",
    "User Management",
    "System Management",
    "Security",
    "Billing",
    "Marketplace",
    "Analytics",
    "Configuration",
  ],
  totalPages: 10,
  activePages: 9,
  completionRate: 90,
  lastUpdated: "2024-01-15",
  pages: [
    {
      id: "admin-dashboard",
      title: "Admin Dashboard",
      href: "/admin",
      icon: BarChart3,
      description: "System administration overview",
      category: "Dashboard",
      status: "active",
      aiScore: 98,
      usageCount: 567,
      difficulty: "advanced",
      estimatedTime: "10 min",
      tags: ["dashboard", "administration", "overview"],
    },
    {
      id: "admin-users",
      title: "User Management",
      href: "/admin/users",
      icon: Users,
      description: "Manage system users and permissions",
      category: "User Management",
      status: "active",
      notifications: 2,
      aiScore: 94,
      usageCount: 445,
      difficulty: "advanced",
      estimatedTime: "15 min",
      tags: ["users", "permissions", "management"],
    },
    {
      id: "admin-tenants",
      title: "Tenant Management",
      href: "/admin/tenants",
      icon: Building2,
      description: "Manage tenant organizations",
      category: "System Management",
      status: "active",
      aiScore: 92,
      usageCount: 334,
      difficulty: "advanced",
      estimatedTime: "18 min",
      tags: ["tenants", "organizations", "management"],
    },
    {
      id: "admin-roles",
      title: "Role Management",
      href: "/admin/roles",
      icon: Shield,
      description: "Configure user roles and permissions",
      category: "Security",
      status: "active",
      aiScore: 90,
      usageCount: 278,
      difficulty: "advanced",
      estimatedTime: "20 min",
      tags: ["roles", "permissions", "security"],
    },
    {
      id: "admin-billing",
      title: "Billing Management",
      href: "/admin/billing",
      icon: ImageIcon,
      description: "Manage billing and subscriptions",
      category: "Billing",
      status: "active",
      notifications: 1,
      aiScore: 89,
      usageCount: 234,
      difficulty: "advanced",
      estimatedTime: "22 min",
      tags: ["billing", "subscriptions", "payments"],
    },
    {
      id: "admin-marketplace",
      title: "Marketplace Management",
      href: "/admin/marketplace",
      icon: Globe,
      description: "Manage marketplace and modules",
      category: "Marketplace",
      status: "active",
      aiScore: 87,
      usageCount: 189,
      difficulty: "advanced",
      estimatedTime: "25 min",
      tags: ["marketplace", "modules", "management"],
    },
    {
      id: "admin-modules",
      title: "Module Management",
      href: "/admin/modules",
      icon: Package,
      description: "Configure system modules",
      category: "System Management",
      status: "active",
      aiScore: 91,
      usageCount: 156,
      difficulty: "advanced",
      estimatedTime: "20 min",
      tags: ["modules", "configuration", "system"],
    },
    {
      id: "admin-system",
      title: "System Settings",
      href: "/admin/system",
      icon: Settings,
      description: "Configure system-wide settings",
      category: "Configuration",
      status: "active",
      aiScore: 85,
      usageCount: 123,
      difficulty: "advanced",
      estimatedTime: "30 min",
      tags: ["system", "settings", "configuration"],
    },
    {
      id: "admin-analytics",
      title: "System Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      description: "System performance and usage analytics",
      category: "Analytics",
      status: "active",
      aiScore: 93,
      usageCount: 234,
      difficulty: "advanced",
      estimatedTime: "15 min",
      tags: ["analytics", "performance", "usage"],
    },
    {
      id: "admin-security",
      title: "Security Management",
      href: "/admin/security",
      icon: Lock,
      description: "Security settings and monitoring",
      category: "Security",
      status: "active",
      aiScore: 96,
      usageCount: 178,
      difficulty: "advanced",
      estimatedTime: "25 min",
      tags: ["security", "monitoring", "settings"],
    },
  ],
}

// Navigation registry
const navigationRegistry: Record<string, ModuleNavigation> = {
  hrms: hrmsNavigation,
  talent: talentNavigation,
  crm: crmNavigation,
  admin: adminNavigation,
}

// Export functions
export function getModuleNavigation(moduleId: string): ModuleNavigation | null {
  return navigationRegistry[moduleId] || null
}

export function getAllModules(): ModuleNavigation[] {
  return Object.values(navigationRegistry)
}

export function getPagesByModule(moduleId: string): PageItem[] {
  const module = navigationRegistry[moduleId]
  return module?.pages || []
}

export function getPageById(moduleId: string, pageId: string): PageItem | null {
  const module = navigationRegistry[moduleId]
  if (!module) return null

  return module.pages.find((page) => page.id === pageId) || null
}

export function searchPages(moduleId: string, query: string): PageItem[] {
  const module = navigationRegistry[moduleId]
  if (!module) return []

  const lowercaseQuery = query.toLowerCase()
  return module.pages.filter(
    (page) =>
      page.title.toLowerCase().includes(lowercaseQuery) ||
      page.description.toLowerCase().includes(lowercaseQuery) ||
      page.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getPagesByCategory(moduleId: string, category: string): PageItem[] {
  const module = navigationRegistry[moduleId]
  if (!module) return []

  return module.pages.filter((page) => page.category === category)
}

export function getModuleCategories(moduleId: string): string[] {
  const module = navigationRegistry[moduleId]
  return module?.categories || []
}

export const navigationData = {
  hrms: hrmsNavigation,
  talent: talentNavigation,
  crm: crmNavigation,
  admin: adminNavigation,
}

// Add the missing function
export function getModuleByPath(pathname: string): ModuleNavigation | null {
  // Extract module from pathname (e.g., "/talent/dashboard" -> "talent")
  const pathParts = pathname.split("/").filter(Boolean)
  if (pathParts.length === 0) return null

  const moduleId = pathParts[0]
  return getModuleNavigation(moduleId)
}
