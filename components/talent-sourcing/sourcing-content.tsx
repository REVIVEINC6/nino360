"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Mail, Users } from "lucide-react"

interface SourcingContentProps {
  candidates?: any[]
  pools?: any[]
  campaigns?: any[]
}

export function SourcingContent({ candidates = [], pools = [], campaigns = [] }: SourcingContentProps) {
  const [activeTab, setActiveTab] = useState<"candidates" | "pools" | "campaigns">("candidates")

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex gap-2 border-b">
        <Button variant={activeTab === "candidates" ? "default" : "ghost"} onClick={() => setActiveTab("candidates")}>
          Candidates ({candidates.length})
        </Button>
        <Button variant={activeTab === "pools" ? "default" : "ghost"} onClick={() => setActiveTab("pools")}>
          Talent Pools ({pools.length})
        </Button>
        <Button variant={activeTab === "campaigns" ? "default" : "ghost"} onClick={() => setActiveTab("campaigns")}>
          Campaigns ({campaigns.length})
        </Button>
      </div>

      {activeTab === "candidates" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No candidates yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start sourcing by uploading resumes, CSV files, or connecting email intake
              </p>
            </Card>
          ) : (
            candidates.map((candidate) => (
              <Card key={candidate.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={candidate.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {candidate.first_name?.[0]}
                      {candidate.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">
                      {candidate.first_name} {candidate.last_name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">{candidate.job_title}</p>
                  </div>
                </div>
                {candidate.skills && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {candidate.skills.slice(0, 3).map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1">
                    Match to Job
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "pools" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pools.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No talent pools yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create pools to organize candidates by skills or roles
              </p>
              <Button>Create Pool</Button>
            </Card>
          ) : (
            pools.map((pool) => (
              <Card key={pool.id} className="p-4">
                <h4 className="font-semibold mb-2">{pool.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{pool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{pool.candidate_count} candidates</span>
                  <Button size="sm" variant="outline">
                    View Pool
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create sourcing campaigns to reach out to candidates</p>
              <Button>Create Campaign</Button>
            </Card>
          ) : (
            campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">{campaign.name}</h4>
                  <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>{campaign.sent_count} sent</span>
                  <span className="text-green-600">{campaign.response_rate}% response</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
