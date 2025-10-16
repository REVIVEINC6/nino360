import { Suspense } from "react"
import { PageHeader } from "@/components/hrms/page-header"
import { PageSkeleton } from "@/components/hrms/page-skeleton"
import { ComplianceManagement } from "@/components/hrms/compliance/compliance-management"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export default async function CompliancePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Compliance Management"
        description="Track and manage HR compliance requirements and audits"
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Audit
            </Button>
          </>
        }
      />

      <Suspense fallback={<PageSkeleton />}>
        <ComplianceManagement />
      </Suspense>
    </div>
  )
}
