"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { completeTask } from "@/app/(dashboard)/crm/dashboard/actions"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface TaskListProps {
  tasks: Array<{
    id: string
    title: string
    due_date: string
    status: string
    owner: string
  }>
}

export function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isPending, startTransition] = useTransition()

  const handleComplete = (taskId: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    startTransition(async () => {
      try {
        await completeTask(taskId)
        toast.success("Task completed")
      } catch (error) {
        // Rollback on error
        setTasks(initialTasks)
        toast.error("Failed to complete task")
      }
    })
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No open tasks</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors"
              >
                <Checkbox id={task.id} onCheckedChange={() => handleComplete(task.id)} disabled={isPending} />
                <div className="flex-1 space-y-1">
                  <label htmlFor={task.id} className="text-sm font-medium cursor-pointer">
                    {task.title}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
