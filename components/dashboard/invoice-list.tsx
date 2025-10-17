"use client"

import { motion } from "framer-motion"
import { FileText, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const invoices = [
  { id: "INV-001", client: "Acme Corp", amount: "$12,500", status: "paid", date: "2025-01-05" },
  { id: "INV-002", client: "TechStart Inc", amount: "$8,200", status: "sent", date: "2025-01-08" },
  { id: "INV-003", client: "Global Systems", amount: "$15,000", status: "overdue", date: "2024-12-28" },
]

export function InvoiceList() {
  const router = useRouter()

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Invoices & Payments</CardTitle>
        <Button size="sm" className="gap-2" onClick={() => router.push("/finance/invoices/new")}>
          <Plus className="h-3.5 w-3.5" />
          Create Invoice
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{invoice.id}</p>
                <p className="text-sm font-semibold">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{invoice.client}</span>
                <Badge
                  variant={
                    invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
