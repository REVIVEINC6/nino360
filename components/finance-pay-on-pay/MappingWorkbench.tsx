"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MappingWorkbench({ runId }: { runId: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function suggest() {
    setLoading(true)
    try {
      const res = await fetch(`/api/pay-on-pay/settlements/${runId}/suggest`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientInvoiceId: crypto.randomUUID() }),
      })
      const json = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapping Workbench</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={suggest} disabled={loading}>{loading ? "Generating..." : "Generate Suggestion"}</Button>
        {data && <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-80">{JSON.stringify(data, null, 2)}</pre>}
      </CardContent>
    </Card>
  )
}
