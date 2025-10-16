"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Clock, Settings, DollarSign, Shield } from "lucide-react"
import type { TenantListItem } from "@/app/(dashboard)/tenant/directory/actions"
import { SwitchTenantDialog } from "./switch-tenant-dialog"
import { formatDistanceToNow } from "date-fns"

interface TenantCardProps {
  tenant: TenantListItem
  quickLinks?: Record<string, string>
  onAccept?: () => void
  onDecline?: () => void
}

export function TenantCard({ tenant, quickLinks = {}, onAccept, onDecline }: TenantCardProps) {
  const [switchDialogOpen, setSwitchDialogOpen] = useState(false)

  const isInvited = tenant.inviteStatus === "invited"

  return (
    <>
      <Card className="group relative overflow-hidden border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-[#8B5CF6]/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
        {/* Neon border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#A855F7] opacity-0 blur-xl transition-opacity group-hover:opacity-20" />

        <div className="relative space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#8B5CF6]" />
                <h3 className="text-lg font-semibold text-white">{tenant.name}</h3>
              </div>
              <Badge variant="outline" className="border-white/20 text-xs text-white/60">
                {tenant.slug}
              </Badge>
            </div>
            <Badge
              variant={tenant.status === "active" ? "default" : "secondary"}
              className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6]"
            >
              {tenant.status}
            </Badge>
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[#D0FF00]/30 bg-[#D0FF00]/10 text-[#D0FF00]">
              {tenant.role || "Member"}
            </Badge>
            {isInvited && (
              <Badge variant="outline" className="border-[#F81CE5]/30 bg-[#F81CE5]/10 text-[#F81CE5]">
                Invited
              </Badge>
            )}
          </div>

          {/* Location & Timezone */}
          {(tenant.region || tenant.timezone) && (
            <div className="flex flex-wrap gap-3 text-sm text-white/60">
              {tenant.region && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{tenant.region}</span>
                </div>
              )}
              {tenant.timezone && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{tenant.timezone}</span>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {tenant.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tenant.features.map((feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className="border-white/10 bg-gradient-to-r from-[#6D28D9]/20 to-[#8B5CF6]/20 text-xs"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          )}

          {/* Last Activity */}
          {tenant.lastAction && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/60">
                  {tenant.lastAction.action} •{" "}
                  {formatDistanceToNow(new Date(tenant.lastAction.ts), { addSuffix: true })}
                </span>
                {tenant.lastAction.hash && (
                  <code className="rounded bg-black/30 px-2 py-1 font-mono text-[10px] text-[#D0FF00]">
                    {tenant.lastAction.hash.slice(0, 8)}...
                  </code>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {isInvited ? (
              <>
                <Button
                  onClick={onAccept}
                  className="flex-1 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
                >
                  Accept
                </Button>
                <Button onClick={onDecline} variant="outline" className="flex-1 border-white/20 bg-transparent">
                  Decline
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setSwitchDialogOpen(true)}
                  className="flex-1 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED]"
                >
                  Switch
                </Button>
                {quickLinks.admin && (
                  <Button variant="outline" size="icon" className="border-white/20 bg-transparent" asChild>
                    <a href={quickLinks.admin}>
                      <Shield className="h-4 w-4" />
                      <span className="sr-only">Admin</span>
                    </a>
                  </Button>
                )}
                {quickLinks.billing && (
                  <Button variant="outline" size="icon" className="border-white/20 bg-transparent" asChild>
                    <a href={quickLinks.billing}>
                      <DollarSign className="h-4 w-4" />
                      <span className="sr-only">Billing</span>
                    </a>
                  </Button>
                )}
                {quickLinks.settings && (
                  <Button variant="outline" size="icon" className="border-white/20 bg-transparent" asChild>
                    <a href={quickLinks.settings}>
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      <SwitchTenantDialog open={switchDialogOpen} onOpenChange={setSwitchDialogOpen} tenant={tenant} />
    </>
  )
}
