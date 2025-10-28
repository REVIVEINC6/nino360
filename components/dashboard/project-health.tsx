"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const projects = [
  { id: 1, name: "ERP Migration", status: "on-track", burn: 65, risks: 2 },
  { id: 2, name: "Mobile App v2", status: "at-risk", burn: 85, risks: 5 },
  { id: 3, name: "Cloud Infrastructure", status: "on-track", burn: 45, risks: 1 },
]

export function ProjectHealth() {
  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <CardTitle className="text-base">Project Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-background/50 space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{project.name}</p>
              <Badge variant={project.status === "on-track" ? "default" : "destructive"} className="text-xs">
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Burn: {project.burn}%</span>
              <span className={cn(project.risks > 3 ? "text-destructive" : "")}>{project.risks} risks</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
