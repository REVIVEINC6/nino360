import { faker } from "@faker-js/faker"

/**
 * User Factory
 */
export const UserFactory = {
  build: (overrides?: Partial<any>) => ({
    email: faker.internet.email(),
    password: "TestPassword123!",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: "user",
    ...overrides,
  }),

  buildAdmin: (overrides?: Partial<any>) => ({
    ...UserFactory.build(),
    role: "admin",
    ...overrides,
  }),
}

/**
 * Tenant Factory
 */
export const TenantFactory = {
  build: (overrides?: Partial<any>) => ({
    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
    settings: {},
    ...overrides,
  }),
}

/**
 * Session Factory
 */
export const SessionFactory = {
  build: (userId: string, overrides?: Partial<any>) => ({
    user_id: userId,
    session_token: faker.string.alphanumeric(64),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    device_fingerprint: faker.string.alphanumeric(32),
    ...overrides,
  }),
}

/**
 * MFA Factory
 */
export const MFAFactory = {
  build: (userId: string, overrides?: Partial<any>) => ({
    user_id: userId,
    method: "totp",
    secret: faker.string.alphanumeric(32),
    is_verified: false,
    ...overrides,
  }),

  buildVerified: (userId: string, overrides?: Partial<any>) => ({
    ...MFAFactory.build(userId),
    is_verified: true,
    verified_at: new Date().toISOString(),
    ...overrides,
  }),
}

/**
 * Password Reset Token Factory
 */
export const PasswordResetFactory = {
  build: (userId: string, overrides?: Partial<any>) => ({
    user_id: userId,
    token: faker.string.alphanumeric(64),
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    ...overrides,
  }),
}
