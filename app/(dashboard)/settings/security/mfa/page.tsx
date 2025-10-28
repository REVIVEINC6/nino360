"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Shield, Smartphone, MessageSquare, QrCode, Check, X, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QRCode from "qrcode"

export default function MFASetupPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [totpSecret, setTotpSecret] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    checkMFAStatus()
  }, [])

  const checkMFAStatus = async () => {
    try {
      const response = await fetch("/api/auth/mfa/status")
      const data = await response.json()
      setMfaEnabled(data.enabled)
      setPhoneNumber(data.phoneNumber || "")
    } catch (error) {
      console.error("Failed to check MFA status:", error)
    }
  }

  const setupTOTP = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "totp" }),
      })

      const data = await response.json()
      setTotpSecret(data.secret)

      // Generate QR code
      const qrUrl = await QRCode.toDataURL(data.otpauthUrl)
      setQrCodeUrl(qrUrl)

      toast({
        title: "TOTP Setup Started",
        description: "Scan the QR code with your authenticator app",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to setup TOTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTOTP = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "totp",
          code: verificationCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMfaEnabled(true)
        setBackupCodes(data.backupCodes || [])
        toast({
          title: "MFA Enabled",
          description: "Two-factor authentication is now active",
        })
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid code. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const setupSMS = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/mfa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "sms",
          phoneNumber,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Verification Code Sent",
          description: "Check your phone for the code",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to setup SMS MFA",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const disableMFA = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/mfa/disable", {
        method: "POST",
      })

      if (response.ok) {
        setMfaEnabled(false)
        setTotpSecret("")
        setQrCodeUrl("")
        toast({
          title: "MFA Disabled",
          description: "Two-factor authentication has been turned off",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable MFA",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Multi-Factor Authentication</h1>
              <p className="text-gray-600">Add an extra layer of security to your account</p>
            </div>
          </div>
        </div>

        {/* MFA Status */}
        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mfaEnabled ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-gray-400" />}
              <div>
                <p className="font-semibold text-gray-900">MFA Status: {mfaEnabled ? "Enabled" : "Disabled"}</p>
                <p className="text-sm text-gray-600">
                  {mfaEnabled
                    ? "Your account is protected with two-factor authentication"
                    : "Enable MFA to secure your account"}
                </p>
              </div>
            </div>
            {mfaEnabled && (
              <Button
                variant="outline"
                onClick={disableMFA}
                disabled={isLoading}
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                Disable MFA
              </Button>
            )}
          </div>
        </Card>

        {/* Setup Methods */}
        {!mfaEnabled && (
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-6">
            <Tabs defaultValue="totp" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/50">
                <TabsTrigger value="totp" className="data-[state=active]:bg-white">
                  <QrCode className="h-4 w-4 mr-2" />
                  Authenticator App
                </TabsTrigger>
                <TabsTrigger value="sms" className="data-[state=active]:bg-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="totp" className="space-y-6 mt-6">
                {!qrCodeUrl ? (
                  <div className="text-center space-y-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">Setup Authenticator App</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Use apps like Google Authenticator, Authy, or 1Password
                      </p>
                    </div>
                    <Button
                      onClick={setupTOTP}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        "Start Setup"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="inline-block p-4 bg-white rounded-xl border-2 border-gray-200">
                        <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Or enter this code manually:</p>
                        <code className="text-sm font-mono text-gray-900 break-all">{totpSecret}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                      />
                    </div>

                    <Button
                      onClick={verifyTOTP}
                      disabled={isLoading || verificationCode.length !== 6}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Enable"
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sms" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                    <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2 text-center">Setup SMS Authentication</h3>
                    <p className="text-sm text-gray-600 text-center">Receive verification codes via text message</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={setupSMS}
                    disabled={isLoading || !phoneNumber}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}

        {/* Backup Codes */}
        {backupCodes.length > 0 && (
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Backup Codes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Save these codes in a secure place. Each code can only be used once.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-200 font-mono text-sm text-center"
                >
                  {code}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
