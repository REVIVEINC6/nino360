import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { listConsultants } from "../actions/consultants"
import { ConsultantsTable } from "@/components/bench/consultants-table"

export default async function BenchTrackingPage() {
  const consultants = await listConsultants()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bench Tracking</h1>
          <p className="text-muted-foreground">Manage consultants on bench with skills and availability</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Consultant
        </Button>
      </div>

      <Suspense fallback={<div>Loading consultants...</div>}>
        {consultants && consultants.length > 0 ? (
          <ConsultantsTable consultants={consultants} />
        ) : (
          <div className="text-sm text-muted-foreground">No consultants to display yet.</div>
        )}
      </Suspense>
    </div>
  )
}
