import type { ReactNode } from "react"
import { hasFeature, hasAnyFeature } from "@/lib/fbac/guards"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RequireFeatureProps {
  tenantId: string
  feature?: string
  anyOf?: string[]
  children: ReactNode
  fallback?: ReactNode
  showUpgrade?: boolean
}

export async function RequireFeature({
  tenantId,
  feature,
  anyOf,
  children,
  fallback,
  showUpgrade = true,
}: RequireFeatureProps) {
  let hasAccess = false

  if (feature) {
    hasAccess = await hasFeature(tenantId, feature)
  } else if (anyOf) {
    hasAccess = await hasAnyFeature(tenantId, anyOf)
  }

  if (!hasAccess) {
    return (
      fallback || (
        <Alert className="glass-card border-[#F81CE5]">
          <Lock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>This feature is not available on your current plan.</span>
            {showUpgrade && (
              <Button asChild size="sm" className="bg-gradient-to-r from-[#D0FF00] to-[#F81CE5] text-black">
                <Link href="/billing/portal">Upgrade Plan</Link>
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
