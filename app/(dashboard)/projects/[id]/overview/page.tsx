import { Suspense } from "react"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react"
import { getBurndown } from "../../actions/burndown"

async function ProjectOverview({ projectId }: { projectId: string }) {
  const supabase = await createServerClient()

  const { data: project } = await supabase
    .from("proj.projects")
    .select("*, finance.clients(name), core.users(full_name)")
    .eq("id", projectId)
    .single()

  if (!project) notFound()

  const _project: any = project as any

  const { data: budget } = await supabase.from("proj.budgets").select("*").eq("project_id", projectId).single()

  const burndown = await getBurndown(projectId)

  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{_project.model}</div>
            <p className="text-xs text-muted-foreground">Project type</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {_project.start_date
                ? new Date(_project.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "TBD"}
            </div>
            <p className="text-xs text-muted-foreground">
              {_project.end_date
                ? `to ${new Date(_project.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : "No end date"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {(
                (budget?.labor_budget || 0) +
                (budget?.expense_budget || 0) +
                (budget?.fee_budget || 0)
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{budget?.currency || "USD"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(burndown.percentComplete)}%</div>
            <p className="text-xs text-muted-foreground">
              {burndown.totalLogged}h / {burndown.totalEst}h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
  {_project.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{_project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Budget Breakdown */}
      {budget && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
            <CardDescription>Allocated budget by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Labor Budget</span>
                <span className="text-sm text-muted-foreground">
                  ${budget.labor_budget.toLocaleString()} {budget.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Expense Budget</span>
                <span className="text-sm text-muted-foreground">
                  ${budget.expense_budget.toLocaleString()} {budget.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fee Budget</span>
                <span className="text-sm text-muted-foreground">
                  ${budget.fee_budget.toLocaleString()} {budget.currency}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-bold">Total Budget</span>
                <span className="text-sm font-bold">
                  ${(budget.labor_budget + budget.expense_budget + budget.fee_budget).toLocaleString()}{" "}
                  {budget.currency}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ProjectOverviewPage({ params, searchParams }: { params?: any; searchParams?: any }) {
  return (
    <Suspense fallback={<div>Loading overview...</div>}>
      {/** @ts-expect-error Async render */}
      {ProjectOverview({ projectId: params.id })}
    </Suspense>
  )
}
