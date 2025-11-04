declare module "../../app/(dashboard)/dashboard/actions" {
  import type { KPIs } from "../../app/(dashboard)/dashboard/actions"
  export function getKpis(): Promise<KPIs>
}
