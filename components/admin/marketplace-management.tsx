"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { MarketplaceTable } from "./marketplace-table"
import { listAddons } from "@/app/(dashboard)/admin/marketplace/actions"
import { Skeleton } from "@/components/ui/skeleton"

export function MarketplaceManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [addons, setAddons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await listAddons()
        setAddons(data)
      } catch (error) {
        console.error("[v0] Failed to load marketplace data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <Skeleton className="h-[600px] w-full" />
  }

  const filteredAddons = addons.filter(
    (addon: any) =>
      addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addon.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Add-ons & SKUs</CardTitle>
          <CardDescription>Manage marketplace offerings, add-ons, and SKU configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search add-ons or SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <MarketplaceTable addons={filteredAddons} />
        </CardContent>
      </Card>
    </div>
  )
}
