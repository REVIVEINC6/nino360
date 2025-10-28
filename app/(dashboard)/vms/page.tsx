import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { VendorsTable } from "@/components/vms/vendors-table"
import { ContractsTable } from "@/components/vms/contracts-table"
import { VMSStats } from "@/components/vms/vms-stats"

export default function VMSPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VMS</h1>
          <p className="text-muted-foreground">Vendor Management System - Track vendors and contracts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <VMSStats />

      {/* VMS Tabs */}
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>All Vendors</CardTitle>
              <CardDescription>Manage your vendor relationships and partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              <VendorsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Contracts</CardTitle>
              <CardDescription>Track active and upcoming vendor contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <ContractsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
