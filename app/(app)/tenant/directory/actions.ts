export async function getEmployeeDirectory() {
  // Shim: return an empty list by default. Real implementation lives under dashboard tenant actions.
  return [] as any[]
}

export async function searchEmployees(query: string) {
  // Shim: return empty results. Replace with a proper implementation if needed.
  return [] as any[]
}

// Note: These shims exist to satisfy components that import from the (app) path. The authoritative
// implementations live under `app/(dashboard)/tenant/actions` and can be re-exported here when a safe
// client/server boundary approach is chosen.
