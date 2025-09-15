"use client"

import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ModuleSidebar } from "./module-sidebar"

interface ModuleLayoutProps {
  children: ReactNode
  module: string
  title: string
}

export function ModuleLayout({ children, module, title }: ModuleLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ModuleSidebar module={module} />
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <h1 className="text-lg font-semibold">{title}</h1>
              </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
