"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

function VerifyOTPContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    if (countdown > 0) return

    setIsResending(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast({
        title: "Email sent",
        description: "Check your inbox for a new verification link",
      })
      setCountdown(60)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-panel border-white/10 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
              <Mail className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-white/60">
              We sent a verification link to
              <br />
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
              <div className="text-sm text-white/80">
                <p className="font-medium mb-1">Click the link in your email</p>
                <p className="text-white/60">The link will expire in 1 hour</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-white/60 mb-3">Didn't receive the email?</p>
              <Button
                onClick={handleResend}
                disabled={isResending || countdown > 0}
                variant="outline"
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Resend email"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
