"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import type { ChurnRiskTenant } from "@/lib/types/billing"
import { AlertTriangle, Phone, Mail, MessageSquare, TrendingDown, Users } from "lucide-react"

interface ChurnRiskPanelProps {
  tenants: ChurnRiskTenant[]
  loading: boolean
}

export function ChurnRiskPanel({ tenants, loading }: ChurnRiskPanelProps) {
  const { toast } = useToast()

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const handleContactTenant = (tenantName: string, method: string) => {
    toast({
      title: "Contact Initiated",
      description: `${method} contact initiated for ${tenantName}`,
    })
  }

  const handleViewDetails = (tenantId: string) => {
    toast({
      title: "Opening Details",
      description: "Tenant details will open in a new tab",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Churn Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const criticalCount = tenants.filter((t) => t.risk_level === "critical").length
  const highCount = tenants.filter((t) => t.risk_level === "high").length
  const totalAtRisk = tenants.length
  const potentialLostMRR = tenants.reduce((sum, t) => sum + t.mrr, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Churn Risk Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              {totalAtRisk} At Risk
            </Badge>
            <Badge variant="outline">{formatCurrency(potentialLostMRR)} MRR at Risk</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-900">Critical Risk</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-sm text-red-700">Immediate action required</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-orange-900">High Risk</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{highCount}</div>
              <div className="text-sm text-orange-700">Close monitoring needed</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-900">Total MRR at Risk</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(potentialLostMRR)}</div>
              <div className="text-sm text-blue-700">Potential monthly loss</div>
            </div>
          </div>

          {/* Risk List */}
          <div className="space-y-4">
            {tenants.slice(0, 10).map((tenant) => (
              <div key={tenant.tenant_id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{tenant.tenant_name}</h3>
                      <Badge variant={getRiskBadgeVariant(tenant.risk_level)}>
                        {tenant.risk_level.toUpperCase()} RISK
                      </Badge>
                      <Badge variant="outline">{tenant.plan_name}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>MRR: {formatCurrency(tenant.mrr)}</span>
                      <span>Last Activity: {formatDate(tenant.last_activity)}</span>
                      <span>Risk Score: {tenant.risk_score}%</span>
                    </div>

                    {/* Risk Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Risk Level</span>
                        <span>{tenant.risk_score}%</span>
                      </div>
                      <Progress value={tenant.risk_score} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactTenant(tenant.tenant_name, "Email")}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactTenant(tenant.tenant_name, "Phone")}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(tenant.tenant_id)}>
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</div>
                    <div className="space-y-1">
                      {tenant.factors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Recommendations:</div>
                    <div className="space-y-1">
                      {tenant.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-blue-600">
                          <MessageSquare className="h-3 w-3" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tenants.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">Great news! No tenants are currently at high churn risk.</div>
            </div>
          )}

          {tenants.length > 10 && (
            <div className="text-center pt-4 border-t">
              <Button variant="outline">View All {tenants.length} At-Risk Tenants</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
