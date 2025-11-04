import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Download } from "lucide-react"

export default function VendorInvoicesPage() {
  const invoices = [
    { id: 1, invoiceNo: "INV-2025-001", client: "Acme Corp", amount: 45000, period: "Jan 2025", status: "approved" },
    { id: 2, invoiceNo: "INV-2025-002", client: "TechCo", amount: 32000, period: "Jan 2025", status: "submitted" },
    { id: 3, invoiceNo: "INV-2024-012", client: "StartupXYZ", amount: 28000, period: "Dec 2024", status: "paid" },
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
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground">Create and manage your invoices</p>
      </div>

      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{invoice.invoiceNo}</CardTitle>
                  <p className="text-sm text-muted-foreground">{invoice.client}</p>
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
                  {invoice.status === "draft" && <Button size="sm">Submit</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
