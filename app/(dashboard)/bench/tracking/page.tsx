import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { listConsultants } from "../actions/consultants"
import { ConsultantsTable } from "@/components/bench/consultants-table"

async function ConsultantsData() {
  const consultants = await listConsultants()
  return <ConsultantsTable consultants={consultants} />
}

export default function BenchTrackingPage() {
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
        <ConsultantsData />
      </Suspense>
    </div>
  )
}
