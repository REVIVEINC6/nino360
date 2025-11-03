# Nino360 Database Setup Guide

## Overview

This guide walks you through setting up the complete Nino360 database schema in Supabase.

## Prerequisites

- Supabase project created
- Access to Supabase SQL Editor
- Environment variables configured in Vercel

## Quick Setup (Recommended)

### Option 1: Run Individual Scripts

Run the SQL migration scripts in order through the Supabase SQL Editor:

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor**
3. Run each script in numerical order:

\`\`\`
scripts/01-create-tables.sql
scripts/02-enable-rls.sql
scripts/03-seed-data.sql
scripts/04-admin-module.sql
scripts/05-tenant-admin.sql
scripts/06-ats.sql
scripts/07-bench.sql
scripts/08-vms.sql
scripts/09-rbac-fbac.sql
scripts/10-finance.sql
scripts/11-projects.sql
scripts/12-reports.sql
scripts/13-automation.sql
scripts/14-hrms.sql
scripts/15-crm.sql
scripts/19-admin-enhancements.sql
scripts/20-security-compliance.sql
scripts/21-rbac-fbac-enhanced.sql
scripts/22-rag-system.sql
scripts/23-admin-governance.sql
scripts/24-tenant-management.sql
scripts/25-ats-talent.sql
scripts/26-bench-management.sql
scripts/27-finance-module.sql
scripts/28-hrms-module.sql
scripts/30-lead-billing-onboarding.sql
scripts/31-user-settings.sql
scripts/32-public-rpc-wrappers.sql
\`\`\`

### Option 2: Use the Script Runner (Coming Soon)

\`\`\`bash
npm run db:setup
\`\`\`

## What Gets Created

### Schemas
- `core` - Core tables (tenants, users, clients, candidates, etc.)
- `sec` - Security (audit logs, permissions, field permissions)
- `ai` - AI features (insights, RAG embeddings)
- `app` - Application data (user preferences, API keys, webhooks)
- `ats` - Applicant Tracking System
- `finance` - Financial management
- `bench` - Bench management
- `vms` - Vendor Management System
- `hrms` - Human Resources Management
- `crm` - Customer Relationship Management
- `bill` - Billing and subscriptions

### Key Tables
- **Core**: tenants, users, user_tenants, user_roles, clients, candidates, job_requisitions
- **Security**: audit_logs, field_permissions, roles, permissions
- **Finance**: invoices, expenses, timesheets, payments
- **Projects**: projects, project_assignments, tasks
- **Bench**: bench_consultants, marketing_activities, submissions, placements

### Functions
- `public.has_feature(feature_key)` - Check if feature is enabled for current user (wrapper for sec.has_feature)
- `public.feature_limits(feature_key)` - Get feature limits for current user (wrapper for sec.feature_limits)
- `public.has_permission(permission_key)` - Check if user has permission (wrapper for sec.has_perm)
- `public.has_role(role_key)` - Check if user has role (wrapper for sec.has_role)
- `public.current_user_id()` - Get current user ID from JWT (wrapper for sec.current_user_id)
- `public.current_tenant_id()` - Get current tenant ID from JWT (wrapper for sec.current_tenant_id)
- `sec.has_permission(user_id, tenant_id, permission_key)` - Internal permission check
- `sec.get_user_permissions(user_id, tenant_id)` - Get all user permissions
- `sec.get_user_roles(user_id, tenant_id)` - Get all user roles
- `sec.can_access_field(user_id, tenant_id, table, field, access_type)` - Check field-level access

### Row Level Security (RLS)
All tables have RLS policies that enforce:
- Tenant isolation (users can only see their tenant's data)
- Role-based access control
- Field-level permissions for sensitive data

## Verification

After running all scripts, verify the setup:

\`\`\`sql
-- Check schemas
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name IN ('core', 'sec', 'ai', 'app', 'ats', 'finance', 'bench', 'vms', 'hrms', 'crm', 'bill');

-- Check tables
SELECT table_schema, COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema IN ('core', 'sec', 'ai', 'app', 'ats', 'finance', 'bench', 'vms', 'hrms', 'crm', 'bill')
GROUP BY table_schema;

-- Check functions
SELECT routine_schema, routine_name 
FROM information_schema.routines 
WHERE routine_schema IN ('sec', 'public')
ORDER BY routine_schema, routine_name;
\`\`\`

Expected results:
- 11 schemas created
- 100+ tables created
- 10+ functions created

## Troubleshooting

### Error: Schema already exists
This is safe to ignore. The scripts use `CREATE SCHEMA IF NOT EXISTS`.

### Error: Table already exists
This is safe to ignore. The scripts use `CREATE TABLE IF NOT EXISTS`.

### Error: Function already exists
Drop the function first:
\`\`\`sql
DROP FUNCTION IF EXISTS sec.has_permission(UUID, UUID, TEXT);
\`\`\`
Then re-run the script.

### Error: Permission denied
Make sure you're running the scripts as the Supabase service role (default in SQL Editor).

### Error: Could not find the function public.has_feature

This means the public schema wrapper functions haven't been created yet. Run:
\`\`\`sql
-- Run the public RPC wrappers script
scripts/32-public-rpc-wrappers.sql
\`\`\`

Or manually create the wrapper:
\`\`\`sql
CREATE OR REPLACE FUNCTION public.has_feature(_feature_key TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sec.has_feature(_feature_key);
$$;

GRANT EXECUTE ON FUNCTION public.has_feature(TEXT) TO authenticated;
\`\`\`

**Why this is needed**: Supabase's PostgREST API looks for RPC functions in the `public` schema by default. The actual security logic lives in the `sec` schema, so we create public wrappers that call the secure functions.

## Next Steps

After database setup:

1. **Create your first tenant**:
\`\`\`sql
INSERT INTO core.tenants (slug, name, subscription_tier)
VALUES ('demo', 'Demo Organization', 'pro')
RETURNING *;
\`\`\`

2. **Create your first user** (automatically created on signup via Supabase Auth)

3. **Assign user to tenant**:
\`\`\`sql
INSERT INTO core.user_tenants (user_id, tenant_id, is_primary)
VALUES (
  'your-user-id-from-auth-users',
  'your-tenant-id-from-above',
  TRUE
);
\`\`\`

4. **Assign role to user**:
\`\`\`sql
INSERT INTO core.user_roles (user_id, tenant_id, role_id)
VALUES (
  'your-user-id',
  'your-tenant-id',
  (SELECT id FROM core.roles WHERE key = 'admin')
);
\`\`\`

5. **Test the application** at `/dashboard`

## Support

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify environment variables are set correctly
3. Ensure RLS is enabled on all tables
4. Check that the `authenticated` role has proper grants

## Schema Diagram

\`\`\`
core.tenants
  ├── core.users (via user_tenants)
  ├── core.clients
  │   └── core.client_contacts
  ├── core.candidates
  │   └── core.job_applications
  │       └── core.interviews
  ├── core.job_requisitions
  ├── core.projects
  │   └── core.project_assignments
  ├── core.invoices
  └── core.expenses

sec.audit_logs (all actions logged here)
sec.field_permissions (field-level access control)
