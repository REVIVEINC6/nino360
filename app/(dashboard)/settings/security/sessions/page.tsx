"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Monitor, MapPin, Calendar, Shield, LogOut, AlertCircle, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Session {
  id: string
  deviceName: string
  browser: string
  os: string
  ipAddress: string
  location: string
  createdAt: string
  lastActive: string
  isCurrentSession: boolean
}

export default function SessionManagementPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/auth/sessions")
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Session Revoked",
          description: "The session has been terminated",
        })
        loadSessions()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session",
        variant: "destructive",
      })
    }
  }

  const revokeAllSessions = async () => {
    try {
      const response = await fetch("/api/auth/sessions/revoke-all", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "All Sessions Revoked",
          description: "All other sessions have been terminated",
        })
        loadSessions()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke sessions",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
                <p className="text-gray-600">Manage your active login sessions</p>
              </div>
            </div>
            {sessions.length > 1 && (
              <Button
                variant="outline"
                onClick={revokeAllSessions}
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Revoke All Other Sessions
              </Button>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-6 ${
                session.isCurrentSession ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600">
                    <Monitor className="h-5 w-5" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{session.deviceName}</h3>
                        {session.isCurrentSession && (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {session.browser} on {session.os}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{session.ipAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Last active {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Started {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                {!session.isCurrentSession && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeSession(session.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Revoke
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {sessions.length === 0 && !isLoading && (
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Sessions</h3>
            <p className="text-gray-600">You don't have any active sessions</p>
          </Card>
        )}
      </div>
    </div>
  )
}
