"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Users, Calendar } from "lucide-react"

const stages = [
  {
    name: "Planning",
    projects: [
      {
        id: "1",
        name: "Patient Portal Enhancement",
        code: "PROJ-2025-003",
        client: "HealthTech Solutions",
        budget: "$300,000",
        progress: 5,
        team: 5,
        endDate: "Sep 30, 2025",
      },
    ],
  },
  {
    name: "Active",
    projects: [
      {
        id: "2",
        name: "E-commerce Platform Redesign",
        code: "PROJ-2025-001",
        client: "TechCorp Inc",
        budget: "$500,000",
        progress: 35,
        team: 8,
        endDate: "Jun 30, 2025",
      },
      {
        id: "3",
        name: "Mobile Banking App",
        code: "PROJ-2025-002",
        client: "FinanceHub LLC",
        budget: "$750,000",
        progress: 20,
        team: 12,
        endDate: "Aug 31, 2025",
      },
      {
        id: "4",
        name: "Learning Management System",
        code: "PROJ-2024-045",
        client: "EduLearn Platform",
        budget: "$420,000",
        progress: 85,
        team: 7,
        endDate: "Mar 31, 2025",
      },
    ],
  },
  {
    name: "On Hold",
    projects: [],
  },
  {
    name: "Completed",
    projects: [
      {
        id: "5",
        name: "Cloud Migration",
        code: "PROJ-2024-038",
        client: "TechCorp Inc",
        budget: "$280,000",
        progress: 100,
        team: 6,
        endDate: "Dec 31, 2024",
      },
    ],
  },
]

export function ProjectsKanban() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage) => (
        <div key={stage.name} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{stage.name}</h3>
            <Badge variant="secondary">{stage.projects.length}</Badge>
          </div>
          <div className="space-y-3">
            {stage.projects.map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-sm font-medium">{project.name}</CardTitle>
                  <p className="text-xs text-muted-foreground font-mono">{project.code}</p>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-xs">{project.budget}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">{project.team}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {project.endDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
