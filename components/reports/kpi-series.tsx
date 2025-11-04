import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KpiSeriesChart } from "./kpi-series-chart"

interface KpiSeriesProps {
  title: string
  yKeys: string[]
  data: any[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function KpiSeries({ title, yKeys, data }: KpiSeriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <KpiSeriesChart data={data} yKeys={yKeys} />
      </CardContent>
    </Card>
  )
}
