"use client"

import type React from "react"
import { useState } from "react"
import { TopBar } from "./top-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, Save, Download, RefreshCw } from "lucide-react"

interface SettingsLayoutWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  currentPage?: string
}

export function SettingsLayoutWrapper({
  children,
  title = "Application Settings",
  subtitle = "Configure your platform preferences",
  currentPage = "overview",
}: SettingsLayoutWrapperProps) {
  const [notifications] = useState(1)

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Top Bar */}
      <div className="flex-shrink-0 border-b bg-white/80 backdrop-blur-sm">
        <TopBar />
      </div>

      {/* Page Header */}
      <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Config
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">{notifications}</Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-6">{children}</div>
      </main>
    </div>
  )
}
