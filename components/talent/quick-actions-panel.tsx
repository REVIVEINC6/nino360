"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, UserPlus, Briefcase, Calendar, Upload, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AddCandidateDialog } from "./add-candidate-dialog"
import { ScheduleInterviewDialog } from "./schedule-interview-dialog"

export function QuickActionsPanel() {
  const router = useRouter()
  const [showAddCandidate, setShowAddCandidate] = useState(false)
  const [showScheduleInterview, setShowScheduleInterview] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Quick Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Talent Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowAddCandidate(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Candidate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/talent/jobs/new")}>
            <Briefcase className="mr-2 h-4 w-4" />
            Create Job Requisition
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowScheduleInterview(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>AI-Powered</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/talent/sourcing")}>
            <Upload className="mr-2 h-4 w-4" />
            Import & Parse Resumes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/talent/skills")}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Candidate Matching
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddCandidateDialog open={showAddCandidate} onOpenChange={setShowAddCandidate} />
      <ScheduleInterviewDialog open={showScheduleInterview} onOpenChange={setShowScheduleInterview} />
    </>
  )
}
