import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getKpiSeries } from "@/app/(dashboard)/reports/actions/charts"
import { KpiSeriesChart } from "./kpi-series-chart"

interface KpiSeriesProps {
  title: string
  view: string
  yKeys: string[]
  days?: number
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export async function KpiSeries({ title, view, yKeys, days = 30 }: KpiSeriesProps) {
  const data = await getKpiSeries(view, yKeys, days)

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
