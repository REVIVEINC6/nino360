"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Shield, Loader2, AlertTriangle } from "lucide-react"

export default function MFAVerifyPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [method, setMethod] = useState<"totp" | "sms">("totp")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const returnTo = searchParams.get("returnTo") || "/dashboard"

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, code }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Verification Successful",
          description: "You have been authenticated",
        })
        router.push(returnTo)
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid code",
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

  const resendCode = async () => {
    try {
      await fetch("/api/auth/mfa/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method }),
      })

      toast({
        title: "Code Sent",
        description: "A new verification code has been sent",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/70 border-white/20 shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h1>
          <p className="text-gray-600">Enter your verification code to continue</p>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Security Alert</p>
            <p>We detected unusual activity and need to verify your identity.</p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
            <p className="text-xs text-gray-500 text-center">Enter the code from your authenticator app</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Continue"
            )}
          </Button>

          <button
            type="button"
            onClick={resendCode}
            className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Didn't receive a code? Resend
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to login
          </button>
        </div>
      </Card>
    </div>
  )
}
