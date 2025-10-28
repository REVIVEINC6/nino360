Prompt: Nino360 — End-to-End Journey (Lead → Demo → Tenant → Subscription → Payment → Access) — 100% Production

Brand & Theme
- Primary gradient (logo): #4F46E5 → #6D28D9 → #8B5CF6 → #A855F7
- Accents: Lime #D0FF00, Neon Pink #F81CE5
- Style: Glassmorphism, neon gradients, subtle particle backdrop, Framer Motion micro-interactions
- Fonts: Clash Display (H1/H2) + Plus Jakarta Sans (UI)
- Dark mode default; WCAG 2.2 AA, focus rings, keyboard nav

Tech Stack
- Next.js 14 (App Router, TypeScript), TailwindCSS, shadcn/ui, Framer Motion, Recharts
- Supabase (Auth, Postgres, RLS, Storage), Edge Functions
- Payments (env-toggle): Stripe **or** Razorpay  → PAYMENT_PROVIDER=stripe|razorpay
- AI: “Ask Nino” Copilot (prompt→action demo, policy-aware) — pgvector placeholder
- Trust: SHA-256 hash-chained audit for critical events

────────────────────────────────────────────────────────────────────────
# 0) Project Layout (Files)

app/(marketing)/{page.tsx,pricing/page.tsx,demo/page.tsx,legal/{terms,privacy}/page.tsx}
app/(onboarding)/onboarding/start/page.tsx
app/(auth)/{login,signup,verify-otp}/page.tsx
app/(invite)/invite/accept/page.tsx
app/(tenant)/t/[slug]/{getting-started,admin/{users,roles,branding,billing,integrations,feature-flags,audit}}/page.tsx
app/(app)/{dashboard,page.tsx}
app/(app)/profile/page.tsx
app/(billing)/{page.tsx,checkout/page.tsx,portal/page.tsx}

api routes (app/api/*):
- /api/leads/route.ts
- /api/demo/book/route.ts
- /api/tenants/create/route.ts
- /api/admin/invite/route.ts
- /api/billing/checkout/route.ts
- /api/webhooks/stripe/route.ts
- /api/webhooks/razorpay/route.ts
- /api/audit/verify/route.ts

components/*
- LeadForm, Scheduler, SuccessModal, PricingTable, PlanBadge
- TenantWizard, CheckoutButton, BillingPortal, InvoiceList
- AdminUsersTable, RoleMatrix, FeatureFlagGrid, ProfileForm
- AuditTable, HashVerify, AutomationBuilder, CopilotConsole
- GettingStartedChecklist, Topbar, Sidebar

lib/*
- supabaseServer.ts, payments.ts (stripe|razorpay), hash.ts (sha256 + chain)
- rbac.ts (role & feature checks), pricing.ts, email.ts (stubs)
- validators.ts (zod schemas), env.ts (safe env loader)

styles/globals.css  (glass + neon utilities)
public/* (logo, particles, og)

────────────────────────────────────────────────────────────────────────
# 1) Database (SQL Migrations) — Supabase

-- SCHEMAS
create schema if not exists public;   -- leads + demo live in public
create schema if not exists app;      -- tenants, members, roles, perms, features, audit
create schema if not exists bill;     -- plans, subscriptions, invoices

-- PUBLIC: LEADS & DEMO
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  name text not null,
  work_email text unique not null,
  company text not null,
  size text,
  industry text,
  phone text,
  utm jsonb default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','qualified','demo_scheduled','converted')),
  assigned_to uuid
);

create table if not exists public.demo_bookings (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  calendar_ref text,
  status text not null default 'scheduled' check (status in ('scheduled','completed','no_show'))
);

-- APP: CORE MULTI-TENANCY + RBAC + FBAC
create table if not exists app.tenants (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  name text not null,
  slug text unique not null,
  region text,
  timezone text,
  status text default 'active' check (status in ('active','trial','suspended'))
);

create table if not exists app.user_profiles (
  user_id uuid primary key,
  full_name text,
  avatar_url text,
  phone text,
  title text,
  locale text default 'en',
  last_login_at timestamptz
);

create table if not exists app.tenant_members (
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('tenant_admin','manager','member')),
  status text not null default 'active' check (status in ('active','invited')),
  created_at timestamptz default now(),
  primary key (tenant_id, user_id)
);

create table if not exists app.roles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  key text not null,
  name text not null,
  description text,
  unique(tenant_id, key)
);

create table if not exists app.permissions (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  description text
);

create table if not exists app.role_permissions (
  role_id uuid not null references app.roles(id) on delete cascade,
  permission_key text not null references app.permissions(key) on delete cascade,
  primary key (role_id, permission_key)
);

create table if not exists app.feature_flags (
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  key text not null,
  enabled boolean not null default true,
  primary key (tenant_id, key)
);

-- AUDIT (hash chain)
create table if not exists app.audit_log (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid,
  actor_user_id uuid,
  action text not null,
  entity text,
  entity_id text,
  diff jsonb default '{}'::jsonb,
  prev_hash text,
  hash text,
  created_at timestamptz default now()
);

-- BILLING: PLANS, SUBSCRIPTIONS, INVOICES
create table if not exists bill.plans (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null check (code in ('free','pro','enterprise')),
  name text not null,
  price_month numeric(10,2) default 0,
  price_year numeric(10,2) default 0,
  currency text default 'USD',
  features jsonb default '{}'::jsonb,
  limits jsonb default '{}'::jsonb
);

create table if not exists bill.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  plan_code text not null references bill.plans(code),
  interval text not null check (interval in ('month','year')),
  status text not null default 'trial' check (status in ('trial','active','past_due','canceled')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  provider text check (provider in ('stripe','razorpay')),
  provider_sub_id text,
  trial_end timestamptz
);

create table if not exists bill.invoices (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references app.tenants(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  status text not null check (status in ('draft','open','paid','uncollectible','void')),
  provider_invoice_id text,
  hosted_url text,
  due_date date,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- RLS (tenant scope)
alter table app.tenants enable row level security;
alter table app.tenant_members enable row level security;
alter table app.roles enable row level security;
alter table app.role_permissions enable row level security;
alter table app.feature_flags enable row level security;
alter table app.audit_log enable row level security;
alter table bill.subscriptions enable row level security;
alter table bill.invoices enable row level security;

-- Policies
create or replace function app.current_tenant_id() returns uuid
language sql stable as $$ select nullif(current_setting('request.jwt.claims', true)::json->>'tenant_id','')::uuid $$;

create policy tenant_read on app.tenants for select using (id = app.current_tenant_id());
create policy tm_read on app.tenant_members for select using (tenant_id = app.current_tenant_id());
create policy tm_write on app.tenant_members for all using (
  tenant_id = app.current_tenant_id()
  and exists (
    select 1 from app.tenant_members m
    where m.tenant_id = app.current_tenant_id() and m.user_id = auth.uid() and m.role in ('tenant_admin','manager')
  )
);
-- Repeat analogous read/write policies for roles, role_permissions, feature_flags, audit_log
create policy sub_read on bill.subscriptions for select using (tenant_id = app.current_tenant_id());
create policy inv_read on bill.invoices for select using (tenant_id = app.current_tenant_id());

-- Seeds
insert into bill.plans (code,name,price_month,price_year,currency,features,limits)
values
('free','Free',0,0,'USD','{"modules":["analytics-lite"]}','{}') on conflict (code) do nothing,
('pro','Pro',49,490,'USD','{"modules":["crm","talent","hrms","finance","automation","trust"]}','{}') on conflict (code) do nothing,
('enterprise','Enterprise',0,0,'USD','{"modules":["all"],"sso":true,"saml":true,"sla":"24x7"}','{}') on conflict (code) do nothing;

────────────────────────────────────────────────────────────────────────
# 2) Auth & Profiles

- Use Supabase Auth with Email OTP (password optional) + invite tokens.
- Tables: app.user_profiles (above). Update last_login_at post-auth.
- Pages: /login, /signup, /verify-otp, /invite/accept

States & Guardrails
- Rate limit OTP, lockout after N attempts, resend with cooldown.
- Minimal PII in user_profiles.

────────────────────────────────────────────────────────────────────────
# 3) Public Site & Lead Capture (UI + APIs)

Pages:
- /(marketing) Landing (hero, modules, trust, CTA)
- /demo (Lead → Demo booking)
- /pricing (plans table, region-aware currency)
- /legal/{terms,privacy}

Components:
- LeadForm (name, work_email, company, size, industry, phone opt)
- Scheduler (slot picker, Cal/Google placeholder)
- SuccessModal (confirmation + ICS download)

APIs:
- POST /api/leads → create/update lead (status='new'); rate-limited
- POST /api/demo/book → create demo_bookings, set lead.status='demo_scheduled'
- Copilot quick actions (UI only): “Qualify lead”, “Schedule demo”, “Send deck” → toasts/log

Automation:
- On new lead → email stub + assign_to (round-robin placeholder)

────────────────────────────────────────────────────────────────────────
# 4) Demo → Tenant Creation Wizard

Page:
- /onboarding/start?lead=... (magic link from demo)

Wizard Steps:
1) Company Profile: company_name, domain, region, timezone
2) Tenant Handle: tenant_slug (validate DNS safe) → will create https://app.nino360.com/t/{slug}
3) Admin User: full_name, work_email (prefill from lead), role=tenant_admin, OTP/SSO placeholder
4) Plan Select: Free/Pro/Enterprise (monthly/yearly)
5) Review & Create → POST /api/tenants/create

Server Action / API:
- /api/tenants/create
  • Create app.tenants row
  • Add app.tenant_members (admin)
  • Seed roles (tenant_admin, manager, member)
  • Seed minimal permissions
  • Seed feature_flags from plan
  • Compute hash chain and insert app.audit_log (prev_hash→hash)
  • If plan != free → redirect to /billing/checkout?plan=...; else → /t/{slug}/getting-started

RLS:
- All tenant tables enforce auth.uid() ∈ app.tenant_members for that tenant_id

────────────────────────────────────────────────────────────────────────
# 5) Subscription & Billing

Pages:
- /billing (portal)
- /billing/checkout?plan=pro&interval=month
- /billing/portal (manage card, see invoices)

Plan Model (bill.plans) already seeded.

APIs:
- POST /api/billing/checkout
  • If PAYMENT_PROVIDER=stripe → create Stripe Checkout session
  • If razorpay → create Razorpay order; return order_id + key_id
  • success_url → /billing/portal
  • On return, show status and next steps

Webhooks (Edge/API):
- /api/webhooks/stripe
- /api/webhooks/razorpay
  • Verify signature
  • Handle: subscription.created|updated|deleted; invoice.paid|payment_failed
  • Upsert bill.subscriptions & bill.invoices
  • For paid/active: enable features, set status='active'
  • Append app.audit_log with SHA-256 chain (action='subscription_updated'|'invoice_paid')

payments.ts (helpers):
- getProvider() by env
- createCheckoutSession(), createRazorpayOrder()
- verifyWebhook(req)

Grace & Access:
- On past_due|canceled → set banner in app + grace period (configurable), gate features via feature_flags

────────────────────────────────────────────────────────────────────────
# 6) Tenant Provisioning & First-Run

Edge Function (or server action):
- seedTenant(tenant_id, plan_code, withSamples:boolean)
  • Create sample pipelines/opportunity, HRMS/Finance placeholders (optional)
  • Feature flags from plan.features

Page:
- /t/{slug}/getting-started checklist:
  • Invite team
  • Connect email/calendar
  • Configure branding
  • Import CSV (contacts/candidates)
  • Choose modules
  • Create first pipeline/opportunity

Emails (stubs):
- Lead received / Demo booked (ICS)
- Tenant created (admin invite link)
- Payment receipt & invoice link
- Past-due reminder & portal link
- User invite acceptance

────────────────────────────────────────────────────────────────────────
# 7) In-App Admin & Profile

Pages:
- /app/profile  → ProfileForm (name, avatar, phone, title, locale, device mgmt)
- /t/{tenant}/admin
  • Users (invite, roles, deactivate) → AdminUsersTable
  • Roles & Permissions → RoleMatrix
  • Branding → logo/color/subdomain
  • Billing → plan, invoices (InvoiceList), payment method (CheckoutButton portal)
  • Integrations → email, calendar, storage
  • Feature Flags → FeatureFlagGrid
  • Audit & AI Logs → AuditTable + filters + CSV export

RBAC/FBAC:
- role_permissions join to check component & API access
- Components hide/disable when gated

────────────────────────────────────────────────────────────────────────
# 8) Intelligence, Automation, Trust (UI + Hooks)

- CopilotConsole (floating): prompt → simulate pipeline “Planner → Tools → Policy/DLP → Execute → Ledger Hash”
- AutomationBuilder: low-code triggers/conditions/actions (simulate run & status timeline)
- ML surfacing: inline chips on dashboard cards (“Churn risk ↑”, “Cashflow buffer 14%”)
- Blockchain Trust:
  • HashVerify widget (paste event hash → simulate verify)
  • app.audit_log: calculate hash = sha256(prev_hash || action || entity || entity_id || diff || timestamp)

api/audit/verify:
- POST {hash} → look up in audit_log and return found/attested boolean (mock if no anchor)

────────────────────────────────────────────────────────────────────────
# 9) Navigation & Access

Public:
- /, /demo, /pricing, /login, /signup, /legal/*

Onboarding:
- /onboarding/start, /verify-otp

Tenant:
- /t/{slug}/getting-started, /t/{slug}/admin/*
- /app/dashboard, /app/profile, /billing/*

Guards:
- If not authenticated → send to /login
- If no active membership for tenant → 404 or request access
- If subscription not active (and plan != free) → show billing banner & gated features

────────────────────────────────────────────────────────────────────────
# 10) Components to Implement

LeadForm, Scheduler, SuccessModal, PricingTable, PlanBadge
TenantWizard, CheckoutButton (provider-aware), BillingPortal, InvoiceList
AdminUsersTable, RoleMatrix, FeatureFlagGrid, ProfileForm
AuditTable, HashVerify, AutomationBuilder, CopilotConsole
GettingStartedChecklist, Topbar, Sidebar

UI micro-copy:
- “Policy-aware Copilot respects RBAC/RLS & DLP.”
- “Events are tamper-evident via hash-chained audit.”

────────────────────────────────────────────────────────────────────────
# 11) API Contracts (summarized)

POST /api/leads
  body: {name, work_email, company, size?, industry?, phone?, utm?}
  result: {id, status:'new'}

POST /api/demo/book
  body: {lead_id, starts_at, ends_at}
  result: {id, status:'scheduled'}

POST /api/tenants/create
  body: {name, slug, region, timezone, admin_email, admin_name, plan_code, interval}
  side-effects: create tenant, member, seed roles/perms/features, audit chain
  result: {tenant_id, slug, next:'/billing/checkout?plan=...'|'/t/{slug}/getting-started'}

POST /api/admin/invite
  body: {tenant_id, email, role}
  result: {status:'invited'} (email stub)

POST /api/billing/checkout
  body: {tenant_id, plan_code, interval}
  result (stripe): {url} | (razorpay): {order_id, key_id, amount, currency}

POST /api/webhooks/stripe | /api/webhooks/razorpay
  body: provider payload; verify signature
  result: 200; upsert subscriptions/invoices; audit chain append

POST /api/audit/verify
  body: {hash}
  result: {found:boolean, record?}

────────────────────────────────────────────────────────────────────────
# 12) Hash Chain Logic (hash.ts)

- prev = (select hash from app.audit_log where tenant_id=? order by created_at desc limit 1)
- curr = hex(sha256(prev || action || entity || entity_id || coalesce(diff::text,'') || coalesce(created_at::text,'')))
- Store prev_hash, hash on insert

Log events:
- lead_created, demo_booked
- tenant_created, admin_invited
- subscription_updated, invoice_paid
- feature_flags_provisioned, access_granted

────────────────────────────────────────────────────────────────────────
# 13) Payments: Provider Switch

env:
PAYMENT_PROVIDER=stripe|razorpay

If stripe:
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
If razorpay:
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET

Mock Mode:
- If keys missing → simulate success on checkout; webhook routes accept “test” payloads

────────────────────────────────────────────────────────────────────────
# 14) RLS & Security Summary

- All app.* and bill.* tables have tenant_id and RLS:
  • SELECT/INSERT/UPDATE require active membership (tenant_members) for that tenant
  • Admin operations further checked by role in ('tenant_admin','manager') where relevant
- public.* tables (leads, demo_bookings) are open to insert via anon API with rate limiting; no PII reads exposed
- Webhooks validate signatures; secrets stored in env (never exposed to client)
- Rate-limit lead submit, login/OTP, and webhook endpoints

────────────────────────────────────────────────────────────────────────
# 15) UI/UX Requirements

- Topbar: tenant switcher, Cmd/Ctrl+K global search, date range filter, notifications, user menu
- Sidebar: modules + settings
- Animations: Framer Motion on enter/hover, respects prefers-reduced-motion
- Glass panels (backdrop-blur-xl, border-white/10), neon borders (brand tokens)
- Recharts for simple KPIs in dashboard starter
- CopilotConsole simulates steps with chips: Planner → Tools → Policy/DLP → Execute → Ledger Hash

────────────────────────────────────────────────────────────────────────
# 16) Seeds & Fixtures

- Plans: Free ($0), Pro ($49/mo), Enterprise (contact)
- Sample tenant: acme (US, America/New_York)
- Sample users: admin@acme.com (tenant_admin), ops@acme.com (manager)
- Sample lead: “Acme Corp” → demo slot T+3d 10:00

────────────────────────────────────────────────────────────────────────
# 17) .env.example

NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
PAYMENT_PROVIDER=stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

────────────────────────────────────────────────────────────────────────
# 18) Acceptance Tests (Playwright smoke + API)

- Submit lead → lead row created; schedule demo → booking saved; confirmation modal shows ICS
- From magic link → complete tenant wizard → tenant + admin member created; audit chain row exists
- Checkout (real or mock) → webhook updates bill.subscriptions to active; features provisioned; access granted banner disappears
- Admin invites second user → second user accepts invite and sees only allowed modules
- Billing portal lists invoices; can cancel/upgrade/downgrade (simulate)
- /api/audit/verify returns found:true for a known hash

Build now. Output:
- All pages & API routes above
- SQL migrations & RLS policies
- Edge/webhook handlers for Stripe/Razorpay with provider toggle
- Mock providers for local dev when keys absent
- Fully wired UI with loaders, errors, empty states, RBAC/FBAC gates
- Footer: “© 2025 Nino360 — Designed with Intelligence.”
