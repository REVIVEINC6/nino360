"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  UserCheck,
  Activity,
  Target,
  DollarSign,
  Building2,
  Shield,
  Briefcase,
  Star,
} from "lucide-react"

// Navigation item interface
export interface NavigationItem {
  id: string
  title: string
  href: string
  icon: any
  description: string
  color: string
  gradient: string
  notifications?: number
  isNew?: boolean
  category?: string
  aiScore?: number
  usage?: number
}

// Page item interface for recent and favorites
export interface PageItem {
  id: string
  name: string
  path: string
  icon?: any
}

// AI Navigation Context
interface AINavigationContextType {
  navigationItems: NavigationItem[]
  currentModule: string | null
  navigateTo: (href: string) => void
  suggestions: NavigationItem[]
  recentItems: NavigationItem[]
  favoriteItems: NavigationItem[]
  // Add these properties that the command palette expects
  recentPages: PageItem[]
  favorites: PageItem[]
  searchResults?: any[]
  getSmartSuggestions?: () => void
  addToFavorites: (item: NavigationItem) => void
  removeFromFavorites: (id: string) => void
  searchItems: (query: string) => NavigationItem[]
  isCommandPaletteOpen: boolean
  setIsCommandPaletteOpen: (open: boolean) => void
  trackNavigation: (href: string) => void
}

const AINavigationContext = createContext<AINavigationContextType | undefined>(undefined)

// Navigation items data
const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Main dashboard and overview",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-indigo-500",
    category: "overview",
    aiScore: 95,
    usage: 89,
  },
  {
    id: "crm",
    title: "CRM",
    href: "/crm",
    icon: Target,
    description: "Customer relationship management",
    color: "bg-green-500",
    gradient: "from-green-500 to-emerald-500",
    notifications: 5,
    category: "sales",
    aiScore: 92,
    usage: 85,
  },
  {
    id: "talent",
    title: "Talent/ATS",
    href: "/talent",
    icon: Users,
    description: "Talent acquisition and management",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-indigo-500",
    notifications: 12,
    category: "hr",
    aiScore: 90,
    usage: 82,
  },
  {
    id: "hrms",
    title: "HRMS",
    href: "/hrms",
    icon: UserCheck,
    description: "Human resource management system",
    color: "bg-teal-500",
    gradient: "from-teal-500 to-cyan-500",
    notifications: 6,
    category: "hr",
    aiScore: 88,
    usage: 79,
  },
  {
    id: "bench",
    title: "Bench Marketing",
    href: "/bench",
    icon: Activity,
    description: "Bench management and resource allocation",
    color: "bg-orange-500",
    gradient: "from-orange-500 to-red-500",
    notifications: 4,
    category: "operations",
    aiScore: 85,
    usage: 76,
  },
  {
    id: "hotlist",
    title: "Hotlist Marketing",
    href: "/hotlist",
    icon: Star,
    description: "Priority candidate tracking",
    color: "bg-yellow-500",
    gradient: "from-yellow-500 to-orange-500",
    isNew: true,
    category: "marketing",
    aiScore: 83,
    usage: 73,
  },
  {
    id: "finance",
    title: "Finance",
    href: "/finance",
    icon: DollarSign,
    description: "Financial management and accounting",
    color: "bg-emerald-500",
    gradient: "from-emerald-500 to-green-500",
    notifications: 4,
    category: "finance",
    aiScore: 87,
    usage: 78,
  },
  {
    id: "vms",
    title: "VMS",
    href: "/vms",
    icon: Shield,
    description: "Vendor management system",
    color: "bg-red-500",
    gradient: "from-red-500 to-pink-500",
    category: "operations",
    aiScore: 80,
    usage: 70,
  },
  {
    id: "project-management",
    title: "Project Management",
    href: "/project-management",
    icon: Briefcase,
    description: "Project management and tracking",
    color: "bg-indigo-500",
    gradient: "from-indigo-500 to-blue-500",
    category: "operations",
    aiScore: 82,
    usage: 68,
  },
  {
    id: "tenant",
    title: "Tenant",
    href: "/tenant",
    icon: Building2,
    description: "Tenant management and configuration",
    color: "bg-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    notifications: 3,
    category: "admin",
    aiScore: 86,
    usage: 75,
  },
  {
    id: "admin",
    title: "Admin",
    href: "/admin",
    icon: Shield,
    description: "System administration and management",
    color: "bg-red-500",
    gradient: "from-red-500 to-pink-500",
    notifications: 7,
    category: "admin",
    aiScore: 94,
    usage: 88,
  },
]

export function AINavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentModule, setCurrentModule] = useState<string | null>(null)
  const [recentItems, setRecentItems] = useState<NavigationItem[]>([])
  const [favoriteItems, setFavoriteItems] = useState<NavigationItem[]>([])
  const [suggestions, setSuggestions] = useState<NavigationItem[]>([])
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Update current module based on pathname
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const moduleId = pathSegments[0]
    setCurrentModule(moduleId || null)
  }, [pathname])

  // Generate AI suggestions based on current context
  useEffect(() => {
    const generateSuggestions = () => {
      // Get suggestions based on current module and usage patterns
      const currentModuleItem = navigationItems.find((item) => item.id === currentModule)
      const relatedItems = navigationItems.filter(
        (item) => item.category === currentModuleItem?.category && item.id !== currentModule,
      )
      const highUsageItems = navigationItems
        .filter((item) => (item.usage || 0) > 80 && item.id !== currentModule)
        .sort((a, b) => (b.usage || 0) - (a.usage || 0))

      const suggestions = [...relatedItems.slice(0, 2), ...highUsageItems.slice(0, 3)].slice(0, 4)
      setSuggestions(suggestions)
    }

    generateSuggestions()
  }, [currentModule])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("navigation-favorites")
    if (savedFavorites) {
      try {
        const favoriteIds = JSON.parse(savedFavorites)
        const favorites = navigationItems.filter((item) => favoriteIds.includes(item.id))
        setFavoriteItems(favorites)
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [])

  // Load recent items from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem("navigation-recent")
    if (savedRecent) {
      try {
        const recentIds = JSON.parse(savedRecent)
        const recent = recentIds
          .map((id: string) => navigationItems.find((item) => item.id === id))
          .filter(Boolean)
          .slice(0, 5)
        setRecentItems(recent)
      } catch (error) {
        console.error("Error loading recent items:", error)
      }
    }
  }, [])

  const navigateTo = useCallback(
    (href: string) => {
      router.push(href)
      trackNavigation(href)
    },
    [router],
  )

  const trackNavigation = useCallback((href: string) => {
    const moduleId = href.split("/")[1]
    const item = navigationItems.find((item) => item.id === moduleId)
    if (item) {
      setRecentItems((prev) => {
        const updated = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 5)
        localStorage.setItem("navigation-recent", JSON.stringify(updated.map((i) => i.id)))
        return updated
      })
    }
  }, [])

  const addToFavorites = useCallback((item: NavigationItem) => {
    setFavoriteItems((prev) => {
      const updated = [...prev, item]
      localStorage.setItem("navigation-favorites", JSON.stringify(updated.map((i) => i.id)))
      return updated
    })
  }, [])

  const removeFromFavorites = useCallback((id: string) => {
    setFavoriteItems((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      localStorage.setItem("navigation-favorites", JSON.stringify(updated.map((i) => i.id)))
      return updated
    })
  }, [])

  const searchItems = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase()
    const results = navigationItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        (item.category || "").toLowerCase().includes(lowerQuery),
    )
    setSearchResults(results)
    return results
  }, [])

  const value: AINavigationContextType = {
    navigationItems,
    currentModule,
    navigateTo,
    suggestions,
    recentItems,
    favoriteItems,
    // Add these to match what command palette expects
    recentPages: recentItems.map((item) => ({
      id: item.id,
      name: item.title,
      path: item.href,
      icon: item.icon,
    })),
    favorites: favoriteItems.map((item) => ({
      id: item.id,
      name: item.title,
      path: item.href,
      icon: item.icon,
    })),
    searchResults,
    getSmartSuggestions: () => {},
    addToFavorites,
    removeFromFavorites,
    searchItems,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    trackNavigation,
  }

  return <AINavigationContext.Provider value={value}>{children}</AINavigationContext.Provider>
}

export function useAINavigation() {
  const context = useContext(AINavigationContext)
  if (context === undefined) {
    throw new Error("useAINavigation must be used within an AINavigationProvider")
  }
  return context
}
