import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { ProjectsTable } from "@/components/projects/projects-table"
import { ProjectsKanban } from "@/components/projects/projects-kanban"
import { ProjectsStats } from "@/components/projects/projects-stats"
import { Suspense } from "react"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"

async function ProjectsList() {
  const supabase = await createServerClient()

  const { data: projects } = await supabase
    .from("proj.projects")
    .select("*, finance.clients(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-4">
      {projects?.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}/overview`}>
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: project.color || "#2563eb" }}
                  >
                    {project.code.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.code}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    project.status === "active" ? "default" : project.status === "completed" ? "secondary" : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Model: {project.model}</span>
                {project.clients && <span>Client: {project.clients.name}</span>}
                {project.start_date && <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage internal projects and resource assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ProjectsStats />

      {/* Projects List */}
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsList />
      </Suspense>

      {/* Projects Tabs */}
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="kanban">Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>Track and manage client projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kanban">
          <ProjectsKanban />
        </TabsContent>
      </Tabs>
    </div>
  )
}
