import { Suspense } from "react"
import { getContext, listMembers } from "./actions"
import { UsersContent } from "@/components/tenant-users/users-content"
import { LoadingSkeleton } from "@/components/tenant-users/loading-skeleton"
import { ErrorState } from "@/components/tenant-users/error-state"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Users & Access | Nino360",
  description: "Manage team members, roles, and permissions with AI assistance",
}

export default async function TenantUsersPage() {
  try {
    const [context, initialData] = await Promise.all([getContext(), listMembers()])

    if (!context.tenantId) {
      redirect("/tenant/directory")
    }

    return (
      <Suspense fallback={<LoadingSkeleton />}>
        <UsersContent initialData={initialData} context={context} />
      </Suspense>
    )
  } catch (error) {
    console.error("[v0] Error loading tenant users page:", error)
    return <ErrorState />
  }
}
