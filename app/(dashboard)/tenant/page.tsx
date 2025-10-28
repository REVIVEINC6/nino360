import { redirect } from "next/navigation"

export default function TenantPage() {
  // Redirect to tenant dashboard as the default tenant page
  redirect("/tenant/dashboard")
}
