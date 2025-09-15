"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Package, Users, DollarSign, Activity, ExternalLink, Settings, TrendingUp } from "lucide-react"
import type { Module } from "@/lib/types/modules"

interface ModuleDetailSheetProps {
  module: Module | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (moduleId: string, updates: Partial<Module>) => Promise<void>
}

export function ModuleDetailSheet({ module, open, onOpenChange, onUpdate }: ModuleDetailSheetProps) {
  const [loading, setLoading] = useState(false)

  if (!module) return null

  const usagePercentage = module.totalTenants > 0 ? (module.activeTenants / module.totalTenants) * 100 : 0

  const getStatusColor = (status: Module["status"]) => {
    switch (status) {
      case "live":
        return "text-green-600"
      case "beta":
        return "text-orange-600"
      case "deprecated":
        return "text-red-600"
      case "coming-soon":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getTierColor = (tier: Module["tier"]) => {
    switch (tier) {
      case "free":
        return "bg-gray-100 text-gray-800"
      case "pro":
        return "bg-blue-100 text-blue-800"
      case "enterprise":
        return "bg-purple-100 text-purple-800"
      case "custom":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl">{module.name}</SheetTitle>
              <SheetDescription>{module.description}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tenants">Tenants</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Status & Tier */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Tier</div>
                      <Badge className={getTierColor(module.tier)}>
                        {module.tier.charAt(0).toUpperCase() + module.tier.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Version</div>
                      <Badge variant="outline">{module.version}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Category</div>
                      <span className="text-sm font-medium">{module.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tenant Adoption</span>
                        <span>
                          {module.activeTenants} / {module.totalTenants}
                        </span>
                      </div>
                      <Progress value={usagePercentage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Usage Score</span>
                        <span>{module.usageScore}%</span>
                      </div>
                      <Progress value={module.usageScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {module.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dependencies */}
              {module.dependencies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dependencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {module.dependencies.map((dep, index) => (
                        <Badge key={index} variant="outline">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pricing */}
              {module.pricing && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Monthly</div>
                        <div className="text-2xl font-bold">${module.pricing.monthly}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Yearly</div>
                        <div className="text-2xl font-bold">${module.pricing.yearly}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Developer</span>
                    <span className="text-sm font-medium">{module.metadata.developer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">{module.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm font-medium">{module.lastUpdated.toLocaleDateString()}</span>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    {module.metadata.supportUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={module.metadata.supportUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Support
                        </a>
                      </Button>
                    )}
                    {module.metadata.documentationUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={module.metadata.documentationUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Docs
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tenants" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Tenant Access
                  </CardTitle>
                  <CardDescription>Manage which tenants have access to this module</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tenant management interface</p>
                    <p className="text-sm">View and manage tenant access to this module</p>
                    <Button className="mt-4">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Tenant Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Usage Analytics
                  </CardTitle>
                  <CardDescription>Performance metrics and usage patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics dashboard</p>
                    <p className="text-sm">Detailed usage metrics and insights</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Module Settings
                  </CardTitle>
                  <CardDescription>Configure module parameters and behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configuration interface</p>
                    <p className="text-sm">Adjust module settings and parameters</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
