import type React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

async function ProjectHeader({ projectId }: { projectId: string }) {
  const supabase = await createServerClient()

  const { data: project, error } = await supabase
    .from("proj.projects")
    .select("*, finance.clients(name)")
    .eq("id", projectId)
    .single()

  if (error || !project) {
    notFound()
  }

  const _project: any = project as any

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: _project.color || "#2563eb" }}
          >
            {_project.code.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{_project.name}</h1>
            <p className="text-muted-foreground">{_project.code}</p>
          </div>
        </div>
        <Badge
          variant={_project.status === "active" ? "default" : _project.status === "completed" ? "secondary" : "outline"}
        >
          {_project.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <Link href={`/projects/${projectId}/overview`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </Link>
          <Link href={`/projects/${projectId}/milestones`}>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </Link>
          <Link href={`/projects/${projectId}/tasks`}>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </Link>
          <Link href={`/projects/${projectId}/team`}>
            <TabsTrigger value="team">Team</TabsTrigger>
          </Link>
          <Link href={`/projects/${projectId}/time`}>
            <TabsTrigger value="time">Time</TabsTrigger>
          </Link>
          <Link href={`/projects/${projectId}/expenses`}>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </Link>
          <Link href={`/projects/${projectId}/files`}>
            <TabsTrigger value="files">Files</TabsTrigger>
          </Link>
          <Link href={`/projects/${projectId}/settings`}>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  return (
    <div className="p-6 space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        {/* ProjectHeader is async; await it at render time */}
        {ProjectHeader({ projectId: params.id })}
      </Suspense>
      {children}
    </div>
  )
}
