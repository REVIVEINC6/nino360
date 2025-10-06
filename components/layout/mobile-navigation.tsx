"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  Users,
  Briefcase,
  Building2,
  DollarSign,
  Award,
  Shield,
  Bot,
  ExternalLink,
  ArrowLeft,
} from "lucide-react"

interface MobileNavigationProps {
  currentModule?: string
  currentPage?: string
  onNavigate?: (path: string) => void
}

const modules = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Overview and analytics",
    icon: Home,
    path: "/dashboard",
    badge: "Home",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "crm",
    name: "Customer CRM",
    description: "Manage leads and customers",
    icon: Users,
    path: "/crm",
    badge: "Active",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "talent",
    name: "Talent Management",
    description: "Recruit and hire talent",
    icon: Briefcase,
    path: "/talent",
    badge: "Growing",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "hrms",
    name: "HRMS",
    description: "Employee management",
    icon: Building2,
    path: "/hrms",
    badge: "Stable",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Financial management",
    icon: DollarSign,
    path: "/finance",
    badge: "Profitable",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "training",
    name: "Training",
    description: "Learning and development",
    icon: Award,
    path: "/training",
    badge: "Expanding",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "admin",
    name: "Admin",
    description: "System administration",
    icon: Shield,
    path: "/admin",
    badge: "Secure",
    color: "from-gray-500 to-slate-500",
  },
]

const quickActions = [
  {
    name: "AI Assistant",
    description: "Get AI-powered insights",
    icon: Bot,
    action: "ai-assistant",
    color: "from-purple-500 to-blue-500",
  },
  {
    name: "Search",
    description: "Find anything quickly",
    icon: Search,
    action: "search",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Notifications",
    description: "View recent updates",
    icon: Bell,
    action: "notifications",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Profile",
    description: "Manage your account",
    icon: User,
    action: "profile",
    color: "from-green-500 to-emerald-500",
  },
]

const recentItems = [
  { name: "New Lead: TechCorp Inc.", path: "/crm/leads", time: "2 min ago", type: "lead" },
  { name: "Meeting with DataFlow", path: "/crm/calendar", time: "1 hour ago", type: "meeting" },
  { name: "Quarterly Report", path: "/crm/reports", time: "3 hours ago", type: "report" },
  { name: "Training Session", path: "/training", time: "1 day ago", type: "training" },
]

export function MobileNavigation({ currentModule, currentPage, onNavigate }: MobileNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState("modules")

  // Handle navigation
  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      router.push(path)
    }
    setIsOpen(false)
  }

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "ai-assistant":
        // Trigger AI assistant
        break
      case "search":
        setActiveSection("search")
        break
      case "notifications":
        setActiveSection("notifications")
        break
      case "profile":
        handleNavigation("/settings/profile")
        break
      default:
        break
    }
  }

  // Filter modules based on search
  const filteredModules = modules.filter(
    (module) =>
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-80 p-0 bg-white/95 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/nino360-primary.png?height=40&width=40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-left text-lg">John Doe</SheetTitle>
                <SheetDescription className="text-left">Administrator</SheetDescription>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
            </div>
          </SheetHeader>

          {/* Search */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules, pages, or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 border-white/20"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200/50">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <motion.div key={action.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    className="h-16 w-full flex-col gap-1 bg-white/50 hover:bg-white/70 border-white/20"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${action.color} shadow-sm`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">{action.name}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <ScrollArea className="flex-1">
            {activeSection === "modules" && (
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">Modules</h3>
                <div className="space-y-2">
                  {filteredModules.map((module) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-auto p-4 ${
                          currentModule === module.id ? "bg-blue-50 border border-blue-200" : "hover:bg-white/70"
                        }`}
                        onClick={() => handleNavigation(module.path)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${module.color} shadow-lg`}>
                            <module.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-gray-900">{module.name}</div>
                            <div className="text-sm text-muted-foreground">{module.description}</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {module.badge}
                          </Badge>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <Separator />

                <h3 className="text-sm font-semibold text-gray-900">Recent</h3>
                <div className="space-y-2">
                  {recentItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-auto p-3 hover:bg-white/70"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.time}</div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "search" && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setActiveSection("modules")}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-sm font-semibold text-gray-900">Search Results</h3>
                </div>
                <div className="space-y-2">
                  {searchQuery ? (
                    filteredModules.length > 0 ? (
                      filteredModules.map((module) => (
                        <Button
                          key={module.id}
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 hover:bg-white/70"
                          onClick={() => handleNavigation(module.path)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <module.icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-gray-900">{module.name}</div>
                              <div className="text-xs text-muted-foreground">{module.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No results found</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Start typing to search</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setActiveSection("modules")}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      title: "New lead assigned",
                      description: "TechCorp Inc. has been assigned to you",
                      time: "2 min ago",
                      type: "info",
                      unread: true,
                    },
                    {
                      title: "Meeting reminder",
                      description: "Product demo in 30 minutes",
                      time: "28 min ago",
                      type: "warning",
                      unread: true,
                    },
                    {
                      title: "Report generated",
                      description: "Q3 sales report is ready",
                      time: "2 hours ago",
                      type: "success",
                      unread: false,
                    },
                  ].map((notification, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        notification.unread ? "bg-blue-50/50 border-blue-200/50" : "bg-white/50 border-gray-200/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-blue-500" : "bg-gray-300"}`}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{notification.description}</div>
                          <div className="text-xs text-muted-foreground mt-2">{notification.time}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/settings")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation("/logout")}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
