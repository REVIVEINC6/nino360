"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Settings, Upload, Plug } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface QuickActionsProps {
  features: {
    [key: string]: boolean
  }
  tenantSlug: string
}

export function QuickActions({ features, tenantSlug }: QuickActionsProps) {
  const actions = [
    {
      icon: UserPlus,
      label: "Invite User",
      href: `/t/${tenantSlug}/admin/users?invite=1`,
      enabled: true,
    },
    {
      icon: Settings,
      label: "Configure Tenant",
      href: "/tenant/configuration",
      enabled: true,
    },
    {
      icon: Upload,
      label: "Import CSV",
      href: "/tenant/data?import=1",
      enabled: true,
    },
    {
      icon: Plug,
      label: "Connect Integrations",
      href: "/tenant/integrations",
      enabled: features.integrations !== false,
    },
  ]

  return (
    <Card className="glass-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {actions
          .filter((a) => a.enabled)
          .map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 p-4 hover:bg-primary/10 bg-transparent"
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </Link>
            </motion.div>
          ))}
      </div>
    </Card>
  )
}
