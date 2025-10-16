import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign } from "lucide-react"

export default async function PipelinePage() {
  const stages = [
    { name: "Prospect", count: 24, value: "$480K", color: "bg-gray-100" },
    { name: "Qualified", count: 18, value: "$720K", color: "bg-blue-100" },
    { name: "Proposal", count: 15, value: "$900K", color: "bg-purple-100" },
    { name: "Negotiation", count: 12, value: "$600K", color: "bg-orange-100" },
    { name: "Closed Won", count: 8, value: "$400K", color: "bg-green-100" },
  ]

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Pipeline</CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Opportunity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Pipeline Value</div>
              <div className="text-3xl font-bold">$3.1M</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Weighted Pipeline</div>
              <div className="text-3xl font-bold text-primary">$1.8M</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Opportunities</div>
              <div className="text-3xl font-bold">77</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-5">
        {stages.map((stage) => (
          <Card key={stage.name} className={stage.color}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                <span className="text-xs text-muted-foreground">({stage.count})</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <DollarSign className="h-3 w-3" />
                {stage.value}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Sample opportunity cards */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="cursor-pointer bg-white hover:shadow-md">
                  <CardContent className="p-3">
                    <div className="text-sm font-medium">Opportunity {i}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Acme Corp</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold">$50K</span>
                      <span className="text-xs text-muted-foreground">Jan 15</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
