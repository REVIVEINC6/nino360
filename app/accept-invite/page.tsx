"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid invitation link")
      return
    }

    async function acceptInvite() {
      try {
        const supabase = createClient()

        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          setStatus("error")
          setMessage("You must be logged in to accept an invitation")
          return
        }

        // Accept invitation
        const response = await fetch("/api/admin/accept-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, user_id: user.id }),
        })

        const data = await response.json()

        if (!response.ok) {
          setStatus("error")
          setMessage(data.error || "Failed to accept invitation")
          return
        }

        setStatus("success")
        setMessage("Invitation accepted successfully! Redirecting...")

        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        console.error("[v0] Error accepting invitation:", error)
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    acceptInvite()
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "loading" && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
            {status === "success" && <CheckCircle className="h-12 w-12 text-green-500" />}
            {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
          </div>
          <CardTitle>
            {status === "loading" && "Processing Invitation"}
            {status === "success" && "Success!"}
            {status === "error" && "Error"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "error" && <Button onClick={() => router.push("/login")}>Go to Sign In</Button>}
        </CardContent>
      </Card>
    </div>
  )
}
