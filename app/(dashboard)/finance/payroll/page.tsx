import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayrollManagement } from "@/components/finance/payroll-management"

export default function PayrollPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
        <p className="text-muted-foreground">Manage payroll batches, taxes, and payroll imports</p>
      </div>

      <Tabs defaultValue="batches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="imports">Imports</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-4">
          <PayrollManagement view="batches" />
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <PayrollManagement view="taxes" />
        </TabsContent>

        <TabsContent value="imports" className="space-y-4">
          <PayrollManagement view="imports" />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <PayrollManagement view="reports" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
