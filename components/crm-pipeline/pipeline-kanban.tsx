import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Calendar, Building2 } from "lucide-react"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"

interface PipelineKanbanProps {
  opportunities: any[]
  stages: any[]
}

export function PipelineKanban({ opportunities, stages }: PipelineKanbanProps) {
  return (
    <div className="glass-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pipeline Board</h2>
        <Badge variant="outline" className="ai-glow">
          AI-Powered
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {stages.map((stage) => {
          const stageOpps = opportunities.filter((opp) => opp.stage === stage.name)
          const stageValue = stageOpps.reduce((sum, opp) => sum + (opp.amount || 0), 0)

          return (
            <div key={stage.id} className="space-y-3">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {stageOpps.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <DollarSign className="h-3 w-3" />${(stageValue / 1000).toFixed(0)}K
                  </div>
                </CardHeader>
              </Card>

              <div className="space-y-2">
                {stageOpps.slice(0, 5).map((opp) => (
                  <Card
                    key={opp.id}
                    className="glass-card cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-sm font-semibold line-clamp-1">{opp.name}</h3>
                        <BlockchainBadge verified={!!opp.blockchain_hash} size="sm" />
                      </div>

                      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span className="line-clamp-1">{opp.account_name || "No account"}</span>
                      </div>

                      <div className="mb-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-primary">${((opp.amount || 0) / 1000).toFixed(0)}K</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {opp.close_date
                            ? new Date(opp.close_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "No date"}
                        </div>
                      </div>

                      <MLConfidenceMeter confidence={opp.win_probability || 0} label="Win Probability" size="sm" />
                    </CardContent>
                  </Card>
                ))}

                {stageOpps.length > 5 && (
                  <div className="text-center text-xs text-muted-foreground">+{stageOpps.length - 5} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
