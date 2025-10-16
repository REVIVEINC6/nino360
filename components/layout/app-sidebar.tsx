"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  Building2,
  DollarSign,
  FolderKanban,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCog,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Shield,
  },
  {
    title: "Tenant",
    href: "/tenant/dashboard",
    icon: Building2,
  },
  {
    title: "CRM",
    href: "/crm",
    icon: Building2,
  },
  {
    title: "Talent",
    href: "/talent",
    icon: Users,
  },
  {
    title: "Bench",
    href: "/bench",
    icon: UserCheck,
  },
  {
    title: "VMS",
    href: "/vms",
    icon: Briefcase,
  },
  {
    title: "HRMS",
    href: "/hrms/dashboard",
    icon: UserCog,
  },
  {
    title: "Finance",
    href: "/finance",
    icon: DollarSign,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Automation",
    href: "/automation",
    icon: Zap,
  },
]

const bottomNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn("relative flex flex-col border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-xl font-bold">NINO360</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">N</span>
            </div>
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t p-2 space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  )
}
