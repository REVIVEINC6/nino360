"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MoreHorizontal,
  Eye,
  Mail,
  Calendar,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface CandidatesTableProps {
  candidates: any[]
  loading: boolean
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  onSort: (field: string) => void
  sortBy: string
  sortOrder: "asc" | "desc"
  onRefresh: () => void
}

const statusColors: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Screening: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Interviewing: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Offered: "bg-green-500/10 text-green-600 dark:text-green-400",
  Hired: "bg-green-600/10 text-green-700 dark:text-green-500",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  Withdrawn: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export function CandidatesTable({
  candidates,
  loading,
  selected,
  onSelectionChange,
  onSort,
  sortBy,
  sortOrder,
  onRefresh,
}: CandidatesTableProps) {
  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      onSelectionChange(selected.filter((s) => s !== id))
    } else {
      onSelectionChange([...selected, id])
    }
  }

  const toggleSelectAll = () => {
    if (selected.length === candidates.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(candidates.map((c) => c.id))
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    return sortOrder === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No candidates found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={selected.length === candidates.length && candidates.length > 0}
              onCheckedChange={toggleSelectAll}
            />
          </TableHead>
          <TableHead>
            <Button variant="ghost" size="sm" onClick={() => onSort("first_name")} className="h-8 px-2">
              Candidate
              <SortIcon field="first_name" />
            </Button>
          </TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>
            <Button variant="ghost" size="sm" onClick={() => onSort("job_title")} className="h-8 px-2">
              Title
              <SortIcon field="job_title" />
            </Button>
          </TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Work Auth</TableHead>
          <TableHead>Skills</TableHead>
          <TableHead>
            <Button variant="ghost" size="sm" onClick={() => onSort("years_of_experience")} className="h-8 px-2">
              Experience
              <SortIcon field="years_of_experience" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" size="sm" onClick={() => onSort("candidate_status")} className="h-8 px-2">
              Status
              <SortIcon field="candidate_status" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" size="sm" onClick={() => onSort("created_at")} className="h-8 px-2">
              Added
              <SortIcon field="created_at" />
            </Button>
          </TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((candidate) => (
          <TableRow key={candidate.id}>
            <TableCell>
              <Checkbox checked={selected.includes(candidate.id)} onCheckedChange={() => toggleSelect(candidate.id)} />
            </TableCell>
            <TableCell>
              <Link href={`/talent/candidates/${candidate.id}`} className="flex items-center gap-3 hover:underline">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={candidate.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {candidate.first_name?.[0]}
                    {candidate.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {candidate.first_name} {candidate.last_name}
                  </p>
                  {candidate.candidate_id && <p className="text-xs text-muted-foreground">{candidate.candidate_id}</p>}
                </div>
              </Link>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <p className="truncate max-w-[180px]">{candidate.email || "No email"}</p>
                <p className="text-muted-foreground">{candidate.mobile || candidate.phone || "No phone"}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-[150px]">
                <p className="text-sm truncate">{candidate.job_title || candidate.current_title || "Not specified"}</p>
                {candidate.current_company && (
                  <p className="text-xs text-muted-foreground truncate">{candidate.current_company}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm text-muted-foreground max-w-[120px]">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {candidate.city && candidate.state
                    ? `${candidate.city}, ${candidate.state}`
                    : candidate.location || "Not specified"}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {candidate.work_authorization ? (
                <Badge variant="outline" className="text-xs">
                  {candidate.work_authorization}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">N/A</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-[200px]">
                {candidate.skills?.slice(0, 3).map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills?.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm">
                <Briefcase className="h-3 w-3 text-muted-foreground" />
                {candidate.years_of_experience || candidate.experience_years
                  ? `${candidate.years_of_experience || candidate.experience_years} yrs`
                  : "N/A"}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={statusColors[candidate.candidate_status || candidate.status] || ""}>
                {candidate.candidate_status || candidate.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {candidate.created_at ? formatDistanceToNow(new Date(candidate.created_at), { addSuffix: true }) : "N/A"}
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
                    <Link href={`/talent/candidates/${candidate.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  {candidate.resume_url && (
                    <DropdownMenuItem asChild>
                      <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </a>
                    </DropdownMenuItem>
                  )}
                  {candidate.linkedin_url && (
                    <DropdownMenuItem asChild>
                      <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn Profile
                      </a>
                    </DropdownMenuItem>
                  )}
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
  )
}
