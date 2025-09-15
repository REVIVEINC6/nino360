"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Bot } from "lucide-react"
import { TopBar } from "./top-bar"
import { ModuleSidebar } from "@/components/navigation/module-sidebar"
import { PageSidebar } from "./page-sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"
import AIChatInterface from "../ai/ai-chat-interface"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  currentPage?: string
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
  const [isModuleSidebarCollapsed, setIsModuleSidebarCollapsed] = useState(false)

  // Close AI panel on route changes
  useEffect(() => {
    setIsAIPanelOpen(false)
  }, [pathname])

  const toggleAIPanel = () => setIsAIPanelOpen(!isAIPanelOpen)

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Module Sidebar */}
      <div className={`${isModuleSidebarCollapsed ? "w-16" : "w-64"} transition-all duration-300`}>
        <ModuleSidebar collapsed={isModuleSidebarCollapsed} onCollapsedChange={setIsModuleSidebarCollapsed} />
      </div>

      {/* Page Sidebar */}
      <PageSidebar className="w-80 border-r bg-white/80 backdrop-blur-sm" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex-shrink-0 border-b bg-white/80 backdrop-blur-sm">
          <TopBar />
        </div>

        {/* Page Header */}
        <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-lg text-gray-600 mt-2">System Administration</p>
            </div>
            <Button
              onClick={toggleAIPanel}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {/* AI Panel - Desktop */}
      {isAIPanelOpen && (
        <div className="w-80 border-l bg-card/50 backdrop-blur-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">AI Assistant</h3>
            <Button variant="ghost" size="icon" onClick={toggleAIPanel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AIChatInterface />
        </div>
      )}
    </div>
  )
}
