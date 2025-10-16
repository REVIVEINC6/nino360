import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuditLogViewer } from "@/components/audit/audit-log-viewer"
import { Card } from "@/components/ui/card"

export default async function AuditPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get tenant by slug
  const { data: tenant } = await supabase.from("tenants").select("id, name").eq("slug", params.slug).single()

  if (!tenant) {
    redirect("/dashboard")
  }

  // Check if user is admin
  const { data: member } = await supabase
    .from("tenant_members")
    .select("role")
    .eq("tenant_id", tenant.id)
    .eq("user_id", user.id)
    .single()

  if (!member || member.role !== "tenant_admin") {
    redirect(`/t/${params.slug}/dashboard`)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D0FF00] to-[#F81CE5] bg-clip-text text-transparent">
          Audit Trail
        </h1>
        <p className="text-muted-foreground mt-2">Blockchain-verified tamper-evident audit logs for {tenant.name}</p>
      </div>

      <Suspense
        fallback={
          <Card className="glass-card border-neon p-6 text-center">
            <p className="text-muted-foreground">Loading audit logs...</p>
          </Card>
        }
      >
        <AuditLogViewer tenantId={tenant.id} />
      </Suspense>
    </div>
  )
}
