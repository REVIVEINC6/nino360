"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Users, Download, MapPin, Briefcase, DollarSign } from "lucide-react"
import Link from "next/link"
import { ApprovalWorkflow } from "@/components/talent/approval-workflow"
import { PublishingPanel } from "@/components/talent/publishing-panel"
import { HiringTeamPanel } from "@/components/talent/hiring-team-panel"
import { InterviewPlanPanel } from "@/components/talent/interview-plan-panel"

export default function RequisitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [requisition, setRequisition] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load requisition details
    // This would call a getRequisition(id) action
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center text-muted-foreground">Loading requisition...</Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Senior Software Engineer</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800">Open</Badge>
              <span className="text-sm text-muted-foreground">Created 5 days ago</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Link href={`/talent/jobs/${params.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Briefcase className="h-4 w-4" />
            Department
          </div>
          <div className="font-semibold">Engineering</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            Location
          </div>
          <div className="font-semibold">San Francisco, CA</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            Openings
          </div>
          <div className="font-semibold">2 positions</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <DollarSign className="h-4 w-4" />
            Salary Range
          </div>
          <div className="font-semibold">$150k - $200k</div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Hiring Team</TabsTrigger>
          <TabsTrigger value="plan">Interview Plan</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p>We're looking for a Senior Software Engineer to join our growing engineering team...</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "PostgreSQL"].map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <HiringTeamPanel requisitionId={params.id as string} />
        </TabsContent>

        <TabsContent value="plan">
          <InterviewPlanPanel requisitionId={params.id as string} />
        </TabsContent>

        <TabsContent value="approvals">
          <ApprovalWorkflow requisitionId={params.id as string} />
        </TabsContent>

        <TabsContent value="publishing">
          <PublishingPanel requisitionId={params.id as string} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
