"use client"

import type React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TopBar } from "@/components/layout/top-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            <TopBar />
            <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 to-white">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
