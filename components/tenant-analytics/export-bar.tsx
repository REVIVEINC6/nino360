"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { exportAnalytics } from "@/app/(dashboard)/tenant/analytics/actions"
import { toast } from "sonner"

interface ExportBarProps {
  dateRange: {
    from: string
    to: string
  }
}

export function ExportBar({ dateRange }: ExportBarProps) {
  const [loading, setLoading] = useState<"csv" | "pdf" | null>(null)

  async function handleExport(format: "csv" | "pdf") {
    setLoading(format)
    try {
      const result = await exportAnalytics({ ...dateRange, format })
      if ("error" in result) {
        toast.error(result.error)
      } else {
        window.open(result.url, "_blank")
        toast.success(`Analytics exported as ${format.toUpperCase()}`)
      }
    } catch (error) {
      toast.error("Failed to export analytics")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Export Analytics</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")} disabled={loading !== null}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {loading === "csv" ? "Exporting..." : "CSV"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("pdf")} disabled={loading !== null}>
            <FileText className="mr-2 h-4 w-4" />
            {loading === "pdf" ? "Exporting..." : "PDF"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
