import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Target, TrendingUp, DollarSign } from "lucide-react"

export default async function OpportunitiesPage() {
  return (
    <div className="space-y-6">
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Opportunities</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">View Pipeline</Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Opportunity
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search opportunities..." className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">Title</th>
                  <th className="p-3 text-left text-sm font-medium">Account</th>
                  <th className="p-3 text-left text-sm font-medium">Amount</th>
                  <th className="p-3 text-left text-sm font-medium">Stage</th>
                  <th className="p-3 text-left text-sm font-medium">Close Date</th>
                  <th className="p-3 text-left text-sm font-medium">Owner</th>
                  <th className="p-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    title: "Enterprise License Renewal",
                    account: "Acme Corp",
                    amount: "$250K",
                    stage: "Negotiation",
                    date: "2025-01-15",
                    owner: "John Doe",
                  },
                  {
                    title: "Cloud Migration Project",
                    account: "TechStart Inc",
                    amount: "$180K",
                    stage: "Proposal",
                    date: "2025-01-30",
                    owner: "Jane Smith",
                  },
                  {
                    title: "Consulting Services",
                    account: "GlobalTech",
                    amount: "$95K",
                    stage: "Qualified",
                    date: "2025-02-10",
                    owner: "Bob Johnson",
                  },
                ].map((opp, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 text-sm font-medium">{opp.title}</td>
                    <td className="p-3 text-sm">{opp.account}</td>
                    <td className="p-3 text-sm font-medium">{opp.amount}</td>
                    <td className="p-3 text-sm">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{opp.date}</td>
                    <td className="p-3 text-sm">{opp.owner}</td>
                    <td className="p-3 text-sm">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
