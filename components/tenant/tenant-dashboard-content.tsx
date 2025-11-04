"use client"

import { Card } from "@/components/ui/card"
import { Users, Package, HardDrive, Shield, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface TenantDashboardContentProps {
  data: {
    tenant: any
    metrics: {
      users: number
      modules: number
      storage: {
        used: number
        limit: number
        percentage: number
      }
    }
  }
}

export function TenantDashboardContent({ data }: TenantDashboardContentProps) {
  const { tenant, metrics } = data

  const quickActions = [
    { label: "Manage Users", href: "/tenant/users", icon: Users },
    { label: "Configure Modules", href: "/admin/modules", icon: Package },
    { label: "Security Settings", href: "/tenant/security", icon: Shield },
    { label: "Billing & Plans", href: "/tenant/billing", icon: CreditCard },
  ]

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-linear-to-br from-blue-50 to-purple-50 border-blue-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold mt-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {metrics.users}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-purple-50 to-pink-50 border-purple-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Modules</p>
              <p className="text-3xl font-bold mt-2 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {metrics.modules}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-pink-50 to-blue-50 border-pink-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
              <p className="text-3xl font-bold mt-2 bg-linear-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                {metrics.storage.used}GB
              </p>
              <p className="text-xs text-muted-foreground mt-1">of {metrics.storage.limit}GB</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-pink-500 to-blue-500 flex items-center justify-center">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
          </div>
          <Progress value={metrics.storage.percentage} className="mt-4" />
        </Card>
      </div>

      {/* Tenant Info */}
      <Card className="p-6 bg-white/50 backdrop-blur-sm border-gray-200/50">
        <h2 className="text-lg font-semibold mb-4">Organization Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Organization Name</p>
            <p className="font-medium mt-1">{tenant?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-medium mt-1">{tenant?.plan || "Enterprise"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-medium mt-1">
              {tenant?.created_at ? new Date(tenant.created_at).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/50 backdrop-blur-sm border-gray-200/50">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-auto py-3 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 bg-transparent"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
