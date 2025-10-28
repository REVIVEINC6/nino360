"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Sparkles, TrendingUp, Zap, Shield, Bot } from "lucide-react"
import { motion } from "framer-motion"
import { aiSearchCandidates } from "@/app/(dashboard)/talent/sourcing/actions"
import { useToast } from "@/hooks/use-toast"

interface AISourcingContentProps {
  insights?: any[]
}

export function AISourcingContent({ insights = [] }: AISourcingContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [candidates, setCandidates] = useState<any[]>([])
  const { toast } = useToast()

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await aiSearchCandidates({ query: searchQuery, limit: 20 })

      if (response.success) {
        setCandidates(response.data || [])
        toast({
          title: "AI Search Complete",
          description: `Found ${response.data?.length || 0} candidates`,
        })
      } else {
        toast({
          title: "Search Failed",
          description: response.error || "Failed to search candidates",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during search",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* AI Search Panel */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="p-6 bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Candidate Search
            </h2>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Describe your ideal candidate... (e.g., 'Senior React developer with 5+ years experience')"
                className="pl-9 bg-white/50 border-purple-200 focus:border-purple-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
              />
            </div>
            <Button
              onClick={handleAISearch}
              disabled={searching}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {searching ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Search
                </>
              )}
            </Button>
          </div>

          {/* AI Insights Banner */}
          {insights && insights.length > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-lg border border-purple-200/50">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">AI Insight</h4>
                  <p className="text-sm text-muted-foreground">{insights[0].description}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {insights[0].confidence}% confidence
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Tabs for different views */}
      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList className="bg-white/70 backdrop-blur-md border border-white/20">
          <TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger>
          <TabsTrigger value="matches">
            <Zap className="h-4 w-4 mr-2" />
            AI Matches
          </TabsTrigger>
          <TabsTrigger value="campaigns">Auto-Outreach</TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="h-4 w-4 mr-2" />
            Blockchain Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-4">
          {candidates.length === 0 ? (
            <Card className="p-12 text-center bg-white/70 backdrop-blur-md border-white/20">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No candidates yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use AI search above to find candidates matching your criteria
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-4 bg-white/70 backdrop-blur-md border-white/20 hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold truncate">{candidate.full_name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{candidate.headline}</p>
                      </div>
                      {candidate.ml_match_score > 0 && (
                        <Badge variant={candidate.ml_match_score >= 80 ? "default" : "secondary"} className="ml-2">
                          {candidate.ml_match_score}%
                        </Badge>
                      )}
                    </div>

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.skills.slice(0, 3).map((skill: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-purple-50/50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-white/50">
                        View Profile
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                        Match to Job
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches">
          <Card className="p-12 text-center bg-white/70 backdrop-blur-md border-white/20">
            <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">AI Matching Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">View top candidates matched to your open requisitions</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Run AI Matching</Button>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card className="p-12 text-center bg-white/70 backdrop-blur-md border-white/20">
            <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Auto-Outreach Campaigns</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create automated outreach campaigns to engage candidates
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Create Campaign</Button>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card className="p-12 text-center bg-white/70 backdrop-blur-md border-white/20">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Blockchain Audit Trail</h3>
            <p className="text-sm text-muted-foreground mb-4">View immutable audit logs for all sourcing activities</p>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">View Audit Trail</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
