import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

async function TasksBoard({ projectId }: { projectId: string }) {
  const supabase = await createServerClient()

  const { data: tasks } = await supabase
    .from("proj.tasks")
    .select("*, assignee:core.users(full_name)")
    .eq("project_id", projectId)
    .order("position", { ascending: true })

  const _tasks: any[] = (tasks as any) || []

  const columns = [
    { id: "todo", title: "To Do", tasks: _tasks.filter((t: any) => t.status === "todo") || [] },
    { id: "in_progress", title: "In Progress", tasks: _tasks.filter((t: any) => t.status === "in_progress") || [] },
    { id: "review", title: "Review", tasks: _tasks.filter((t: any) => t.status === "review") || [] },
    { id: "done", title: "Done", tasks: _tasks.filter((t: any) => t.status === "done") || [] },
    { id: "blocked", title: "Blocked", tasks: _tasks.filter((t: any) => t.status === "blocked") || [] },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((column) => (
          <Card key={column.id}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                {column.title}
                <Badge variant="secondary">{column.tasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {column.tasks.map((task: any) => (
                <Card key={task.id} className="p-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.assignee && <p className="text-xs text-muted-foreground">{task.assignee.full_name}</p>}
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                      <span className="text-muted-foreground">
                        {task.logged_hours}h / {task.estimate_hours}h
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function ProjectTasksPage({ params, searchParams }: { params?: any; searchParams?: any }) {
  const board = await TasksBoard({ projectId: params.id })

  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      {board}
    </Suspense>
  )
}
