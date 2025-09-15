"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserCheck,
  Users2,
  Star,
  Building2,
  DollarSign,
  Settings,
  Shield,
  Brain,
  Activity,
  Bell,
  ChevronRight,
  Plus,
  ShieldCheck,
  Home,
  Briefcase,
} from "lucide-react"

interface Module {
  id: string
  name: string
  icon: any
  href: string
  gradient: string
  notifications?: number
  isNew?: boolean
  description: string
}

const modules: Module[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    href: "/dashboard",
    gradient: "from-blue-500 to-cyan-500",
    notifications: 0,
    description: "Overview & Analytics",
  },
  {
    id: "crm",
    name: "CRM",
    icon: Users,
    href: "/crm/dashboard",
    gradient: "from-green-500 to-emerald-500",
    notifications: 3,
    description: "Customer relationship management",
  },
  {
    id: "talent",
    name: "Talent/ATS",
    icon: UserCheck,
    href: "/talent/dashboard",
    gradient: "from-purple-500 to-violet-500",
    notifications: 7,
    description: "Talent acquisition & management",
  },
  {
    id: "hrms",
    name: "HRMS",
    icon: Building2,
    href: "/hrms/dashboard",
    gradient: "from-teal-500 to-cyan-500",
    notifications: 2,
    description: "Human resource management",
  },
  {
    id: "bench",
    name: "Bench Marketing",
    icon: Users2,
    href: "/bench",
    gradient: "from-orange-500 to-red-500",
    notifications: 2,
    description: "Bench resource management",
  },
  {
    id: "hotlist",
    name: "Hotlist Marketing",
    icon: Star,
    href: "/hotlist",
    gradient: "from-yellow-500 to-orange-500",
    isNew: true,
    description: "Priority candidate tracking",
  },
  {
    id: "finance",
    name: "Finance",
    icon: DollarSign,
    href: "/finance",
    gradient: "from-emerald-500 to-teal-600",
    notifications: 1,
    description: "Financial management & reporting",
  },
  {
    id: "vms",
    name: "VMS",
    icon: Shield,
    href: "/vms",
    gradient: "from-red-500 to-pink-500",
    description: "Vendor management system",
  },
  {
    id: "project-management",
    name: "Project Management",
    icon: Briefcase,
    href: "/project-management",
    gradient: "from-indigo-500 to-blue-600",
    description: "Project management & tracking",
  },
  {
    id: "tenant",
    name: "Tenant",
    icon: Settings,
    href: "/tenant",
    gradient: "from-blue-500 to-indigo-500",
    description: "Tenant configuration",
  },
  {
    id: "admin",
    name: "Admin",
    icon: ShieldCheck,
    href: "/admin/dashboard",
    gradient: "from-red-600 to-orange-600",
    notifications: 12,
    description: "Admin configuration",
  },
]

interface AppSidebarProps {
  className?: string
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname()
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const getActiveModule = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    return pathSegments[0] || "dashboard"
  }

  const activeModule = getActiveModule()

  return (
    <div
      className={`${collapsed ? "w-16" : "w-64"} bg-white/60 backdrop-blur-xl border-r border-white/20 shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="hidden lg:block">
                <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ESG OS
                </h2>
                <p className="text-xs text-muted-foreground">Enterprise Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Assistant Quick Access */}
        <div className="p-4 lg:p-6 border-b border-white/20">
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
            size={collapsed ? "sm" : "default"}
          >
            <Brain className="h-4 w-4 lg:mr-2" />
            {!collapsed && <span className="hidden lg:inline">AI Assistant</span>}
          </Button>
        </div>

        {/* Modules */}
        <ScrollArea className="flex-1 px-2 lg:px-4">
          <div className="space-y-2 py-4">
            {modules.map((module, index) => {
              const isActive = activeModule === module.id
              const IconComponent = module.icon

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onHoverStart={() => setHoveredModule(module.id)}
                  onHoverEnd={() => setHoveredModule(null)}
                >
                  <Link href={module.href}>
                    <div
                      className={`relative group p-3 lg:p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r " + module.gradient + " shadow-lg text-white"
                          : "bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/20 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-white/20"
                              : `bg-gradient-to-br ${module.gradient} group-hover:scale-110 shadow-md`
                          }`}
                        >
                          <IconComponent className={`h-5 w-5 ${isActive ? "text-white" : "text-white"}`} />
                        </div>

                        {!collapsed && (
                          <div className="hidden lg:block flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3
                                className={`font-semibold text-sm truncate ${isActive ? "text-white" : "text-gray-900"}`}
                              >
                                {module.name}
                              </h3>
                              <div className="flex items-center gap-1">
                                {module.notifications && (
                                  <Badge
                                    variant="secondary"
                                    className={`h-5 px-1.5 text-xs ${
                                      isActive ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                                    }`}
                                  >
                                    {module.notifications}
                                  </Badge>
                                )}
                                {module.isNew && (
                                  <Badge
                                    variant="secondary"
                                    className={`h-5 px-1.5 text-xs ${
                                      isActive ? "bg-white/20 text-white" : "bg-green-100 text-green-600"
                                    }`}
                                  >
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p
                              className={`text-xs mt-1 truncate ${isActive ? "text-white/80" : "text-muted-foreground"}`}
                            >
                              {module.description}
                            </p>
                          </div>
                        )}

                        {!collapsed && (
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isActive ? "text-white" : "text-gray-400 group-hover:translate-x-1"
                            } ${hoveredModule === module.id ? "translate-x-1" : ""}`}
                          />
                        )}
                      </div>

                      {/* Hover tooltip for collapsed state */}
                      {collapsed && hoveredModule === module.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                        >
                          {module.name}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                        </motion.div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>

        <Separator className="bg-white/20" />

        {/* Footer */}
        <div className="p-4 lg:p-6 space-y-3">
          {/* Quick Actions */}
          {!collapsed && (
            <div className="hidden lg:block">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="bg-white/40 backdrop-blur-sm border-white/20">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
                <Button variant="outline" size="sm" className="bg-white/40 backdrop-blur-sm border-white/20">
                  <Activity className="h-3 w-3 mr-1" />
                  Stats
                </Button>
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="flex items-center gap-2 p-2 lg:p-3 rounded-xl bg-green-50 border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {!collapsed && (
              <div className="hidden lg:block">
                <p className="text-xs font-medium text-green-800">System Online</p>
                <p className="text-xs text-green-600">All services operational</p>
              </div>
            )}
          </div>

          {/* Notifications */}
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white/40 backdrop-blur-sm border-white/20 hover:bg-white/60"
          >
            <Bell className="h-4 w-4 lg:mr-2" />
            {!collapsed && <span className="hidden lg:inline">Notifications</span>}
            <Badge variant="secondary" className="ml-auto lg:ml-2 bg-red-100 text-red-600">
              5
            </Badge>
          </Button>

          {/* Collapse Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full bg-white/40 backdrop-blur-sm border-white/20 hover:bg-white/60"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span className="hidden lg:inline ml-2">Collapse</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
