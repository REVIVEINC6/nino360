# Phase 1 Implementation Guide
## Core CRUD Operations - Detailed Roadmap

### ✅ Completed (Database Layer)
- [x] Hotlist Module Tables (7 tables)
- [x] Training/LMS Module Tables (9 tables)  
- [x] Module Enhancement Tables (10 tables)
- [x] Total: 26 new tables with RLS, indexes, and triggers

### ✅ Completed (Server Actions - Partial)
- [x] CRM Leads Actions (7 functions)
- [x] CRM Contacts Actions (5 functions)

### 🔄 In Progress (Server Actions)

#### Priority 1: Core Business Modules (Estimated: 4 weeks)

**CRM Module** (8 action files needed)
- [x] `/crm/leads/actions.ts` - ✅ Complete
- [x] `/crm/contacts/actions.ts` - ✅ Complete
- [ ] `/crm/accounts/actions.ts` - accounts CRUD
- [ ] `/crm/opportunities/actions.ts` - opportunities CRUD, stage management
- [ ] `/crm/activities/actions.ts` - calls, meetings, tasks CRUD
- [ ] `/crm/documents/actions.ts` - quotes, proposals CRUD
- [ ] `/crm/engagement/actions.ts` - email sequences, campaigns
- [ ] `/crm/pipeline/actions.ts` - pipeline analytics, forecasting

**Talent/ATS Module** (11 action files needed)
- [ ] `/talent/jobs/actions.ts` - job requisitions CRUD
- [ ] `/talent/candidates/actions.ts` - candidate CRUD, resume parsing
- [ ] `/talent/applications/actions.ts` - application tracking, stage movement
- [ ] `/talent/interviews/actions.ts` - interview scheduling, feedback
- [ ] `/talent/assessments/actions.ts` - test management, scoring
- [ ] `/talent/offers/actions.ts` - offer generation, approval workflow
- [ ] `/talent/sourcing/actions.ts` - sourcing campaigns, imports
- [ ] `/talent/engagement/actions.ts` - candidate communication
- [ ] `/talent/skills/actions.ts` - skill matching, JD parsing
- [ ] `/talent/onboarding/actions.ts` - onboarding handoff
- [ ] `/talent/analytics/actions.ts` - funnel metrics, quality of hire

**HRMS Module** (13 action files needed)
- [ ] `/hrms/employees/actions.ts` - employee CRUD, lifecycle
- [ ] `/hrms/assignments/actions.ts` - client assignments, rates
- [ ] `/hrms/attendance/actions.ts` - check-ins, leave management
- [ ] `/hrms/timesheets/actions.ts` - timesheet submission, approval
- [ ] `/hrms/documents/actions.ts` - document management
- [ ] `/hrms/onboarding/actions.ts` - new hire provisioning
- [ ] `/hrms/offboarding/actions.ts` - exit checklist
- [ ] `/hrms/helpdesk/actions.ts` - HR tickets, SLA tracking
- [ ] `/hrms/performance/actions.ts` - reviews, goals, 360 feedback
- [ ] `/hrms/compensation/actions.ts` - salary bands, adjustments
- [ ] `/hrms/benefits/actions.ts` - plans, enrollment, claims
- [ ] `/hrms/immigration/actions.ts` - visa tracking, alerts
- [ ] `/hrms/i9-compliance/actions.ts` - I-9 verification

**Finance Module** (10 action files needed)
- [ ] `/finance/accounts-receivable/actions.ts` - invoices, collections
- [ ] `/finance/accounts-payable/actions.ts` - bills, payments
- [ ] `/finance/pay-on-pay/actions.ts` - reconciliation
- [ ] `/finance/payroll/actions.ts` - payroll processing
- [ ] `/finance/budgeting/actions.ts` - budget management
- [ ] `/finance/forecasting/actions.ts` - cashflow forecasting
- [ ] `/finance/expenses/actions.ts` - expense management
- [ ] `/finance/revenue/actions.ts` - revenue recognition
- [ ] `/finance/ledger/actions.ts` - GL entries
- [ ] `/finance/tax/actions.ts` - tax calculations

#### Priority 2: Resource Management (Estimated: 2 weeks)

**Bench Module** (4 action files needed)
- [ ] `/bench/tracking/actions.ts` - resource roster, availability
- [ ] `/bench/allocation/actions.ts` - resource matching, assignment
- [ ] `/bench/forecasting/actions.ts` - demand prediction, roll-off
- [ ] `/bench/analytics/actions.ts` - utilization metrics

**VMS Module** (5 action files needed)
- [ ] `/vms/vendors/actions.ts` - vendor management, scorecards
- [ ] `/vms/jobs/actions.ts` - job distribution
- [ ] `/vms/submissions/actions.ts` - submission tracking, deduplication
- [ ] `/vms/timesheets/actions.ts` - vendor timesheet approval
- [ ] `/vms/invoicing/actions.ts` - vendor invoice processing

**Projects Module** (5 action files needed)
- [ ] `/projects/projects/actions.ts` - project CRUD
- [ ] `/projects/health/actions.ts` - health tracking
- [ ] `/projects/risks/actions.ts` - risk management
- [ ] `/projects/resources/actions.ts` - resource allocation
- [ ] `/projects/reports/actions.ts` - status reports, burn tracking

#### Priority 3: New Modules (Estimated: 2 weeks)

**Hotlist Module** (5 action files needed)
- [ ] `/hotlist/campaigns/actions.ts` - campaign management
- [ ] `/hotlist/candidates/actions.ts` - priority candidate management
- [ ] `/hotlist/requirements/actions.ts` - urgent job management
- [ ] `/hotlist/distributions/actions.ts` - distribution tracking
- [ ] `/hotlist/matches/actions.ts` - candidate-job matching

**Training/LMS Module** (7 action files needed)
- [ ] `/training/courses/actions.ts` - course management
- [ ] `/training/enrollments/actions.ts` - enrollment management
- [ ] `/training/content/actions.ts` - content management
- [ ] `/training/assessments/actions.ts` - quiz/test management
- [ ] `/training/certificates/actions.ts` - certificate issuance
- [ ] `/training/progress/actions.ts` - progress tracking
- [ ] `/training/paths/actions.ts` - learning path management

#### Priority 4: Platform Administration (Estimated: 1 week)

**Admin Module** (8 action files needed)
- [ ] `/admin/tenants/actions.ts` - tenant management
- [ ] `/admin/users/actions.ts` - global user management
- [ ] `/admin/modules/actions.ts` - module entitlements
- [ ] `/admin/marketplace/actions.ts` - add-on management
- [ ] `/admin/billing/actions.ts` - billing management
- [ ] `/admin/integrations/actions.ts` - integration configs
- [ ] `/admin/feature-flags/actions.ts` - feature flag management
- [ ] `/admin/api-gateway/actions.ts` - API key management

**Tenant Module** (4 action files needed)
- [x] `/tenant/users/actions.ts` - ✅ Already exists
- [x] `/tenant/directory/actions.ts` - ✅ Already exists
- [x] `/tenant/analytics/actions.ts` - ✅ Already exists
- [ ] `/tenant/access/actions.ts` - role/permission management

### 📋 API Routes Implementation

#### Priority 1: External API Access (Estimated: 3 weeks)

**Pattern: RESTful API Routes**
Each module needs API routes for external access:

\`\`\`
/api/v1/{module}/{resource}/route.ts
\`\`\`

**CRM API Routes** (8 routes)
- [ ] `/api/v1/crm/leads/route.ts` - GET, POST
- [ ] `/api/v1/crm/leads/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/crm/contacts/route.ts` - GET, POST
- [ ] `/api/v1/crm/contacts/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/crm/opportunities/route.ts` - GET, POST
- [ ] `/api/v1/crm/opportunities/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/crm/activities/route.ts` - GET, POST
- [ ] `/api/v1/crm/activities/[id]/route.ts` - GET, PUT, DELETE

**Talent API Routes** (10 routes)
- [ ] `/api/v1/talent/jobs/route.ts` - GET, POST
- [ ] `/api/v1/talent/jobs/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/talent/candidates/route.ts` - GET, POST
- [ ] `/api/v1/talent/candidates/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/talent/applications/route.ts` - GET, POST
- [ ] `/api/v1/talent/applications/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/talent/interviews/route.ts` - GET, POST
- [ ] `/api/v1/talent/interviews/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/talent/offers/route.ts` - GET, POST
- [ ] `/api/v1/talent/offers/[id]/route.ts` - GET, PUT, DELETE

**HRMS API Routes** (12 routes)
- [ ] `/api/v1/hrms/employees/route.ts` - GET, POST
- [ ] `/api/v1/hrms/employees/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/hrms/timesheets/route.ts` - GET, POST
- [ ] `/api/v1/hrms/timesheets/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/hrms/attendance/route.ts` - GET, POST
- [ ] `/api/v1/hrms/attendance/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/hrms/documents/route.ts` - GET, POST
- [ ] `/api/v1/hrms/documents/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/hrms/performance/route.ts` - GET, POST
- [ ] `/api/v1/hrms/performance/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/hrms/benefits/route.ts` - GET, POST
- [ ] `/api/v1/hrms/benefits/[id]/route.ts` - GET, PUT, DELETE

**Finance API Routes** (10 routes)
- [ ] `/api/v1/finance/invoices/route.ts` - GET, POST
- [ ] `/api/v1/finance/invoices/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/finance/bills/route.ts` - GET, POST
- [ ] `/api/v1/finance/bills/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/finance/payments/route.ts` - GET, POST
- [ ] `/api/v1/finance/payments/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/finance/expenses/route.ts` - GET, POST
- [ ] `/api/v1/finance/expenses/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/api/v1/finance/payroll/route.ts` - GET, POST
- [ ] `/api/v1/finance/payroll/[id]/route.ts` - GET, PUT, DELETE

### 🔧 Standard Action Template

\`\`\`typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 1. Define Zod schema for validation
const resourceSchema = z.object({
  // Define fields with validation rules
})

type ResourceInput = z.infer<typeof resourceSchema>

// 2. List function with filters and pagination
export async function listResources(filters?: {
  // Define filter options
  page?: number
  pageSize?: number
}) {
  try {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    
    // Get tenant
    const { data: profile } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', user.id)
      .single()
    
    if (!profile?.tenant_id) throw new Error('No tenant found')
    
    // Build query with filters
    let query = supabase
      .from('table_name')
      .select('*', { count: 'exact' })
      .eq('tenant_id', profile.tenant_id)
    
    // Apply filters...
    
    // Pagination
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    if (error) throw error
    
    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    }
  } catch (error) {
    console.error('[v0] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Operation failed'
    }
  }
}

// 3. Get by ID
export async function getResource(id: string) {
  // Similar pattern...
}

// 4. Create
export async function createResource(input: ResourceInput) {
  // Validate, insert, revalidate
}

// 5. Update
export async function updateResource(id: string, input: Partial<ResourceInput>) {
  // Validate, update, revalidate
}

// 6. Delete
export async function deleteResource(id: string) {
  // Delete, revalidate
}
\`\`\`

### 🔧 Standard API Route Template

\`\`\`typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/v1/module/resource
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate (API key or session)
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      )
    }
    
    // 2. Validate API key and get tenant
    const supabase = await createClient()
    const { data: keyData } = await supabase
      .from('admin_api_keys')
      .select('tenant_id, scopes, is_active')
      .eq('key_hash', hashApiKey(apiKey))
      .single()
    
    if (!keyData || !keyData.is_active) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }
    
    // 3. Check permissions
    if (!keyData.scopes.includes('resource.read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // 4. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    
    // 5. Query data
    const { data, error, count } = await supabase
      .from('table_name')
      .select('*', { count: 'exact' })
      .eq('tenant_id', keyData.tenant_id)
      .range((page - 1) * pageSize, page * pageSize - 1)
    
    if (error) throw error
    
    // 6. Return response
    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    })
  } catch (error) {
    console.error('[v0] API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/v1/module/resource
export async function POST(request: NextRequest) {
  // Similar pattern for create
}
\`\`\`

### 📊 Implementation Progress Tracking

**Total Scope:**
- Database Tables: 26 new tables ✅ COMPLETE
- Server Actions: 75 action files (0% → 3% complete)
- API Routes: 150+ route files (0% complete)

**Estimated Timeline:**
- Week 1-4: Core Business Module Actions (CRM, Talent, HRMS, Finance)
- Week 5-6: Resource Management Actions (Bench, VMS, Projects)
- Week 7-8: New Module Actions (Hotlist, Training/LMS)
- Week 9: Admin/Tenant Actions
- Week 10-12: API Routes (all modules)
- Week 13-14: Testing, Documentation, Deployment

**Total Estimated Effort:** 14 weeks (3.5 months) with 1 developer

### 🎯 Next Immediate Steps

1. **Complete CRM Actions** (6 remaining files)
2. **Start Talent Actions** (11 files)
3. **Create API Authentication Middleware**
4. **Set up API Rate Limiting**
5. **Create API Documentation (OpenAPI/Swagger)**

### 📝 Notes

- All actions follow the same pattern for consistency
- Zod validation ensures data integrity
- RLS policies provide tenant isolation
- Revalidation keeps UI in sync
- Error handling provides clear feedback
- API routes require authentication and rate limiting
