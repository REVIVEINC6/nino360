"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AnchorRunButton({ runId }: { runId: string }) {
  const [pending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={pending || loading}
      onClick={() => {
        setLoading(true)
        fetch(`/api/pay-on-pay/anchor/${runId}`, { method: "POST" })
          .then(() => {
            startTransition(() => router.refresh())
          })
          .finally(() => setLoading(false))
      }}
    >
      {pending || loading ? "Anchoring..." : "Anchor on Chain"}
    </Button>
  )
}
