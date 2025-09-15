"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Star,
  Clock,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Bell,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  Loader,
  Brain,
  Eye,
  Activity,
  BarChart3,
  Target,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  BarChart,
  FileBarChart,
  Bot,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavigationPage } from "@/lib/navigation-data"

interface PageSidebarProps {
  pages: NavigationPage[]
  currentPage?: string
  moduleTitle?: string
  moduleIcon?: any
  isCollapsed?: boolean
}

// CRM Pages in correct order
const crmPagesOrder = [
  {
    id: "crm-dashboard",
    name: "CRM Dashboard",
    path: "/crm/dashboard",
    icon: BarChart3,
    category: "overview",
    description: "CRM dashboard with key metrics and insights",
    aiScore: 95,
    usage: 85,
    isNew: false,
    isFavorite: true,
  },
  {
    id: "lead-management",
    name: "Lead Management",
    path: "/crm/leads",
    icon: Target,
    category: "sales",
    description: "Manage leads and their lifecycle",
    aiScore: 92,
    usage: 78,
    isNew: false,
    isFavorite: true,
  },
  {
    id: "contact-management",
    name: "Contact Management",
    path: "/crm/contacts",
    icon: Users,
    category: "contacts",
    description: "Manage contacts and their groups",
    aiScore: 88,
    usage: 72,
    isNew: false,
    isFavorite: false,
  },
  {
    id: "customer-engagement",
    name: "Customer Engagement",
    path: "/crm/engagement",
    icon: MessageSquare,
    category: "engagement",
    description: "Track customer engagement activities",
    aiScore: 85,
    usage: 65,
    isNew: false,
    isFavorite: true,
  },
  {
    id: "sales-pipeline",
    name: "Sales Pipeline",
    path: "/crm/pipeline",
    icon: TrendingUp,
    category: "sales",
    description: "Manage sales pipeline and deal stages",
    aiScore: 90,
    usage: 80,
    isNew: false,
    isFavorite: true,
  },
  {
    id: "documents-proposals",
    name: "Documents & Proposals",
    path: "/crm/documents",
    icon: FileText,
    category: "documents",
    description: "Manage documents and proposals",
    aiScore: 82,
    usage: 58,
    isNew: false,
    isFavorite: false,
  },
  {
    id: "calendar-tasks",
    name: "Calendar & Tasks",
    path: "/crm/calendar",
    icon: Calendar,
    category: "productivity",
    description: "Manage calendar and tasks",
    aiScore: 78,
    usage: 62,
    isNew: false,
    isFavorite: false,
  },
  {
    id: "crm-analytics",
    name: "CRM Analytics",
    path: "/crm/analytics",
    icon: BarChart,
    category: "analytics",
    description: "View CRM analytics and performance metrics",
    aiScore: 87,
    usage: 70,
    isNew: false,
    isFavorite: true,
  },
  {
    id: "reports-forecasts",
    name: "Reports & Forecasts",
    path: "/crm/reports",
    icon: FileBarChart,
    category: "analytics",
    description: "Generate and view reports and forecasts",
    aiScore: 84,
    usage: 55,
    isNew: false,
    isFavorite: false,
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    path: "/crm/ai-assistant",
    icon: Bot,
    category: "ai",
    description: "Access AI assistant for CRM tasks",
    aiScore: 96,
    usage: 45,
    isNew: true,
    isFavorite: false,
  },
  {
    id: "crm-settings",
    name: "CRM Settings",
    path: "/crm/settings",
    icon: Settings,
    category: "settings",
    description: "Configure CRM settings and integrations",
    aiScore: 75,
    usage: 35,
    isNew: false,
    isFavorite: false,
  },
]

export function PageSidebar({
  pages = [],
  currentPage = "",
  moduleTitle = "Module",
  moduleIcon: ModuleIcon = Shield,
  isCollapsed = false,
}: PageSidebarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("order")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [favorites, setFavorites] = useState<string[]>(crmPagesOrder.filter((p) => p.isFavorite).map((p) => p.id))
  const [aiInsights, setAiInsights] = useState(false) // Default to false to save space
  const [showQuickAccess, setShowQuickAccess] = useState(false) // Collapsible quick access

  // Use CRM pages if we're in CRM module, otherwise use provided pages
  const isCRMModule = moduleTitle.toLowerCase().includes("crm") || currentPage.startsWith("/crm")
  const displayPages = isCRMModule ? crmPagesOrder : pages

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(displayPages.map((p) => p.category).filter(Boolean)))
    return ["all", ...cats.sort()]
  }, [displayPages])

  // Filter and sort pages
  const filteredPages = useMemo(() => {
    const filtered = displayPages.filter((page) => {
      const matchesSearch =
        (page.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (page.category || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || page.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort pages
    if (sortBy === "order" && isCRMModule) {
      // Keep original CRM order
      return filtered
    }

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "")
          break
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "")
          break
        case "usage":
          comparison = (a.usage || 0) - (b.usage || 0)
          break
        case "aiScore":
          comparison = (a.aiScore || 0) - (b.aiScore || 0)
          break
        default:
          comparison = 0
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [displayPages, searchQuery, selectedCategory, sortBy, sortOrder, isCRMModule])

  const handlePageClick = (page: NavigationPage) => {
    router.push(page.path)
  }

  const toggleFavorite = (pageId: string) => {
    setFavorites((prev) => (prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]))
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "beta":
        return <Loader className="h-3 w-3 text-yellow-500" />
      case "coming-soon":
        return <Clock className="h-3 w-3 text-blue-500" />
      case "deprecated":
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <CheckCircle className="h-3 w-3 text-green-500" />
    }
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-emerald-600"
    if (score >= 80) return "from-blue-500 to-indigo-600"
    if (score >= 70) return "from-yellow-500 to-orange-600"
    return "from-red-500 to-pink-600"
  }

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col bg-white/70 backdrop-blur-sm border-r border-white/20">
        <div className="p-2 border-b border-white/20">
          <ModuleIcon className="h-4 w-4 text-primary mx-auto" />
        </div>
        <ScrollArea className="flex-1 p-1">
          <div className="space-y-1">
            {filteredPages.slice(0, 12).map((page) => {
              const isActive = currentPage === page.path
              const IconComponent = page.icon || Activity
              return (
                <Button
                  key={page.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn("w-full h-8 p-0 relative", isActive && "bg-primary text-primary-foreground shadow-md")}
                  onClick={() => handlePageClick(page)}
                >
                  <IconComponent className="h-3 w-3" />
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white/70 backdrop-blur-sm border-r border-white/20">
      {/* Compact Header */}
      <div className="p-3 border-b border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded-md bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <ModuleIcon className="h-3 w-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-xs truncate">{moduleTitle}</h2>
            {isCRMModule && <p className="text-xs text-muted-foreground">Correct Order</p>}
          </div>
        </div>

        {/* Compact Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-7 text-xs bg-white/50 border-white/30"
          />
        </div>
      </div>

      {/* Compact Filters */}
      <div className="p-3 border-b border-white/20 space-y-2">
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-7 text-xs bg-white/50 border-white/30 flex-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-xs">
                  {category === "all" ? "All" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/60"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/60"
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            >
              {viewMode === "list" ? <Grid className="h-3 w-3" /> : <List className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-7 text-xs bg-white/50 border-white/30">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {isCRMModule && (
              <SelectItem value="order" className="text-xs">
                Correct Order
              </SelectItem>
            )}
            <SelectItem value="aiScore" className="text-xs">
              AI Score
            </SelectItem>
            <SelectItem value="usage" className="text-xs">
              Usage
            </SelectItem>
            <SelectItem value="name" className="text-xs">
              Name
            </SelectItem>
            <SelectItem value="category" className="text-xs">
              Category
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Collapsible AI Insights */}
      <div className="border-b border-white/20">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between h-8 px-3 rounded-none hover:bg-white/60"
          onClick={() => setAiInsights(!aiInsights)}
        >
          <div className="flex items-center gap-2">
            <Brain className="h-3 w-3 text-purple-600" />
            <span className="text-xs font-medium">AI Insights</span>
          </div>
          {aiInsights ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        <AnimatePresence>
          {aiInsights && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: -0 }}
              className="overflow-hidden"
            >
              <div className="p-3 pt-0">
                <div className="space-y-1">
                  {filteredPages
                    .filter((p) => (p.aiScore || 0) > 85)
                    .slice(0, 2)
                    .map((page) => {
                      const IconComponent = page.icon || Activity
                      return (
                        <div
                          key={page.id}
                          className="p-2 rounded-md bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 cursor-pointer hover:shadow-sm transition-all duration-200"
                          onClick={() => handlePageClick(page)}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-medium text-purple-800 flex-1 truncate">
                              {page.name || "Untitled"}
                            </span>
                            <span className="text-xs text-purple-600">{page.aiScore || 0}%</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapsible Quick Access */}
      <div className="border-b border-white/20">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between h-8 px-3 rounded-none hover:bg-white/60"
          onClick={() => setShowQuickAccess(!showQuickAccess)}
        >
          <div className="flex items-center gap-2">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="text-xs font-medium">Quick Access</span>
          </div>
          {showQuickAccess ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        <AnimatePresence>
          {showQuickAccess && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 pt-0 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-7 text-xs hover:bg-white/60"
                  onClick={() => setSelectedCategory("all")}
                >
                  <Star className="h-3 w-3 mr-2 text-yellow-500" />
                  Favorites ({favorites.length})
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-7 text-xs hover:bg-white/60">
                  <Clock className="h-3 w-3 mr-2 text-blue-500" />
                  Recent (3)
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-7 text-xs hover:bg-white/60">
                  <Bell className="h-3 w-3 mr-2 text-orange-500" />
                  Notifications (0)
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compact Pages List */}
      <ScrollArea className="flex-1 p-2">
        <AnimatePresence>
          <div className="space-y-1">
            {filteredPages.map((page, index) => {
              const isActive = currentPage === page.path
              const isFavorite = favorites.includes(page.id)
              const IconComponent = page.icon || Activity

              return (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-2 transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                        : "hover:bg-white/60 hover:shadow-sm",
                    )}
                    onClick={() => handlePageClick(page)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div className="flex items-center gap-2 min-w-0">
                        {isCRMModule && sortBy === "order" && (
                          <span className="text-xs text-muted-foreground w-4 text-center font-mono flex-shrink-0">
                            {crmPagesOrder.findIndex((p) => p.id === page.id) + 1}
                          </span>
                        )}
                        <div
                          className={cn(
                            "p-1 rounded-md transition-all duration-200 flex-shrink-0",
                            isActive ? "bg-white/20" : "bg-muted/50",
                          )}
                        >
                          <IconComponent className={cn("h-3 w-3", isActive ? "text-white" : "text-muted-foreground")} />
                        </div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs truncate pr-2">{page.name || "Untitled"}</span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {page.isNew && <Badge className="h-3 px-1 text-xs bg-blue-500">New</Badge>}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-3 w-3 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(page.id)
                              }}
                            >
                              <Star
                                className={cn(
                                  "h-2 w-2",
                                  isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                                )}
                              />
                            </Button>
                          </div>
                        </div>

                        {/* Compact AI Score and Usage */}
                        {aiInsights && (
                          <div className="flex items-center justify-between mb-1">
                            <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${page.aiScore || 0}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={cn(
                                  "h-full rounded-full bg-gradient-to-r",
                                  isActive ? "from-white/60 to-white/40" : getAIScoreColor(page.aiScore || 0),
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-xs font-medium",
                                isActive ? "text-primary-foreground" : "text-foreground",
                              )}
                            >
                              {page.aiScore || 0}%
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {getStatusIcon("active")}
                            <span
                              className={cn(
                                "text-xs truncate",
                                isActive ? "text-primary-foreground/70" : "text-muted-foreground",
                              )}
                            >
                              {page.category || "Uncategorized"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye
                              className={cn(
                                "h-2 w-2",
                                isActive ? "text-primary-foreground/60" : "text-muted-foreground",
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs",
                                isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                              )}
                            >
                              {page.usage || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>

        {filteredPages.length === 0 && (
          <div className="text-center py-4">
            <Search className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No pages found</p>
          </div>
        )}
      </ScrollArea>

      {/* Compact Footer */}
      <div className="p-2 border-t border-white/20">
        <div className="text-xs text-muted-foreground text-center mb-1">
          {filteredPages.length} of {displayPages.length} pages
        </div>
        {isCRMModule && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
            <CardContent className="p-1">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-2 w-2 text-blue-600" />
                <span className="text-xs text-blue-800">Order: 1-11</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
