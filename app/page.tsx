"use client"
import { Nino360EnterpriseLanding } from "@/components/landing/nino360-enterprise-landing"
import { SmartNavigationProvider } from "@/components/navigation/smart-navigation-provider"
import {
  LayoutDashboard,
  Users,
  Star,
  Calculator,
  Settings,
  Target,
  Clock,
  UserCog,
  Briefcase,
  TrendingUp,
  User,
} from "lucide-react"

const defaultNavigationItems = [
  {
    id: "dashboard",
    title: "AI Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    category: "Main",
    keywords: ["home", "overview", "main", "ai", "intelligence"],
  },
  {
    id: "crm",
    title: "CRM",
    href: "/crm",
    icon: Users,
    category: "Business",
    keywords: ["customer", "relationship", "management", "clients"],
  },
  {
    id: "talent",
    title: "Talent",
    href: "/talent",
    icon: Star,
    category: "Business",
    keywords: ["recruitment", "hiring", "candidates", "talent"],
  },
  {
    id: "bench",
    title: "Bench",
    href: "/bench",
    icon: User,
    category: "Business",
    keywords: ["bench", "available", "resources", "allocation"],
  },
  {
    id: "hotlist",
    title: "Hotlist Management",
    href: "/hotlist",
    icon: Target,
    category: "Business",
    keywords: ["hotlist", "priority", "candidates", "management"],
  },
  {
    id: "hrms",
    title: "HRMS",
    href: "/hrms",
    icon: UserCog,
    category: "Business",
    keywords: ["human", "resources", "employees", "management"],
  },
  {
    id: "finance",
    title: "Finance",
    href: "/finance",
    icon: Calculator,
    category: "Business",
    keywords: ["finance", "accounting", "budget", "money"],
  },
  {
    id: "vms",
    title: "VMS",
    href: "/vms",
    icon: Briefcase,
    category: "Business",
    keywords: ["vendor", "management", "system", "suppliers"],
  },
  {
    id: "training",
    title: "Training",
    href: "/training",
    icon: Clock,
    category: "Business",
    keywords: ["training", "learning", "development", "courses"],
  },
  {
    id: "project-management",
    title: "Project Management",
    href: "/project-management",
    icon: TrendingUp,
    category: "Business",
    keywords: ["projects", "management", "tasks", "planning"],
  },
  {
    id: "settings",
    title: "Settings",
    href: "/settings",
    icon: Settings,
    category: "Settings",
    keywords: ["preferences", "configuration", "options", "settings"],
  },
]

export default function HomePage() {
  return (
    <SmartNavigationProvider navigationItems={defaultNavigationItems}>
      <div className="min-h-screen bg-background">
        <Nino360EnterpriseLanding />
      </div>
    </SmartNavigationProvider>
  )
}
