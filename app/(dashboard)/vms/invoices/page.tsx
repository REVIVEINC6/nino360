import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download } from "lucide-react"

export default function VMSInvoicesPage() {
  const invoices = [
    {
      id: 1,
      vendor: "TechVendor Inc.",
      invoiceNo: "INV-2025-001",
      amount: 45000,
      period: "Jan 2025",
      status: "approved",
    },
    {
      id: 2,
      vendor: "GlobalStaff LLC",
      invoiceNo: "INV-2025-002",
      amount: 32000,
      period: "Jan 2025",
      status: "submitted",
    },
    {
      id: 3,
      vendor: "ConsultPro Partners",
      invoiceNo: "INV-2025-003",
      amount: 28000,
      period: "Jan 2025",
      status: "paid",
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      submitted: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      paid: "bg-purple-100 text-purple-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Invoices</h1>
        <p className="text-muted-foreground">Review and approve vendor invoices</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{invoice.vendor}</CardTitle>
                  <p className="text-sm text-muted-foreground">{invoice.invoiceNo}</p>
                </div>
                <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">${invoice.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Period: {invoice.period}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  {invoice.status === "submitted" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                        Reject
                      </Button>
                    </>
                  )}
                  {invoice.status === "approved" && <Button size="sm">Mark as Paid</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
