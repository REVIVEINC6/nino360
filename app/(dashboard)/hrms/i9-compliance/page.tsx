import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, AlertCircle } from "lucide-react"

export default async function I9CompliancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">I-9 Compliance</h1>
          <p className="text-muted-foreground">Manage I-9 forms and employment verification</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New I-9
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">218</div>
            <p className="text-xs text-muted-foreground">All sections filled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reverify Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
            <p className="text-xs text-muted-foreground">Action needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.8%</div>
            <p className="text-xs text-muted-foreground">Overall compliance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>I-9 Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { employee: "John Doe", empCode: "EMP001", status: "complete", date: "2024-01-15" },
              { employee: "Jane Smith", empCode: "EMP002", status: "pending", date: "2025-01-10" },
              { employee: "Bob Wilson", empCode: "EMP003", status: "reverify_required", date: "2023-06-20" },
            ].map((record, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{record.employee}</p>
                  <p className="text-sm text-muted-foreground">{record.empCode}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "complete"
                          ? "bg-green-100 text-green-800"
                          : record.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status.replace("_", " ")}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                  </div>
                  {record.status === "reverify_required" && <AlertCircle className="h-5 w-5 text-red-600" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
