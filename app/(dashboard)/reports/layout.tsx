import type React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-3xl">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm">Executive dashboards, explorers, and AI-powered insights</p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <Link href="/reports/dashboard">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </Link>
          <Link href="/reports/explorer">
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
          </Link>
          <Link href="/reports/copilot">
            <TabsTrigger value="copilot">AI Copilot</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
