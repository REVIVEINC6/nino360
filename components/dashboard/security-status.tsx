"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, Clock, Scan, Lock, Key, Eye, Activity } from "lucide-react"

interface SecurityMetrics {
  threatLevel: "low" | "medium" | "high" | "critical"
  activeThreats: number
  blockedAttempts: number
  vulnerabilities: number
  complianceScore: number
  lastScan: string
  certificates: Array<{
    name: string
    expiryDate: string
    status: "valid" | "expiring" | "expired"
  }>
}

interface SecurityStatusProps {
  metrics?: SecurityMetrics
  onThreatClick: (threatId: string) => void
  onRunScan: () => void
}

export function SecurityStatus({ metrics, onThreatClick, onRunScan }: SecurityStatusProps) {
  const defaultMetrics: SecurityMetrics = {
    threatLevel: "low",
    activeThreats: 0,
    blockedAttempts: 156,
    vulnerabilities: 2,
    complianceScore: 96,
    lastScan: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    certificates: [
      {
        name: "SSL Certificate",
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: "valid",
      },
      {
        name: "API Certificate",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "expiring",
      },
    ],
  }

  const securityData = metrics || defaultMetrics

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-600 bg-red-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-green-600 bg-green-100"
    }
  }

  const getCertificateIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "expiring":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getThreatLevelColor(securityData.threatLevel)}>
              {securityData.threatLevel.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">{securityData.activeThreats} active threats detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityData.blockedAttempts}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{securityData.vulnerabilities}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityData.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">GDPR/CCPA compliant</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {securityData.vulnerabilities > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {securityData.vulnerabilities} security vulnerabilities detected.
            <Button variant="link" className="p-0 ml-2 h-auto" onClick={() => onThreatClick("vuln-1")}>
              View details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Security Scan Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Security Scan Status
            </CardTitle>
            <CardDescription>Last scan: {new Date(securityData.lastScan).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Security Score</span>
                <span className="font-medium">{securityData.complianceScore}%</span>
              </div>
              <Progress value={securityData.complianceScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(0, 100 - securityData.vulnerabilities * 10)}
                </div>
                <div className="text-xs text-muted-foreground">Security Rating</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">{securityData.blockedAttempts}</div>
                <div className="text-xs text-muted-foreground">Threats Blocked</div>
              </div>
            </div>

            <Button onClick={onRunScan} className="w-full">
              <Scan className="h-4 w-4 mr-2" />
              Run Security Scan
            </Button>
          </CardContent>
        </Card>

        {/* Certificates Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              SSL Certificates
            </CardTitle>
            <CardDescription>Certificate expiration monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityData.certificates.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getCertificateIcon(cert.status)}
                    <div>
                      <div className="font-medium text-sm">{cert.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      cert.status === "valid" ? "default" : cert.status === "expiring" ? "secondary" : "destructive"
                    }
                  >
                    {cert.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
          <CardDescription>AI-powered security suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Enable Two-Factor Authentication",
                description: "Require 2FA for all admin users to enhance account security",
                priority: "high",
                impact: "Reduces unauthorized access risk by 99.9%",
              },
              {
                title: "Update Security Policies",
                description: "Review and update password policies to meet latest standards",
                priority: "medium",
                impact: "Improves overall security posture",
              },
              {
                title: "Certificate Renewal",
                description: "API certificate expires in 30 days - schedule renewal",
                priority: "high",
                impact: "Prevents service disruption",
              },
            ].map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Activity className="h-5 w-5 mt-0.5 text-blue-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{recommendation.title}</span>
                    <Badge
                      variant={recommendation.priority === "high" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
                  <p className="text-xs text-green-600">💡 {recommendation.impact}</p>
                </div>
                <Button variant="outline" size="sm">
                  Implement
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
