import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function TeamAllocations({ projectId }: { projectId: string }) {
  const supabase = await createServerClient()

  const { data: allocations } = await supabase
    .from("proj.allocations")
    .select("*")
    .eq("project_id", projectId)
    .order("start_date", { ascending: true })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Allocations</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Allocation</TableHead>
                <TableHead>Bill Rate</TableHead>
                <TableHead>Pay Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations?.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell>{allocation.person_id}</TableCell>
                  <TableCell>{allocation.role || "-"}</TableCell>
                  <TableCell>
                    {new Date(allocation.start_date).toLocaleDateString()} -{" "}
                    {new Date(allocation.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{allocation.allocation_pct}%</TableCell>
                  <TableCell>${allocation.bill_rate?.toLocaleString() || "-"}</TableCell>
                  <TableCell>${allocation.pay_rate?.toLocaleString() || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProjectTeamPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading team...</div>}>
      <TeamAllocations projectId={params.id} />
    </Suspense>
  )
}
