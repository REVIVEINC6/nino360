"use client"

import type React from "react"
import { useState } from "react"
import { TopBar } from "./top-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, Plus, Download, Star, AlertCircle } from "lucide-react"

interface HotlistLayoutWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  currentPage?: string
}

export function HotlistLayoutWrapper({
  children,
  title = "Hotlist Management",
  subtitle = "Priority candidates and urgent requirements tracking",
  currentPage = "overview",
}: HotlistLayoutWrapperProps) {
  const [notifications] = useState(15)

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
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
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70">
              <Star className="h-4 w-4 mr-2" />
              Add Priority
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70">
              <AlertCircle className="h-4 w-4 mr-2" />
              Mark Urgent
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
            <Button variant="ghost" size="sm" className="relative hover:bg-white/50">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                  {notifications > 9 ? "9+" : notifications}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-white/50">
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
