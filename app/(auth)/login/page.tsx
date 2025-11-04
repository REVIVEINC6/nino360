"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { isSupabaseBrowserConfigured } from "@/lib/supabase-browser"
import { logAuthAttempt, loginWithPassword } from "./actions"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [useOTP, setUseOTP] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
  const supabase = getSupabaseBrowserClient()

      if (useOTP) {
        const { error } = await supabase.auth.signInWithOtp?.({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        toast({
          title: "Check your email",
          description: "We sent you a secure login link.",
        })
      } else {
        // Perform password login on the server so auth cookies are set for middleware
        const result = await loginWithPassword({ email, password, userAgent: navigator.userAgent })
        if (!result.ok) throw new Error(result.error || "Failed to sign in")

        // Log successful auth (non-blocking)
        logAuthAttempt({
          email,
          success: true,
          userAgent: navigator.userAgent,
        }).catch(console.error)

        // Ask server for RBAC / FLAC after-login info and redirect accordingly
        try {
          const res = await fetch('/api/auth/post-login')
          const json = await res.json()

          const roles: string[] = json?.roles?.map((r: any) => r.key) || []

          // Simple routing rules - adapt as needed
          if (roles.includes('tenant_admin')) {
            router.push('/dashboard/admin')
          } else if (roles.includes('manager')) {
            router.push('/dashboard')
          } else {
            router.push('/dashboard')
          }
        } catch (err) {
          // Fallback
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      // Log failed attempt (best-effort server call)
      try {
        await logAuthAttempt({ email, success: false, userAgent: navigator.userAgent })
      } catch (e) {
        console.error('Failed to log failed auth attempt', e)
      }
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot password state and handler
  const [showForgot, setShowForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)

  const handleResetPassword = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setResetLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })

      if (error) throw error

      toast({ title: 'Password reset sent', description: 'Check your email for reset instructions.' })
      setShowForgot(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to request password reset', variant: 'destructive' })
    } finally {
      setResetLoading(false)
    }
  }

  // AI assistant: lightweight suggestion from a local stub
  const handleAIHelp = async () => {
    try {
      const res = await fetch('/api/ai/suggest')
      const json = await res.json()
      toast({ title: 'AI suggestion', description: json?.suggestion || 'Try signing in with a magic link' })
    } catch (e) {
      toast({ title: 'AI error', description: 'Unable to fetch suggestion', variant: 'destructive' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      {!isSupabaseBrowserConfigured() && (
        <div className="fixed right-6 bottom-6 z-50 max-w-md">
          <div className="rounded-md bg-red-600 text-white p-4 shadow-lg">
            <div className="font-bold">Error</div>
            <div className="text-sm mt-1">NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for the browser client</div>
            <div className="mt-2 text-xs opacity-90">Set these env vars in your hosting provider and redeploy.</div>
          </div>
        </div>
      )}
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Nino360 account</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          {!useOTP && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!useOTP}
                  className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                {useOTP ? "Send magic link" : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => setUseOTP(!useOTP)}
            className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            {useOTP ? "Use password instead" : "Use passwordless login"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-gray-600 hover:text-gray-900">
            Forgot password?
          </button>

          <button type="button" onClick={handleAIHelp} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            AI assistant
          </button>
        </div>

        {showForgot && (
          <form onSubmit={handleResetPassword} className="mt-4 space-y-2">
            <Label htmlFor="resetEmail" className="text-gray-700 font-medium">Email to reset</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input id="resetEmail" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={resetLoading} className="bg-green-600 hover:bg-green-700">{resetLoading ? 'Sending...' : 'Send reset'}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForgot(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
