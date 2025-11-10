"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Shield, Smartphone, Monitor } from "lucide-react"
import {
  listSessions,
  revokeSession,
  getTOTPStatus,
  enableTOTP,
  verifyTOTP,
  disableTOTP,
} from "@/app/(dashboard)/settings/actions/security"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SecuritySettings() {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<any[]>([])
  const [totpStatus, setTotpStatus] = useState<any>(null)
  const [showTOTPDialog, setShowTOTPDialog] = useState(false)
  const [totpData, setTotpData] = useState<any>(null)
  const [verifyCode, setVerifyCode] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        const [sessionsData, totpData] = await Promise.all([listSessions(), getTOTPStatus()])
        setSessions(sessionsData)
        setTotpStatus(totpData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [toast])

  async function handleRevokeSession(sessionId: string) {
    try {
      await revokeSession(sessionId)
      toast({
        title: "Success",
        description: "Session revoked successfully",
      })
      setSessions(sessions.filter((s) => s.id !== sessionId))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleEnableTOTP() {
    try {
      const data = await enableTOTP()
      setTotpData(data)
      setShowTOTPDialog(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleVerifyTOTP() {
    try {
      await verifyTOTP(totpData.factor_id, verifyCode)
      toast({
        title: "Success",
        description: "Two-factor authentication enabled",
      })
      setShowTOTPDialog(false)
      setTotpStatus({ enabled: true, factors: [{ id: totpData.factor_id }] })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  async function handleDisableTOTP() {
    if (!totpStatus.factors[0]) return

    try {
      await disableTOTP(totpStatus.factors[0].id)
      toast({
        title: "Success",
        description: "Two-factor authentication disabled",
      })
      setTotpStatus({ enabled: false, factors: [] })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Add an extra layer of security to your account by requiring a verification code in addition to your password.
        </p>

        {totpStatus?.enabled ? (
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-green-400" />
              <div>
                <p className="font-medium text-green-400">Enabled</p>
                <p className="text-sm text-muted-foreground">TOTP authenticator app</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisableTOTP}>
              Disable
            </Button>
          </div>
        ) : (
          <Button onClick={handleEnableTOTP} className="neon">
            Enable Two-Factor Authentication
          </Button>
        )}
      </Card>

      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold">Active Sessions</h3>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div>
                <p className="font-medium">{session.device}</p>
                <p className="text-sm text-muted-foreground">
                  {session.ip} • Last active: {new Date(session.last_active).toLocaleString()}
                </p>
                {session.is_current && <span className="text-xs text-green-400 font-medium">Current Session</span>}
              </div>
              {!session.is_current && (
                <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={showTOTPDialog} onOpenChange={setShowTOTPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              {totpData?.qr_code && (
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <img src={totpData.qr_code || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
            </div>

            <div>
              <Label>Or enter this code manually:</Label>
              <code className="block mt-2 p-3 bg-black/50 rounded text-sm font-mono">{totpData?.secret}</code>
            </div>

            <div>
              <Label>Verification Code</Label>
              <Input
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="mt-2"
              />
            </div>

            <Button onClick={handleVerifyTOTP} className="w-full neon" disabled={verifyCode.length !== 6}>
              Verify and Enable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
