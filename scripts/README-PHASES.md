# Nino360 HRMS Database Setup - Phase Execution Guide

This guide explains how to execute the database setup in phases using the Supabase SQL Editor.

## Overview

The master setup script has been divided into **6 phases** for easier execution and debugging:

1. **Phase 1**: Core Infrastructure (Extensions, Schemas, Core Tables)
2. **Phase 2**: Module Tables (CRM, HRMS, Talent, etc.)
3. **Phase 3**: Indexes & Performance
4. **Phase 4**: RLS & Security Policies
5. **Phase 5**: Functions & Triggers
6. **Phase 6**: Seed Data & Finalization

## Execution Order

**IMPORTANT**: Execute phases in order. Each phase depends on the previous ones.

### Phase 1: Core Infrastructure
\`\`\`bash
File: phase-1-core-infrastructure.sql
Duration: ~10 seconds
\`\`\`

**What it does:**
- Creates PostgreSQL extensions (uuid-ossp, pgcrypto, etc.)
- Creates `core` schema
- Creates utility functions for safe migrations
- Creates core tables: tenants, users, roles, permissions
- Creates basic indexes

**Execute in Supabase SQL Editor:**
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `phase-1-core-infrastructure.sql`
3. Click "Run"
4. Wait for success message

### Phase 2: Module Tables
\`\`\`bash
File: phase-2-module-tables.sql
Duration: ~20 seconds
\`\`\`

**What it does:**
- Creates all application module tables
- CRM (accounts, contacts, leads, opportunities)
- Projects (projects table)
- HRMS (employees, timesheets, leave, payroll)
- Talent/ATS (jobs, candidates, applications, interviews)
- Bench (resources, allocations)
- Finance (invoices, expenses)
- VMS (vendors, contracts)
- Hotlist (consultants)
- Training/LMS (courses, enrollments)
- Automation (rules, webhooks)
- Notifications
- Reports
- Audit logs

**Execute in Supabase SQL Editor:**
1. Ensure Phase 1 completed successfully
2. Copy contents of `phase-2-module-tables.sql`
3. Click "Run"
4. Wait for success message

### Phase 3: Indexes & Performance
\`\`\`bash
File: phase-3-indexes.sql
Duration: ~15 seconds
\`\`\`

**What it does:**
- Creates 50+ performance indexes
- Optimizes queries for tenant isolation
- Adds foreign key indexes
- Improves search performance

**Execute in Supabase SQL Editor:**
1. Ensure Phase 2 completed successfully
2. Copy contents of `phase-3-indexes.sql`
3. Click "Run"
4. Wait for success message

### Phase 4: RLS & Security
\`\`\`bash
File: phase-4-rls-security.sql
Duration: ~10 seconds
\`\`\`

**What it does:**
- Enables Row Level Security (RLS) on all tables
- Creates tenant isolation policies
- Ensures data security and multi-tenancy

**Execute in Supabase SQL Editor:**
1. Ensure Phase 3 completed successfully
2. Copy contents of `phase-4-rls-security.sql`
3. Click "Run"
4. Wait for success message

### Phase 5: Functions & Triggers
\`\`\`bash
File: phase-5-functions-triggers.sql
Duration: ~10 seconds
\`\`\`

**What it does:**
- Creates `updated_at` triggers for all tables
- Creates business logic functions:
  - `calculate_project_utilization()`
  - `get_leave_balance()`
  - `calculate_invoice_total()`
- Adds automated triggers

**Execute in Supabase SQL Editor:**
1. Ensure Phase 4 completed successfully
2. Copy contents of `phase-5-functions-triggers.sql`
3. Click "Run"
4. Wait for success message

### Phase 6: Seed Data & Finalization
\`\`\`bash
File: phase-6-seed-data.sql
Duration: ~5 seconds
\`\`\`

**What it does:**
- Inserts 27 default permissions
- Enables Realtime for critical tables
- Displays final success summary

**Execute in Supabase SQL Editor:**
1. Ensure Phase 5 completed successfully
2. Copy contents of `phase-6-seed-data.sql`
3. Click "Run"
4. Wait for final success message

## Verification

After completing all phases, verify the setup:

\`\`\`sql
-- Check total tables created
SELECT count(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: 35+ tables

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
LIMIT 10;
-- Expected: Multiple tenant_isolation_policy entries

-- Check permissions
SELECT count(*) FROM core.permissions;
-- Expected: 27 permissions

-- Check indexes
SELECT count(*) FROM pg_indexes 
WHERE schemaname = 'public';
-- Expected: 50+ indexes
\`\`\`

## Troubleshooting

### If a phase fails:

1. **Read the error message carefully**
2. **Check prerequisites**: Ensure previous phases completed
3. **Check for existing objects**: Some objects might already exist
4. **Re-run the phase**: Most scripts use `IF NOT EXISTS` for idempotency

### Common Issues:

**"relation already exists"**
- Safe to ignore if using `CREATE TABLE IF NOT EXISTS`
- Or drop the table and re-run: `DROP TABLE IF EXISTS table_name CASCADE;`

**"column does not exist"**
- Ensure Phase 2 (module tables) completed successfully
- Check that the referenced table was created

**"permission denied"**
- Ensure you're running as database owner or superuser
- Check Supabase project permissions

## Benefits of Phased Approach

1. **Easier Debugging**: Isolate issues to specific phases
2. **Progress Tracking**: See exactly what's been completed
3. **Timeout Prevention**: Avoid SQL editor timeouts with large scripts
4. **Selective Execution**: Re-run only failed phases
5. **Better Understanding**: Clear separation of concerns

## Total Execution Time

**Estimated total time**: 60-70 seconds for all 6 phases

## Next Steps

After successful completion:

1. **Create your first tenant**:
\`\`\`sql
INSERT INTO core.tenants (name, slug) 
VALUES ('My Company', 'my-company');
\`\`\`

2. **Set tenant context** for testing:
\`\`\`sql
SET app.current_tenant_id = 'your-tenant-uuid';
\`\`\`

3. **Test RLS policies** by querying tables

4. **Connect your application** using the Supabase client

## Support

If you encounter issues:
- Check the error logs in Supabase Dashboard
- Review the phase-specific success messages
- Verify each phase completed before proceeding
- Contact support with specific error messages
