"use client"

import { Button } from "@/components/ui/button"
import { Users, Briefcase, Send, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <div className="space-y-2">
      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
        <Link href="/hotlist/priority">
          <Users className="h-4 w-4" />
          Add Priority Candidate
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
        <Link href="/hotlist/requirements">
          <Briefcase className="h-4 w-4" />
          Create Requirement
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
        <Link href="/hotlist/automation">
          <Send className="h-4 w-4" />
          Launch Campaign
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
        <Link href="/hotlist/analytics">
          <BarChart3 className="h-4 w-4" />
          View Full Analytics
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
        <Link href="/hotlist/automation">
          <Settings className="h-4 w-4" />
          Automation Rules
        </Link>
      </Button>
    </div>
  )
}
