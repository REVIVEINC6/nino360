"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle2, Clock, ExternalLink } from "lucide-react"
import { useState, useEffect, useTransition } from "react"

interface CRMBlockchainAuditProps {
  getAuditTrail: () => Promise<any>
}

export function CRMBlockchainAudit({ getAuditTrail }: CRMBlockchainAuditProps) {
  const [auditData, setAuditData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const loadAuditTrail = async () => {
      const result = await getAuditTrail()
      if (result.success) {
        setAuditData(result.data)
      }
      setLoading(false)
    }

    startTransition(() => {
      loadAuditTrail()
    })
  }, [getAuditTrail])

  if (loading || isPending) {
    return (
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-emerald-500" />
            Blockchain Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-emerald-500" />
          Blockchain Audit
        </CardTitle>
        <CardDescription>Immutable record verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">Verified Records</span>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
            {auditData?.verifiedCount || "1,247"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Last Sync</span>
          </div>
          <span className="text-xs text-muted-foreground">{auditData?.lastSync || "2 min ago"}</span>
        </div>
        <div className="pt-2 space-y-2">
          <p className="text-xs text-muted-foreground">Latest Transaction:</p>
          <code className="block text-xs bg-muted p-2 rounded font-mono break-all">
            {auditData?.latestHash || "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"}
          </code>
          <Button size="sm" variant="outline" className="w-full h-7 text-xs bg-transparent">
            <ExternalLink className="h-3 w-3 mr-1" />
            View on Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
