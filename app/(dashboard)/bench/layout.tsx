import type React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function BenchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bench Management</h1>
        <p className="text-muted-foreground">Manage consultants from bench to placement</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <Link href="/bench/dashboard">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </Link>
          <Link href="/bench/consultants">
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
          </Link>
          <Link href="/bench/marketing">
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </Link>
          <Link href="/bench/submissions">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </Link>
          <Link href="/bench/placements">
            <TabsTrigger value="placements">Placements</TabsTrigger>
          </Link>
          <Link href="/bench/analytics">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
