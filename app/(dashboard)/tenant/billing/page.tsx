import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, CheckCircle2 } from "lucide-react"
import { getCurrentTenant } from "../actions/tenant-context"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function TenantBillingPage() {
  const tenant = await getCurrentTenant()
  if (!tenant) redirect("/signin")

  const supabase = await createServerClient()

  const { data: tenantPlan } = await supabase
    .from("tenant_plans")
    .select(
      `
      *,
      plan:plans(*)
    `,
    )
    .eq("tenant_id", tenant.id)
    .single()

  const plan = tenantPlan?.plan

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{plan?.name || "Starter"}</h3>
              <p className="text-sm text-muted-foreground">{plan?.description || "Basic features for small teams"}</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>

          {plan && (
            <div className="space-y-2 border-t pt-4">
              <h4 className="font-semibold">Plan Features</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>All core modules included</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>AI Copilot with RAG</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Document management</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Team collaboration</span>
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Contact your administrator to update billing details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For billing inquiries or plan changes, please contact your organization administrator or reach out to our
            support team.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
