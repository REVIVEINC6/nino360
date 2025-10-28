"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createAddon, updateAddon, deleteAddon } from "@/app/(dashboard)/admin/marketplace/actions"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Addon {
  id: string
  name: string
  sku: string
  description?: string
  price: number
  billing_cycle: string
  category: string
  active: boolean
}

interface MarketplaceTableProps {
  addons: Addon[]
}

export function MarketplaceTable({ addons }: MarketplaceTableProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [newAddon, setNewAddon] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    billing_cycle: "monthly",
    category: "feature",
  })

  const handleCreate = async () => {
    if (!newAddon.name || !newAddon.sku) {
      toast.error("Name and SKU are required")
      return
    }

    try {
      await createAddon(newAddon)
      toast.success("Add-on created successfully")
      setCreateOpen(false)
      setNewAddon({
        name: "",
        sku: "",
        description: "",
        price: 0,
        billing_cycle: "monthly",
        category: "feature",
      })
    } catch (error) {
      toast.error("Failed to create add-on")
      console.error(error)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await updateAddon(id, { active })
      toast.success(active ? "Add-on activated" : "Add-on deactivated")
    } catch (error) {
      toast.error("Failed to update add-on")
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this add-on?")) return

    try {
      await deleteAddon(id)
      toast.success("Add-on deleted successfully")
    } catch (error) {
      toast.error("Failed to delete add-on")
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Add-on
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Add-on</DialogTitle>
              <DialogDescription>Add a new marketplace offering</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAddon.name}
                  onChange={(e) => setNewAddon({ ...newAddon, name: e.target.value })}
                  placeholder="e.g., Advanced Analytics"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newAddon.sku}
                  onChange={(e) => setNewAddon({ ...newAddon, sku: e.target.value })}
                  placeholder="e.g., ADDON-ANALYTICS-001"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newAddon.price}
                  onChange={(e) => setNewAddon({ ...newAddon, price: Number.parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="billing_cycle">Billing Cycle</Label>
                <Select
                  value={newAddon.billing_cycle}
                  onValueChange={(value) => setNewAddon({ ...newAddon, billing_cycle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newAddon.category}
                  onValueChange={(value) => setNewAddon({ ...newAddon, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAddon.description}
                  onChange={(e) => setNewAddon({ ...newAddon, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Add-on</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addons.map((addon) => (
              <TableRow key={addon.id}>
                <TableCell className="font-medium">{addon.name}</TableCell>
                <TableCell className="font-mono text-xs">{addon.sku}</TableCell>
                <TableCell>
                  <Badge variant="outline">{addon.category}</Badge>
                </TableCell>
                <TableCell>${addon.price.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{addon.billing_cycle}</TableCell>
                <TableCell>
                  <Badge variant={addon.active ? "default" : "secondary"}>{addon.active ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleToggleActive(addon.id, !addon.active)}>
                      {addon.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(addon.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
