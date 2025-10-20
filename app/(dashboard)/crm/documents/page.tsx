import { Suspense } from "react"
import { DocumentsHeader } from "@/components/crm-documents/documents-header"
import { DocumentsContent } from "@/components/crm-documents/documents-content"
import { AILoadingState } from "@/components/shared/ai-loading-state"

export default async function DocumentsPage() {
  return (
    <div className="min-h-screen ai-gradient-bg p-6 space-y-6">
      <DocumentsHeader />

      <Suspense fallback={<AILoadingState message="Loading documents..." />}>
        <DocumentsContent />
      </Suspense>
    </div>
  )
}
