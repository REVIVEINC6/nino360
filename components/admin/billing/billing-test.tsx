"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface TestResult {
  endpoint: string
  status: "success" | "error" | "loading"
  data?: any
  error?: string
}

export function BillingTest() {
  const [results, setResults] = useState<TestResult[]>([
    { endpoint: "/api/billing/accounts", status: "loading" },
    { endpoint: "/api/billing/stats", status: "loading" },
    { endpoint: "/api/billing/plans", status: "loading" },
    { endpoint: "/api/billing/churn-risk", status: "loading" },
    { endpoint: "/api/billing/projections", status: "loading" },
  ])

  useEffect(() => {
    const testEndpoints = async () => {
      const endpoints = [
        "/api/billing/accounts",
        "/api/billing/stats",
        "/api/billing/plans",
        "/api/billing/churn-risk",
        "/api/billing/projections",
      ]

      for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i]
        try {
          const response = await fetch(endpoint)
          const data = await response.json()

          setResults((prev) =>
            prev.map((result, index) =>
              index === i
                ? {
                    endpoint,
                    status: response.ok ? "success" : "error",
                    data: response.ok ? data : undefined,
                    error: response.ok ? undefined : data.error || "Unknown error",
                  }
                : result,
            ),
          )
        } catch (error) {
          setResults((prev) =>
            prev.map((result, index) =>
              index === i
                ? {
                    endpoint,
                    status: "error",
                    error: error instanceof Error ? error.message : "Network error",
                  }
                : result,
            ),
          )
        }
      }
    }

    testEndpoints()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Success
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Loading</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Billing API Test Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <span className="font-medium">{result.endpoint}</span>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(result.status)}
                {result.status === "success" && result.data && (
                  <span className="text-sm text-gray-600">
                    {result.endpoint === "/api/billing/churn-risk" &&
                      `${result.data.tenants?.length || 0} at-risk tenants`}
                    {result.endpoint === "/api/billing/accounts" && `${result.data.accounts?.length || 0} accounts`}
                    {result.endpoint === "/api/billing/plans" && `${result.data.plans?.length || 0} plans`}
                    {result.endpoint === "/api/billing/stats" && "Stats loaded"}
                    {result.endpoint === "/api/billing/projections" &&
                      `${result.data.projections?.length || 0} projections`}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Churn Risk Details */}
          {results.find((r) => r.endpoint === "/api/billing/churn-risk" && r.status === "success") && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Churn Risk Test Data:</h4>
              <div className="space-y-2">
                {results
                  .find((r) => r.endpoint === "/api/billing/churn-risk")
                  ?.data?.tenants?.map((tenant: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{tenant.tenant_name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            tenant.risk_level === "critical"
                              ? "destructive"
                              : tenant.risk_level === "high"
                                ? "destructive"
                                : tenant.risk_level === "medium"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {tenant.risk_level.toUpperCase()}
                        </Badge>
                        <span className="text-gray-600">{tenant.risk_score}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Error Details */}
          {results.some((r) => r.status === "error") && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-3">Errors Found:</h4>
              <div className="space-y-2">
                {results
                  .filter((r) => r.status === "error")
                  .map((result, i) => (
                    <div key={i} className="text-sm text-red-700">
                      <strong>{result.endpoint}:</strong> {result.error}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
