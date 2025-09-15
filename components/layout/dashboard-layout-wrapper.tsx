"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "./top-bar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface DashboardLayoutWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayoutWrapper({
  children,
  title = "Dashboard",
  subtitle = "Welcome to your workspace",
}: DashboardLayoutWrapperProps) {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
        ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
        transition-transform duration-300 ease-in-out
      `}
      >
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex-shrink-0 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 px-6 py-4">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <TopBar />
          </div>
        </div>

        {/* Page Header */}
        <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
