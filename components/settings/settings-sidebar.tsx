"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Bell, Shield, Plug, Key, Sparkles, Palette, CreditCard } from "lucide-react"

const navItems = [
  { href: "/settings/account", label: "Account & Identity", icon: User },
  { href: "/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/settings/security", label: "Security & Sessions", icon: Shield },
  { href: "/settings/integrations", label: "Integrations", icon: Plug },
  { href: "/settings/api", label: "API Keys & Webhooks", icon: Key },
  { href: "/settings/ai", label: "AI & Copilot", icon: Sparkles },
  { href: "/settings/theme", label: "Theme & Accessibility", icon: Palette },
  { href: "/settings/billing", label: "Billing & Tenants", icon: CreditCard },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
