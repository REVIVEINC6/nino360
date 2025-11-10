export { getUsage as getTenantAnalytics } from "@/app/(dashboard)/tenant/actions/analytics"

// Note: components in the codebase import `getTenantAnalytics` from `@/app/(app)/tenant/analytics/actions`.
// This shim re-exports the implementation located under the dashboard tenant actions to preserve the existing imports.
