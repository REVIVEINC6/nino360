"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mail, Phone, Search, Filter, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState, type ChangeEvent } from "react"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"
import { convertLead } from "@/app/(dashboard)/crm/leads/actions"
import { useRouter } from "next/navigation"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"

interface LeadsTableProps {
  leads: any[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [converting, setConverting] = useState<string | null>(null)

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      lead.first_name?.toLowerCase().includes(query) ||
      lead.last_name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query)
    )
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-purple-100 text-purple-700",
      qualified: "bg-green-100 text-green-700",
      unqualified: "bg-gray-100 text-gray-700",
      converted: "bg-emerald-100 text-emerald-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  const handleConvert = async (leadId: string) => {
    setConverting(leadId)
    const result = await convertLead(leadId, true)
    setConverting(null)

    if (result.success) {
      router.refresh()
    }
  }

  const handleMailClick = (email?: string) => {
    if (!email) return
    // Open the user's mail client
    window.location.href = `mailto:${email}`
  }

  const handlePhoneClick = (phone?: string) => {
    if (!phone) return
    // Attempt to open a tel: link; on desktop this will prompt supported apps
    window.location.href = `tel:${phone}`
  }

  const openFilterPanel = () => {
    // Toggle a `filter` query param to show/hide a (future) filter panel
    const params = new URLSearchParams(window.location.search)
    const current = params.get("filter") === "1"
    params.set("filter", current ? "0" : "1")
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const applyAISort = () => {
    // Toggle an `ai_sort` query param to enable AI sorting
    const params = new URLSearchParams(window.location.search)
    const current = params.get("ai_sort") === "1"
    params.set("ai_sort", current ? "0" : "1")
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Leads
            <Badge variant="secondary" className="ml-2">
              {filteredLeads.length}
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={openFilterPanel}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={applyAISort}>
              <Sparkles className="h-4 w-4 text-purple-500" />
              AI Sort
            </Button>
          </div>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-white/20"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="p-3 text-left text-sm font-medium">Name</th>
                  <th className="p-3 text-left text-sm font-medium">Company</th>
                  <th className="p-3 text-left text-sm font-medium">AI Score</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Source</th>
                  <th className="p-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {lead.first_name} {lead.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">{lead.email}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{lead.company || "—"}</td>
                    <td className="p-3">
                      <MLConfidenceMeter value={lead.score || 0} size="sm" showLabel />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        <BlockchainBadge hash={lead.audit_hash} verified={Boolean(lead.audit_hash_verified)} />
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{lead.source || "Unknown"}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleMailClick(lead.email)} aria-label={`Email ${lead.first_name}`}>
                          <Mail className="h-4 w-4 text-sky-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePhoneClick(lead.phone)} aria-label={`Call ${lead.first_name}`}>
                          <Phone className="h-4 w-4 text-emerald-500" />
                        </Button>
                        {lead.status === "qualified" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConvert(lead.id)}
                            disabled={converting === lead.id}
                          >
                            <ArrowRight className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
