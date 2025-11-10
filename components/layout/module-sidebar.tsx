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
  Shield,
  UserCog,
  Zap,
  GraduationCap,
  Flame,
  Database,
  Lock,
} from "lucide-react"

const modules = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "CRM", href: "/crm", icon: Building2 },
  { title: "Talent", href: "/talent", icon: Users },
  { title: "Bench", href: "/bench", icon: UserCheck },
  { title: "Hotlist", href: "/hotlist", icon: Flame },
  { title: "HRMS", href: "/hrms", icon: UserCog },
  { title: "VMS", href: "/vms", icon: Briefcase },
  { title: "Finance", href: "/finance", icon: DollarSign },
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { title: "Training", href: "/training", icon: GraduationCap },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Admin", href: "/admin", icon: Shield },
  { title: "Tenant", href: "/tenant", icon: Building2 },
  { title: "Automation", href: "/automation", icon: Zap },
  { title: "Analytics", href: "/analytics", icon: Database },
  { title: "Security", href: "/security", icon: Lock },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function ModuleSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-20 flex flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b">
        <Link href="/dashboard">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">N</span>
          </div>
        </Link>
      </div>

      {/* Module Icons */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {modules.map((module) => {
          const isActive = pathname === module.href || pathname.startsWith(`${module.href}/`)
          return (
            <Link key={module.href} href={module.href}>
              <div
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={module.title}
              >
                <module.icon className="h-5 w-5" />
                <span className="text-[10px] leading-tight text-center">{module.title}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
