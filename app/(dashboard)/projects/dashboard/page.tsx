import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerClient } from "@/lib/supabase/server"
import { FolderKanban, Target, CheckCircle2, Users } from "lucide-react"

async function ProjectsKPIs() {
  const supabase = await createServerClient()

  const { data: projects } = await supabase.from("proj.projects").select("*")

  const activeProjects = projects?.filter((p: any) => p.status === "active").length || 0
  const totalProjects = projects?.length || 0

  const { data: milestones } = await supabase
    .from("proj.milestones")
    .select("*")
    .gte("due_date", new Date().toISOString().split("T")[0])
    .lte("due_date", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

  const { data: tasks } = await supabase.from("proj.tasks").select("*").eq("status", "done")

  const { data: allocations } = await supabase.from("proj.allocations").select("*")

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">{totalProjects} total projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Milestones Due (7d)</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{milestones?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Upcoming this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasks?.length || 0}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Allocations</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{allocations?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Active allocations</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function ProjectsDashboardPage() {
  const kpis = await ProjectsKPIs()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
        <p className="text-muted-foreground">Overview of all internal projects, milestones, and team allocations</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        {kpis}
      </Suspense>
    </div>
  )
}
