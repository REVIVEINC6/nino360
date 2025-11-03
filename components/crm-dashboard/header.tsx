"use client"

import { useState } from "react"
import { Filter, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [owner, setOwner] = useState(searchParams.get("owner") || "me")

  const handleOwnerChange = (value: string) => {
    setOwner(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set("owner", value)
    // Use replace instead of push to avoid adding to history for filter changes
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    if (from) params.set("from", from.toISOString())
    if (to) params.set("to", to.toISOString())
    // Use replace instead of push to avoid adding to history for filter changes
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent">
          CRM Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Pipeline analytics, forecasts, and AI-powered insights</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={owner} onValueChange={handleOwnerChange}>
          <SelectTrigger className="w-[140px] glass-panel">
            <Users className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="me">My Deals</SelectItem>
            <SelectItem value="team">My Team</SelectItem>
            <SelectItem value="all">All Deals</SelectItem>
          </SelectContent>
        </Select>

        <DatePickerWithRange onDateChange={handleDateChange} className="glass-panel" />

        <Button variant="outline" size="icon" className="glass-panel bg-transparent">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
