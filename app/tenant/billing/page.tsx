"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  Download,
  Eye,
  Settings,
  Plus,
  Receipt,
  BarChart3,
  Users,
} from "lucide-react"

export default function TenantBillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("enterprise")

  const billingData = {
    currentPlan: "Enterprise",
    monthlySpend: 12450,
    nextBilling: "2024-02-15",
    usagePercent: 78,
    activeUsers: 245,
    storageUsed: 1.2,
    storageLimit: 2.0,
  }

  const subscriptions = [
    {
      id: "1",
      tenant: "Acme Corp",
      plan: "Enterprise",
      users: 150,
      monthlyFee: 4500,
      status: "active",
      nextBilling: "2024-02-15",
      usage: 85,
    },
    {
      id: "2",
      tenant: "TechStart Inc",
      plan: "Professional",
      users: 75,
      monthlyFee: 2250,
      status: "active",
      nextBilling: "2024-02-18",
      usage: 62,
    },
    {
      id: "3",
      tenant: "Global Solutions",
      plan: "Enterprise",
      users: 200,
      monthlyFee: 6000,
      status: "pending",
      nextBilling: "2024-02-20",
      usage: 45,
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: 12450,
      status: "paid",
      tenant: "All Tenants",
    },
    {
      id: "INV-2024-002",
      date: "2024-01-01",
      amount: 11200,
      status: "paid",
      tenant: "All Tenants",
    },
    {
      id: "INV-2023-012",
      date: "2023-12-15",
      amount: 10800,
      status: "paid",
      tenant: "All Tenants",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Billing & Subscription
            </h1>
            <p className="text-gray-600 mt-2">Manage tenant billing, subscriptions, and usage</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Subscription
            </Button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${billingData.monthlySpend.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{subscriptions.length}</div>
                <p className="text-xs text-muted-foreground">Across all tenants</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usage Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{billingData.usagePercent}%</div>
                <Progress value={billingData.usagePercent} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">Feb 15</div>
                <p className="text-xs text-muted-foreground">5 days remaining</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="settings">Billing Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>Manage tenant subscriptions and billing plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.map((subscription, index) => (
                    <motion.div
                      key={subscription.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {subscription.tenant.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{subscription.tenant}</h3>
                          <p className="text-sm text-gray-600">
                            {subscription.plan} • {subscription.users} users
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">${subscription.monthlyFee}/month</p>
                          <p className="text-sm text-gray-600">Next: {subscription.nextBilling}</p>
                        </div>
                        <Badge
                          variant={subscription.status === "active" ? "default" : "secondary"}
                          className={
                            subscription.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {subscription.status}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>View and manage billing invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <Receipt className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{invoice.id}</h3>
                          <p className="text-sm text-gray-600">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">${invoice.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{invoice.tenant}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>Storage Usage</CardTitle>
                  <CardDescription>Current storage utilization across tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Used Storage</span>
                      <span className="font-semibold">{billingData.storageUsed} TB</span>
                    </div>
                    <Progress value={(billingData.storageUsed / billingData.storageLimit) * 100} />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>0 TB</span>
                      <span>{billingData.storageLimit} TB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Active users across all tenants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Active Users</span>
                      <span className="font-semibold">{billingData.activeUsers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>+15% from last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>Configure billing preferences and payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20">
                    <div>
                      <h3 className="font-semibold">Auto-billing</h3>
                      <p className="text-sm text-gray-600">Automatically charge subscriptions</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20">
                    <div>
                      <h3 className="font-semibold">Payment Method</h3>
                      <p className="text-sm text-gray-600">**** **** **** 4242</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20">
                    <div>
                      <h3 className="font-semibold">Billing Notifications</h3>
                      <p className="text-sm text-gray-600">Email notifications for billing events</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
