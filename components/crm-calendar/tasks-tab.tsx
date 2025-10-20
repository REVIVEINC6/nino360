"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"
import { getTasks, updateTaskStatus } from "@/app/(dashboard)/crm/actions/calendar"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"
import { MLConfidenceMeter } from "@/components/shared/ml-confidence-meter"
import { motion } from "framer-motion"
import { format } from "date-fns"

export function TasksTab() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadTasks()
  }, [filter])

  async function loadTasks() {
    try {
      const filters: any = {}
      if (filter !== "all") {
        filters.status = filter
      }
      const data = await getTasks(filters)
      setTasks(data)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleComplete(taskId: string, currentStatus: string) {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed"
      await updateTaskStatus(taskId, newStatus)
      loadTasks()
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  if (loading) {
    return <div className="glass-card p-6">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button size="sm" variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
          Pending
        </Button>
        <Button
          size="sm"
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="glass-card p-12 text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No tasks found</p>
        </Card>
      ) : (
        tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-card p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <button onClick={() => handleToggleComplete(task.id, task.status)} className="mt-1">
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-blue-500 transition-colors" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </h4>
                    {task.blockchain_hash && <BlockchainBadge hash={task.blockchain_hash} size="sm" />}
                  </div>

                  {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {task.due_date && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(task.due_date), "MMM d, h:mm a")}
                      </div>
                    )}

                    <Badge
                      variant={
                        task.priority === "urgent" ? "destructive" : task.priority === "high" ? "default" : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>

                    <Badge variant="outline">{task.task_type}</Badge>

                    {task.ai_priority_score && (
                      <MLConfidenceMeter confidence={task.ai_priority_score} label="AI Priority" size="sm" />
                    )}
                  </div>

                  {task.ai_reasoning && (
                    <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        AI Insight: {task.ai_reasoning}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}
