"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useSmartNavigation } from "./smart-navigation-provider"
import { Home, Users, UserCheck, Building2, DollarSign, Settings, Shield, Search, Clock } from "lucide-react"

const iconMap: Record<string, any> = {
  dashboard: Home,
  crm: Users,
  talent: UserCheck,
  hrms: Building2,
  finance: DollarSign,
  admin: Shield,
  settings: Settings,
}

export function NavigationShortcuts() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { navigationItems, searchItems, recentItems } = useSmartNavigation()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search modules, pages, or actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {recentItems.length > 0 && (
          <CommandGroup heading="Recent">
            {recentItems.map((item) => {
              const Icon = iconMap[item.id] || Search
              return (
                <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                  {item.description && (
                    <span className="ml-auto text-xs text-muted-foreground">{item.description}</span>
                  )}
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        <CommandGroup heading="Modules">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.id] || Search
            return (
              <CommandItem key={item.id} onSelect={() => handleSelect(item.href)}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
                {item.description && <span className="ml-auto text-xs text-muted-foreground">{item.description}</span>}
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
