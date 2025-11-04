"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Shield, Search, Download, CheckCircle2, AlertTriangle, XCircle, Info, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AuditEvent {
  id: string
  eventType: string
  action: string
  status: "success" | "failure" | "warning" | "info"
  ipAddress: string
  location: string
  userAgent: string
  metadata: Record<string, any>
  blockchainHash: string
  verified: boolean
  createdAt: string
}

export default function AuditLogPage() {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadAuditLog()
  }, [filterType])

  const loadAuditLog = async () => {
    try {
      const params = new URLSearchParams()
      if (filterType !== "all") params.append("type", filterType)

      const response = await fetch(`/api/auth/audit-log?${params}`)
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load audit log",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportAuditLog = async () => {
    try {
      const response = await fetch("/api/auth/audit-log/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit-log-${new Date().toISOString()}.csv`
      a.click()

      toast({
        title: "Export Complete",
        description: "Audit log has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export audit log",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "failure":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200"
      case "failure":
        return "bg-red-100 text-red-700 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-purple-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Security Audit Log</h1>
                <p className="text-gray-600">Blockchain-verified security events</p>
              </div>
            </div>
            <Button
              onClick={exportAuditLog}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Log
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "login", "mfa", "password", "session"].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? "bg-linear-to-r from-blue-600 to-purple-600" : ""}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Events List */}
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-gray-50">{getStatusIcon(event.status)}</div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{event.action}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}
                        >
                          {event.status}
                        </span>
                        {event.verified && (
                          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Blockchain Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{event.eventType}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">IP Address:</span> {event.ipAddress}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {event.location}
                    </div>
                    <div>
                      <span className="font-medium">Device:</span> {event.userAgent.split(" ")[0]}
                    </div>
                  </div>

                  {event.blockchainHash && (
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Blockchain Hash:</p>
                      <code className="text-xs font-mono text-purple-700 break-all">{event.blockchainHash}</code>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && !isLoading && (
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">No security events match your search criteria</p>
          </Card>
        )}
      </div>
    </div>
  )
}
