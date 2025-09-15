"use client"

import type React from "react"
import { useState } from "react"
import { useAINavigation } from "./ai-navigation-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Brain, Sparkles, Bell, Search, Star, Clock, ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface ModuleSidebarProps {
  className?: string
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function ModuleSidebar({ className = "", collapsed = false, onCollapsedChange }: ModuleSidebarProps) {
  const {
    navigationItems,
    currentModule,
    navigateTo,
    suggestions,
    recentItems,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    setIsCommandPaletteOpen,
  } = useAINavigation()

  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  const toggleCollapsed = () => {
    onCollapsedChange?.(!collapsed)
  }

  const handleModuleClick = (moduleId: string, href: string) => {
    navigateTo(href)
  }

  const toggleFavorite = (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    const isFavorite = favoriteItems.some((fav) => fav.id === item.id)
    if (isFavorite) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

  return (
    <TooltipProvider>
      <div
        className={`${collapsed ? "w-16" : "w-64"} bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-sm transition-all duration-300 ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                {!collapsed && (
                  <div>
                    <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Nino360
                    </h2>
                    <p className="text-xs text-slate-500">AI-Powered Platform</p>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={toggleCollapsed} className="h-8 w-8 p-0">
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* AI Assistant Quick Access */}
          <div className="p-4 border-b border-slate-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg ${collapsed ? "px-0" : ""}`}
                  size={collapsed ? "sm" : "default"}
                >
                  <Brain className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">AI Assistant</span>}
                  <Sparkles className="h-3 w-3 ml-auto" />
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>AI Assistant (⌘K)</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>

          {/* Quick Actions */}
          {!collapsed && (
            <div className="p-4 border-b border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                  <Search className="h-3 w-3 mr-1" />
                  Search
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                  <Plus className="h-3 w-3 mr-1" />
                  Create
                </Button>
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {!collapsed && suggestions.length > 0 && (
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-medium text-slate-700">AI Suggestions</h3>
              </div>
              <div className="space-y-1">
                {suggestions.slice(0, 3).map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateTo(item.href)}
                      className="w-full justify-start h-8 text-xs text-slate-600 hover:text-slate-900 hover:bg-purple-50"
                    >
                      <IconComponent className="h-3 w-3 mr-2" />
                      <span className="truncate">{item.title}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Modules */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-2 py-4">
              {!collapsed && (
                <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Modules</h3>
              )}

              {navigationItems.map((module, index) => {
                const isActive = currentModule === module.id
                const IconComponent = module.icon
                const isFavorite = favoriteItems.some((fav) => fav.id === module.id)

                return (
                  <div
                    key={module.id}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative group p-3 rounded-2xl transition-all duration-300 cursor-pointer ${
                            isActive
                              ? `bg-gradient-to-r ${module.gradient} shadow-lg text-white`
                              : "bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-slate-200 hover:shadow-md hover:border-slate-300"
                          }`}
                          onClick={() => handleModuleClick(module.id, module.href)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl transition-all duration-300 ${
                                isActive ? "bg-white/20" : `${module.color} group-hover:scale-110 shadow-sm`
                              }`}
                            >
                              <IconComponent className={`h-5 w-5 ${isActive ? "text-white" : "text-white"}`} />
                            </div>

                            {!collapsed && (
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3
                                    className={`font-semibold text-sm truncate ${
                                      isActive ? "text-white" : "text-slate-900"
                                    }`}
                                  >
                                    {module.title}
                                  </h3>
                                  <div className="flex items-center gap-1">
                                    {module.notifications && module.notifications > 0 && (
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
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => toggleFavorite(e, module)}
                                    >
                                      <Star
                                        className={`h-3 w-3 ${
                                          isFavorite ? "fill-yellow-400 text-yellow-400" : "text-slate-400"
                                        }`}
                                      />
                                    </Button>
                                  </div>
                                </div>
                                <p className={`text-xs mt-1 truncate ${isActive ? "text-white/80" : "text-slate-500"}`}>
                                  {module.description}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Hover tooltip for collapsed state */}
                          {collapsed && hoveredModule === module.id && (
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                              {module.title}
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          <p>{module.title}</p>
                          <p className="text-xs text-slate-400">{module.description}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          <Separator className="bg-slate-200" />

          {/* Recent Items */}
          {!collapsed && recentItems.length > 0 && (
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-medium text-slate-700">Recent</h3>
              </div>
              <div className="space-y-1">
                {recentItems.slice(0, 3).map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateTo(item.href)}
                      className="w-full justify-start h-8 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      <IconComponent className="h-3 w-3 mr-2" />
                      <span className="truncate">{item.title}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="p-4 border-b border-slate-200">
            <div
              className={`flex items-center gap-2 p-2 rounded-xl bg-green-50 border border-green-200 ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {!collapsed && (
                <div>
                  <p className="text-xs font-medium text-green-800">System Online</p>
                  <p className="text-xs text-green-600">All services operational</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">AI Assistant</p>
                  <p className="text-xs text-slate-500">Always learning</p>
                </div>
              )}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
