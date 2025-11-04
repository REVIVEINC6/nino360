import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download } from "lucide-react"

export default function VendorsPage() {
  const vendors = [
    { id: 1, name: "TechVendor Inc.", status: "active", submissions: 45, compliance: "complete" },
    { id: 2, name: "GlobalStaff LLC", status: "active", submissions: 32, compliance: "pending" },
    { id: 3, name: "ConsultPro Partners", status: "pending", submissions: 0, compliance: "incomplete" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors..." className="pl-10" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                <Badge variant={vendor.status === "active" ? "default" : "secondary"}>{vendor.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{vendor.submissions} submissions</p>
                  <p className="text-sm">
                    Compliance:{" "}
                    <span className={vendor.compliance === "complete" ? "text-green-600" : "text-orange-600"}>
                      {vendor.compliance}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Invite User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
