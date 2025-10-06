"use client"

import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Search, Grid3X3, List, Star, Clock, Filter, Zap, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getModuleByPath, getPagesByCategory, searchPages, type PageItem } from "@/lib/navigation-data"

interface PageSidebarProps {
  className?: string
  pages?: any[]
  currentPage?: string
  currentModule?: string
  moduleTitle?: string
  moduleIcon?: any
  isCollapsed?: boolean
}

export function PageSidebar({ className }: PageSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  // Get current module data
  const currentModule = useMemo(() => {
    return getModuleByPath(pathname)
  }, [pathname])

  // Filter and search pages
  const filteredPages = useMemo(() => {
    if (!currentModule) return []

    let pages = currentModule.pages

    // Apply search filter
    if (searchQuery.trim()) {
      pages = searchPages(currentModule.id, searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      pages = getPagesByCategory(currentModule.id, selectedCategory)
    }

    // Apply tab filter
    switch (activeTab) {
      case "favorites":
        pages = pages.filter((page) => page.isFavorite)
        break
      case "recent":
        pages = pages
          .filter((page) => page.lastVisited)
          .sort((a, b) => new Date(b.lastVisited!).getTime() - new Date(a.lastVisited!).getTime())
        break
      case "new":
        pages = pages.filter((page) => page.isNew)
        break
      default:
        break
    }

    return pages
  }, [currentModule, searchQuery, selectedCategory, activeTab])

  // Get categories for current module
  const categories = useMemo(() => {
    if (!currentModule) return []
    return ["all", ...currentModule.categories]
  }, [currentModule])

  if (!currentModule) {
    return null
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "beta":
        return "bg-blue-100 text-blue-800"
      case "coming-soon":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className={cn("w-80 border-r bg-background flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-lg">{currentModule.title} Pages</h2>
            <p className="text-sm text-muted-foreground">
              {filteredPages.length} of {currentModule.totalPages} pages
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 text-sm border rounded px-2 py-1"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-2">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="new" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            New
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="all" className="mt-0">
            <PageList
              pages={filteredPages}
              viewMode={viewMode}
              currentPath={pathname}
              getDifficultyColor={getDifficultyColor}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <PageList
              pages={filteredPages}
              viewMode={viewMode}
              currentPath={pathname}
              getDifficultyColor={getDifficultyColor}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            <PageList
              pages={filteredPages}
              viewMode={viewMode}
              currentPath={pathname}
              getDifficultyColor={getDifficultyColor}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="new" className="mt-0">
            <PageList
              pages={filteredPages}
              viewMode={viewMode}
              currentPath={pathname}
              getDifficultyColor={getDifficultyColor}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

interface PageListProps {
  pages: PageItem[]
  viewMode: "grid" | "list"
  currentPath: string
  getDifficultyColor: (difficulty?: string) => string
  getStatusColor: (status?: string) => string
}

function PageList({ pages, viewMode, currentPath, getDifficultyColor, getStatusColor }: PageListProps) {
  if (pages.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No pages found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  if (viewMode === "grid") {
    return (
      <div className="p-4 grid grid-cols-1 gap-3">
        {pages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            isActive={currentPath === page.href}
            getDifficultyColor={getDifficultyColor}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-2">
      {pages.map((page, index) => (
        <div key={page.id}>
          <PageListItem
            page={page}
            isActive={currentPath === page.href}
            getDifficultyColor={getDifficultyColor}
            getStatusColor={getStatusColor}
          />
          {index < pages.length - 1 && <Separator className="my-1" />}
        </div>
      ))}
    </div>
  )
}

interface PageCardProps {
  page: PageItem
  isActive: boolean
  getDifficultyColor: (difficulty?: string) => string
  getStatusColor: (status?: string) => string
}

function PageCard({ page, isActive, getDifficultyColor, getStatusColor }: PageCardProps) {
  const Icon = page.icon

  return (
    <Link href={page.href}>
      <div
        className={cn(
          "p-4 rounded-lg border transition-all hover:shadow-md group cursor-pointer",
          isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-md",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted group-hover:bg-primary group-hover:text-primary-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{page.title}</h3>
              {page.notifications && (
                <UIBadge variant="destructive" className="text-xs mt-1">
                  {page.notifications} notifications
                </UIBadge>
              )}
            </div>
          </div>
          {page.isNew && (
            <UIBadge variant="secondary" className="text-xs">
              New
            </UIBadge>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{page.description}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {page.difficulty && (
              <span className={cn("px-2 py-1 rounded-full text-xs", getDifficultyColor(page.difficulty))}>
                {page.difficulty}
              </span>
            )}
            {page.status && page.status !== "active" && (
              <span className={cn("px-2 py-1 rounded-full text-xs", getStatusColor(page.status))}>{page.status}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            {page.aiScore && (
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>{page.aiScore}%</span>
              </div>
            )}
            {page.estimatedTime && <span>{page.estimatedTime}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface PageListItemProps {
  page: PageItem
  isActive: boolean
  getDifficultyColor: (difficulty?: string) => string
  getStatusColor: (status?: string) => string
}

function PageListItem({ page, isActive, getDifficultyColor, getStatusColor }: PageListItemProps) {
  const Icon = page.icon

  return (
    <Link href={page.href}>
      <div
        className={cn(
          "p-3 rounded-md transition-all hover:bg-muted group cursor-pointer",
          isActive ? "bg-primary/10 border-l-2 border-l-primary" : "",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-1.5 rounded-md",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted group-hover:bg-primary group-hover:text-primary-foreground",
            )}
          >
            <Icon className="h-3 w-3" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{page.title}</h3>
              {page.isNew && (
                <UIBadge variant="secondary" className="text-xs">
                  New
                </UIBadge>
              )}
              {page.notifications && (
                <UIBadge variant="destructive" className="text-xs">
                  {page.notifications}
                </UIBadge>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {page.category && <span>{page.category}</span>}
              {page.estimatedTime && (
                <>
                  <span>•</span>
                  <span>{page.estimatedTime}</span>
                </>
              )}
              {page.aiScore && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    <span>{page.aiScore}%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {page.difficulty && (
              <span className={cn("px-2 py-1 rounded-full text-xs", getDifficultyColor(page.difficulty))}>
                {page.difficulty}
              </span>
            )}
            {page.status && page.status !== "active" && (
              <span className={cn("px-2 py-1 rounded-full text-xs", getStatusColor(page.status))}>{page.status}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
