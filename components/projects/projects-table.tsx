"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const projects = [
  {
    id: "1",
    name: "E-commerce Platform Redesign",
    code: "PROJ-2025-001",
    client: "TechCorp Inc",
    manager: "Lisa Manager",
    startDate: "Jan 1, 2025",
    endDate: "Jun 30, 2025",
    budget: "$500,000",
    progress: 35,
    team: 8,
    status: "active",
  },
  {
    id: "2",
    name: "Mobile Banking App",
    code: "PROJ-2025-002",
    client: "FinanceHub LLC",
    manager: "John Admin",
    startDate: "Feb 1, 2025",
    endDate: "Aug 31, 2025",
    budget: "$750,000",
    progress: 20,
    team: 12,
    status: "active",
  },
  {
    id: "3",
    name: "Patient Portal Enhancement",
    code: "PROJ-2025-003",
    client: "HealthTech Solutions",
    manager: "Sarah Recruiter",
    startDate: "Mar 1, 2025",
    endDate: "Sep 30, 2025",
    budget: "$300,000",
    progress: 5,
    team: 5,
    status: "planning",
  },
  {
    id: "4",
    name: "Learning Management System",
    code: "PROJ-2024-045",
    client: "EduLearn Platform",
    manager: "Lisa Manager",
    startDate: "Oct 1, 2024",
    endDate: "Mar 31, 2025",
    budget: "$420,000",
    progress: 85,
    team: 7,
    status: "active",
  },
  {
    id: "5",
    name: "Cloud Migration",
    code: "PROJ-2024-038",
    client: "TechCorp Inc",
    manager: "Mike Finance",
    startDate: "Sep 1, 2024",
    endDate: "Dec 31, 2024",
    budget: "$280,000",
    progress: 100,
    team: 6,
    status: "completed",
  },
]

const statusColors: Record<string, string> = {
  planning: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  active: "bg-green-500/10 text-green-600 dark:text-green-400",
  on_hold: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  completed: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function ProjectsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{project.code}</p>
                </div>
              </TableCell>
              <TableCell>{project.client}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                    <AvatarFallback className="text-xs">
                      {project.manager
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{project.manager}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{project.startDate}</p>
                  <p className="text-muted-foreground">{project.endDate}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">{project.budget}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{project.team}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[project.status]}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Manage Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
