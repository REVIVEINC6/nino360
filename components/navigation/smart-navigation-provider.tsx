"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface NavigationItem {
  id: string
  // either `name` or `title` may be present depending on callers
  name?: string
  title?: string
  isFavorite?: boolean
  href: string
  icon?: any
  description?: string
  category?: string
  keywords?: string[]
}

interface SmartNavigationContextType {
  navigationItems: NavigationItem[]
  currentPath: string
  navigate: (path: string) => void
  searchItems: (query: string) => NavigationItem[]
  isCommandPaletteOpen: boolean
  setIsCommandPaletteOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  filteredItems: NavigationItem[]
  favoriteItems: NavigationItem[]
  toggleFavorite: (item: NavigationItem) => void
  addRecentItem: (item: NavigationItem) => void
  recentItems: NavigationItem[]
}

const SmartNavigationContext = createContext<SmartNavigationContextType | null>(null)

const defaultNavigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard", description: "Main dashboard overview" },
  { id: "crm", name: "CRM", href: "/crm", description: "Customer relationship management" },
  { id: "talent", name: "Talent", href: "/talent", description: "Talent acquisition and management" },
  { id: "hrms", name: "HRMS", href: "/hrms", description: "Human resource management system" },
  { id: "finance", name: "Finance", href: "/finance", description: "Financial management" },
  { id: "admin", name: "Admin", href: "/admin", description: "System administration" },
  { id: "settings", name: "Settings", href: "/settings", description: "Application settings" },
]

export function SmartNavigationProvider({
  children,
  navigationItems = defaultNavigationItems,
}: {
  children: React.ReactNode
  navigationItems?: NavigationItem[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [recentItems, setRecentItems] = useState<NavigationItem[]>([])
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [favoriteItems, setFavoriteItems] = useState<NavigationItem[]>([])

  const navigate = useCallback(
    (path: string) => {
      router.push(path)
    },
    [router],
  )

  const searchItems = useCallback(
    (query: string): NavigationItem[] => {
      if (!query.trim()) return []

      const lowercaseQuery = query.toLowerCase()
      return navigationItems.filter(
        (item) => {
          const label = (item.title || item.name || "").toLowerCase()
          return (
            label.includes(lowercaseQuery) ||
            item.description?.toLowerCase().includes(lowercaseQuery) ||
            item.category?.toLowerCase().includes(lowercaseQuery) ||
            item.keywords?.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery))
          )
        },
      )
    },
    [navigationItems],
  )

  const addRecentItem = useCallback((item: NavigationItem) => {
    setRecentItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id)
      return [item, ...filtered].slice(0, 5)
    })
  }, [])

  const toggleFavorite = useCallback((item: NavigationItem) => {
    setFavoriteItems((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      if (exists) return prev.filter((i) => i.id !== item.id)
      return [item, ...prev]
    })
  }, [])

  useEffect(() => {
    const currentItem = navigationItems.find((item) => pathname.startsWith(item.href))
    if (currentItem) {
      addRecentItem(currentItem)
    }
  }, [pathname, navigationItems, addRecentItem])

  const filteredItems = (() => {
    const items = searchQuery.trim() ? searchItems(searchQuery) : navigationItems
    return items.map((item) => ({ ...item, isFavorite: favoriteItems.some((f) => f.id === item.id) }))
  })()

  const value: SmartNavigationContextType = {
    navigationItems,
    currentPath: pathname,
    navigate,
    searchItems,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    searchQuery,
    setSearchQuery,
    filteredItems,
    favoriteItems,
    toggleFavorite,
    addRecentItem,
    recentItems,
  }

  return <SmartNavigationContext.Provider value={value}>{children}</SmartNavigationContext.Provider>
}

export function useSmartNavigation() {
  const context = useContext(SmartNavigationContext)
  if (!context) {
    throw new Error("useSmartNavigation must be used within a SmartNavigationProvider")
  }
  return context
}
