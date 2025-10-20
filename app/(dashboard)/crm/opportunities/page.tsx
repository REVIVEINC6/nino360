import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, DollarSign } from "lucide-react"
import { Suspense } from "react"
import { OpportunitiesContent } from "@/components/crm-opportunities/opportunities-content"
import { OpportunitiesHeader } from "@/components/crm-opportunities/opportunities-header"
import { AILoadingState } from "@/components/shared/ai-loading-state"

export default async function OpportunitiesPage() {
  return (
    <div className="min-h-screen ai-gradient-bg p-6 space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">+5 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3.1M</div>
            <p className="text-xs text-muted-foreground">Weighted: $1.8M</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% this quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities Table */}
      <OpportunitiesHeader />

      <Suspense fallback={<AILoadingState message="Loading opportunities with AI insights..." />}>
        <OpportunitiesContent />
      </Suspense>
    </div>
  )
}
