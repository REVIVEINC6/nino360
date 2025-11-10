import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, FileCheck, AlertCircle, CheckCircle } from "lucide-react"

export default function VMSCompliancePage() {
  const complianceItems = [
    { id: 1, vendor: "TechVendor Inc.", type: "MSA", status: "approved", expires: "2025-12-31" },
    { id: 2, vendor: "TechVendor Inc.", type: "COI", status: "pending", expires: "2025-06-30" },
    { id: 3, vendor: "GlobalStaff LLC", type: "W9", status: "approved", expires: null },
    { id: 4, vendor: "GlobalStaff LLC", type: "SOC2", status: "expired", expires: "2024-12-31" },
    { id: 5, vendor: "ConsultPro Partners", type: "NDA", status: "rejected", expires: null },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "expired":
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
      expired: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Management</h1>
        <p className="text-muted-foreground">Review and manage vendor compliance documents</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search compliance items..." className="pl-10" />
        </div>
      </div>

      <div className="grid gap-4">
        {complianceItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <CardTitle className="text-lg">{item.vendor}</CardTitle>
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
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Document
                  </Button>
                  {item.status === "pending" && (
                    <>
                      <Button variant="outline" size="sm" className="text-green-600 bg-transparent">
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                        Reject
                      </Button>
                    </>
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
