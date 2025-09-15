"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Building2,
  Briefcase,
  UserCheck,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Sparkles,
  Plus,
  Search,
  Home,
  Zap,
  Brain,
  Activity,
  Star,
  Users2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const modules = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    href: "/dashboard",
    description: "Overview & Analytics",
    color: "from-blue-500 to-blue-600",
    notifications: 0,
    status: "active",
    usage: 85,
  },
  {
    id: "crm",
    name: "CRM",
    icon: Users,
    href: "/crm",
    description: "Customer Relations",
    color: "from-green-500 to-emerald-600",
    notifications: 3,
    status: "active",
    usage: 72,
  },
  {
    id: "talent",
    name: "Talent/ATS",
    icon: UserCheck,
    href: "/talent",
    description: "Talent Acquisition & HR",
    color: "from-purple-500 to-violet-600",
    notifications: 7,
    status: "active",
    usage: 68,
  },
  {
    id: "hrms",
    name: "HRMS",
    icon: Building2,
    href: "/hrms",
    description: "Human Resources",
    color: "from-teal-500 to-cyan-600",
    notifications: 2,
    status: "active",
    usage: 91,
  },
  {
    id: "bench",
    name: "Bench Marketing",
    icon: Users2,
    href: "/bench",
    description: "Bench Resource Management",
    color: "from-orange-500 to-red-500",
    notifications: 2,
    status: "active",
    usage: 56,
  },
  {
    id: "hotlist",
    name: "Hotlist Marketing",
    icon: Star,
    href: "/hotlist",
    description: "Priority Candidate Tracking",
    color: "from-yellow-500 to-orange-500",
    notifications: 0,
    status: "active",
    usage: 43,
  },
  {
    id: "finance",
    name: "Finance",
    icon: DollarSign,
    href: "/finance",
    description: "Financial Management & Reporting",
    color: "from-emerald-500 to-teal-600",
    notifications: 1,
    status: "active",
    usage: 78,
  },
  {
    id: "vms",
    name: "VMS",
    icon: Shield,
    href: "/vms",
    description: "Vendor Management System",
    color: "from-red-500 to-pink-600",
    notifications: 0,
    status: "active",
    usage: 34,
  },
  {
    id: "project-management",
    name: "Project Management",
    icon: Briefcase,
    href: "/project-management",
    description: "Project Management & Tracking",
    color: "from-indigo-500 to-blue-600",
    notifications: 0,
    status: "active",
    usage: 65,
  },
  {
    id: "tenant",
    name: "Tenant",
    icon: Settings,
    href: "/tenant",
    description: "Tenant Configuration",
    color: "from-blue-500 to-indigo-500",
    notifications: 0,
    status: "active",
    usage: 43,
  },
  {
    id: "admin",
    name: "Admin",
    icon: Shield,
    href: "/admin",
    description: "System Administration",
    color: "from-red-600 to-orange-600",
    notifications: 12,
    status: "active",
    usage: 78,
  },
]

const quickActions = [
  { icon: Plus, label: "Create", action: "create", color: "text-green-600" },
  { icon: Search, label: "Search", action: "search", color: "text-blue-600" },
  { icon: Bell, label: "Alerts", action: "alerts", color: "text-orange-600" },
  { icon: BarChart3, label: "Reports", action: "reports", color: "text-purple-600" },
]

const aiSuggestions = [
  { text: "Check CRM pipeline", confidence: 95 },
  { text: "Review pending approvals", confidence: 87 },
  { text: "Update talent metrics", confidence: 78 },
]

interface ModuleSidebarProps {
  currentModule?: string
  isCollapsed?: boolean
}

export function ModuleSidebar({ currentModule = "dashboard", isCollapsed = false }: ModuleSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)
  const [aiMode, setAiMode] = useState(false)

  const handleModuleClick = (module: (typeof modules)[0]) => {
    router.push(module.href)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create":
        // Open create modal
        break
      case "search":
        // Focus search input or open command palette
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
        break
      case "alerts":
        router.push("/notifications")
        break
      case "reports":
        router.push("/reports")
        break
    }
  }

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm border-r border-white/20">
        {/* Collapsed Header */}
        <div className="p-3 border-b border-white/20">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Collapsed Modules */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {modules.map((module) => {
              const isActive = pathname.startsWith(module.href)
              return (
                <Button
                  key={module.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full h-12 p-0 relative group",
                    isActive && "bg-gradient-to-r " + module.color + " text-white shadow-lg",
                  )}
                  onClick={() => handleModuleClick(module)}
                >
                  <module.icon className="h-5 w-5" />
                  {module.notifications > 0 && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {module.notifications > 9 ? "9+" : module.notifications}
                      </span>
                    </div>
                  )}
                </Button>
              )
            })}
          </div>
        </ScrollArea>

        {/* Collapsed AI Toggle */}
        <div className="p-2 border-t border-white/20">
          <Button
            variant={aiMode ? "default" : "ghost"}
            size="sm"
            className="w-full h-10 p-0"
            onClick={() => setAiMode(!aiMode)}
          >
            <Brain className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm border-r border-white/20">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ESG OS
            </h2>
            <p className="text-xs text-muted-foreground">AI-Powered Platform</p>
          </div>
        </div>
      </div>

      {/* AI Mode Toggle */}
      <div className="p-4 border-b border-white/20">
        <Button
          variant={aiMode ? "default" : "outline"}
          size="sm"
          className={cn(
            "w-full justify-start gap-2 transition-all duration-200",
            aiMode && "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg",
          )}
          onClick={() => setAiMode(!aiMode)}
        >
          <Brain className="h-4 w-4" />
          <span>AI Assistant</span>
          {aiMode && <Zap className="h-3 w-3 ml-auto" />}
        </Button>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {aiMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/20 overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                AI Suggestions
              </h3>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 cursor-pointer hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="text-xs text-purple-800">{suggestion.text}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="h-1 bg-purple-200 rounded-full flex-1">
                          <div
                            className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${suggestion.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-purple-600">{suggestion.confidence}%</span>
                      </div>
                    </div>
                    <Star className="h-3 w-3 text-purple-500" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="p-4 border-b border-white/20">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-10 text-xs bg-white/50 hover:bg-white/80 border-white/30 transition-all duration-200"
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className={cn("h-3 w-3 mr-1", action.color)} />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Modules */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Modules</h3>
          {modules.map((module) => {
            const isActive = pathname.startsWith(module.href)
            const isHovered = hoveredModule === module.id

            return (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredModule(module.id)}
                onHoverEnd={() => setHoveredModule(null)}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto p-3 transition-all duration-200",
                    isActive
                      ? `bg-gradient-to-r ${module.color} text-white shadow-lg hover:shadow-xl`
                      : "hover:bg-white/60 hover:shadow-sm",
                  )}
                  onClick={() => handleModuleClick(module)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        isActive ? "bg-white/20 shadow-inner" : `bg-gradient-to-br ${module.color} shadow-sm`,
                      )}
                    >
                      <module.icon
                        className={cn("h-4 w-4 transition-colors duration-200", isActive ? "text-white" : "text-white")}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{module.name}</span>
                        <div className="flex items-center gap-1">
                          {module.notifications > 0 && (
                            <Badge className="h-5 px-2 text-xs bg-red-500 text-white shadow-sm">
                              {module.notifications > 9 ? "9+" : module.notifications}
                            </Badge>
                          )}
                          {isHovered && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2 w-2 bg-green-400 rounded-full"
                            />
                          )}
                        </div>
                      </div>
                      <p
                        className={cn(
                          "text-xs transition-colors duration-200",
                          isActive ? "text-white/80" : "text-muted-foreground",
                        )}
                      >
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Activity className={cn("h-3 w-3", isActive ? "text-white/60" : "text-muted-foreground")} />
                          <span className={cn("text-xs", isActive ? "text-white/80" : "text-muted-foreground")}>
                            {module.usage}% active
                          </span>
                        </div>
                        <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${module.usage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={cn(
                              "h-full rounded-full",
                              isActive ? "bg-white/60" : "bg-gradient-to-r " + module.color,
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>

      {/* System Status */}
      <div className="p-4 border-t border-white/20">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">System Healthy</span>
              <Badge className="ml-auto bg-green-100 text-green-700 text-xs">99.9%</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">API Health</span>
                <span className="font-medium text-green-600">Optimal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-indigo-200">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-medium">
              SA
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">System Admin</p>
            <p className="text-xs text-muted-foreground">Super Administrator</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/60">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
