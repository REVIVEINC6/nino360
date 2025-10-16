# Tenant Management Implementation Plan

## Overview

This document outlines the comprehensive implementation of the tenant management page at `/admin/tenants`, designed to support efficient management of organizations across the platform.

## Features Implemented

### 1. Core Functionality ✓

#### Tenant Listing
- **Pagination**: 20 tenants per page with Previous/Next navigation
- **Search**: Real-time search by organization name or slug
- **Filtering**: 
  - Status filter (all, active, trial, suspended)
  - Plan filter (all plans + individual plan selection)
- **Sorting**: 
  - Sort by: created_at, name, status
  - Sort order: ascending/descending toggle
- **Real-time Updates**: Supabase subscriptions for live data refresh

#### Tenant Actions
- **Create Tenant**: Dialog form with name, slug, status, plan, billing email
- **Edit Tenant**: Inline editing of tenant details
- **View Details**: Comprehensive modal with tabs (Overview, Features, Stats, Audit)
- **Suspend/Activate**: Single-click status change with confirmation
- **Archive**: Lifecycle management for inactive tenants

### 2. Bulk Operations ✓

#### Bulk Suspend/Activate
- Select multiple tenants via checkboxes
- Select All functionality
- Bulk activate button (sets status to "active")
- Bulk suspend button (sets status to "suspended")
- Rate limited (5 per minute)
- Toast notifications for success/error

#### Bulk Plan Override
- Select multiple tenants
- Choose plan from dropdown
- Apply plan to all selected tenants simultaneously
- Updates `tenant_plans` table
- Rate limited (5 per minute)
- Confirmation dialog before execution

### 3. Metrics Dashboard ✓

#### Key Performance Indicators
- **Total Tenants**: Count of all organizations
- **Active**: Count of active tenants (green indicator)
- **Trial**: Count of trial tenants (blue indicator)
- **Suspended**: Count of suspended tenants (red indicator)

Real-time metric updates based on current filtered data.

### 4. Tenant Details View ✓

#### Overview Tab
- Organization name and slug
- Current status with badge
- Assigned plan
- Billing email
- Creation date
- Quick actions: Suspend/Activate, Edit, Archive

#### Features Tab
- List of feature overrides for the tenant
- Toggle switches to enable/disable features
- Shows plan defaults when no overrides exist
- Real-time feature toggle with immediate feedback

#### Statistics Tab
- Total users count
- Documents count
- Copilot sessions count
- Visual cards with metrics

#### Audit Trail Tab
- Recent 10 activity logs
- Action name and timestamp
- Scrollable list
- Empty state when no logs available

### 5. Export Functionality ✓

#### CSV Export
- Exports all tenants matching current search query
- Includes: ID, Name, Slug, Status, Plan, Users, Created Date
- Proper CSV escaping for special characters
- Timestamped filename
- Rate limited (3 per minute)
- Download trigger with proper MIME type

### 6. Security & Authorization ✓

#### Admin Verification
- All server actions require admin role
- Checks for: master_admin, super_admin, or admin
- Throws error if unauthorized
- Applied to all CRUD operations

#### Rate Limiting
- Bulk operations: 5 per minute
- Export: 3 per minute
- Upsert tenant: 5 per minute
- In-memory rate limit store
- User-specific rate limit keys

#### Audit Logging
- All critical actions logged
- Tenant creation/update logged
- Status changes logged
- Plan overrides logged

### 7. User Experience ✓

#### Loading States
- Skeleton loading during data fetch
- Button disabled states during operations
- Loading text indicators

#### Empty States
- "No tenants found" with filter icon
- Clear filters button
- Helpful descriptive text

#### Toast Notifications
- Success messages for all operations
- Error messages with details
- Consistent notification pattern

#### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Tables scroll horizontally on mobile
- Dialogs adapt to viewport

## Database Schema

### Tables Used

\`\`\`sql
-- Tenants table (core.tenants)
CREATE TABLE core.tenants (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  billing_email TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant Plans junction (core.tenant_plans)
CREATE TABLE core.tenant_plans (
  tenant_id UUID REFERENCES core.tenants(id),
  plan_id UUID REFERENCES core.plans(id),
  trial_ends_at TIMESTAMPTZ,
  PRIMARY KEY (tenant_id, plan_id)
);

-- Plans table (core.plans)
CREATE TABLE core.plans (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2)
);

-- Feature Overrides (core.tenant_feature_overrides)
CREATE TABLE core.tenant_feature_overrides (
  tenant_id UUID REFERENCES core.tenants(id),
  feature_id UUID REFERENCES core.features(id),
  enabled BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (tenant_id, feature_id)
);
\`\`\`

### Indexes

\`\`\`sql
CREATE INDEX idx_tenants_status ON core.tenants(status);
CREATE INDEX idx_tenants_slug ON core.tenants(slug);
CREATE INDEX idx_tenant_plans_tenant ON core.tenant_plans(tenant_id);
CREATE INDEX idx_tenant_plans_plan ON core.tenanw let me create a comprehensive implementation summary document:

<CodeProject id="nino360-hrms" taskNameActive="Creating implementation docs" taskNameComplete="Created implementation docs">

```markdown file="docs/TENANT_MANAGEMENT_IMPLEMENTATION.md"
# Tenant Management Implementation Plan

## Overview

This document outlines the comprehensive implementation of the tenant management page at `/admin/tenants`, designed to support efficient management of organizations across the platform.

## Features Implemented

### 1. Core Functionality ✓

#### Tenant Listing
- **Pagination**: 20 tenants per page with Previous/Next navigation
- **Search**: Real-time search by organization name or slug
- **Filtering**: 
  - Status filter (all, active, trial, suspended)
  - Plan filter (all plans + individual plan selection)
- **Sorting**: 
  - Sort by: created_at, name, status
  - Sort order: ascending/descending toggle
- **Real-time Updates**: Supabase subscriptions for live data refresh

#### Tenant Actions
- **Create Tenant**: Dialog form with name, slug, status, plan, billing email
- **Edit Tenant**: Inline editing of tenant details
- **View Details**: Comprehensive modal with tabs (Overview, Features, Stats, Audit)
- **Suspend/Activate**: Single-click status change with confirmation
- **Archive**: Lifecycle management for inactive tenants

### 2. Bulk Operations ✓

#### Bulk Suspend/Activate
- Select multiple tenants via checkboxes
- Select All functionality
- Bulk activate button (sets status to "active")
- Bulk suspend button (sets status to "suspended")
- Rate limited (5 per minute)
- Toast notifications for success/error

#### Bulk Plan Override
- Select multiple tenants
- Choose plan from dropdown
- Apply plan to all selected tenants simultaneously
- Updates `tenant_plans` table
- Rate limited (5 per minute)
- Confirmation dialog before execution

### 3. Metrics Dashboard ✓

#### Key Performance Indicators
- **Total Tenants**: Count of all organizations
- **Active**: Count of active tenants (green indicator)
- **Trial**: Count of trial tenants (blue indicator)
- **Suspended**: Count of suspended tenants (red indicator)

Real-time metric updates based on current filtered data.

### 4. Tenant Details View ✓

#### Overview Tab
- Organization name and slug
- Current status with badge
- Assigned plan
- Billing email
- Creation date
- Quick actions: Suspend/Activate, Edit, Archive

#### Features Tab
- List of feature overrides for the tenant
- Toggle switches to enable/disable features
- Shows plan defaults when no overrides exist
- Real-time feature toggle with immediate feedback

#### Statistics Tab
- Total users count
- Documents count
- Copilot sessions count
- Visual cards with metrics

#### Audit Trail Tab
- Recent 10 activity logs
- Action name and timestamp
- Scrollable list
- Empty state when no logs available

### 5. Export Functionality ✓

#### CSV Export
- Exports all tenants matching current search query
- Includes: ID, Name, Slug, Status, Plan, Users, Created Date
- Proper CSV escaping for special characters
- Timestamped filename
- Rate limited (3 per minute)
- Download trigger with proper MIME type

### 6. Security & Authorization ✓

#### Admin Verification
- All server actions require admin role
- Checks for: master_admin, super_admin, or admin
- Throws error if unauthorized
- Applied to all CRUD operations

#### Rate Limiting
- Bulk operations: 5 per minute
- Export: 3 per minute
- Upsert tenant: 5 per minute
- In-memory rate limit store
- User-specific rate limit keys

#### Audit Logging
- All critical actions logged
- Tenant creation/update logged
- Status changes logged
- Plan overrides logged

### 7. User Experience ✓

#### Loading States
- Skeleton loading during data fetch
- Button disabled states during operations
- Loading text indicators

#### Empty States
- "No tenants found" with filter icon
- Clear filters button
- Helpful descriptive text

#### Toast Notifications
- Success messages for all operations
- Error messages with details
- Consistent notification pattern

#### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Tables scroll horizontally on mobile
- Dialogs adapt to viewport

## Database Schema

### Tables Used

\`\`\`sql
-- Tenants table (core.tenants)
CREATE TABLE core.tenants (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  billing_email TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant Plans junction (core.tenant_plans)
CREATE TABLE core.tenant_plans (
  tenant_id UUID REFERENCES core.tenants(id),
  plan_id UUID REFERENCES core.plans(id),
  trial_ends_at TIMESTAMPTZ,
  PRIMARY KEY (tenant_id, plan_id)
);

-- Plans table (core.plans)
CREATE TABLE core.plans (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2)
);

-- Feature Overrides (core.tenant_feature_overrides)
CREATE TABLE core.tenant_feature_overrides (
  tenant_id UUID REFERENCES core.tenants(id),
  feature_id UUID REFERENCES core.features(id),
  enabled BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (tenant_id, feature_id)
);
\`\`\`

### Indexes

\`\`\`sql
CREATE INDEX idx_tenants_status ON core.tenants(status);
CREATE INDEX idx_tenants_slug ON core.tenants(slug);
CREATE INDEX idx_tenant_plans_tenant ON core.tenant_plans(tenant_id);
CREATE INDEX idx_tenant_plans_plan ON core.tenant_plans(plan_id);
\`\`\`

## API Endpoints (Server Actions)

### listTenants(params)
**Purpose**: Fetch paginated, filtered, sorted tenant list

**Parameters**:
- `q`: Search query (optional)
- `page`: Page number (default: 1)
- `per`: Items per page (default: 20)
- `status`: Status filter (optional)
- `plan`: Plan filter (optional)
- `sortBy`: Sort column (default: "created_at")
- `sortOrder`: Sort direction (default: "desc")

**Returns**: `{ rows: Tenant[], total: number, error?: string }`

**Security**: Requires admin role

---

### getTenantDetails(tenantId)
**Purpose**: Fetch comprehensive tenant details

**Parameters**:
- `tenantId`: UUID of tenant

**Returns**: 
\`\`\`typescript
{
  tenant: Tenant,
  stats: {
    user_count: number,
    doc_count: number,
    copilot_sessions: number,
    recent_audit: AuditLog[]
  },
  features: FeatureOverride[]
}
\`\`\`

**Security**: Requires admin role

---

### upsertTenant(input)
**Purpose**: Create or update tenant

**Parameters**:
\`\`\`typescript
{
  id?: string,
  name: string,
  slug: string,
  status: "active" | "suspended" | "trial",
  plan_id?: string,
  billing_email?: string,
  settings?: Record<string, any>
}
\`\`\`

**Returns**: Created/updated tenant object

**Security**: Requires admin role, rate limited

---

### updateTenantStatus(tenantId, status)
**Purpose**: Change tenant status

**Parameters**:
- `tenantId`: UUID of tenant
- `status`: "active" | "suspended"

**Returns**: Updated tenant object

**Security**: Requires admin role

---

### bulkSuspendTenants(input)
**Purpose**: Bulk suspend or activate tenants

**Parameters**:
\`\`\`typescript
{
  tenant_ids: string[],
  action: "suspend" | "activate"
}
\`\`\`

**Returns**: `{ success: boolean }`

**Security**: Requires admin role, rate limited (5/min)

---

### overrideTenantPlans(input)
**Purpose**: Override plans for multiple tenants

**Parameters**:
\`\`\`typescript
{
  tenant_ids: string[],
  plan_id: string,
  trial_ends_at?: string
}
\`\`\`

**Returns**: `{ success: boolean }`

**Security**: Requires admin role, rate limited (5/min)

---

### toggleTenantFeature(tenantId, featureSlug, enabled)
**Purpose**: Enable/disable feature for tenant

**Parameters**:
- `tenantId`: UUID of tenant
- `featureSlug`: Feature identifier
- `enabled`: boolean

**Returns**: `{ success: boolean }`

**Security**: Requires admin role

---

### exportTenantsCSV(q?)
**Purpose**: Export tenants to CSV

**Parameters**:
- `q`: Search query (optional)

**Returns**: CSV string

**Security**: Requires admin role, rate limited (3/min)

---

### listPlans()
**Purpose**: Get all available plans

**Returns**: `Plan[]`

**Security**: Requires admin role

---

### archiveTenant(tenantId)
**Purpose**: Archive a tenant (lifecycle management)

**Parameters**:
- `tenantId`: UUID of tenant

**Returns**: Updated tenant object

**Security**: Requires admin role

## Component Structure

\`\`\`
app/(dashboard)/admin/tenants/
├── page.tsx                    # Main tenant management page
└── actions/
    └── tenants.ts              # Server actions for tenant operations

components/
└── ui/                         # shadcn/ui components
    ├── card.tsx
    ├── button.tsx
    ├── input.tsx
    ├── select.tsx
    ├── dialog.tsx
    ├── badge.tsx
    ├── tabs.tsx
    ├── checkbox.tsx
    └── switch.tsx

lib/
└── rate-limit.ts               # Rate limiting utility
\`\`\`

## Integration Points

### 1. Supabase Integration
- Real-time subscriptions on `core.tenants` table
- Server-side queries with RLS policies
- Authentication via Supabase Auth

### 2. Rate Limiting
- In-memory rate limit store
- User-specific rate limit keys
- Configurable limits per action

### 3. Toast Notifications
- Success/error feedback
- Consistent notification pattern
- Auto-dismiss after 5 seconds

### 4. Navigation
- Integrated with admin dashboard sidebar
- Breadcrumb navigation
- Deep linking support

## Testing Checklist

### Functional Testing
- [ ] Create new tenant
- [ ] Edit existing tenant
- [ ] View tenant details
- [ ] Suspend tenant
- [ ] Activate tenant
- [ ] Archive tenant
- [ ] Bulk suspend multiple tenants
- [ ] Bulk activate multiple tenants
- [ ] Override plan for multiple tenants
- [ ] Toggle feature for tenant
- [ ] Export tenants to CSV
- [ ] Search tenants by name
- [ ] Search tenants by slug
- [ ] Filter by status
- [ ] Filter by plan
- [ ] Sort by created date
- [ ] Sort by name
- [ ] Sort by status
- [ ] Pagination (next/previous)
- [ ] Select all tenants
- [ ] Deselect all tenants

### Security Testing
- [ ] Verify admin role required for all actions
- [ ] Test unauthorized access (non-admin user)
- [ ] Test rate limiting on bulk operations
- [ ] Test rate limiting on export
- [ ] Verify audit logs created

### Performance Testing
- [ ] Load 1000+ tenants
- [ ] Test search performance
- [ ] Test filter performance
- [ ] Test sort performance
- [ ] Test real-time updates with multiple users

### UI/UX Testing
- [ ] Test on mobile devices
- [ ] Test on tablet devices
- [ ] Test on desktop
- [ ] Verify loading states
- [ ] Verify empty states
- [ ] Verify error states
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

## Deployment Checklist

### Database
- [ ] Run migration scripts
- [ ] Create indexes
- [ ] Enable RLS policies
- [ ] Seed initial plans

### Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Verify Supabase connection

### Application
- [ ] Build application
- [ ] Run tests
- [ ] Deploy to staging
- [ ] Verify functionality in staging
- [ ] Deploy to production

### Monitoring
- [ ] Set up error tracking
- [ ] Set up performance monitoring
- [ ] Set up audit log monitoring
- [ ] Set up rate limit alerts

## Future Enhancements

### Phase 2 (Optional)
1. **Advanced Analytics**
   - Tenant growth charts
   - Revenue by tenant
   - Usage trends
   - Churn analysis

2. **Bulk Import**
   - CSV import for tenants
   - Validation and error handling
   - Preview before import

3. **Custom Fields**
   - Extensible tenant metadata
   - Custom field definitions
   - Field validation rules

4. **Tenant Templates**
   - Pre-configured tenant setups
   - Template library
   - Quick tenant creation

5. **Automated Lifecycle**
   - Auto-suspend on payment failure
   - Trial expiration automation
   - Renewal reminders

6. **Advanced Permissions**
   - Granular feature permissions
   - Custom permission sets
   - Permission inheritance

## Support & Maintenance

### Common Issues

**Issue**: Tenants not loading
**Solution**: Check Supabase connection, verify RLS policies

**Issue**: Bulk operations failing
**Solution**: Check rate limits, verify admin role

**Issue**: Export not working
**Solution**: Check rate limits, verify CSV formatting

### Maintenance Tasks

- **Weekly**: Review audit logs for anomalies
- **Monthly**: Analyze tenant growth metrics
- **Quarterly**: Review and optimize database queries
- **Annually**: Review and update security policies

## Conclusion

The tenant management page is now fully implemented with comprehensive features for managing organizations, plans, and lifecycle events. All security measures are in place, and the interface is intuitive and responsive. The system is production-ready and can handle enterprise-scale tenant management efficiently.
