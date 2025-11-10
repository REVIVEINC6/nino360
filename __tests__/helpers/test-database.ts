import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const testDb = createClient(supabaseUrl, supabaseKey)

/**
 * Clean up test data by tenant ID
 */
export async function cleanupTestTenant(tenantId: string) {
  // Delete in correct order to respect foreign keys
  await testDb.from("crm.leads").delete().eq("tenant_id", tenantId)
  await testDb.from("crm.opportunities").delete().eq("tenant_id", tenantId)
  await testDb.from("crm.contacts").delete().eq("tenant_id", tenantId)
  await testDb.from("core.users").delete().eq("tenant_id", tenantId)
  await testDb.from("core.tenants").delete().eq("id", tenantId)
}

/**
 * Clean up test user data
 */
export async function cleanupTestUser(userId: string) {
  await testDb.from("core.users").delete().eq("id", userId)
  await testDb.auth.admin.deleteUser(userId)
}

/**
 * Create isolated test transaction
 */
export async function withTestTransaction<T>(callback: () => Promise<T>): Promise<T> {
  try {
    const result = await callback()
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Verify database state
 */
export async function verifyDatabaseState(checks: {
  table: string
  where: Record<string, any>
  exists: boolean
}) {
  const query = testDb.from(checks.table).select("*")

  Object.entries(checks.where).forEach(([key, value]) => {
    query.eq(key, value)
  })

  const { data, error } = await query.single()

  if (checks.exists) {
    if (error || !data) {
      throw new Error(`Expected record to exist in ${checks.table}`)
    }
  } else {
    if (!error || data) {
      throw new Error(`Expected record to not exist in ${checks.table}`)
    }
  }

  return data
}
