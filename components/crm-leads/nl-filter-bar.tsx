"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { useState, type ChangeEvent } from "react"
import { nlFilterToQuery } from "@/app/(dashboard)/crm/leads/actions"

export function NLFilterBar({ onFilters }: { onFilters: (filters: any) => void }) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    const res = await nlFilterToQuery(text)
    setLoading(false)
    if (res?.success) onFilters(res.filters)
  }

  return (
    <div className="flex gap-2 items-center">
        <Input
        placeholder="e.g., qualified leads with score > 75 from events"
        value={text}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        className="glass-card border-white/20"
      />
      <Button onClick={run} disabled={loading} className="gap-2 bg-linear-to-r from-blue-600 to-purple-600">
        <Wand2 className="h-4 w-4" />
        {loading ? "Parsing..." : "Parse"}
      </Button>
    </div>
  )
}
