"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Plus } from "lucide-react"

export function DirectoryToolbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("q") || "")

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("q", search)
    } else {
      params.delete("q")
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Filters */}
        <Select onValueChange={(value) => handleFilter("status", value)}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilter("type", value)}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Intern">Intern</SelectItem>
          </SelectContent>
        </Select>

        {/* Actions */}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>
    </div>
  )
}
