import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BenchForecastingManagement } from "@/components/bench/bench-forecasting-management"

export default function BenchForecastingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bench Forecasting</h1>
        <p className="text-muted-foreground">Predict incoming and outgoing resource demand</p>
      </div>

      <Tabs defaultValue="demand" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
          <TabsTrigger value="rolloff">Roll-off Predictions</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="space-y-4">
          <BenchForecastingManagement view="demand" />
        </TabsContent>

        <TabsContent value="rolloff" className="space-y-4">
          <BenchForecastingManagement view="rolloff" />
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <BenchForecastingManagement view="pipeline" />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <BenchForecastingManagement view="scenarios" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
