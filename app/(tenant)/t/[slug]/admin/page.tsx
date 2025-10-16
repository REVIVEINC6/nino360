"use client"

import { motion } from "framer-motion"
import { Users, Flag, Palette, Settings, Shield, Database } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useParams } from "next/navigation"

const ADMIN_SECTIONS = [
  {
    title: "User Management",
    description: "Manage team members, roles, and permissions",
    icon: Users,
    href: "/t/[slug]/admin/users",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Feature Flags",
    description: "Enable or disable modules and features",
    icon: Flag,
    href: "/t/[slug]/admin/feature-flags",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Branding",
    description: "Customize your workspace appearance",
    icon: Palette,
    href: "/t/[slug]/admin/branding",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Settings",
    description: "Configure workspace settings and preferences",
    icon: Settings,
    href: "/t/[slug]/admin/settings",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Security",
    description: "Manage security policies and audit logs",
    icon: Shield,
    href: "/t/[slug]/admin/security",
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Data & Integrations",
    description: "Connect external services and import data",
    icon: Database,
    href: "/t/[slug]/admin/integrations",
    color: "from-teal-500 to-cyan-500",
  },
]

export default function AdminPage() {
  const params = useParams()
  const slug = params.slug as string

  return (
    <div className="container max-w-7xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Manage your workspace settings and configuration</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map((section, index) => {
            const Icon = section.icon

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={section.href.replace("[slug]", slug)}>
                  <Card className="glass-panel border-white/10 p-6 hover:border-purple-500/50 transition-all cursor-pointer group h-full">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${section.color} mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{section.description}</p>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
