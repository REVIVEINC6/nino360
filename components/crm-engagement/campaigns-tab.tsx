"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Sparkles } from "lucide-react"
import { getCampaigns, aiOptimizeCampaignSendTime } from "@/app/(dashboard)/crm/actions/engagement"
import { motion } from "framer-motion"

export function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    try {
      const data = await getCampaigns()
      setCampaigns(data)
    } catch (error) {
      console.error("Failed to load campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleOptimizeSendTime(campaignId: string) {
    try {
      await aiOptimizeCampaignSendTime(campaignId)
      await loadCampaigns()
    } catch (error) {
      console.error("Failed to optimize send time:", error)
    }
  }

  if (loading) {
    return <div className="glass-card p-6">Loading campaigns...</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Marketing Campaigns</h3>
            <p className="text-sm text-muted-foreground">Bulk email campaigns with AI send time optimization</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="glass-panel p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.sent_at ? `Sent on ${new Date(campaign.sent_at).toLocaleDateString()}` : "Draft"}
                  </p>
                  {campaign.ai_optimized && (
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-purple-600">
                        AI-Optimized Send Time: {new Date(campaign.ai_send_time).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Recipients</p>
                  <p className="text-lg font-semibold">{campaign.recipient_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Opens</p>
                  <p className="text-lg font-semibold">{campaign.opened_count || 0}</p>
                  {campaign.sent_count > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((campaign.opened_count / campaign.sent_count) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-lg font-semibold">{campaign.clicked_count || 0}</p>
                  {campaign.sent_count > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>

              {!campaign.ai_optimized && campaign.status === "draft" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleOptimizeSendTime(campaign.id)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Optimize Send Time
                </Button>
              )}
            </Card>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
