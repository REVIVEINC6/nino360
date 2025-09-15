"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, ChevronDown, Check } from "lucide-react"

export function TenantSwitcher() {
  const [currentTenant, setCurrentTenant] = useState({
    id: "tenant-1",
    name: "Demo Tenant",
    status: "active",
  })

  const tenants = [
    { id: "tenant-1", name: "Demo Tenant", status: "active" },
    { id: "tenant-2", name: "Test Corp", status: "active" },
    { id: "tenant-3", name: "Beta Client", status: "trial" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Building2 className="h-4 w-4" />
          {currentTenant.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => setCurrentTenant(tenant)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{tenant.name}</span>
              <Badge variant={tenant.status === "active" ? "default" : "secondary"} className="text-xs">
                {tenant.status}
              </Badge>
            </div>
            {currentTenant.id === tenant.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
