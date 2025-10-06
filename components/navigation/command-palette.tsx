"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Command,
  ArrowRight,
  Star,
  Clock,
  Zap,
  Brain,
  Sparkles,
  TrendingUp,
  Activity,
  Settings,
  User,
  Home,
  BarChart3,
  Users,
  Target,
  DollarSign,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAINavigation } from "./ai-navigation-provider"

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  icon: React.ComponentType<any>
  action: () => void
  category: string
  keywords?: string[]
  shortcut?: string
  isNew?: boolean
  aiScore?: number
}

export function CommandPalette() {
  const router = useRouter()
  const { searchResults, recentPages, favorites, getSmartSuggestions } = useAINavigation()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Generate command items
  const commandItems = useMemo((): CommandItem[] => {
    const items: CommandItem[] = [
      // Navigation commands
      {
        id: "nav-dashboard",
        title: "Dashboard",
        subtitle: "Go to main dashboard",
        icon: Home,
        action: () => router.push("/dashboard"),
        category: "Navigation",
        keywords: ["home", "overview", "main"],
        aiScore: 95,
      },
      {
        id: "nav-crm",
        title: "CRM Dashboard",
        subtitle: "Customer relationship management",
        icon: Users,
        action: () => router.push("/crm"),
        category: "Navigation",
        keywords: ["customer", "leads", "contacts"],
        aiScore: 90,
      },
      {
        id: "nav-talent",
        title: "Talent Management",
        subtitle: "Recruitment and HR",
        icon: Target,
        action: () => router.push("/talent"),
        category: "Navigation",
        keywords: ["recruitment", "hiring", "candidates"],
        aiScore: 88,
      },
      {
        id: "nav-finance",
        title: "Finance",
        subtitle: "Financial management",
        icon: DollarSign,
        action: () => router.push("/finance"),
        category: "Navigation",
        keywords: ["money", "accounting", "budget"],
        aiScore: 85,
      },
      {
        id: "nav-admin",
        title: "Administration",
        subtitle: "System administration",
        icon: Shield,
        action: () => router.push("/admin"),
        category: "Navigation",
        keywords: ["system", "settings", "config"],
        aiScore: 82,
      },

      // Quick actions
      {
        id: "action-search",
        title: "Global Search",
        subtitle: "Search across all modules",
        icon: Search,
        action: () => {
          setIsOpen(false)
          // Implement global search
        },
        category: "Actions",
        shortcut: "⌘ F",
        aiScore: 92,
      },
      {
        id: "action-ai-chat",
        title: "AI Assistant",
        subtitle: "Chat with AI assistant",
        icon: Brain,
        action: () => {
          setIsOpen(false)
          // Open AI chat
        },
        category: "Actions",
        shortcut: "⌘ J",
        isNew: true,
        aiScore: 94,
      },
      {
        id: "action-analytics",
        title: "Analytics Dashboard",
        subtitle: "View system analytics",
        icon: BarChart3,
        action: () => router.push("/analytics"),
        category: "Actions",
        keywords: ["metrics", "reports", "data"],
        aiScore: 87,
      },

      // Settings
      {
        id: "settings-profile",
        title: "Profile Settings",
        subtitle: "Manage your profile",
        icon: User,
        action: () => router.push("/profile"),
        category: "Settings",
        keywords: ["account", "personal"],
        aiScore: 75,
      },
      {
        id: "settings-preferences",
        title: "Preferences",
        subtitle: "Application preferences",
        icon: Settings,
        action: () => router.push("/settings"),
        category: "Settings",
        keywords: ["config", "options"],
        aiScore: 70,
      },
    ]

    // Add recent pages as commands
    if (recentPages && Array.isArray(recentPages)) {
      recentPages.forEach((page, index) => {
        items.push({
          id: `recent-${page.id}`,
          title: page.title,
          subtitle: "Recently visited",
          icon: page.icon || Activity,
          action: () => router.push(page.href),
          category: "Recent",
          aiScore: 80 - index * 5,
        })
      })
    }

    // Add favorites as commands
    if (favorites && Array.isArray(favorites)) {
      favorites.forEach((page, index) => {
        items.push({
          id: `favorite-${page.id}`,
          title: page.title,
          subtitle: "Favorited page",
          icon: page.icon || Activity,
          action: () => router.push(page.href),
          category: "Favorites",
          aiScore: 85 - index * 3,
        })
      })
    }

    return items
  }, [router, recentPages, favorites])

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      // Return top commands by AI score when no query
      return commandItems.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 12)
    }

    const lowerQuery = query.toLowerCase()
    return commandItems
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery)
        const subtitleMatch = item.subtitle?.toLowerCase().includes(lowerQuery)
        const keywordMatch = item.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery))
        const categoryMatch = item.category.toLowerCase().includes(lowerQuery)

        return titleMatch || subtitleMatch || keywordMatch || categoryMatch
      })
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.title.toLowerCase() === lowerQuery
        const bExact = b.title.toLowerCase() === lowerQuery
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1

        // Then by AI score
        return (b.aiScore || 0) - (a.aiScore || 0)
      })
      .slice(0, 20)
  }, [query, commandItems])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    return filteredCommands.reduce(
      (acc, command) => {
        if (!acc[command.category]) {
          acc[command.category] = []
        }
        acc[command.category].push(command)
        return acc
      },
      {} as Record<string, CommandItem[]>,
    )
  }, [filteredCommands])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      // Close on escape
      if (e.key === "Escape") {
        setIsOpen(false)
        return
      }

      // Navigation within palette
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
        } else if (e.key === "Enter") {
          e.preventDefault()
          const selectedCommand = filteredCommands[selectedIndex]
          if (selectedCommand) {
            selectedCommand.action()
            setIsOpen(false)
            setQuery("")
            setSelectedIndex(0)
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Simulate AI processing
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 200)
      return () => clearTimeout(timer)
    }
  }, [query])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setQuery("")
    setSelectedIndex(0)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-white/20">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Command className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Search commands, pages, or ask AI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Brain className="h-4 w-4 animate-pulse" />
              <span>AI thinking...</span>
            </div>
          )}
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-2">
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category} className="mb-4">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {category === "Navigation" && <ArrowRight className="h-3 w-3" />}
                  {category === "Actions" && <Zap className="h-3 w-3" />}
                  {category === "Recent" && <Clock className="h-3 w-3" />}
                  {category === "Favorites" && <Star className="h-3 w-3" />}
                  {category === "Settings" && <Settings className="h-3 w-3" />}
                  <span>{category}</span>
                </div>
                <div className="space-y-1">
                  {commands.map((command, index) => {
                    const globalIndex = filteredCommands.indexOf(command)
                    const isSelected = globalIndex === selectedIndex
                    const IconComponent = command.icon

                    return (
                      <motion.div
                        key={command.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200",
                          isSelected
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 shadow-sm"
                            : "hover:bg-gray-50",
                        )}
                        onClick={() => {
                          command.action()
                          handleClose()
                        }}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isSelected
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                              : "bg-gray-100 text-gray-600",
                          )}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn("font-medium truncate", isSelected ? "text-blue-900" : "text-gray-900")}
                            >
                              {command.title}
                            </span>
                            {command.isNew && (
                              <Badge className="h-4 px-1 text-xs bg-green-100 text-green-700">New</Badge>
                            )}
                          </div>
                          {command.subtitle && (
                            <p className="text-sm text-gray-500 truncate mt-0.5">{command.subtitle}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {command.aiScore && command.aiScore > 85 && (
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-purple-500" />
                              <span className="text-xs text-purple-600">{command.aiScore}%</span>
                            </div>
                          )}
                          {command.shortcut && (
                            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded border">
                              {command.shortcut}
                            </kbd>
                          )}
                          <ArrowRight className={cn("h-4 w-4", isSelected ? "text-blue-600" : "text-gray-400")} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No commands found</h3>
                <p className="text-xs text-gray-500">Try a different search term or browse categories</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between p-4 border-t border-white/20 bg-gray-50/50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">esc</kbd>
              <span>Close</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>Powered by AI</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
