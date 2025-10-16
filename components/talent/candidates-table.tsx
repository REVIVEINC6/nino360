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
import { MoreHorizontal, Eye, Mail, Calendar, FileText, Star } from "lucide-react"
import Link from "next/link"

const candidates = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    experience: 8,
    status: "screening",
    rating: 5,
    source: "LinkedIn",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    title: "Full Stack Developer",
    location: "New York, NY",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    experience: 6,
    status: "interviewing",
    rating: 4,
    source: "Referral",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    title: "DevOps Engineer",
    location: "Austin, TX",
    skills: ["Kubernetes", "Terraform", "Jenkins", "AWS"],
    experience: 7,
    status: "new",
    rating: 5,
    source: "Job Board",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    title: "Data Scientist",
    location: "Seattle, WA",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    experience: 5,
    status: "offered",
    rating: 4,
    source: "Website",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.b@example.com",
    title: "Frontend Developer",
    location: "Boston, MA",
    skills: ["React", "Vue.js", "CSS", "JavaScript"],
    experience: 4,
    status: "screening",
    rating: 3,
    source: "LinkedIn",
  },
]

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  screening: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  interviewing: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  offered: "bg-green-500/10 text-green-600 dark:text-green-400",
  hired: "bg-green-600/10 text-green-700 dark:text-green-500",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
}

export function CandidatesTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                    <AvatarFallback>
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.location}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{candidate.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{candidate.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{candidate.experience} years</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[candidate.status]}>
                  {candidate.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {Array.from({ length: candidate.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{candidate.source}</TableCell>
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
                      <Link href={`/talent/candidates/${candidate.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Interview
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
