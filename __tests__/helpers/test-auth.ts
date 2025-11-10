import { testDb } from "./test-database"
import { faker } from "@faker-js/faker"

export interface TestUser {
  id: string
  email: string
  password: string
  tenantId: string
  role: string
}

/**
 * Create a test user with authentication
 */
export async function createTestUser(options?: {
  email?: string
  password?: string
  role?: string
  tenantId?: string
}): Promise<TestUser> {
  const email = options?.email || faker.internet.email()
  const password = options?.password || "TestPassword123!"
  const role = options?.role || "user"

  // Create auth user
  const { data: authData, error: authError } = await testDb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    throw new Error(`Failed to create test user: ${authError?.message}`)
  }

  // Create tenant if not provided
  let tenantId = options?.tenantId
  if (!tenantId) {
    const { data: tenantData, error: tenantError } = await testDb
      .from("core.tenants")
      .insert({
        name: faker.company.name(),
        status: "active",
        subscription_tier: "enterprise",
      })
      .select()
      .single()

    if (tenantError || !tenantData) {
      throw new Error(`Failed to create test tenant: ${tenantError?.message}`)
    }

    tenantId = tenantData.id
  }

  // Create user profile
  const { error: userError } = await testDb.from("core.users").insert({
    id: authData.user.id,
    email,
    tenant_id: tenantId,
    role,
    status: "active",
  })

  if (userError) {
    throw new Error(`Failed to create user profile: ${userError.message}`)
  }

  return {
    id: authData.user.id,
    email,
    password,
    tenantId,
    role,
  }
}

/**
 * Get authentication headers for API testing
 */
export async function getAuthHeaders(user: TestUser): Promise<Record<string, string>> {
  const { data, error } = await testDb.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  })

  if (error || !data.session) {
    throw new Error(`Failed to sign in test user: ${error?.message}`)
  }

  return {
    Authorization: `Bearer ${data.session.access_token}`,
    "Content-Type": "application/json",
  }
}

/**
 * Create admin test user
 */
export async function createAdminUser(): Promise<TestUser> {
  return createTestUser({ role: "admin" })
}

/**
 * Create tenant admin test user
 */
export async function createTenantAdminUser(): Promise<TestUser> {
  return createTestUser({ role: "tenant_admin" })
}
