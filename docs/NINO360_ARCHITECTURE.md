# Nino360 — Comprehensive Application Architecture

**Version:** 2.0  
**Last Updated:** January 2025  
**Status:** Production-Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Principles](#core-principles)
3. [Platform Stack](#platform-stack)
4. [System Architecture](#system-architecture)
5. [Security Model](#security-model)
6. [Data Architecture](#data-architecture)
7. [AI & Automation](#ai--automation)
8. [Module Architecture](#module-architecture)
9. [Data Flows](#data-flows)
10. [Integration Architecture](#integration-architecture)
11. [Non-Functional Requirements](#non-functional-requirements)
12. [DevEx, CI/CD & Testing](#devex-cicd--testing)
13. [Deployment Architecture](#deployment-architecture)
14. [Scalability & Future Path](#scalability--future-path)
15. [Acceptance Criteria](#acceptance-criteria)

---

## Executive Summary

Nino360 is a **multi-tenant, AI-native SaaS platform** that unifies CRM, Talent/ATS, HRMS, Finance, VMS, Training/LMS, Bench Management, and Project Management into a single, cohesive ecosystem. Built on Next.js 14 App Router with Supabase (PostgreSQL + Auth + RLS + Storage), the platform emphasizes:

- **Strict tenant isolation** via Row-Level Security (RLS)
- **RBAC + FBAC** for granular access control
- **AI-powered workflows** with Copilot, ML forecasts, and explainability
- **Event-driven architecture** with outbox pattern for async operations
- **Tamper-evident trust** via SHA-256 hash-chained audit logs
- **Production-grade quality** with comprehensive testing and observability

---

## Core Principles

### 1. Multi-Tenant by Default
- **Strict tenant isolation**: Every row has `tenant_id`
- **PostgreSQL RLS**: Automatic filtering at database level
- **Tenant context**: Stored in session, validated by middleware
- **Cross-tenant prevention**: No data leakage between tenants

### 2. RBAC + FBAC
- **Role-Based Access Control (RBAC)**: Permissions assigned to roles
- **Feature-Based Access Control (FBAC)**: Runtime feature flags per tenant
- **Scope rules**: Optional resource-level constraints (owner-only, team-only)
- **Field-level masking**: PII protection based on permissions

### 3. AI-Native UX
- **Copilot**: Prompt → Plan → Tools → Policy → Execute → Ledger
- **ML Forecasts**: Sales, cashflow, bench utilization, anomaly detection
- **Explainability**: "Why?" hovers show salient features for ML scores
- **Guardrails**: DLP policies, human-in-the-loop checkpoints

### 4. Event-Driven
- **Outbox pattern**: Reliable async processing
- **Workers**: Syncs, automations, emails, webhooks
- **Idempotency**: Retry-safe operations with deduplication
- **Dead Letter Queue (DLQ)**: Failed job handling

### 5. Tamper-Evident Trust
- **Hash-chained audit log**: SHA-256 linking for immutability
- **Ledger notarization**: Critical events (comp cycles, EDI files, evidence packs)
- **Verification API**: `/api/audit/verify` for external audits
- **Compliance-ready**: SOC 2, ISO 27001, GDPR

### 6. Quality & Speed
- **Next.js App Router**: Server Components, Server Actions, streaming
- **Edge caching**: Vercel Edge Network for global performance
- **Progressive hydration**: Faster initial loads
- **Playwright smoke tests**: Critical path coverage

---

## Platform Stack

\`\`\`mermaid
graph TB
    subgraph "Frontend"
        A[Next.js 14 App Router]
        B[TypeScript]
        C[Tailwind CSS v4]
        D[shadcn/ui]
        E[Framer Motion]
        F[Recharts]
        G[Three.js]
    end
    
    subgraph "Backend"
        H[Supabase PostgreSQL]
        I[Supabase Auth]
        J[Supabase Storage]
        K[Supabase Edge Functions]
        L[Server Actions]
    end
    
    subgraph "AI/ML"
        M[Vercel AI SDK]
        N[OpenAI GPT-4]
        O[pgvector]
        P[Trigram Search]
    end
    
    subgraph "Integrations"
        Q[Stripe/Razorpay]
        R[Upstash Redis]
        S[Email Service]
        T[Webhooks]
    end
    
    subgraph "Infrastructure"
        U[Vercel Edge]
        V[Vercel Serverless]
        W[GitHub Actions]
    end
    
    A  L
    L  H
    H  O
    A  M
    M  N
    L  Q
    L  R
    U  V
    V  H
\`\`\`

### Technology Choices

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (TypeScript) | App Router, Server Components, streaming |
| **Styling** | Tailwind CSS v4 | Utility-first, design tokens, glassmorphic UI |
| **Components** | shadcn/ui | Accessible, customizable, Radix UI primitives |
| **Animation** | Framer Motion | Smooth transitions, micro-interactions |
| **Charts** | Recharts | Declarative, composable data visualizations |
| **3D** | Three.js | Marketing hero, interactive demos |
| **Backend** | Supabase | PostgreSQL + Auth + RLS + Storage + Realtime |
| **Auth** | Supabase Auth | Email/password, OTP, SSO (future) |
| **Database** | PostgreSQL 15+ | ACID, RLS, JSONB, full-text search, pgvector |
| **Search** | pgvector + trigram | Semantic search + fuzzy text search |
| **AI** | Vercel AI SDK | Streaming, tool calling, multi-provider |
| **LLM** | OpenAI GPT-4 | Copilot, summarization, drafting |
| **Payments** | Stripe/Razorpay | Subscriptions, invoicing, webhooks |
| **Cache** | Upstash Redis | Session store, rate limiting, job queues |
| **Email** | Resend/SendGrid | Transactional emails, templates |
| **Hosting** | Vercel | Edge Network, serverless, auto-scaling |
| **CI/CD** | GitHub Actions | Tests, migrations, deployments |
| **Monitoring** | Vercel Analytics | Web Vitals, custom metrics |

---

## System Architecture

### Logical Architecture

\`\`\`mermaid
graph TB
    subgraph "Client Layer"
        A1[Marketing Site]
        A2[App Shell]
        A3[Copilot Panel]
        A4[Orchestrator Builder]
    end
    
    subgraph "Gateway Layer"
        B1[Next.js Routes]
        B2[Server Actions]
        B3[API Routes]
        B4[Middleware]
    end
    
    subgraph "Service Layer"
        C1[Auth & Profile]
        C2[Tenant Service]
        C3[Access Control]
        C4[Billing]
        C5[Automation]
        C6[AI Orchestrator]
        C7[Audit/Trust]
        C8[Integrations]
        C9[Data/RAG]
        C10[Analytics]
    end
    
    subgraph "Data Layer"
        D1[(PostgreSQL)]
        D2[Storage Buckets]
        D3[Redis Cache]
    end
    
    subgraph "Async Layer"
        E1[Edge Functions]
        E2[Cron Jobs]
        E3[Outbox Workers]
    end
    
    A1  B1
    A2  B2
    A3  B2
    A4  B2
    B1  B4
    B2  B4
    B3  B4
    B4  C1
    B4  C2
    B4  C3
    C1  D1
    C2  D1
    C3  D1
    C4  D1
    C5  D1
    C6  D1
    C7  D1
    C8  D1
    C9  D1
    C10  D1
    D1  E1
    E1  E3
    E2  E3
\`\`\`

### Request Flow

\`\`\`mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant ServerAction
    participant RLS
    participant Database
    participant AuditLog
    
    Client->>Middleware: Request with session
    Middleware->>Middleware: Validate session
    Middleware->>Middleware: Extract tenant_id
    Middleware->>ServerAction: Forward request
    ServerAction->>ServerAction: Validate input (Zod)
    ServerAction->>ServerAction: Check RBAC/FBAC
    ServerAction->>RLS: Set tenant context
    RLS->>Database: Query with RLS filter
    Database->>RLS: Filtered results
    RLS->>ServerAction: Return data
    ServerAction->>AuditLog: Write audit entry
    AuditLog->>AuditLog: Compute hash chain
    ServerAction->>Client: Response
\`\`\`

### Multi-Tenancy Architecture

\`\`\`mermaid
graph LR
    subgraph "Tenant A"
        A1[Users]
        A2[Data]
        A3[Features]
    end
    
    subgraph "Tenant B"
        B1[Users]
        B2[Data]
        B3[Features]
    end
    
    subgraph "Shared Infrastructure"
        C1[Application Code]
        C2[Database]
        C3[Storage]
    end
    
    A1  C1
    A2  C2
    A3  C1
    B1  C1
    B2  C2
    B3  C1
    
    C2  D[RLS Policies]
    D  E[tenant_id Filter]
\`\`\`

---

## Security Model

### Defense in Depth

\`\`\`mermaid
graph TB
    A[Network Layer]  B[Application Layer]
    B  C[Database Layer]
    C  D[Authentication Layer]
    D  E[Authorization Layer]
    E  F[Audit Layer]
    
    A1[HTTPS, CORS, Rate Limiting] -.-> A
    B1[Input Validation, XSS Prevention] -.-> B
    C1[RLS, Prepared Statements, Encryption] -.-> C
    D1[HTTP-only Cookies, CSRF Protection] -.-> D
    E1[RBAC, FBAC, Field Masking] -.-> E
    F1[Hash Chain, Immutable Logs] -.-> F
\`\`\`

### Row-Level Security (RLS)

Every tenant table has RLS policies that automatically filter by `tenant_id`:

\`\`\`sql
-- Example RLS policy
CREATE POLICY tenant_isolation ON app.employees
  USING (tenant_id = app.current_tenant_id());

-- Function to get current tenant from session
CREATE FUNCTION app.current_tenant_id()
RETURNS uuid AS $$
  SELECT (current_setting('app.tenant_id', true))::uuid;
$$ LANGUAGE sql STABLE;
\`\`\`

### RBAC (Role-Based Access Control)

\`\`\`mermaid
graph LR
    A[User]  B[Role]
    B  C[Permissions]
    C  D[Resources]
    
    B1[tenant_admin]  C1[*.manage]
    B2[manager]  C2[*.write, *.read]
    B3[member]  C3[*.read]
\`\`\`

**Key Tables:**
- `app.roles`: Role definitions (tenant_admin, manager, member, custom)
- `app.permissions`: Permission catalog (crm.read, hrms.write, finance.manage)
- `app.role_permissions`: Many-to-many mapping
- `app.tenant_members`: User-role assignments per tenant

### FBAC (Feature-Based Access Control)

\`\`\`mermaid
graph TB
    A[Tenant]  B[Subscription Plan]
    B  C[Feature Flags]
    C  D[UI Components]
    C  E[Server Actions]
    
    C1[crm.enabled] -.-> D1[CRM Module]
    C2[ai.copilot] -.-> D2[Copilot Panel]
    C3[exports.allowed] -.-> E1[Export Action]
\`\`\`

**Key Tables:**
- `app.feature_flags`: Per-tenant feature toggles
- `bill.plans`: Plan definitions with included features
- `bill.subscriptions`: Active subscriptions

**Runtime Checks:**
\`\`\`typescript
// Server action guard
if (!hasFeature(tenantId, 'exports.allowed')) {
  throw new Error('Export feature not enabled');
}
\`\`\`

### DLP & PII Protection

\`\`\`mermaid
graph LR
    A[User Request]  B{Has Permission?}
    B |Yes| C[Return Full Data]
    B |No| D[Apply Masking]
    D  E[Return Masked Data]
    
    D1[SSN: ***-**-1234] -.-> E
    D2[Salary: $***,***] -.-> E
    D3[Email: j***@example.com] -.-> E
\`\`\`

**Masking Rules:**
- `pii.masking`: Redact SSN, DOB, addresses
- `pii.salary.unmask`: Timed token for salary visibility
- `pii.dependent.unmask`: Benefits dependent data
- `hrms.rates.read`: Billing rates visibility

### Audit Hash Chain

\`\`\`mermaid
graph LR
    A[Event 1]  B[Hash 1]
    B  C[Event 2]
    C  D[Hash 2]
    D  E[Event 3]
    E  F[Hash 3]
    
    B1[SHA-256] -.-> B
    D1[SHA-256] -.-> D
    F1[SHA-256] -.-> F
\`\`\`

**Hash Computation:**
\`\`\`typescript
hash = SHA256(prev_hash || action || entity || entity_id || diff || timestamp)
\`\`\`

**Verification:**
\`\`\`typescript
// Verify entire chain
const isValid = await verifyAuditChain(tenantId);
// Verify specific entry
const isValid = await verifyAuditEntry(auditId);
\`\`\`

---

## Data Architecture

### Schema Organization

\`\`\`mermaid
graph TB
    subgraph "Core Schemas"
        A[public]  A1[Marketing, Leads]
        B[app]  B1[Tenants, Users, Roles]
        C[bill]  C1[Plans, Subscriptions]
        D[sec]  D1[Audit, Hash Chain]
    end
    
    subgraph "Business Schemas"
        E[crm]  E1[Accounts, Opportunities]
        F[talent]  F1[Jobs, Candidates]
        G[hrms]  G1[Employees, Attendance]
        H[finance]  H1[AR, AP, Payroll]
        I[vms]  I1[Vendors, Submissions]
        J[lms]  J1[Courses, Enrollments]
        K[projects]  K1[Projects, Tasks]
        L[bench]  L1[Consultants, Allocation]
    end
    
    subgraph "Support Schemas"
        M[analytics]  M1[Dimensions, Facts]
        N[compliance]  N1[Frameworks, Controls]
        O[comp]  O1[Bands, Cycles]
        P[benefits]  P1[Plans, Enrollments]
    end
\`\`\`

### Entity Relationship Diagram (Core)

\`\`\`mermaid
erDiagram
    TENANTS ||--o{ TENANT_MEMBERS : has
    TENANTS ||--o{ FEATURE_FLAGS : has
    TENANTS ||--o{ SUBSCRIPTIONS : has
    USERS ||--o{ TENANT_MEMBERS : belongs
    TENANT_MEMBERS }o--|| ROLES : assigned
    ROLES ||--o{ ROLE_PERMISSIONS : has
    ROLE_PERMISSIONS }o--|| PERMISSIONS : grants
    SUBSCRIPTIONS }o--|| PLANS : subscribes
    
    TENANTS {
        uuid id PK
        string name
        string slug
        jsonb settings
        timestamp created_at
    }
    
    USERS {
        uuid id PK
        string email
        string name
        timestamp created_at
    }
    
    TENANT_MEMBERS {
        uuid id PK
        uuid tenant_id FK
        uuid user_id FK
        uuid role_id FK
        string status
    }
    
    ROLES {
        uuid id PK
        uuid tenant_id FK
        string name
        string type
    }
    
    FEATURE_FLAGS {
        uuid id PK
        uuid tenant_id FK
        string key
        boolean enabled
    }
\`\`\`

### Data Model Patterns

#### 1. Soft Deletes
\`\`\`sql
-- All tables include
deleted_at TIMESTAMP NULL,
deleted_by UUID REFERENCES app.users(id)

-- Queries automatically filter
WHERE deleted_at IS NULL
\`\`\`

#### 2. Audit Timestamps
\`\`\`sql
-- All tables include
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
created_by UUID REFERENCES app.users(id),
updated_by UUID REFERENCES app.users(id)

-- Trigger updates updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
\`\`\`

#### 3. Tenant Isolation
\`\`\`sql
-- All tenant tables include
tenant_id UUID NOT NULL REFERENCES app.tenants(id),

-- RLS policy
CREATE POLICY tenant_isolation ON table_name
  USING (tenant_id = app.current_tenant_id());
\`\`\`

#### 4. JSONB for Flexibility
\`\`\`sql
-- Settings, metadata, custom fields
settings JSONB DEFAULT '{}',
metadata JSONB DEFAULT '{}',
custom_fields JSONB DEFAULT '{}'

-- Indexed for performance
CREATE INDEX idx_settings_gin ON table_name USING GIN(settings);
\`\`\`

---

## AI & Automation

### AI Copilot Architecture

\`\`\`mermaid
graph TB
    A[User Prompt]  B[Planner]
    B  C[Tool Registry]
    C  D[Policy Check]
    D  E{Approved?}
    E |Yes| F[Execute Tools]
    E |No| G[Request Approval]
    G  H[Human Review]
    H  E
    F  I[Ledger Write]
    I  J[Response]
    
    C1[Server Actions] -.-> C
    C2[API Calls] -.-> C
    D1[DLP Rules] -.-> D
    D2[RBAC/FBAC] -.-> D
\`\`\`

**Copilot Flow:**
1. **Input**: User natural language prompt
2. **Planner**: LLM generates execution plan with tools
3. **Policy**: Check DLP rules, RBAC/FBAC permissions
4. **Execute**: Call server actions/APIs with parameters
5. **Ledger**: Write audit entry with hash chain
6. **Response**: Stream results to user

**Tool Registry:**
\`\`\`typescript
const tools = {
  'create_lead': createLeadAction,
  'search_candidates': searchCandidatesAction,
  'generate_report': generateReportAction,
  'draft_email': draftEmailAction,
  // ... 100+ tools
};
\`\`\`

### ML Insights

\`\`\`mermaid
graph LR
    A[Historical Data]  B[Feature Engineering]
    B  C[Model Training]
    C  D[Predictions]
    D  E[Explainability]
    E  F[UI Display]
    
    D1[Sales Forecast] -.-> D
    D2[Churn Risk] -.-> D
    D3[Anomaly Detection] -.-> D
    
    E1[SHAP Values] -.-> E
    E2[Feature Importance] -.-> E
\`\`\`

**Forecast Types:**
- **Sales Pipeline**: Weighted probability × deal value
- **Cashflow**: AR aging + AP schedule + payroll
- **Bench Utilization**: Historical patterns + pipeline
- **Attrition Risk**: Tenure, performance, engagement signals

**Explainability:**
- "Why?" hover shows top 3 contributing features
- SHAP values for model transparency
- No black-box decisions for critical actions

### Automation Orchestrator

\`\`\`mermaid
graph TB
    A[Trigger]  B{Condition Met?}
    B |Yes| C[Action]
    B |No| D[Skip]
    C  E{Human Checkpoint?}
    E |Yes| F[Request Approval]
    E |No| G[Execute]
    F  H[Approved?]
    H |Yes| G
    H |No| I[Cancel]
    G  J[Log Result]
    
    A1[Timer] -.-> A
    A2[Webhook] -.-> A
    A3[DB Event] -.-> A
    
    C1[Send Email] -.-> C
    C2[Create Task] -.-> C
    C3[Update Record] -.-> C
    C4[Call Webhook] -.-> C
\`\`\`

**Automation Examples:**
- **Lead Routing**: New lead → Territory match → Assign rep → Send notification
- **Invoice Dunning**: Invoice overdue → Wait 7 days → Send reminder → Escalate
- **Compliance Alerts**: I-9 expires in 30 days → Create task → Notify HR
- **Performance Reviews**: Cycle opens → Notify managers → Remind weekly → Close cycle

---

## Module Architecture

### Module Map

\`\`\`mermaid
graph TB
    subgraph "Tenant Modules"
        A[Dashboard]
        B[Directory]
        C[Users]
        D[Analytics]
        E[Configuration]
        F[Security]
        G[Access]
        H[Billing]
        I[Data]
        J[Integrations]
        K[Notifications]
    end
    
    subgraph "Business Modules"
        L[CRM]
        M[Talent/ATS]
        N[HRMS]
        O[Finance]
        P[VMS]
        Q[Training/LMS]
        R[Bench]
        S[Hotlist]
        T[Projects]
    end
    
    subgraph "Admin Modules"
        U[Admin Dashboard]
        V[Tenants]
        W[System Health]
        X[Marketplace]
        Y[Support]
        Z[Audit Logs]
    end
\`\`\`

### Module Structure Pattern

Every module follows this structure:

\`\`\`
/app/(dashboard)/{module}/
├── page.tsx                 # Main page (Server Component)
├── loading.tsx              # Loading skeleton
├── error.tsx                # Error boundary
├── actions.ts               # Server actions
└── [submodule]/
    ├── page.tsx
    └── actions.ts

/components/{module}/
├── {module}-management.tsx  # Main component
├── {module}-table.tsx       # Data table
├── {module}-form.tsx        # Create/edit form
└── {module}-filters.tsx     # Filter controls

/lib/{module}/
├── {module}.ts              # Business logic
├── types.ts                 # TypeScript types
└── utils.ts                 # Helper functions
\`\`\`

### CRM Module Architecture

\`\`\`mermaid
graph TB
    subgraph "CRM Pages"
        A[Dashboard]
        B[Leads]
        C[Contacts]
        D[Engagement]
        E[Pipeline]
        F[Documents]
        G[Calendar]
        H[Analytics]
        I[Reports]
        J[AI Assistant]
        K[Settings]
    end
    
    subgraph "CRM Data"
        L[(Accounts)]
        M[(Contacts)]
        N[(Leads)]
        O[(Opportunities)]
        P[(Activities)]
        Q[(Products)]
        R[(Quotes)]
    end
    
    A  L
    B  N
    C  M
    E  O
    F  R
    G  P
\`\`\`

**Key Workflows:**
- Lead → MQL → SQL → Opportunity → Won/Lost
- Engagement sequences with email/SMS/calls
- Quote generation with e-signature
- Pipeline forecasting with AI

### HRMS Module Architecture

\`\`\`mermaid
graph TB
    subgraph "HRMS Pages"
        A[Dashboard]
        B[Employees]
        C[Assignments]
        D[Attendance]
        E[Timesheets]
        F[Invoices]
        G[AP]
        H[Immigration]
        I[I-9]
        J[Documents]
        K[Onboarding]
        L[Offboarding]
        M[Help Desk]
        N[Performance]
        O[Compensation]
        P[Analytics]
        Q[Compliance]
        R[Benefits]
    end
    
    subgraph "HRMS Data"
        S[(Employees)]
        T[(Assignments)]
        U[(Attendance)]
        V[(Timesheets)]
        W[(Compensation)]
        X[(Performance)]
        Y[(Benefits)]
        Z[(Documents)]
    end
    
    A  S
    B  S
    C  T
    D  U
    E  V
    N  X
    O  W
    R  Y
\`\`\`

**Key Workflows:**
- New hire → Onboarding → Provisioning
- Timesheets → Approvals → Payroll/AP
- Performance cycle → Reviews → Compensation
- Benefits enrollment → Payroll deductions → EDI 834

### Finance Module Architecture

\`\`\`mermaid
graph TB
    subgraph "Finance Pages"
        A[Dashboard]
        B[AR]
        C[AP]
        D[Pay-on-Pay]
        E[Payroll]
        F[Budgeting]
        G[Forecasting]
        H[Expenses]
        I[Revenue]
        J[Reports]
        K[Analytics]
        L[GL]
        M[Tax]
    end
    
    subgraph "Finance Data"
        N[(Invoices)]
        O[(Bills)]
        P[(Payments)]
        Q[(Expenses)]
        R[(Payroll)]
        S[(GL Entries)]
        T[(Tax Records)]
    end
    
    A  N
    B  N
    C  O
    D  P
    E  R
    L  S
    M  T
\`\`\`

**Key Workflows:**
- Timesheets → Invoice → Payment → Revenue recognition
- Bill → Approval → Payment → Expense
- Pay-on-pay reconciliation
- Month-end close with GL entries

---

## Data Flows

### Lead → Demo → Tenant → Subscription

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Marketing
    participant LeadAPI
    participant DemoAPI
    participant OnboardingAPI
    participant BillingAPI
    participant Webhook
    participant TenantDB
    
    User->>Marketing: Fill demo form
    Marketing->>LeadAPI: POST /api/leads
    LeadAPI->>TenantDB: Insert into public.leads
    LeadAPI->>User: Confirmation email
    
    User->>DemoAPI: Book demo slot
    DemoAPI->>TenantDB: Insert into public.demo_bookings
    DemoAPI->>User: Calendar invite
    
    User->>OnboardingAPI: Magic link /onboarding/start
    OnboardingAPI->>TenantDB: Create app.tenants
    OnboardingAPI->>TenantDB: Create app.tenant_members
    OnboardingAPI->>User: Redirect to /billing/checkout
    
    User->>BillingAPI: Choose plan
    BillingAPI->>Stripe: Create checkout session
    Stripe->>User: Payment page
    User->>Stripe: Complete payment
    
    Stripe->>Webhook: POST /api/webhooks/stripe
    Webhook->>TenantDB: Create bill.subscriptions
    Webhook->>TenantDB: Update app.feature_flags
    Webhook->>TenantDB: Write sec.audit_log
    Webhook->>User: Redirect to /app/dashboard
\`\`\`

### Audit Hash Chain Flow

\`\`\`mermaid
sequenceDiagram
    participant Action
    participant AuditLog
    participant Database
    participant Ledger
    
    Action->>AuditLog: Write audit entry
    AuditLog->>Database: Get prev_hash
    Database->>AuditLog: Return prev_hash
    AuditLog->>AuditLog: Compute hash = SHA256(prev_hash || data)
    AuditLog->>Database: Insert with hash
    AuditLog->>Ledger: Notarize (optional)
    Ledger->>Database: Store proof
\`\`\`

### Integration Sync Flow

\`\`\`mermaid
sequenceDiagram
    participant Scheduler
    participant SyncJob
    participant Connector
    participant ExternalAPI
    participant Mapper
    participant Database
    participant AuditLog
    
    Scheduler->>SyncJob: Trigger sync
    SyncJob->>Database: Create app.sync_jobs
    SyncJob->>Connector: Fetch data
    Connector->>ExternalAPI: API call
    ExternalAPI->>Connector: Return data
    Connector->>Mapper: Transform data
    Mapper->>Database: Upsert records
    Database->>AuditLog: Write audit entries
    SyncJob->>Database: Update app.sync_jobs (success)
\`\`\`

---

## Integration Architecture

### Integration Hub

\`\`\`mermaid
graph TB
    subgraph "Nino360"
        A[Integration Hub]
        B[Connector Registry]
        C[Mapping Engine]
        D[Scheduler]
        E[Sync Jobs]
        F[Logs]
    end
    
    subgraph "External Systems"
        G[ATS Providers]
        H[Payroll Providers]
        I[Accounting Systems]
        J[CRM Systems]
        K[Email/Calendar]
        L[Background Checks]
    end
    
    A  B
    B  C
    C  D
    D  E
    E  F
    
    E  G
    E  H
    E  I
    E  J
    E  K
    E  L
\`\`\`

**Connector Types:**
- **Pull**: Fetch data from external API (scheduled)
- **Push**: Send data to external API (event-driven)
- **Webhook**: Receive data from external system (real-time)
- **Bidirectional**: Two-way sync with conflict resolution

**AI-Powered Mapping:**
- Auto-detect field mappings from schema
- Suggest transformations (date formats, enums)
- Learn from user corrections

### Webhook Architecture

\`\`\`mermaid
graph LR
    A[External System]  B[Webhook Endpoint]
    B  C{Verify Signature}
    C |Valid| D[Parse Payload]
    C |Invalid| E[Reject]
    D  F[Idempotency Check]
    F  G{Processed?}
    G |No| H[Process Event]
    G |Yes| I[Return 200]
    H  J[Update Database]
    J  K[Trigger Automation]
    K  I
\`\`\`

**Webhook Security:**
- HMAC signature verification
- Replay attack prevention (timestamp check)
- Idempotency keys for deduplication
- Rate limiting per source

---

## Non-Functional Requirements

### Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to Interactive (TTI)** | < 1.5s (90th pct) | Vercel Analytics |
| **First Contentful Paint (FCP)** | < 1.0s (90th pct) | Web Vitals |
| **API Response Time** | < 200ms (95th pct) | Server logs |
| **Database Query Time** | < 50ms (95th pct) | Supabase metrics |
| **Page Load Time** | < 2.0s (90th pct) | Vercel Analytics |

**Optimization Strategies:**
- Server Components for zero JS by default
- Streaming for progressive rendering
- Edge caching for static content
- Database indexes on all foreign keys
- Connection pooling (PgBouncer)
- Lazy loading for heavy components

### Reliability

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Uptime** | 99.9% | Uptime monitoring |
| **Error Rate** | < 0.1% | Error tracking |
| **Data Durability** | 99.999999999% | Supabase SLA |
| **Backup Frequency** | Daily | Automated backups |
| **Recovery Time Objective (RTO)** | < 4 hours | Disaster recovery plan |
| **Recovery Point Objective (RPO)** | < 1 hour | Point-in-time recovery |

**Reliability Measures:**
- Idempotent operations (retry-safe)
- Dead Letter Queue (DLQ) for failed jobs
- Circuit breakers for external APIs
- Graceful degradation (feature flags)
- Automated health checks

### Security

| Requirement | Implementation |
|-------------|----------------|
| **Data Encryption at Rest** | Supabase default (AES-256) |
| **Data Encryption in Transit** | TLS 1.3 |
| **Authentication** | Supabase Auth (bcrypt, JWT) |
| **Session Management** | HTTP-only cookies, 7-day expiry |
| **Password Policy** | Min 8 chars, complexity rules |
| **Rate Limiting** | 100 req/min per IP (Vercel) |
| **SQL Injection Prevention** | Parameterized queries, RLS |
| **XSS Prevention** | React escaping, CSP headers |
| **CSRF Prevention** | SameSite cookies, CSRF tokens |
| **Audit Logging** | All critical actions logged |

### Scalability

| Dimension | Current | Target (12 months) |
|-----------|---------|-------------------|
| **Tenants** | 100 | 10,000 |
| **Users per Tenant** | 1,000 | 10,000 |
| **Records per Tenant** | 1M | 100M |
| **Concurrent Users** | 1,000 | 100,000 |
| **API Requests/sec** | 100 | 10,000 |
| **Database Size** | 10 GB | 1 TB |

**Scaling Strategy:**
1. **Vertical**: Upgrade Supabase plan (CPU, RAM, storage)
2. **Horizontal**: Read replicas for analytics queries
3. **Caching**: Redis for hot data, CDN for static assets
4. **Partitioning**: Partition large tables by tenant_id
5. **Archiving**: Move old data to cold storage
6. **Sharding**: Multi-region deployment (future)

### Compliance

| Standard | Status | Evidence |
|----------|--------|----------|
| **GDPR** | Compliant | Data export, erasure, consent |
| **SOC 2 Type II** | In Progress | Audit controls, evidence packs |
| **ISO 27001** | Planned | Control mappings, policies |
| **HIPAA** | Not Applicable | No PHI stored |
| **PCI DSS** | Delegated | Stripe handles card data |

**Compliance Features:**
- Data Subject Access Requests (DSAR)
- Right to erasure (soft deletes)
- Consent management (policy acknowledgments)
- Data retention policies
- Audit trail with hash chain
- Evidence pack builder with notarization

---

## DevEx, CI/CD & Testing

### Repository Structure

\`\`\`
nino360/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Public pages
│   ├── (dashboard)/          # Authenticated pages
│   │   ├── tenant/           # Tenant management
│   │   ├── admin/            # Admin backoffice
│   │   ├── crm/              # CRM module
│   │   ├── hrms/             # HRMS module
│   │   └── ...               # Other modules
│   └── api/                  # API routes
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── tenant/               # Tenant components
│   ├── crm/                  # CRM components
│   └── ...                   # Other module components
├── lib/                      # Shared utilities
│   ├── supabase/             # Supabase clients
│   ├── ai/                   # AI utilities
│   ├── auth/                 # Auth helpers
│   ├── rbac.ts               # RBAC utilities
│   ├── fbac.ts               # FBAC utilities
│   ├── hash.ts               # Audit hash chain
│   └── ...                   # Other utilities
├── scripts/                  # Database migrations
│   ├── 00-master-setup.sql
│   ├── 01-create-tables.sql
│   └── phase-*.sql           # Phase migrations
├── docs/                     # Documentation
├── tests/                    # Test suites
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # Playwright E2E tests
└── .github/workflows/        # CI/CD pipelines
\`\`\`

### CI/CD Pipeline

\`\`\`mermaid
graph LR
    A[Push to GitHub]  B[GitHub Actions]
    B  C[Typecheck]
    B  D[Lint]
    B  E[Unit Tests]
    B  F[Build]
    C  G{All Pass?}
    D  G
    E  G
    F  G
    G |Yes| H[Deploy to Vercel Preview]
    G |No| I[Fail Build]
    H  J[Run E2E Tests]
    J  K{Tests Pass?}
    K |Yes| L[Ready for Production]
    K |No| M[Notify Team]
    L  N[Manual Promotion]
    N  O[Deploy to Production]
\`\`\`

**CI/CD Steps:**
1. **Typecheck**: `tsc --noEmit`
2. **Lint**: `eslint . --max-warnings 0`
3. **Unit Tests**: `vitest run`
4. **Build**: `next build`
5. **Deploy Preview**: Vercel automatic preview
6. **E2E Tests**: Playwright on preview URL
7. **Production Deploy**: Manual promotion from Vercel dashboard

### Testing Strategy

\`\`\`mermaid
graph TB
    A[Testing Pyramid]
    A  B[E2E Tests - 10%]
    A  C[Integration Tests - 30%]
    A  D[Unit Tests - 60%]
    
    B1[Critical User Flows] -.-> B
    C1[Server Actions, API Routes] -.-> C
    D1[Utilities, Helpers] -.-> D
\`\`\`

**Test Coverage:**
- **Unit Tests**: Utilities, helpers, pure functions (60% of tests)
- **Integration Tests**: Server actions, API routes, database queries (30%)
- **E2E Tests**: Critical user flows (lead→tenant, login, billing) (10%)

**E2E Test Examples:**
- Lead submission → Demo booking → Onboarding → Billing
- Login → Tenant switch → Create record → Logout
- Admin → Create tenant → Assign plan → Verify features

---

## Deployment Architecture

### Production Environment

\`\`\`mermaid
graph TB
    subgraph "Vercel Edge Network"
        A[CDN]
        B[Edge Functions]
        C[Edge Middleware]
    end
    
    subgraph "Vercel Serverless"
        D[Next.js App]
        E[API Routes]
        F[Server Actions]
    end
    
    subgraph "Supabase"
        G[PostgreSQL]
        H[Auth]
        I[Storage]
        J[Edge Functions]
    end
    
    subgraph "External Services"
        K[Stripe]
        L[Upstash Redis]
        M[Email Service]
        N[AI Providers]
    end
    
    A  C
    C  D
    D  F
    E  G
    F  G
    D  H
    D  I
    G  J
    F  K
    F  L
    F  M
    F  N
\`\`\`

### Infrastructure Components

| Component | Provider | Purpose |
|-----------|----------|---------|
| **Web Hosting** | Vercel | Next.js app, serverless functions |
| **Edge Network** | Vercel Edge | CDN, edge middleware, caching |
| **Database** | Supabase | PostgreSQL with RLS |
| **Authentication** | Supabase Auth | User auth, sessions |
| **Storage** | Supabase Storage | File uploads, documents |
| **Cache** | Upstash Redis | Session store, rate limiting |
| **Payments** | Stripe | Subscriptions, invoicing |
| **Email** | Resend/SendGrid | Transactional emails |
| **AI** | OpenAI | GPT-4 for Copilot |
| **Monitoring** | Vercel Analytics | Web Vitals, custom metrics |

### Environment Configuration

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Upstash Redis
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=xxx

# AI
OPENAI_API_KEY=sk-xxx

# Email
RESEND_API_KEY=re_xxx

# App
NEXT_PUBLIC_APP_URL=https://app.nino360.com
NEXT_PUBLIC_MARKETING_URL=https://nino360.com
\`\`\`

### Deployment Regions

\`\`\`mermaid
graph TB
    A[Global Users]
    A  B[Vercel Edge - Global]
    B  C[Vercel Serverless - US East]
    C  D[Supabase - US East]
    
    A  E[Vercel Edge - Europe]
    E  F[Vercel Serverless - Europe]
    F  G[Supabase - Europe Future]
\`\`\`

**Current**: Single region (US East)  
**Future**: Multi-region with data residency per tenant

---

## Scalability & Future Path

### Current Capacity

- **Tenants**: 1,000+
- **Users per Tenant**: 10,000+
- **Records per Tenant**: 10M+
- **Concurrent Users**: 10,000+
- **API Requests/sec**: 1,000+

### Scaling Roadmap

#### Phase 1: Vertical Scaling (0-12 months)
- Upgrade Supabase plan (more CPU, RAM, storage)
- Optimize database queries and indexes
- Implement aggressive caching (Redis, CDN)
- Add read replicas for analytics

#### Phase 2: Horizontal Scaling (12-24 months)
- Multi-region deployment (US, EU, APAC)
- Database sharding by tenant_id
- Separate analytics database (ClickHouse)
- Queue/worker layer (QStash, Cloud Tasks)

#### Phase 3: Microservices (24+ months)
- Extract heavy workloads (AI, reporting) to microservices
- Event-driven architecture with message bus (Kafka, NATS)
- Feature store for ML models
- GraphQL API layer for flexibility

### Future Enhancements

\`\`\`mermaid
graph TB
    A[Current Architecture]
    A  B[Multi-Region]
    A  C[Microservices]
    A  D[Event Bus]
    A  E[ML Pipeline]
    A  F[Mobile Apps]
    A  G[GraphQL API]
    
    B  H[Data Residency]
    C  I[Independent Scaling]
    D  J[Async Processing]
    E  K[Real-time Predictions]
    F  L[Native iOS/Android]
    G  M[Flexible Queries]
\`\`\`

---

## Acceptance Criteria

### Definition of Ready (Every Page)

- [ ] **Server Actions**: All mutations via server actions with RLS
- [ ] **RBAC/FBAC Guards**: Permission checks before operations
- [ ] **Audit Logging**: Critical actions logged with hash chain
- [ ] **Loading States**: Skeleton loaders for async operations
- [ ] **Error States**: Error boundaries with user-friendly messages
- [ ] **Empty States**: Helpful messages with CTAs
- [ ] **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- [ ] **Responsive Design**: Mobile, tablet, desktop layouts
- [ ] **Smoke Tests**: Playwright tests for critical paths

### Critical Flows (Must Work)

- [ ] **Lead → Tenant → Billing**: End-to-end onboarding
- [ ] **Login → Tenant Switch → CRUD**: Basic tenant operations
- [ ] **Connector → Map → Sync**: Integration setup and sync
- [ ] **Docs Ingest → RAG Search**: Document Q&A
- [ ] **Audit Verify**: Hash chain verification

### Performance Benchmarks

- [ ] **TTI < 1.5s**: Time to Interactive (90th percentile)
- [ ] **FCP < 1.0s**: First Contentful Paint (90th percentile)
- [ ] **API < 200ms**: API response time (95th percentile)
- [ ] **DB Query < 50ms**: Database query time (95th percentile)

### Security Checklist

- [ ] **RLS Enabled**: All tenant tables have RLS policies
- [ ] **RBAC Enforced**: Permission checks in all server actions
- [ ] **FBAC Gated**: Feature flags control access
- [ ] **PII Masked**: Sensitive fields masked by default
- [ ] **Audit Logged**: Critical actions in hash-chained log
- [ ] **Input Validated**: Zod schemas for all inputs
- [ ] **HTTPS Only**: No insecure connections
- [ ] **Secrets Secure**: No secrets in code or logs

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| **RLS** | Row-Level Security - PostgreSQL feature for tenant isolation |
| **RBAC** | Role-Based Access Control - Permissions via roles |
| **FBAC** | Feature-Based Access Control - Runtime feature flags |
| **DLP** | Data Loss Prevention - PII redaction policies |
| **SSO** | Single Sign-On - SAML/OIDC authentication |
| **JIT** | Just-In-Time - Provisioning users on first login |
| **DSAR** | Data Subject Access Request - GDPR right to access |
| **TTI** | Time to Interactive - Performance metric |
| **FCP** | First Contentful Paint - Performance metric |
| **RTO** | Recovery Time Objective - Disaster recovery metric |
| **RPO** | Recovery Point Objective - Data loss tolerance |

### References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GDPR Compliance](https://gdpr.eu/)
- [SOC 2 Framework](https://www.aicpa.org/soc)

---

**Document Version:** 2.0  
**Last Updated:** January 2025  
**Maintained By:** Nino360 Engineering Team  
**Next Review:** April 2025
