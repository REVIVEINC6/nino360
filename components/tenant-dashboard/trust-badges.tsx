"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle2, Activity, FileCheck, Globe, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustMetrics {
  auditTrail: {
    enabled: boolean
    totalEntries: number
    lastVerified: string | null
  }
  encryption: {
    enabled: boolean
    algorithm: string
  }
  compliance: {
    soc2: boolean
    gdpr: boolean
    hipaa: boolean
  }
  uptime: {
    percentage: number
    lastIncident: string | null
  }
}

interface TrustBadgesProps {
  metrics: TrustMetrics
}

export function TrustBadges({ metrics }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      label: "SOC 2 Compliant",
      status: metrics.compliance.soc2,
      description: "Type II certified",
      color: "text-blue-500",
    },
    {
      icon: Globe,
      label: "GDPR Compliant",
      status: metrics.compliance.gdpr,
      description: "EU data protection",
      color: "text-green-500",
    },
    {
      icon: Heart,
      label: "HIPAA Compliant",
      status: metrics.compliance.hipaa,
      description: "Healthcare ready",
      color: "text-red-500",
    },
    {
      icon: Lock,
      label: "End-to-End Encryption",
      status: metrics.encryption.enabled,
      description: metrics.encryption.algorithm,
      color: "text-purple-500",
    },
    {
      icon: FileCheck,
      label: "Audit Trail",
      status: metrics.auditTrail.enabled,
      description: `${metrics.auditTrail.totalEntries.toLocaleString()} entries`,
      color: "text-orange-500",
    },
    {
      icon: Activity,
      label: "Uptime SLA",
      status: metrics.uptime.percentage >= 99.9,
      description: `${metrics.uptime.percentage}% uptime`,
      color: "text-cyan-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Trust & Compliance
            </CardTitle>
            <CardDescription>Security certifications and compliance status</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.label}
                className={cn(
                  "relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-md",
                  badge.status ? "border-green-500/20 bg-green-500/5" : "border-muted bg-muted/50 opacity-60",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-full p-2", badge.status ? "bg-background" : "bg-muted")}>
                    <Icon className={cn("h-5 w-5", badge.status ? badge.color : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{badge.label}</p>
                      {badge.status && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileCheck className="h-4 w-4 text-orange-500" />
              Last Audit Verification
            </div>
            <p className="mt-2 text-2xl font-bold">
              {metrics.auditTrail.lastVerified
                ? new Date(metrics.auditTrail.lastVerified).toLocaleDateString()
                : "Never"}
            </p>
            <p className="text-xs text-muted-foreground">Blockchain-verified audit trail</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4 text-cyan-500" />
              Last Incident
            </div>
            <p className="mt-2 text-2xl font-bold">
              {metrics.uptime.lastIncident ? new Date(metrics.uptime.lastIncident).toLocaleDateString() : "None"}
            </p>
            <p className="text-xs text-muted-foreground">{metrics.uptime.percentage}% uptime guarantee</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
