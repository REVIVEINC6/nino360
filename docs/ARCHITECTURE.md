# Nino360 HRMS - Architecture Overview

## System Architecture

Nino360 is a multi-tenant SaaS application built with a modern, scalable architecture.

### High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js App Router, React Components, SWR Caching)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  (Server Components, Server Actions, API Routes)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                          │
│  (Supabase, Stripe, Email, AI Services)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  (PostgreSQL with RLS, Realtime Subscriptions)              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Multi-Tenancy

### Tenant Isolation

- Each tenant has a unique `tenant_id`
- Row Level Security (RLS) enforces data isolation
- All queries automatically filter by tenant
- Tenant context stored in user session

### Tenant Switching

- Users can belong to multiple tenants
- Tenant switcher in navigation
- Session stores current tenant context
- Middleware validates tenant access

## Authentication & Authorization

### Authentication Flow

1. User signs in with email/password
2. Supabase Auth creates session
3. Session stored in HTTP-only cookies
4. Middleware validates session on each request

### Authorization (RBAC/FBAC)

- **Role-Based Access Control (RBAC)**
  - Roles: Super Admin, Tenant Admin, Manager, User
  - Permissions assigned to roles
  - Users inherit role permissions

- **Feature-Based Access Control (FBAC)**
  - Features can be enabled/disabled per tenant
  - Subscription plans control feature access
  - `has_feature()` function checks access

## Data Flow

### Server-Side Rendering (SSR)

\`\`\`
Request → Middleware → Server Component → Supabase Query → Render → Response
\`\`\`

### Client-Side Interactions

\`\`\`
User Action → Client Component → Server Action → Supabase → Response → UI Update
\`\`\`

### Real-Time Updates

\`\`\`
Database Change → Supabase Realtime → WebSocket → Client → UI Update
\`\`\`

## Database Schema

### Core Schemas

- `core` - Tenants, users, roles, permissions
- `hr` - Employees, attendance, leave, payroll
- `ats` - Jobs, candidates, applications, interviews
- `crm` - Accounts, opportunities, contacts
- `finance` - Invoices, expenses, payments, timesheets
- `vms` - Vendors, contracts, compliance
- `projects` - Projects, tasks, time tracking
- `bench` - Consultants, marketing, placements
- `app` - Application settings, preferences
- `sec` - Security, audit logs, hash chain

### Key Design Patterns

1. **Soft Deletes**
   - `deleted_at` timestamp instead of hard deletes
   - Preserves audit trail
   - Can be restored if needed

2. **Audit Trail**
   - All changes logged to `sec.audit_log`
   - Hash-chained for tamper detection
   - Includes user, tenant, and change details

3. **Timestamps**
   - `created_at` and `updated_at` on all tables
   - Automatically managed by database triggers

## Caching Strategy

### Server-Side Caching

- Next.js `unstable_cache` for expensive queries
- Cache tags for granular invalidation
- Different durations based on data volatility

### Client-Side Caching

- SWR for data fetching and caching
- Automatic revalidation on focus/reconnect
- Optimistic updates for better UX

## Security

### Defense in Depth

1. **Network Layer**
   - HTTPS enforced
   - CORS configured
   - Rate limiting via Vercel

2. **Application Layer**
   - Input validation with Zod
   - SQL injection prevention (parameterized queries)
   - XSS prevention (React escaping)

3. **Database Layer**
   - Row Level Security (RLS)
   - Prepared statements
   - Encrypted connections

4. **Authentication Layer**
   - HTTP-only cookies
   - CSRF protection
   - Session expiration

### Audit & Compliance

- Hash-chained audit log
- Immutable audit records
- Tamper detection
- Compliance-ready (SOC 2, GDPR)

## Performance Optimization

### Frontend

- Code splitting by route
- Lazy loading of heavy components
- Image optimization with Next.js Image
- Font optimization with next/font

### Backend

- Database connection pooling
- Query optimization with indexes
- Caching at multiple levels
- Efficient data fetching patterns

### Database

- Indexes on foreign keys and common queries
- Materialized views for complex reports
- Partitioning for large tables (future)
- Read replicas for scaling (future)

## Monitoring & Observability

### Error Tracking

- Error boundaries at multiple levels
- Centralized error logging
- Integration with Sentry (optional)

### Performance Monitoring

- Web Vitals tracking
- Custom performance metrics
- Database query monitoring

### User Analytics

- Event tracking
- Page view tracking
- User journey analysis

## Scalability

### Current Capacity

- Supports 1000+ tenants
- 10,000+ users per tenant
- Millions of records per tenant

### Scaling Strategy

1. **Vertical Scaling**
   - Upgrade Supabase plan
   - Increase database resources

2. **Horizontal Scaling**
   - Vercel auto-scales application
   - Database read replicas
   - CDN for static assets

3. **Data Partitioning**
   - Partition large tables by tenant
   - Archive old data
   - Separate analytics database

## Deployment Architecture

### Production Environment

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         Vercel Edge                          │
│  (CDN, Edge Functions, Automatic Scaling)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Serverless                       │
│  (Next.js App, API Routes, Server Actions)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Supabase                             │
│  (PostgreSQL, Auth, Realtime, Storage)                      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### CI/CD Pipeline

1. Push to GitHub
2. Vercel detects changes
3. Runs build and tests
4. Deploys to preview environment
5. Manual promotion to production

## Future Enhancements

- GraphQL API layer
- Event-driven architecture with queues
- Microservices for heavy workloads
- Machine learning pipeline
- Mobile app with shared backend
- Multi-region deployment
