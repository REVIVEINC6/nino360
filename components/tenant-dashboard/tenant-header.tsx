"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Building2, ChevronDown } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface TenantHeaderProps {
  tenantName: string
  slug: string
  onDateRangeChange?: (range: { from: string; to: string }) => void
}

export function TenantHeader({ tenantName, slug, onDateRangeChange }: TenantHeaderProps) {
  const [dateRange, setDateRange] = useState("7")

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    const to = new Date().toISOString()
    const from = new Date(Date.now() - Number.parseInt(value) * 24 * 60 * 60 * 1000).toISOString()
    onDateRangeChange?.({ from, to })
  }

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 neon-focus bg-transparent">
              <Building2 className="h-4 w-4" />
              <span className="font-semibold">{tenantName}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/tenant/directory">
                <Building2 className="mr-2 h-4 w-4" />
                View All Tenants
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/t/${slug}/admin`}>
                <Building2 className="mr-2 h-4 w-4" />
                Tenant Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Tenant Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time insights and analytics</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={dateRange} onValueChange={handleDateRangeChange}>
          <SelectTrigger className="w-[180px] neon-focus">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
