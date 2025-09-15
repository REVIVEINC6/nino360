"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { SubscriptionPlan } from "@/lib/types/billing"
import { Plus, Edit, Save, X } from "lucide-react"

interface PlanEditorProps {
  plans: SubscriptionPlan[]
  loading: boolean
  onCreatePlan: (planData: Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">) => Promise<any>
  onUpdatePlan: (planId: string, updates: Partial<SubscriptionPlan>) => Promise<any>
}

const AVAILABLE_MODULES = ["CRM", "HRMS", "Talent", "Finance", "VMS", "Training", "Bench", "Hotlist", "Admin"]

const AVAILABLE_FEATURES = [
  "Basic Analytics",
  "Advanced Analytics",
  "Email Support",
  "Priority Support",
  "Phone Support",
  "API Access",
  "Custom Reports",
  "White Labeling",
  "SSO Integration",
  "Audit Logs",
  "Data Export",
  "Custom Integrations",
  "Advanced Security",
  "Dedicated Support",
]

export function PlanEditor({ plans, loading, onCreatePlan, onUpdatePlan }: PlanEditorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_monthly: 0,
    price_quarterly: 0,
    price_annual: 0,
    currency: "USD",
    features: [] as string[],
    modules: [] as string[],
    user_limit: 1,
    storage_limit: 1,
    api_limit: 1000,
    support_level: "basic" as "basic" | "premium" | "enterprise",
    trial_days: 14,
    is_active: true,
  })
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price_monthly: 0,
      price_quarterly: 0,
      price_annual: 0,
      currency: "USD",
      features: [],
      modules: [],
      user_limit: 1,
      storage_limit: 1,
      api_limit: 1000,
      support_level: "basic",
      trial_days: 14,
      is_active: true,
    })
  }

  const handleCreatePlan = async () => {
    try {
      setIsCreating(true)
      await onCreatePlan(formData)
      resetForm()
      toast({
        title: "Plan Created",
        description: "New subscription plan has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription plan.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdatePlan = async () => {
    if (!editingPlan) return

    try {
      await onUpdatePlan(editingPlan.id, formData)
      setEditingPlan(null)
      resetForm()
      toast({
        title: "Plan Updated",
        description: "Subscription plan has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription plan.",
        variant: "destructive",
      })
    }
  }

  const startEditing = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price_monthly: plan.price_monthly,
      price_quarterly: plan.price_quarterly,
      price_annual: plan.price_annual,
      currency: plan.currency,
      features: plan.features,
      modules: plan.modules,
      user_limit: plan.user_limit,
      storage_limit: plan.storage_limit,
      api_limit: plan.api_limit,
      support_level: plan.support_level,
      trial_days: plan.trial_days,
      is_active: plan.is_active,
    })
  }

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const toggleModule = (module: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(module) ? prev.modules.filter((m) => m !== module) : [...prev.modules, module],
    }))
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
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Subscription Plans</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Basic Information</h3>

                  <div>
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Professional"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Plan description..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="monthly">Monthly ($)</Label>
                      <Input
                        id="monthly"
                        type="number"
                        value={formData.price_monthly}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, price_monthly: Number.parseFloat(e.target.value) || 0 }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="quarterly">Quarterly ($)</Label>
                      <Input
                        id="quarterly"
                        type="number"
                        value={formData.price_quarterly}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, price_quarterly: Number.parseFloat(e.target.value) || 0 }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="annual">Annual ($)</Label>
                      <Input
                        id="annual"
                        type="number"
                        value={formData.price_annual}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, price_annual: Number.parseFloat(e.target.value) || 0 }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="support">Support Level</Label>
                    <Select
                      value={formData.support_level}
                      onValueChange={(value: "basic" | "premium" | "enterprise") =>
                        setFormData((prev) => ({ ...prev, support_level: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Limits & Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Limits & Features</h3>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="users">User Limit</Label>
                      <Input
                        id="users"
                        type="number"
                        value={formData.user_limit}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, user_limit: Number.parseInt(e.target.value) || 1 }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="storage">Storage (GB)</Label>
                      <Input
                        id="storage"
                        type="number"
                        value={formData.storage_limit}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, storage_limit: Number.parseInt(e.target.value) || 1 }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="api">API Calls/Month</Label>
                      <Input
                        id="api"
                        type="number"
                        value={formData.api_limit}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, api_limit: Number.parseInt(e.target.value) || 1000 }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="trial">Trial Days</Label>
                      <Input
                        id="trial"
                        type="number"
                        value={formData.trial_days}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, trial_days: Number.parseInt(e.target.value) || 14 }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="active">Plan Active</Label>
                  </div>
                </div>

                {/* Modules */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Included Modules</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_MODULES.map((module) => (
                      <div key={module} className="flex items-center space-x-2">
                        <Switch
                          id={`module-${module}`}
                          checked={formData.modules.includes(module)}
                          onCheckedChange={() => toggleModule(module)}
                        />
                        <Label htmlFor={`module-${module}`} className="text-sm">
                          {module}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Plan Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Switch
                          id={`feature-${feature}`}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label htmlFor={`feature-${feature}`} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPlan(null)
                    resetForm()
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
                  disabled={isCreating || !formData.name}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEditing(plan)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Pricing */}
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(plan.price_monthly)}/mo</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(plan.price_quarterly)}/quarter • {formatCurrency(plan.price_annual)}/year
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Users:</span> {plan.user_limit.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Storage:</span> {plan.storage_limit}GB
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">API Calls:</span> {plan.api_limit.toLocaleString()}/mo
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Support:</span> {plan.support_level}
                    </div>
                  </div>

                  {/* Modules */}
                  <div>
                    <div className="text-sm font-medium mb-2">Modules ({plan.modules.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {plan.modules.slice(0, 4).map((module) => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                      {plan.modules.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.modules.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className="text-sm font-medium mb-2">Features ({plan.features.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {plan.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{plan.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No subscription plans found. Create your first plan to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
