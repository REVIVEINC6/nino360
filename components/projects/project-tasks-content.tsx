"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Plus, Calendar, LayoutGrid, BarChart3, User, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignee: {
    id: string
    full_name: string
    avatar_url: string
  }
  due_date: string
  estimated_hours: number
  actual_hours: number
}

interface ProjectTasksContentProps {
  projectId: string
  tasks: Task[]
}

export function ProjectTasksContent({ projectId, tasks }: ProjectTasksContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"kanban" | "list" | "gantt">("kanban")

  const statuses = ["To Do", "In Progress", "In Review", "Done"]

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "medium":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "low":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-muted-foreground mt-1">Manage project tasks and track progress</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 backdrop-blur-sm border-white/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("kanban")}
            className={view === "kanban" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
            className={view === "list" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={view === "gantt" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("gantt")}
            className={view === "gantt" ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Gantt
          </Button>
        </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{status}</h3>
                <Badge variant="secondary" className="rounded-full">
                  {getTasksByStatus(status).length}
                </Badge>
              </div>
              <div className="space-y-3">
                {getTasksByStatus(status).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.actual_hours || 0}/{task.estimated_hours}h
                          </div>
                        </div>
                        {task.assignee && (
                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                              {task.assignee.full_name.charAt(0)}
                            </div>
                            <span className="text-xs text-muted-foreground">{task.assignee.full_name}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card className="bg-white/50 backdrop-blur-sm border-white/20">
          <div className="divide-y divide-white/10">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-white/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium truncate">{task.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    {task.assignee && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{task.assignee.full_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {task.actual_hours || 0}/{task.estimated_hours}h
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Gantt View Placeholder */}
      {view === "gantt" && (
        <Card className="p-12 bg-white/50 backdrop-blur-sm border-white/20">
          <div className="text-center space-y-4">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Gantt Chart View</h3>
              <p className="text-sm text-muted-foreground mt-1">Timeline visualization coming soon</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
