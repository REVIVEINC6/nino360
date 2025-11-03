"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Building2, Users, ArrowRight, LogOut } from "lucide-react"
import { getBillingInfo, switchTenant, leaveTenant } from "@/app/(dashboard)/settings/actions/billing"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function BillingOverview() {
  const [loading, setLoading] = useState(true)
  const [memberships, setMemberships] = useState<any[]>([])
  const [leavingTenant, setLeavingTenant] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadBillingInfo()
  }, [])

  async function loadBillingInfo() {
    const result = await getBillingInfo()
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else if (result.data) {
      setMemberships(result.data)
    }
    setLoading(false)
  }

  async function handleSwitchTenant(tenantId: string) {
    const result = await switchTenant(tenantId)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Switched tenant successfully" })
      window.location.reload()
    }
  }

  async function handleLeaveTenant(tenantId: string) {
    const result = await leaveTenant(tenantId)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Left tenant successfully" })
      setLeavingTenant(null)
      loadBillingInfo()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Current Plan</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Professional Plan</p>
              <p className="text-sm text-muted-foreground">$49/month • Billed monthly</p>
            </div>
            <Badge>Active</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div>
              <p className="text-2xl font-bold">50</p>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold">10GB</p>
              <p className="text-sm text-muted-foreground">Storage</p>
            </div>
            <div>
              <p className="text-2xl font-bold">∞</p>
              <p className="text-sm text-muted-foreground">API Calls</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent">
              Change Plan
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              View Invoices
            </Button>
          </div>
        </div>
      </Card>

      {/* Linked Tenants */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Linked Tenants</h3>
        </div>

        <div className="space-y-3">
          {memberships.map((membership) => (
            <div
              key={membership.tenant_id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{membership.tenant?.name || "Unnamed Tenant"}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{membership.role}</span>
                    {membership.tenant?.owner_id === membership.user_id && (
                      <Badge variant="secondary" className="text-xs">
                        Owner
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleSwitchTenant(membership.tenant_id)}>
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Switch
                </Button>
                {membership.tenant?.owner_id !== membership.user_id && (
                  <Button variant="ghost" size="sm" onClick={() => setLeavingTenant(membership.tenant_id)}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Leave
                  </Button>
                )}
              </div>
            </div>
          ))}

          {memberships.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No linked tenants</p>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Payment Method</h3>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-16 rounded bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
              VISA
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </Card>

      {/* Leave Tenant Dialog */}
      <AlertDialog open={!!leavingTenant} onOpenChange={() => setLeavingTenant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Tenant?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this tenant? You will lose access to all resources and data associated with
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => leavingTenant && handleLeaveTenant(leavingTenant)}>
              Leave Tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
