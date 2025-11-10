import { redirect } from "next/navigation"

export default function TenantPage() {
  // Redirect to the tenant root listing. Avoid redirecting directly to
  // /tenant/dashboard because that route is implemented explicitly at
  // app/(dashboard)/tenant/dashboard/page.tsx and can collide with
  // redirects during Next's route resolution. Point to /tenant which
  // can then link to the dashboard to keep routes unique.
  redirect("/tenant/directory")
}
