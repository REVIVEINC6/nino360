"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { useMarketplace } from "@/hooks/use-marketplace"
import { MarketplaceStats } from "@/components/admin/marketplace/marketplace-stats"
import { MarketplaceTable } from "@/components/admin/marketplace/marketplace-table"
import { ItemEditorDrawer } from "@/components/admin/marketplace/item-editor-drawer"
import { AICopilotBox } from "@/components/admin/marketplace/ai-copilot-box"
import { InsightsPanel } from "@/components/admin/marketplace/insights-panel"
import { BlockchainBadge } from "@/components/admin/marketplace/blockchain-badge"

import type { MarketplaceItem } from "@/lib/types/marketplace"

export default function MarketplacePage() {
  const {
    items,
    promotions,
    insights,
    loading,
    filters,
    setFilters,
    createItem,
    updateItem,
    deleteItem,
    publishItem,
    unpublishItem,
    createPromotion,
    bulkAction,
    exportData,
    totalItems,
    activeItems,
    totalRevenue,
    totalInstalls,
  } = useMarketplace()

  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleCreateItem = () => {
    setSelectedItem(null)
    setEditorOpen(true)
  }

  const handleEditItem = (item: MarketplaceItem) => {
    setSelectedItem(item)
    setEditorOpen(true)
  }

  const handleViewItem = (item: MarketplaceItem) => {
    // TODO: Implement item detail view
    toast.info(`Viewing details for ${item.name}`)
  }

  const handleSaveItem = async (itemData: Partial<MarketplaceItem>) => {
    try {
      if (selectedItem) {
        await updateItem(selectedItem.id, itemData)
      } else {
        await createItem(itemData)
      }
    } catch (error) {
      console.error("Error saving item:", error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteItem(itemId)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // Simulate refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Marketplace data refreshed")
    } catch (error) {
      toast.error("Failed to refresh data")
    } finally {
      setRefreshing(false)
    }
  }

  const handleExport = async (format: "csv" | "json") => {
    await exportData(format)
  }

  const handleInsightGenerated = (insight: any) => {
    toast.success("AI insight generated successfully")
    console.log("Generated insight:", insight)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace Manager</h1>
          <p className="text-gray-600 mt-1">Manage all SaaS modules, integrations, AI packs, and premium add-ons</p>
        </div>
        <div className="flex items-center gap-2">
          <BlockchainBadge verified={true} action="Last Sync" timestamp={new Date()} />
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <MarketplaceStats
        totalItems={totalItems}
        activeItems={activeItems}
        totalRevenue={totalRevenue}
        totalInstalls={totalInstalls}
      />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Tabs defaultValue="items" className="space-y-4">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="items">
              <MarketplaceTable
                items={items}
                loading={loading}
                filters={filters}
                onFiltersChange={setFilters}
                onEdit={handleEditItem}
                onView={handleViewItem}
                onDelete={handleDeleteItem}
                onPublish={publishItem}
                onUnpublish={unpublishItem}
                onBulkAction={bulkAction}
              />
            </TabsContent>

            <TabsContent value="promotions">
              <Card>
                <CardHeader>
                  <CardTitle>Active Promotions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Promotions management coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Marketplace Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>Advanced analytics dashboard coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <AICopilotBox onInsightGenerated={handleInsightGenerated} />
          <InsightsPanel insights={insights} loading={loading} />
        </div>
      </div>

      {/* Item Editor */}
      <ItemEditorDrawer open={editorOpen} onOpenChange={setEditorOpen} item={selectedItem} onSave={handleSaveItem} />
    </div>
  )
}
