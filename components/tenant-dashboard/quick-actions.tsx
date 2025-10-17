"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Settings, FileText, Users, Shield, BarChart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePermissions } from "@/lib/rbac/hooks"

interface QuickActionsProps {
  features: {
    [key: string]: boolean
  }
  tenantSlug: string
  tenantId: string
}

export function QuickActions({ features, tenantSlug, tenantId }: QuickActionsProps) {
  const { permissions, loading } = usePermissions()

  const actions = [
    {
      icon: UserPlus,
      label: "Invite User",
      href: `/tenant/users?invite=1`,
      enabled: permissions.includes("tenant:users:invite"),
      description: "Add team members",
    },
    {
      icon: Settings,
      label: "Configure Tenant",
      href: "/tenant/configuration",
      enabled: permissions.includes("tenant:settings:update"),
      description: "Manage settings",
    },
    {
      icon: Users,
      label: "Manage Users",
      href: "/tenant/users",
      enabled: permissions.includes("tenant:users:read"),
      description: "View all users",
    },
    {
      icon: Shield,
      label: "Security",
      href: "/tenant/security",
      enabled: permissions.includes("tenant:security:read"),
      description: "Audit & compliance",
    },
    {
      icon: FileText,
      label: "Directory",
      href: "/tenant/directory",
      enabled: permissions.includes("tenant:directory:read"),
      description: "Tenant directory",
    },
    {
      icon: BarChart,
      label: "Analytics",
      href: "/tenant/analytics",
      enabled: permissions.includes("tenant:analytics:read"),
      description: "View insights",
    },
  ]

  if (loading) {
    return (
      <Card className="glass-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions
          .filter((a) => a.enabled)
          .map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 p-4 hover:bg-primary/10 bg-transparent transition-all hover:scale-105"
                >
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <span className="text-sm font-medium block">{action.label}</span>
                    <span className="text-xs text-muted-foreground">{action.description}</span>
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
      </div>
    </Card>
  )
}
