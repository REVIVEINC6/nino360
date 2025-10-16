"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function TenantSwitcher() {
  const [open, setOpen] = useState(false)
  const [tenants, setTenants] = useState<any[]>([])
  const [currentTenant, setCurrentTenant] = useState<any>(null)

  useEffect(() => {
    // TODO: Load user's tenants from database
    setTenants([
      { id: "1", name: "Acme Corp", slug: "acme" },
      { id: "2", name: "TechStart Inc", slug: "techstart" },
    ])
    setCurrentTenant({ id: "1", name: "Acme Corp", slug: "acme" })
  }, [])

  async function switchTenant(tenant: any) {
    // TODO: Call tenant-switch edge function to update JWT
    setCurrentTenant(tenant)
    setOpen(false)
    window.location.reload() // Reload to apply new tenant context
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >
          {currentTenant?.name || "Select tenant..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tenant..." />
          <CommandList>
            <CommandEmpty>No tenant found.</CommandEmpty>
            <CommandGroup>
              {tenants.map((tenant) => (
                <CommandItem key={tenant.id} onSelect={() => switchTenant(tenant)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0")}
                  />
                  {tenant.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Tenant
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
