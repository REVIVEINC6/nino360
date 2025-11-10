# Nino360 API Testing Plan

## Executive Summary

This comprehensive testing plan covers all 75+ API endpoints in the Nino360 multi-tenant SaaS platform. The plan ensures reliability, security, performance, and correctness across authentication, CRM, HRMS, Talent Management, Finance, and administrative APIs.

---

## 1. Testing Strategy Overview

### 1.1 Test Pyramid

\`\`\`
                    E2E Tests (10%)
                  ┌─────────────────┐
                  │  User Journeys  │
                  └─────────────────┘
              Integration Tests (30%)
            ┌───────────────────────────┐
            │  API + Database + Auth    │
            └───────────────────────────┘
          Unit Tests (60%)
        ┌─────────────────────────────────┐
        │  Functions, Utilities, Services │
        └─────────────────────────────────┘
\`\`\`

### 1.2 Testing Frameworks & Tools

- **Unit Testing**: Vitest + Testing Library
- **Integration Testing**: Vitest + Supabase Test Client
- **E2E Testing**: Playwright
- **API Load Testing**: k6
- **Security Testing**: OWASP ZAP, Custom Security Suite
- **Mocking**: MSW (Mock Service Worker)
- **Code Coverage**: Vitest Coverage (c8)
- **CI/CD**: GitHub Actions with parallel test execution

---

## 2. API Inventory & Test Coverage Matrix

### 2.1 Authentication APIs (18 endpoints)

| Endpoint | Method | Priority | Unit | Integration | E2E | Load | Security |
|----------|--------|----------|------|-------------|-----|------|----------|
| `/api/auth/register` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/login` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/verify-email` | GET | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/auth/password-reset/request` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/auth/password-reset/confirm` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/auth/mfa/setup` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/auth/mfa/verify` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/auth/session/refresh` | POST | P0 | ✅ | ✅ | ⏳ | ✅ | ✅ |
| `/api/auth/oauth/callback` | GET | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/auth/post-login` | GET | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/auth/health` | GET | P1 | ✅ | ✅ | ⏳ | ✅ | ⏳ |
| `/api/auth/metrics` | GET | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |

**Legend**: ✅ Implemented | ⏳ Planned | ❌ Not Required | P0 = Critical | P1 = High | P2 = Medium

### 2.2 CRM APIs (20 endpoints)

| Endpoint | Method | Priority | Unit | Integration | E2E | Load | Security |
|----------|--------|----------|------|-------------|-----|------|----------|
| `/api/crm/dashboard/insights` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/dashboard/digest` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/dashboard/rpa` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/dashboard/verify-audit` | POST | P0 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/contacts/create` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/contacts/update` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/contacts/delete` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/contacts/list` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/contacts/export` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/contacts/audit` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/contacts/insights` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/contacts/rpa` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/accounts/create` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/accounts/upsert` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/accounts/delete` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/crm/accounts/insights` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/leads/import` | POST | P1 | ✅ | ✅ | ⏳ | ✅ | ✅ |
| `/api/crm/documents/analyze` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/analytics/export` | GET | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/crm/analytics/ai-digest` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |

### 2.3 Tenant & Admin APIs (15 endpoints)

| Endpoint | Method | Priority | Unit | Integration | E2E | Load | Security |
|----------|--------|----------|------|-------------|-----|------|----------|
| `/api/tenants/create` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/tenants/list` | GET | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/tenants/switch` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/tenant/list` | GET | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/tenant/security` | GET | P0 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/tenant/rpa/new` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/tenant/rpa/toggle` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/tenant/export-directory` | GET | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/admin/invite` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/admin/accept-invite` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/admin/job-form` | GET/POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |

### 2.4 Finance & Payroll APIs (10 endpoints)

| Endpoint | Method | Priority | Unit | Integration | E2E | Load | Security |
|----------|--------|----------|------|-------------|-----|------|----------|
| `/api/pay-on-pay/settlements` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/pay-on-pay/anchor/[id]` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/pay-on-pay/verify-anchor/[root]` | GET | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/pay-on-pay/settlements/[id]/execute` | POST | P0 | ✅ | ✅ | ✅ | ⏳ | ✅ |
| `/api/pay-on-pay/settlements/[id]/suggest` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/billing/checkout` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/webhooks/stripe` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |

### 2.5 Talent & HRMS APIs (12 endpoints)

| Endpoint | Method | Priority | Unit | Integration | E2E | Load | Security |
|----------|--------|----------|------|-------------|-----|------|----------|
| `/api/talent/upload-resume` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/talent/match-jd` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |
| `/api/hrms/documents/upload` | POST | P0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/hrms/documents/notarize` | POST | P1 | ✅ | ✅ | ⏳ | ⏳ | ✅ |

---

## 3. Test Types & Implementation

### 3.1 Unit Tests

**Scope**: Individual functions, utilities, and service methods

**Location**: `__tests__/unit/`

**Framework**: Vitest

**Coverage Target**: 80% minimum

**Example Test Structure**:

\`\`\`typescript
// __tests__/unit/api/crm-insights.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getAIInsights } from '@/app/(dashboard)/crm/dashboard/actions'

describe('CRM AI Insights', () => {
  it('should generate insights from KPI data', async () => {
    const mockKPIs = {
      totalLeads: 150,
      conversionRate: 0.25,
      avgDealSize: 50000
    }
    
    const result = await getAIInsights({ 
      kpis: mockKPIs, 
      pipeline: [] 
    })
    
    expect(result.success).toBe(true)
    expect(result.insights).toHaveLength(3)
    expect(result.insights[0]).toHaveProperty('type')
    expect(result.insights[0]).toHaveProperty('message')
  })

  it('should handle empty data gracefully', async () => {
    const result = await getAIInsights({ 
      kpis: {}, 
      pipeline: [] 
    })
    
    expect(result.success).toBe(true)
    expect(result.insights).toHaveLength(0)
  })
})
\`\`\`

### 3.2 Integration Tests

**Scope**: API routes + Database + Auth + External Services

**Location**: `__tests__/integration/`

**Framework**: Vitest + Supabase Test Client

**Coverage Target**: 70% of critical paths

**Test Database**: Separate Supabase test project

**Example Test Structure**:

\`\`\`typescript
// __tests__/integration/api/crm-contacts.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createServerClient } from '@/lib/supabase/server'

describe('CRM Contacts API Integration', () => {
  let testTenantId: string
  let testUserId: string
  let testContactId: string
  let authToken: string

  beforeAll(async () => {
    // Setup test tenant and user
    const supabase = await createServerClient()
    
    // Create test user
    const { data: user } = await supabase.auth.signUp({
      email: `test-${Date.now()}@test.com`,
      password: 'TestPass123!'
    })
    testUserId = user.user!.id
    authToken = user.session!.access_token
    
    // Create test tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .insert({ name: 'Test Tenant', slug: `test-${Date.now()}` })
      .select()
      .single()
    testTenantId = tenant.id
  })

  afterAll(async () => {
    // Cleanup: delete test data
    const supabase = await createServerClient()
    await supabase.from('crm_contacts').delete().eq('tenant_id', testTenantId)
    await supabase.from('tenants').delete().eq('id', testTenantId)
    await supabase.auth.admin.deleteUser(testUserId)
  })

  it('should create a new contact with proper tenant isolation', async () => {
    const response = await fetch('http://localhost:3000/api/crm/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        tenant_id: testTenantId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      })
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.contact).toBeDefined()
    expect(data.contact.tenant_id).toBe(testTenantId)
    testContactId = data.contact.id
  })

  it('should enforce RBAC permissions', async () => {
    // Create user without contact.create permission
    const supabase = await createServerClient()
    const { data: restrictedUser } = await supabase.auth.signUp({
      email: `restricted-${Date.now()}@test.com`,
      password: 'TestPass123!'
    })

    const response = await fetch('http://localhost:3000/api/crm/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${restrictedUser.session!.access_token}`
      },
      body: JSON.stringify({
        tenant_id: testTenantId,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com'
      })
    })

    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toContain('permission')
  })

  it('should prevent cross-tenant data access', async () => {
    // Try to access contact from different tenant
    const { data: otherTenant } = await supabase
      .from('tenants')
      .insert({ name: 'Other Tenant', slug: `other-${Date.now()}` })
      .select()
      .single()

    const response = await fetch('http://localhost:3000/api/crm/contacts/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        tenant_id: otherTenant.id
      })
    })

    const data = await response.json()
    expect(data.contacts).not.toContainEqual(
      expect.objectContaining({ id: testContactId })
    )
  })

  it('should create audit trail for contact creation', async () => {
    const supabase = await createServerClient()
    const { data: auditLogs } = await supabase
      .from('app_audit_log')
      .select('*')
      .eq('entity_type', 'crm_contact')
      .eq('entity_id', testContactId)
      .eq('action', 'create')

    expect(auditLogs).toHaveLength(1)
    expect(auditLogs[0].user_id).toBe(testUserId)
    expect(auditLogs[0].previous_hash).toBeDefined()
  })
})
\`\`\`

### 3.3 End-to-End Tests

**Scope**: Complete user journeys across multiple APIs

**Location**: `__tests__/e2e/`

**Framework**: Playwright

**Coverage Target**: Critical user flows only

**Example Test Structure**:

\`\`\`typescript
// __tests__/e2e/crm-lead-to-deal.spec.ts
import { test, expect } from '@playwright/test'

test.describe('CRM: Lead to Deal Conversion Journey', () => {
  test('complete lead lifecycle', async ({ page, request }) => {
    // 1. Register and login
    await page.goto('/signup')
    await page.fill('[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('[name="password"]', 'SecurePass123!')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL(/\/dashboard/)

    // 2. Create a lead via API
    const createLeadResponse = await request.post('/api/crm/contacts/create', {
      data: {
        first_name: 'Lead',
        last_name: 'Prospect',
        email: 'lead@example.com',
        status: 'new'
      }
    })
    expect(createLeadResponse.ok()).toBeTruthy()
    const { contact } = await createLeadResponse.json()

    // 3. Navigate to CRM dashboard
    await page.goto('/crm/dashboard')
    await expect(page.locator('text=Lead Prospect')).toBeVisible()

    // 4. Qualify lead
    await page.click(`[data-contact-id="${contact.id}"]`)
    await page.click('button:has-text("Qualify")')
    await page.fill('[name="opportunity_value"]', '50000')
    await page.click('button:has-text("Create Opportunity")')

    // 5. Verify opportunity created
    await expect(page.locator('text=Opportunity Created')).toBeVisible()

    // 6. Check blockchain audit
    await page.goto('/crm/dashboard')
    await page.click('button:has-text("Audit Trail")')
    await expect(page.locator('[data-verified="true"]')).toBeVisible()
  })
})
\`\`\`

### 3.4 Load & Performance Tests

**Scope**: API response times, throughput, and scalability

**Location**: `__tests__/load/`

**Framework**: k6

**Target Metrics**:
- P95 response time < 200ms for read operations
- P95 response time < 500ms for write operations
- Support 100 concurrent users per API
- Zero error rate under normal load

**Example Load Test**:

\`\`\`javascript
// __tests__/load/api-auth-login.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate under 1%
  },
}

export default function () {
  const payload = JSON.stringify({
    email: `load-test-${__VU}@example.com`,
    password: 'LoadTestPass123!',
    deviceFingerprint: `device-${__VU}`
  })

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = http.post(
    'http://localhost:3000/api/auth/login',
    payload,
    params
  )

  check(response, {
    'status is 200': (r) => r.status === 200,
    'has session token': (r) => JSON.parse(r.body).session !== undefined,
    'response time OK': (r) => r.timings.duration < 500,
  })

  sleep(1)
}
\`\`\`

### 3.5 Security Tests

**Scope**: Authentication, authorization, injection attacks, data leaks

**Location**: `__tests__/security/`

**Framework**: Custom test suite + OWASP ZAP

**Coverage Areas**:
- SQL Injection
- XSS Prevention
- CSRF Protection
- Rate Limiting
- JWT Security
- Tenant Isolation
- RBAC/FLAC Enforcement
- Input Validation

**Example Security Test**:

\`\`\`typescript
// __tests__/security/sql-injection.test.ts
import { describe, it, expect } from 'vitest'

describe('SQL Injection Prevention', () => {
  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users--",
    "' UNION SELECT * FROM users--",
    "admin'--",
    "' OR 1=1--",
  ]

  sqlInjectionPayloads.forEach(payload => {
    it(`should prevent SQL injection: ${payload}`, async () => {
      const response = await fetch('http://localhost:3000/api/crm/contacts/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search: payload
        })
      })

      // Should either return safe results or 400 error
      expect([200, 400]).toContain(response.status)
      
      if (response.status === 200) {
        const data = await response.json()
        // Should not return all records
        expect(data.contacts.length).toBeLessThan(1000)
      }
    })
  })
})

// __tests__/security/rbac-enforcement.test.ts
describe('RBAC Enforcement', () => {
  it('should enforce role-based permissions for CRM write operations', async () => {
    // Create user with read-only role
    const readOnlyToken = await createTestUser({ role: 'crm_viewer' })

    const response = await fetch('http://localhost:3000/api/crm/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${readOnlyToken}`
      },
      body: JSON.stringify({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com'
      })
    })

    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toContain('permission denied')
  })

  it('should enforce field-level access control', async () => {
    // Create user without access to salary field
    const restrictedToken = await createTestUser({ 
      role: 'hr_manager',
      field_restrictions: ['salary', 'ssn'] 
    })

    const response = await fetch('http://localhost:3000/api/hrms/employees/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${restrictedToken}`
      }
    })

    expect(response.ok).toBe(true)
    const data = await response.json()
    
    // Restricted fields should be null or undefined
    data.employees.forEach(emp => {
      expect(emp.salary).toBeUndefined()
      expect(emp.ssn).toBeUndefined()
    })
  })
})

// __tests__/security/rate-limiting.test.ts
describe('Rate Limiting', () => {
  it('should enforce rate limits on auth endpoints', async () => {
    const requests = []
    
    // Make 20 rapid requests (limit is 10 per minute)
    for (let i = 0; i < 20; i++) {
      requests.push(
        fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'wrong-password'
          })
        })
      )
    }

    const responses = await Promise.all(requests)
    const rateLimitedResponses = responses.filter(r => r.status === 429)

    expect(rateLimitedResponses.length).toBeGreaterThan(0)
  })
})
\`\`\`

---

## 4. Test Data Management

### 4.1 Test Data Strategy

**Approach**: Isolated test data per test suite with automatic cleanup

**Test Database**: Separate Supabase project (`nino360-test`)

**Data Generation**: Factory functions for consistent test data

**Example Factory**:

\`\`\`typescript
// __tests__/factories/crm.factory.ts
import { faker } from '@faker-js/faker'

export const ContactFactory = {
  build: (overrides = {}) => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    title: faker.person.jobTitle(),
    status: 'active',
    ...overrides
  }),

  create: async (supabase, tenantId, overrides = {}) => {
    const contact = ContactFactory.build(overrides)
    const { data } = await supabase
      .from('crm_contacts')
      .insert({ ...contact, tenant_id: tenantId })
      .select()
      .single()
    return data
  }
}

export const OpportunityFactory = {
  build: (overrides = {}) => ({
    name: faker.commerce.productName(),
    value: faker.number.int({ min: 10000, max: 1000000 }),
    stage: 'qualification',
    probability: faker.number.int({ min: 10, max: 90 }),
    expected_close_date: faker.date.future(),
    ...overrides
  }),

  create: async (supabase, tenantId, accountId, overrides = {}) => {
    const opportunity = OpportunityFactory.build(overrides)
    const { data } = await supabase
      .from('crm_opportunities')
      .insert({ 
        ...opportunity, 
        tenant_id: tenantId,
        account_id: accountId 
      })
      .select()
      .single()
    return data
  }
}
\`\`\`

### 4.2 Test Isolation

**Strategy**: Each test gets its own tenant and cleans up after itself

\`\`\`typescript
// __tests__/helpers/test-isolation.ts
export class TestContext {
  tenantId: string
  userId: string
  authToken: string
  supabase: SupabaseClient

  static async create(): Promise<TestContext> {
    const ctx = new TestContext()
    const supabase = await createServerClient()
    
    // Create unique test user
    const email = `test-${Date.now()}-${Math.random()}@test.com`
    const { data: auth } = await supabase.auth.signUp({
      email,
      password: 'TestPass123!'
    })
    
    ctx.userId = auth.user!.id
    ctx.authToken = auth.session!.access_token
    ctx.supabase = supabase
    
    // Create isolated tenant
    const { data: tenant } = await supabase
      .from('tenants')
      .insert({ 
        name: `Test Tenant ${Date.now()}`,
        slug: `test-${Date.now()}-${Math.random().toString(36).slice(2)}`
      })
      .select()
      .single()
    
    ctx.tenantId = tenant.id
    
    return ctx
  }

  async cleanup() {
    // Delete all tenant data
    await this.supabase.from('crm_contacts').delete().eq('tenant_id', this.tenantId)
    await this.supabase.from('crm_opportunities').delete().eq('tenant_id', this.tenantId)
    await this.supabase.from('tenants').delete().eq('id', this.tenantId)
    await this.supabase.auth.admin.deleteUser(this.userId)
  }
}
\`\`\`

---

## 5. Automated Testing Pipeline

### 5.1 CI/CD Integration (GitHub Actions)

\`\`\`yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: supabase/postgres
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
      SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:security
      - name: Run OWASP ZAP
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'http://localhost:3000'

  load-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: grafana/setup-k6-action@v1
      - run: k6 run __tests__/load/api-critical.js
\`\`\`

### 5.2 Test Scripts (package.json)

\`\`\`json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --dir __tests__/unit",
    "test:integration": "vitest run --dir __tests__/integration",
    "test:e2e": "playwright test",
    "test:security": "vitest run --dir __tests__/security",
    "test:load": "k6 run __tests__/load/*.js",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:ci": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
\`\`\`

---

## 6. API Health Metrics & Monitoring

### 6.1 Key Metrics to Track

**Performance Metrics**:
- Response time (P50, P95, P99)
- Throughput (requests per second)
- Error rate
- Database query time
- External API latency

**Business Metrics**:
- API usage by endpoint
- API usage by tenant
- Failed authentication attempts
- Rate limit hits

**Security Metrics**:
- Failed authorization attempts
- Suspicious request patterns
- CORS violations
- Invalid token attempts

### 6.2 Monitoring Implementation

\`\`\`typescript
// lib/monitoring/api-metrics.ts
export class APIMetrics {
  static async recordRequest(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number,
    tenantId?: string
  ) {
    await supabase.from('api_metrics').insert({
      endpoint,
      method,
      status_code: statusCode,
      duration_ms: duration,
      tenant_id: tenantId,
      timestamp: new Date().toISOString()
    })
  }

  static async getHealthStatus(): Promise<HealthStatus> {
    const now = Date.now()
    const fiveMinutesAgo = now - 5 * 60 * 1000

    const { data: recentRequests } = await supabase
      .from('api_metrics')
      .select('*')
      .gte('timestamp', new Date(fiveMinutesAgo).toISOString())

    const errorRate = recentRequests.filter(r => r.status_code >= 500).length / recentRequests.length
    const avgDuration = recentRequests.reduce((sum, r) => sum + r.duration_ms, 0) / recentRequests.length

    return {
      status: errorRate > 0.05 ? 'degraded' : 'healthy',
      error_rate: errorRate,
      avg_response_time: avgDuration,
      requests_per_minute: recentRequests.length / 5
    }
  }
}
\`\`\`

### 6.3 Alerting Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | > 2% | > 5% |
| P95 Response Time | > 500ms | > 1000ms |
| Database Connection Pool | > 80% | > 95% |
| Failed Auth Rate | > 10% | > 25% |
| Rate Limit Hits | > 100/min | > 500/min |

---

## 7. Test Execution Schedule

### 7.1 Continuous Testing

- **On every commit**: Unit tests, linting, type checking
- **On PR**: Unit + Integration tests
- **On merge to main**: Full test suite (Unit + Integration + E2E)
- **Nightly**: Full suite + Load tests + Security scans
- **Weekly**: Comprehensive security audit with OWASP ZAP

### 7.2 Manual Testing

- **Before major releases**: Manual exploratory testing
- **Quarterly**: Penetration testing by security team
- **Ad-hoc**: When investigating production issues

---

## 8. Test Coverage Goals

### 8.1 Coverage Targets

| Module | Unit Tests | Integration Tests | E2E Tests |
|--------|-----------|-------------------|-----------|
| Authentication | 90% | 80% | Critical paths |
| CRM | 85% | 75% | Critical paths |
| HRMS | 85% | 75% | Critical paths |
| Finance | 90% | 80% | Critical paths |
| Admin | 80% | 70% | Major workflows |
| Tenant Management | 85% | 80% | Critical paths |

### 8.2 Current Coverage Status

**Overall**: 65% (Target: 85%)

**By Module**:
- Authentication: 75% ✅
- CRM: 45% ⚠️
- HRMS: 40% ⚠️
- Finance: 70% ✅
- Admin: 35% ⚠️
- Tenant: 50% ⚠️

**Priority**: Focus on CRM, HRMS, and Admin modules

---

## 9. Testing Best Practices

### 9.1 General Guidelines

1. **Test Independence**: Each test should be able to run in isolation
2. **Fast Feedback**: Unit tests should run in < 5 seconds
3. **Clear Naming**: Use descriptive test names that explain what is being tested
4. **AAA Pattern**: Arrange, Act, Assert structure
5. **One Assertion**: Focus on one logical assertion per test
6. **DRY**: Use factories and helpers to reduce duplication
7. **Mock External Services**: Don't call real third-party APIs in tests
8. **Clean Up**: Always clean up test data in `afterAll` hooks

### 9.2 API Testing Checklist

For each API endpoint, test:

- ✅ **Happy path**: Valid input returns expected output
- ✅ **Authentication**: Requires valid auth token
- ✅ **Authorization**: Enforces RBAC/FLAC permissions
- ✅ **Tenant isolation**: Cannot access other tenant's data
- ✅ **Input validation**: Rejects invalid/malformed input
- ✅ **Error handling**: Returns appropriate error codes
- ✅ **Idempotency**: Repeated calls don't cause issues (for POST/PUT)
- ✅ **Rate limiting**: Enforces rate limits
- ✅ **Audit logging**: Creates audit trail entries
- ✅ **Blockchain verification**: Hash chain integrity (for sensitive operations)

---

## 10. Tools & Dependencies

### 10.1 Testing Stack

\`\`\`json
{
  "devDependencies": {
    "@playwright/test": "^1.56.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@vitest/browser-playwright": "latest",
    "@vitest/ui": "latest",
    "happy-dom": "latest",
    "jsdom": "^27.0.1",
    "k6": "latest",
    "vitest": "^4.0.5"
  }
}
\`\`\`

### 10.2 Additional Tools

- **Mock Service Worker (MSW)**: API mocking for frontend tests
- **Faker.js**: Generate realistic test data
- **Supertest**: HTTP assertions (alternative to fetch)
- **OWASP ZAP**: Security scanning
- **Codecov**: Code coverage reporting
- **Grafana k6**: Load testing and monitoring

---

## 11. Test Maintenance

### 11.1 Regular Reviews

- **Monthly**: Review test coverage and update targets
- **Quarterly**: Audit test suite for flaky tests
- **Per Sprint**: Update tests for new features
- **On failures**: Investigate and fix root cause immediately

### 11.2 Flaky Test Management

1. **Identify**: Track flaky tests in CI logs
2. **Isolate**: Reproduce locally
3. **Fix**: Address timing issues, race conditions, or test dependencies
4. **Quarantine**: Temporarily skip if blocking deployment (with ticket to fix)
5. **Remove**: Delete if providing no value

---

## 12. Success Metrics

### 12.1 Testing KPIs

- **Test Coverage**: 85% minimum across all modules
- **Test Execution Time**: < 10 minutes for full suite
- **Flaky Test Rate**: < 1% of all tests
- **Mean Time to Detect (MTTD)**: < 15 minutes for breaking changes
- **Mean Time to Repair (MTTR)**: < 2 hours for test failures
- **Production Bug Escape Rate**: < 5% of bugs reach production

### 12.2 Quality Gates

**Deployment Blockers**:
- Any P0 test failure
- Code coverage drops below 80%
- Security test failure
- Load test shows >500ms P95 response time

---

## 13. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- ✅ Set up Vitest and Playwright
- ✅ Create test database and factories
- ✅ Implement test isolation helpers
- ⏳ Write tests for Auth APIs (18 endpoints)

### Phase 2: Core Modules (Weeks 3-6)
- ⏳ CRM API tests (20 endpoints)
- ⏳ Tenant & Admin API tests (15 endpoints)
- ⏳ Integration test suite for critical paths
- ⏳ E2E tests for user journeys

### Phase 3: Specialized (Weeks 7-8)
- ⏳ Finance & Payroll API tests (10 endpoints)
- ⏳ Talent & HRMS API tests (12 endpoints)
- ⏳ Load testing suite with k6
- ⏳ Security test suite

### Phase 4: Optimization (Weeks 9-10)
- ⏳ Parallel test execution
- ⏳ Test coverage improvement to 85%
- ⏳ CI/CD pipeline optimization
- ⏳ Monitoring and alerting setup

---

## 14. Appendix

### A. Sample Test Report Template

\`\`\`markdown
## Test Execution Report - [Date]

### Summary
- Total Tests: 450
- Passed: 445
- Failed: 5
- Skipped: 0
- Duration: 8m 32s
- Coverage: 82%

### Failed Tests
1. `integration/crm/contacts.test.ts` - Database timeout
2. `e2e/pay-on-pay.spec.ts` - Blockchain verification delay
3. `security/rate-limiting.test.ts` - Flaky timing issue

### Performance
- P95 response time: 185ms ✅
- Error rate: 0.2% ✅
- Throughput: 250 req/s ✅

### Action Items
- [ ] Fix database connection pooling
- [ ] Increase blockchain verification timeout
- [ ] Stabilize rate limiting test
\`\`\`

### B. API Documentation References

- Authentication: `/docs/api/auth.md`
- CRM: `/docs/api/crm.md`
- HRMS: `/docs/api/hrms.md`
- Finance: `/docs/api/finance.md`
- Admin: `/docs/api/admin.md`

### C. Contact & Support

**Testing Team Lead**: QA Manager
**DevOps Lead**: Platform Engineer
**Security Lead**: Security Officer

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: February 2025
