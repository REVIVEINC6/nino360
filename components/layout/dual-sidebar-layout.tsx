"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ModuleSidebar } from "./module-sidebar"
import { PageSidebar } from "./page-sidebar"
import { MainContent } from "./main-content"
import { TopBar } from "./top-bar"
import { AINavigationProvider } from "../navigation/ai-navigation-provider"
import { CommandPalette } from "../navigation/command-palette"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Sparkles, Brain, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getModuleByPath, getPagesByModule } from "@/lib/navigation-data"

interface DualSidebarLayoutProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  currentModule?: string
  module?: string
  page?: string
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  rightSidebarTitle?: string
}

export function DualSidebarLayout({ children, title, subtitle, className }: DualSidebarLayoutProps) {
  const pathname = usePathname()
  const [isModuleSidebarCollapsed, setIsModuleSidebarCollapsed] = useState(false)
  const [isPageSidebarCollapsed, setIsPageSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentModule, setCurrentModule] = useState<string | null>(null)
  const [aiInsights, setAiInsights] = useState<string[]>([])

  // Extract current module from pathname
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const moduleId = pathSegments[0] || "dashboard"
    setCurrentModule(moduleId)

    // Generate AI insights based on current context
    generateAIInsights(moduleId)
  }, [pathname])

  const generateAIInsights = (moduleId: string) => {
    const insights = [
      "🎯 Quick access to frequently used features",
      "📊 Recent activity suggests focusing on analytics",
      "⚡ Keyboard shortcuts available (Cmd+K)",
      "🔍 Smart search learns from your behavior",
    ]
    setAiInsights(insights)
  }

  const currentModuleData = currentModule ? getModuleByPath(`/${currentModule}`) : null
  const currentModulePages = currentModule ? getPagesByModule(currentModule) : []

  return (
    <AINavigationProvider>
      <div className={cn("h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50", className)}>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Module Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: isModuleSidebarCollapsed ? 64 : 256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "relative flex-shrink-0 border-r border-white/20 bg-white/80 backdrop-blur-sm shadow-xl z-30",
            "lg:relative lg:translate-x-0",
            isMobileMenuOpen
              ? "fixed inset-y-0 left-0 translate-x-0"
              : "fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0",
          )}
        >
          <ModuleSidebar currentModule={currentModule || "dashboard"} isCollapsed={isModuleSidebarCollapsed} />

          {/* Module Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModuleSidebarCollapsed(!isModuleSidebarCollapsed)}
            className="absolute -right-3 top-6 h-6 w-6 p-0 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 hidden lg:flex"
          >
            {isModuleSidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </motion.div>

        {/* Page Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: isPageSidebarCollapsed ? 64 : 288 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "relative flex-shrink-0 border-r border-white/20 bg-white/60 backdrop-blur-sm shadow-lg z-20",
            "hidden lg:block",
          )}
        >
          <PageSidebar
            pages={currentModulePages}
            currentPage={pathname}
            moduleTitle={currentModuleData?.name}
            moduleIcon={currentModuleData?.icon}
            isCollapsed={isPageSidebarCollapsed}
          />

          {/* Page Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPageSidebarCollapsed(!isPageSidebarCollapsed)}
            className="absolute -right-3 top-6 h-6 w-6 p-0 rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isPageSidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-white/40 to-blue-50/40">
          {/* Top Bar */}
          <div className="flex-shrink-0 border-b border-white/20 bg-white/60 backdrop-blur-sm shadow-sm">
            <TopBar />
          </div>

          {/* Page Header */}
          {(title || subtitle) && (
            <div className="flex-shrink-0 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border-b border-white/20 px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    {currentModuleData?.icon && (
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                        <currentModuleData.icon className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {title || currentModuleData?.name || "Dashboard"}
                      </h1>
                      <p className="text-lg text-gray-600 mt-1">
                        {subtitle || currentModuleData?.description || "Welcome to your workspace"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Insights Panel */}
                <div className="hidden xl:block">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">AI Insights</span>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">Live</Badge>
                    </div>
                    <div className="space-y-1">
                      {aiInsights.slice(0, 2).map((insight, index) => (
                        <p key={index} className="text-xs text-purple-700">
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <MainContent className="flex-1 overflow-auto">{children}</MainContent>

          {/* AI Navigation Hints */}
          <div className="fixed bottom-4 right-4 z-40 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-4 py-2 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Press</span>
                <kbd className="bg-white/20 px-2 py-1 rounded text-xs">⌘K</kbd>
                <span>for AI search</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Command Palette */}
        <CommandPalette />
      </div>
    </AINavigationProvider>
  )
}
