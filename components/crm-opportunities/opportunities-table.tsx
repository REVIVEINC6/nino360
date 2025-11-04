"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"

interface OpportunitiesTableProps {
  opportunities: any[]
}

export function OpportunitiesTable({ opportunities }: OpportunitiesTableProps) {
  const router = useRouter()

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      Prospecting: "bg-gray-100 text-gray-700",
      Qualification: "bg-blue-100 text-blue-700",
      Proposal: "bg-purple-100 text-purple-700",
      Negotiation: "bg-orange-100 text-orange-700",
      "Closed Won": "bg-green-100 text-green-700",
      "Closed Lost": "bg-red-100 text-red-700",
    }
    return colors[stage] || "bg-gray-100 text-gray-700"
  }

  return (
    <Card className="glass-card border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Opportunities
            <Badge variant="secondary" className="ml-2">
              {opportunities.length}
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Sort
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="p-3 text-left text-sm font-medium">Opportunity</th>
                  <th className="p-3 text-left text-sm font-medium">Account</th>
                  <th className="p-3 text-left text-sm font-medium">Amount</th>
                  <th className="p-3 text-left text-sm font-medium">Stage</th>
                  <th className="p-3 text-left text-sm font-medium">Win Probability</th>
                  <th className="p-3 text-left text-sm font-medium">Close Date</th>
                  <th className="p-3 text-left text-sm font-medium">Owner</th>
                  <th className="p-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp, index) => (
                  <motion.tr
                    key={opp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{opp.title}</span>
                        {opp.blockchain_hash && <BlockchainBadge hash={opp.blockchain_hash} size="sm" />}
                      </div>
                    </td>
                    <td className="p-3 text-sm">{opp.account_name || "—"}</td>
                    <td className="p-3 text-sm font-medium">${(opp.amount || 0).toLocaleString()}</td>
                    <td className="p-3">
                      <Badge className={getStageColor(opp.stage)}>{opp.stage}</Badge>
                    </td>
                    <td className="p-3">
                      <MLConfidenceMeter value={opp.win_probability || 0} size="sm" showLabel />
                    </td>
                    <td className="p-3 text-sm">
                      {opp.close_date ? new Date(opp.close_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-sm">{opp.owner_name || "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/crm/opportunities/${opp.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
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
