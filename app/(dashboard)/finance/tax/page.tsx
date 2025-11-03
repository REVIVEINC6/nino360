import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaxManagement } from "@/components/finance/tax-management"

export default function TaxManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
        <p className="text-muted-foreground">Tax calculations, compliance, and filing</p>
      </div>

      <Tabs defaultValue="calculations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calculations">Calculations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="filing">Filing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="calculations" className="space-y-4">
          <TaxManagement view="calculations" />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <TaxManagement view="compliance" />
        </TabsContent>

        <TabsContent value="filing" className="space-y-4">
          <TaxManagement view="filing" />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <TaxManagement view="reports" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
