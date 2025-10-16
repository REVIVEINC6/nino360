import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, AlertTriangle } from "lucide-react"

export default async function ImmigrationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Immigration Cases</h1>
          <p className="text-muted-foreground">Track visa cases and immigration status</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Awaiting USCIS</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-muted-foreground">Next 90 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">RFEs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Require response</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                employee: "John Doe",
                type: "H1B",
                status: "Filed",
                attorney: "Smith & Associates",
                expires: "2026-03-15",
              },
              {
                employee: "Jane Smith",
                type: "L1",
                status: "Approved",
                attorney: "Johnson Law",
                expires: "2025-12-20",
              },
              {
                employee: "Bob Wilson",
                type: "H4 EAD",
                status: "RFE",
                attorney: "Smith & Associates",
                expires: "2025-06-30",
              },
            ].map((case_, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{case_.employee}</p>
                    <p className="text-sm text-muted-foreground">
                      {case_.type} • {case_.attorney}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{case_.status}</p>
                    <p className="text-xs text-muted-foreground">Expires: {case_.expires}</p>
                  </div>
                  {case_.status === "RFE" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
