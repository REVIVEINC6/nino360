import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"

async function MilestonesList({ projectId }: { projectId: string }) {
  const supabase = await createServerClient()

  const { data: milestones } = await supabase
    .from("proj.milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("due_date", { ascending: true })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Milestones</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      <div className="grid gap-4">
        {milestones?.map((milestone: { id: string; title?: string; status?: string; due_date?: string | null; amount?: number }) => (
          <Card key={milestone.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{milestone.title}</CardTitle>
                <Badge
                  variant={
                    milestone.status === "completed"
                      ? "default"
                      : milestone.status === "in_progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {milestone.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {milestone.due_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                  </div>
                )}
                {typeof milestone.amount === "number" && milestone.amount > 0 && (
                  <span>Amount: ${milestone.amount.toLocaleString()}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ProjectMilestonesPage({ params, searchParams }: { params?: any; searchParams?: any }) {
  return (
    <Suspense fallback={<div>Loading milestones...</div>}>
      {MilestonesList({ projectId: params.id })}
    </Suspense>
  )
}
