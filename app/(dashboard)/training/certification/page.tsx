import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CertificationManagement } from "@/components/training/certification-management"

export default function CertificationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certification</h1>
        <p className="text-muted-foreground">Certify roles, track certificates, sync to HRMS</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <CertificationManagement />
      </Suspense>
    </div>
  )
}
