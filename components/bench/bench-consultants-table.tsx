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
import { MoreHorizontal, Eye, Briefcase, Mail } from "lucide-react"

const consultants = [
  {
    id: "1",
    name: "Alex Thompson",
    title: "Senior Full Stack Developer",
    skills: ["React", "Node.js", "AWS", "PostgreSQL"],
    experience: 7,
    location: "San Francisco, CA",
    availableFrom: "Jan 15, 2025",
    hourlyRate: "$120",
    dailyRate: "$960",
    status: "available",
    remote: true,
  },
  {
    id: "2",
    name: "Maria Garcia",
    title: "DevOps Engineer",
    skills: ["Kubernetes", "Docker", "Terraform", "Jenkins"],
    experience: 6,
    location: "Austin, TX",
    availableFrom: "Jan 20, 2025",
    hourlyRate: "$110",
    dailyRate: "$880",
    status: "available",
    remote: true,
  },
  {
    id: "3",
    name: "James Wilson",
    title: "Data Engineer",
    skills: ["Python", "Spark", "Airflow", "SQL"],
    experience: 5,
    location: "New York, NY",
    availableFrom: "Immediately",
    hourlyRate: "$105",
    dailyRate: "$840",
    status: "available",
    remote: false,
  },
  {
    id: "4",
    name: "Sarah Chen",
    title: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "React", "CSS"],
    experience: 4,
    location: "Seattle, WA",
    availableFrom: "Feb 1, 2025",
    hourlyRate: "$95",
    dailyRate: "$760",
    status: "interviewing",
    remote: true,
  },
  {
    id: "5",
    name: "Robert Martinez",
    title: "Cloud Architect",
    skills: ["AWS", "Azure", "GCP", "Terraform"],
    experience: 9,
    location: "Boston, MA",
    availableFrom: "Immediately",
    hourlyRate: "$140",
    dailyRate: "$1120",
    status: "available",
    remote: true,
  },
]

const statusColors: Record<string, string> = {
  available: "bg-green-500/10 text-green-600 dark:text-green-400",
  interviewing: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  assigned: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  unavailable: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export function BenchConsultantsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Consultant</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Available From</TableHead>
            <TableHead>Rates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => (
            <TableRow key={consultant.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                    <AvatarFallback>
                      {consultant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{consultant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {consultant.location} {consultant.remote && "• Remote"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{consultant.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {consultant.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {consultant.skills.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{consultant.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{consultant.experience} years</TableCell>
              <TableCell className="font-medium">{consultant.availableFrom}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">{consultant.hourlyRate}/hr</p>
                  <p className="text-muted-foreground">{consultant.dailyRate}/day</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[consultant.status]}>
                  {consultant.status}
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
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Briefcase className="mr-2 h-4 w-4" />
                      Assign to Project
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
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
