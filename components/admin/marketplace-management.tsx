"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react"
import { MarketplaceTable } from "./marketplace-table"
import { listAddons } from "@/app/(dashboard)/admin/marketplace/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

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

  const stats = [
    {
      label: "Total Add-ons",
      value: addons.length,
      icon: Package,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Active Offerings",
      value: addons.filter((a: any) => a.active).length,
      icon: ShoppingCart,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Total Revenue",
      value: `$${addons.reduce((sum: number, a: any) => sum + (a.price || 0), 0).toFixed(0)}`,
      icon: DollarSign,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
    },
    {
      label: "Categories",
      value: new Set(addons.map((a: any) => a.category)).size,
      icon: TrendingUp,
      color: "from-rose-500 to-orange-500",
      bgColor: "bg-rose-50",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/70 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="backdrop-blur-sm bg-white/70 border-white/20">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Marketplace Add-ons & SKUs
            </CardTitle>
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
                  className="pl-9 backdrop-blur-sm bg-white/50"
                />
              </div>
            </div>

            <MarketplaceTable addons={filteredAddons} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
