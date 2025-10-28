import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download } from "lucide-react"
import { CandidatesTable } from "@/components/talent/candidates-table"
import { JobsTable } from "@/components/talent/jobs-table"
import { InterviewsCalendar } from "@/components/talent/interviews-calendar"
import { TalentStats } from "@/components/talent/talent-stats"

export default function TalentPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent</h1>
          <p className="text-muted-foreground">Manage candidates, jobs, and interviews</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Resumes
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats */}
      <TalentStats />

      {/* Talent Tabs */}
      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="jobs">Job Requisitions</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Candidates</CardTitle>
                <CardDescription>Manage your talent pool and track candidate progress</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <CandidatesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Job Requisitions</CardTitle>
                <CardDescription>Active and open positions across all clients</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Job
              </Button>
            </CardHeader>
            <CardContent>
              <JobsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews">
          <Card>
            <CardHeader>
              <CardTitle>Interview Schedule</CardTitle>
              <CardDescription>Upcoming and scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <InterviewsCalendar />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
