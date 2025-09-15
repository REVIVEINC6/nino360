"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, Edit, Eye, Trash2, Play, Pause, Star, DollarSign, Users, Package } from "lucide-react"
import type { MarketplaceItem, MarketplaceFilters } from "@/lib/types/marketplace"

interface MarketplaceTableProps {
  items: MarketplaceItem[]
  loading: boolean
  filters: MarketplaceFilters
  onFiltersChange: (filters: MarketplaceFilters) => void
  onEdit: (item: MarketplaceItem) => void
  onView: (item: MarketplaceItem) => void
  onDelete: (itemId: string) => void
  onPublish: (itemId: string) => void
  onUnpublish: (itemId: string) => void
  onBulkAction: (itemIds: string[], action: string) => void
}

export function MarketplaceTable({
  items,
  loading,
  filters,
  onFiltersChange,
  onEdit,
  onView,
  onDelete,
  onPublish,
  onUnpublish,
  onBulkAction,
}: MarketplaceTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map((item) => item.id) : [])
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) => (checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      deprecated: "bg-red-100 text-red-800 border-red-200",
      "coming-soon": "bg-blue-100 text-blue-800 border-blue-200",
    }
    return variants[status as keyof typeof variants] || variants.inactive
  }

  const getVisibilityBadge = (visibility: string) => {
    const variants = {
      public: "bg-green-100 text-green-800 border-green-200",
      private: "bg-orange-100 text-orange-800 border-orange-200",
      "tenant-specific": "bg-purple-100 text-purple-800 border-purple-200",
    }
    return variants[visibility as keyof typeof variants] || variants.private
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Marketplace Items</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}>
              {viewMode === "table" ? "Grid View" : "Table View"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="ai">AI</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="automation">Automation</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="hrms">HRMS</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
              <SelectItem value="coming-soon">Coming Soon</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.visibility}
            onValueChange={(value) => onFiltersChange({ ...filters, visibility: value })}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="tenant-specific">Tenant Specific</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm text-blue-700">
              {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
            </span>
            <Button size="sm" variant="outline" onClick={() => onBulkAction(selectedItems, "publish")}>
              Publish
            </Button>
            <Button size="sm" variant="outline" onClick={() => onBulkAction(selectedItems, "unpublish")}>
              Unpublish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkAction(selectedItems, "delete")}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === items.length && items.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{item.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getVisibilityBadge(item.visibility)}>{item.visibility}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.pricing.model === "free" ? (
                        <Badge variant="outline" className="text-green-600">
                          Free
                        </Badge>
                      ) : (
                        <div className="text-sm">
                          {formatCurrency(item.pricing.amount || 0)}
                          {item.pricing.billingCycle && (
                            <span className="text-gray-500">/{item.pricing.billingCycle}</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Users className="h-3 w-3" />
                          {item.stats.totalInstalls}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(item.stats.revenue)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star className="h-3 w-3" />
                          {item.stats.avgRating}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {item.status === "active" ? (
                            <DropdownMenuItem onClick={() => onUnpublish(item.id)}>
                              <Pause className="h-4 w-4 mr-2" />
                              Unpublish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => onPublish(item.id)}>
                              <Play className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getStatusBadge(item.status)}>{item.status}</Badge>
                    <Badge className={getVisibilityBadge(item.visibility)}>{item.visibility}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {item.stats.totalInstalls}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {item.stats.avgRating}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(item.stats.revenue)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {item.pricing.model === "free" ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span>
                          {formatCurrency(item.pricing.amount || 0)}
                          {item.pricing.billingCycle && (
                            <span className="text-gray-500">/{item.pricing.billingCycle}</span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {item.status === "active" ? (
                        <Button size="sm" variant="outline" onClick={() => onUnpublish(item.id)}>
                          <Pause className="h-3 w-3 mr-1" />
                          Unpublish
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => onPublish(item.id)}>
                          <Play className="h-3 w-3 mr-1" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your filters or create a new marketplace item.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
