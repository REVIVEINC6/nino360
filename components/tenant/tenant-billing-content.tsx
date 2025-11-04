"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Download, Calendar, Users, HardDrive, Zap, AlertCircle } from "lucide-react"
import { getBillingInfo } from "@/app/(app)/tenant/billing/actions"

export function TenantBillingContent() {
  const [billing, setBilling] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBillingInfo()
  }, [])

  async function loadBillingInfo() {
    try {
      // getBilling expects a tenant_id string; pass an empty string as a
      // defensive fallback. The server action can choose to use cookies or
      // return null for empty input.
      const data = await getBillingInfo("")
      setBilling(data)
    } catch (error) {
      console.error("Failed to load billing info:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !billing) {
    return <div>Loading...</div>
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-white/50 backdrop-blur-sm border border-white/20">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="payment">Payment Method</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Current Plan */}
        <Card className="p-6 bg-linear-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm border-white/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {billing.plan}
                </span>
                <Badge className="bg-linear-to-r from-green-500 to-emerald-500 text-white border-0">
                  {billing.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Billing Cycle: {billing.billingCycle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Next Billing Date: {billing.nextBillingDate}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${billing.amount}</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
              Upgrade Plan
            </Button>
            <Button variant="outline">Change Billing Cycle</Button>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-medium">
                  {billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}
                </div>
                <div className="text-sm text-muted-foreground">
                  Expires {billing.paymentMethod.expiryMonth}/{billing.paymentMethod.expiryYear}
                </div>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </Card>

        {/* Recent Invoices */}
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Invoices</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {billing.invoices.slice(0, 3).map((invoice: any) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.date}</div>
                    <div className="text-sm text-muted-foreground">${invoice.amount.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-linear-to-r from-green-500 to-emerald-500 text-white border-0">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="payment" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-linear-to-br from-blue-50/50 to-purple-50/50 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {billing.paymentMethod.expiryMonth}/{billing.paymentMethod.expiryYear}
                    </div>
                  </div>
                </div>
                <Badge className="bg-linear-to-r from-green-500 to-emerald-500 text-white border-0">Primary</Badge>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
            <Button className="w-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
              Add Payment Method
            </Button>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="invoices" className="space-y-6">
        <Card className="p-6 bg-white/50 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold mb-4">Invoice History</h3>
          <div className="space-y-3">
            {billing.invoices.map((invoice: any) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Invoice #{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                    <Badge className="bg-linear-to-r from-green-500 to-emerald-500 text-white border-0">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="usage" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Users Usage */}
          <Card className="p-6 bg-linear-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold">Users</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span className="font-medium">
                  {billing.usage.users.current} / {billing.usage.users.limit}
                </span>
              </div>
              <Progress value={(billing.usage.users.current / billing.usage.users.limit) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {billing.usage.users.limit - billing.usage.users.current} users remaining
              </div>
            </div>
          </Card>

          {/* Storage Usage */}
          <Card className="p-6 bg-linear-to-br from-purple-50/50 via-pink-50/50 to-blue-50/50 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold">Storage</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span className="font-medium">
                  {billing.usage.storage.current} / {billing.usage.storage.limit} GB
                </span>
              </div>
              <Progress value={(billing.usage.storage.current / billing.usage.storage.limit) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {billing.usage.storage.limit - billing.usage.storage.current} GB remaining
              </div>
            </div>
          </Card>

          {/* API Calls Usage */}
          <Card className="p-6 bg-linear-to-br from-pink-50/50 via-blue-50/50 to-purple-50/50 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-pink-500 to-blue-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold">API Calls</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span className="font-medium">
                  {billing.usage.apiCalls.current.toLocaleString()} / {billing.usage.apiCalls.limit.toLocaleString()}
                </span>
              </div>
              <Progress value={(billing.usage.apiCalls.current / billing.usage.apiCalls.limit) * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {(billing.usage.apiCalls.limit - billing.usage.apiCalls.current).toLocaleString()} calls remaining
              </div>
            </div>
          </Card>
        </div>

        {/* Usage Alert */}
        <Card className="p-4 bg-amber-50/50 backdrop-blur-sm border-amber-200/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900">Approaching Limit</h4>
              <p className="text-sm text-amber-700 mt-1">
                You're using 90% of your API call limit. Consider upgrading your plan to avoid service interruption.
              </p>
              <Button size="sm" className="mt-3 bg-linear-to-r from-amber-500 to-orange-500 text-white">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
