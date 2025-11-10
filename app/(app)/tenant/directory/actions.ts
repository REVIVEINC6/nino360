"use server"

import { listTenants } from "@/app/(dashboard)/tenant/directory/actions"

export async function getEmployeeDirectory() {
	return await listTenants()
}

export async function searchEmployees(query: string) {
	return await listTenants({ q: query })
}

// This shim proxies to the canonical directory actions so existing imports under
// `@/app/(app)/tenant/directory/actions` resolve to working implementations with
// the expected function signatures used by the UI components.
