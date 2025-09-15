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

interface TalentLayoutWrapperProps {
  children: React.ReactNode
}

export function TalentLayoutWrapper({ children }: TalentLayoutWrapperProps) {
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
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
              <h1 className="text-3xl font-bold text-gray-900">Talent Acquisition</h1>
              <p className="text-lg text-gray-600 mt-2">Recruitment & Talent Management</p>
            </div>
            <Button
              onClick={toggleAIPanel}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
