# NINO360 Database Scripts - Module Organization

This directory contains all database setup scripts organized by module for easy maintenance and deployment.

## Directory Structure

\`\`\`
scripts/modules/
├── 00-SETUP-MASTER.sql              # Master setup file (run this)
├── 01-core-infrastructure.sql       # Core tables, extensions, types
├── 02-security-rbac-fbac.sql        # Security, RBAC, FBAC, RLS policies
├── 03-tenant-module.sql             # Tenant management
├── 04-admin-module.sql              # Admin module
├── 05-crm-module.sql                # CRM module
├── 06-talent-ats-module.sql         # Talent/ATS module
├── 07-hrms-module.sql               # HRMS module
├── 08-bench-module.sql              # Bench management
├── 09-hotlist-module.sql            # Hotlist module
├── 10-training-lms-module.sql       # Training/LMS module
├── 11-finance-module.sql            # Finance module
├── 12-projects-module.sql           # Projects module
├── 13-vms-module.sql                # VMS module
├── 14-reports-module.sql            # Reports module
├── 15-automation-module.sql         # Automation module
├── 16-ai-rag-system.sql             # AI & RAG system
├── 17-analytics-views.sql           # Analytics & materialized views
├── 18-seed-data.sql                 # Seed data for all modules
└── 19-public-rpc-wrappers.sql       # Public RPC functions
\`\`\`

## Quick Start

### Full Setup (All Modules)

\`\`\`bash
# Run the master setup file
psql $POSTGRES_URL -f scripts/modules/00-SETUP-MASTER.sql
\`\`\`

### Individual Module Setup

If you only need specific modules, run them in order:

\`\`\`bash
# Core infrastructure (required)
psql $POSTGRES_URL -f scripts/modules/01-core-infrastructure.sql

# Security (required)
psql $POSTGRES_URL -f scripts/modules/02-security-rbac-fbac.sql

# Tenant management (required)
psql $POSTGRES_URL -f scripts/modules/03-tenant-module.sql

# Then add specific modules as needed
psql $POSTGRES_URL -f scripts/modules/05-crm-module.sql
psql $POSTGRES_URL -f scripts/modules/06-talent-ats-module.sql
# etc...
\`\`\`

## Module Dependencies

### Required Modules (Must run in order)
1. **Core Infrastructure** - Base tables, extensions, types
2. **Security & RBAC/FBAC** - Access control and RLS policies
3. **Tenant Module** - Multi-tenancy support

### Optional Modules (Can run independently after required modules)
- Admin Module
- CRM Module
- Talent/ATS Module
- HRMS Module
- Bench Module
- Hotlist Module
- Training/LMS Module
- Finance Module
- Projects Module
- VMS Module
- Reports Module
- Automation Module
- AI & RAG System

### Enhancement Modules (Run after base modules)
- Analytics & Views
- Seed Data
- Public RPC Wrappers

## Module Contents

### 01-core-infrastructure.sql
- PostgreSQL extensions (uuid-ossp, pgcrypto, pg_trgm, etc.)
- Custom types and enums
- Core tables (users, tenants, audit_logs)
- Utility functions
- Indexes for core tables

### 02-security-rbac-fbac.sql
- Roles and permissions tables
- RBAC (Role-Based Access Control) schema
- FBAC (Field-Based Access Control) schema
- RLS (Row Level Security) policies for all tables
- Security functions and triggers
- Audit chain with hash verification

### 03-tenant-module.sql
- Tenant configuration tables
- Tenant settings and preferences
- Tenant onboarding workflow
- Tenant billing and subscription
- Tenant analytics
- Multi-tenancy RLS policies

### 04-admin-module.sql
- Admin dashboard tables
- User management
- System configuration
- Marketplace and add-ons
- Approvals workflow
- Knowledge base
- Support tickets
- RPA automation
- Admin analytics

### 05-crm-module.sql
- Contacts and accounts
- Opportunities and deals
- Pipeline management
- Lead scoring
- Email tracking
- Document management
- Calendar and scheduling
- AI assistant integration
- CRM analytics

### 06-talent-ats-module.sql
- Job requisitions
- Candidates and applications
- Resume parsing
- Candidate scoring
- Interview scheduling
- Offer management
- Onboarding workflows
- Skills matrix
- Talent pipeline
- Marketplace integration
- AI-powered matching

### 07-hrms-module.sql
- Employee directory
- Attendance tracking
- Timesheet management
- Performance reviews
- Compensation management
- Benefits enrollment
- Compliance tracking
- Document management
- Immigration tracking
- I-9 compliance
- Onboarding/Offboarding
- HelpDesk
- HRMS analytics

### 08-bench-module.sql
- Bench consultants
- Availability tracking
- Resource allocation
- Marketing campaigns
- Placement tracking
- Submission tracking
- Bench analytics and forecasting

### 09-hotlist-module.sql
- Priority candidates
- Urgent requirements
- Campaign management
- Automation rules
- Candidate-job matching
- DLP and privacy controls

### 10-training-lms-module.sql
- Learning paths
- Course catalog
- Content management
- Certification tracking
- Quiz and assessment engine
- Learning analytics
- Personalized recommendations

### 11-finance-module.sql
- Invoicing
- Accounts receivable
- Accounts payable
- Payment processing
- Billing cycles
- Revenue recognition
- Pay-on-pay functionality
- Financial analytics

### 12-projects-module.sql
- Project management
- Task tracking
- Resource allocation
- Time tracking
- Project analytics

### 13-vms-module.sql
- Vendor management
- Vendor onboarding
- Contract management
- Vendor performance
- Compliance tracking

### 14-reports-module.sql
- Report definitions
- Report templates
- Scheduled reports
- Report history
- AI Copilot for reports

### 15-automation-module.sql
- Automation rules
- Workflow definitions
- Alert management
- Webhook configuration
- RPA workflows

### 16-ai-rag-system.sql
- Vector embeddings (pgvector)
- Document chunks
- RAG query system
- AI model configurations
- Knowledge base integration
- Semantic search

### 17-analytics-views.sql
- Materialized views for all modules
- Dashboard aggregations
- Performance metrics
- Trend analysis
- Predictive analytics views

### 18-seed-data.sql
- Default roles and permissions
- System users
- Sample tenants (for development)
- Configuration defaults
- Feature flags
- Email templates

### 19-public-rpc-wrappers.sql
- Public API functions
- Stored procedures for common operations
- Helper functions for frontend
- Data validation functions

## Maintenance

### Adding New Tables to a Module

1. Edit the appropriate module file (e.g., `05-crm-module.sql`)
2. Add your table definition
3. Add RLS policies in `02-security-rbac-fbac.sql`
4. Update seed data in `18-seed-data.sql` if needed
5. Test by running the master setup on a clean database

### Creating a New Module

1. Create a new file: `XX-module-name.sql`
2. Add it to `00-SETUP-MASTER.sql` in the correct order
3. Include:
   - Module header comment
   - Table definitions
   - Indexes
   - Functions and triggers
   - Comments on tables and columns
4. Add RLS policies to `02-security-rbac-fbac.sql`
5. Update this README

### Migration Strategy

For existing databases, create migration scripts:

\`\`\`sql
-- migrations/2025-01-XX-add-feature.sql
BEGIN;

-- Your changes here

COMMIT;
\`\`\`

## Troubleshooting

### Script Fails Midway

\`\`\`bash
# Check which tables were created
psql $POSTGRES_URL -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"

# Drop all tables and start fresh (CAUTION: destroys data)
psql $POSTGRES_URL -f scripts/00-drop-all-tables.sql
psql $POSTGRES_URL -f scripts/modules/00-SETUP-MASTER.sql
\`\`\`

### RLS Policy Errors

\`\`\`bash
# Check existing policies
psql $POSTGRES_URL -c "SELECT schemaname, tablename, policyname FROM pg_policies;"

# Disable RLS temporarily for debugging (NOT for production)
psql $POSTGRES_URL -c "ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;"
\`\`\`

### Performance Issues

\`\`\`bash
# Check missing indexes
psql $POSTGRES_URL -c "SELECT schemaname, tablename, attname FROM pg_stats WHERE schemaname = 'public' AND n_distinct > 100 AND correlation < 0.1;"

# Analyze tables
psql $POSTGRES_URL -c "ANALYZE;"
\`\`\`

## Best Practices

1. **Always run scripts in order** - Dependencies matter
2. **Test on development first** - Never run untested scripts on production
3. **Backup before migrations** - `pg_dump` before major changes
4. **Use transactions** - Wrap changes in BEGIN/COMMIT
5. **Document changes** - Add comments to explain complex logic
6. **Version control** - Commit SQL changes with descriptive messages

## Support

For issues or questions:
- Check the main documentation: `/docs/DATABASE_SETUP.md`
- Review architecture: `/docs/NINO360_ARCHITECTURE.md`
- Contact: support@nino360.com
