import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { KnowledgeBaseManagement } from "@/components/admin/knowledge-base-management"

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground">Docs, playbooks</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <KnowledgeBaseManagement />
      </Suspense>
    </div>
  )
}
