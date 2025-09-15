"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Tag } from "lucide-react"
import type { MarketplaceItem } from "@/lib/types/marketplace"

interface ItemEditorDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: MarketplaceItem | null
  onSave: (item: Partial<MarketplaceItem>) => void
}

export function ItemEditorDrawer({ open, onOpenChange, item, onSave }: ItemEditorDrawerProps) {
  const [formData, setFormData] = useState<Partial<MarketplaceItem>>({})
  const [newFeature, setNewFeature] = useState("")
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        name: "",
        description: "",
        category: "integration",
        type: "module",
        status: "inactive",
        visibility: "private",
        pricing: { model: "free" },
        features: [],
        requirements: [],
        compatibility: [],
        developer: { name: "", email: "" },
        media: { icon: "Package", screenshots: [] },
        metadata: { tags: [] },
      })
    }
  }, [item])

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }))
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          tags: [...(prev.metadata?.tags || []), newTag.trim()],
        },
      }))
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags: prev.metadata?.tags?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{item ? "Edit Marketplace Item" : "Create New Item"}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your marketplace item"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai">AI</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="automation">Automation</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="hrms">HRMS</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="module">Module</SelectItem>
                        <SelectItem value="ai-pack">AI Pack</SelectItem>
                        <SelectItem value="add-on">Add-on</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="deprecated">Deprecated</SelectItem>
                        <SelectItem value="coming-soon">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, visibility: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="tenant-specific">Tenant Specific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Developer Information</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input
                      placeholder="Developer name"
                      value={formData.developer?.name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          developer: { ...prev.developer, name: e.target.value, email: prev.developer?.email || "" },
                        }))
                      }
                    />
                    <Input
                      placeholder="Developer email"
                      type="email"
                      value={formData.developer?.email || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          developer: { ...prev.developer, email: e.target.value, name: prev.developer?.name || "" },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pricing Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Pricing Model</Label>
                    <Select
                      value={formData.pricing?.model}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          pricing: { ...prev.pricing, model: value as any },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="one-time">One-time Payment</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="usage-based">Usage-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.pricing?.model !== "free" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Amount</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={formData.pricing?.amount || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                pricing: { ...prev.pricing, amount: Number.parseFloat(e.target.value) || 0 },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>Currency</Label>
                          <Select
                            value={formData.pricing?.currency || "USD"}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                pricing: { ...prev.pricing, currency: value },
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {formData.pricing?.model === "subscription" && (
                        <div>
                          <Label>Billing Cycle</Label>
                          <Select
                            value={formData.pricing?.billingCycle}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                pricing: { ...prev.pricing, billingCycle: value as any },
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select billing cycle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Free Trial Days (Optional)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.pricing?.freeTrialDays || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              pricing: { ...prev.pricing, freeTrialDays: Number.parseInt(e.target.value) || undefined },
                            }))
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Add Feature</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Enter feature description"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      />
                      <Button onClick={addFeature} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {formData.features?.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{feature}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Add Tag</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Enter tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button onClick={addTag} size="sm">
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.metadata?.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeTag(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Version</Label>
                    <Input
                      placeholder="1.0.0"
                      value={formData.version || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Support URL</Label>
                    <Input
                      placeholder="https://support.example.com"
                      value={formData.metadata?.supportUrl || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metadata: { ...prev.metadata, supportUrl: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Documentation URL</Label>
                    <Input
                      placeholder="https://docs.example.com"
                      value={formData.metadata?.documentationUrl || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metadata: { ...prev.metadata, documentationUrl: e.target.value },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{item ? "Update Item" : "Create Item"}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
