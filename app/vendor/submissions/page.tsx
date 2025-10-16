import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export default function VendorSubmissionsPage() {
  const submissions = [
    { id: 1, candidate: "John Doe", job: "Senior Developer", client: "Acme Corp", status: "interview", billRate: 120 },
    {
      id: 2,
      candidate: "Jane Smith",
      job: "Full Stack Engineer",
      client: "TechCo",
      status: "shortlisted",
      billRate: 110,
    },
    {
      id: 3,
      candidate: "Bob Johnson",
      job: "DevOps Engineer",
      client: "StartupXYZ",
      status: "submitted",
      billRate: 130,
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: "bg-blue-100 text-blue-800",
      shortlisted: "bg-purple-100 text-purple-800",
      interview: "bg-yellow-100 text-yellow-800",
      offered: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p className="text-muted-foreground">Manage your candidate submissions</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search submissions..." className="pl-10" />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Submission
        </Button>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{submission.candidate}</CardTitle>
                <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{submission.job}</p>
                  <p className="text-sm text-muted-foreground">{submission.client}</p>
                  <p className="text-sm">Bill Rate: ${submission.billRate}/hr</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
