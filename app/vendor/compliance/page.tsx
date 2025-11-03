import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileCheck, AlertCircle } from "lucide-react"

export default function VendorCompliancePage() {
  const complianceItems = [
    { id: 1, client: "Acme Corp", type: "MSA", status: "approved", expires: "2025-12-31" },
    { id: 2, client: "Acme Corp", type: "COI", status: "pending", expires: "2025-06-30" },
    { id: 3, client: "TechCo", type: "W9", status: "approved", expires: null },
    {
      id: 4,
      client: "StartupXYZ",
      type: "NDA",
      status: "rejected",
      expires: null,
      notes: "Please resubmit with updated terms",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FileCheck className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileCheck className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Documents</h1>
        <p className="text-muted-foreground">Manage your compliance documents for each client</p>
      </div>

      <div className="grid gap-4">
        {complianceItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <CardTitle className="text-lg">{item.client}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {item.expires && (
                    <p className="text-sm">
                      Expires: <span className="font-medium">{item.expires}</span>
                    </p>
                  )}
                  {item.notes && <p className="text-sm text-red-600">{item.notes}</p>}
                </div>
                <div className="flex gap-2">
                  {item.status === "approved" ? (
                    <Button variant="outline" size="sm">
                      View Document
                    </Button>
                  ) : (
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
