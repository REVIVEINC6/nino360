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
import { MoreHorizontal, Eye, Edit, Users, Copy } from "lucide-react"
import Link from "next/link"

const jobs = [
  {
    id: "1",
    title: "Senior React Developer",
    client: "TechCorp Inc",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Senior",
    salary: "$140k - $180k",
    applicants: 23,
    status: "open",
    priority: "high",
    posted: "2 days ago",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    client: "FinanceHub LLC",
    location: "New York, NY",
    type: "Full-time",
    level: "Mid",
    salary: "$120k - $150k",
    applicants: 18,
    status: "open",
    priority: "medium",
    posted: "5 days ago",
  },
  {
    id: "3",
    title: "DevOps Engineer",
    client: "HealthTech Solutions",
    location: "Remote",
    type: "Contract",
    level: "Senior",
    salary: "$130k - $160k",
    applicants: 31,
    status: "open",
    priority: "urgent",
    posted: "1 day ago",
  },
  {
    id: "4",
    title: "Data Engineer",
    client: "TechCorp Inc",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Mid",
    salary: "$110k - $140k",
    applicants: 12,
    status: "on_hold",
    priority: "low",
    posted: "2 weeks ago",
  },
  {
    id: "5",
    title: "Product Designer",
    client: "EduLearn Platform",
    location: "Austin, TX",
    type: "Full-time",
    level: "Senior",
    salary: "$120k - $150k",
    applicants: 27,
    status: "open",
    priority: "medium",
    posted: "1 week ago",
  },
]

const statusColors: Record<string, string> = {
  open: "bg-green-500/10 text-green-600 dark:text-green-400",
  on_hold: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  filled: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
}

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  low: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export function JobsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.level} level</p>
                </div>
              </TableCell>
              <TableCell>{job.client}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.type}</TableCell>
              <TableCell className="font-medium">{job.salary}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{job.applicants}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[job.status]}>
                  {job.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={priorityColors[job.priority]}>
                  {job.priority}
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
                    <DropdownMenuItem asChild>
                      <Link href={`/talent/jobs/${job.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Job
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      View Applicants
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate Job
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
