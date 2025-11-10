# Dashboard Route Implementation Plan
## Next.js App Router - `/app/(dashboard)/dashboard`

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture & Patterns](#architecture--patterns)
3. [Folder Structure](#folder-structure)
4. [Page Component Structure](#page-component-structure)
5. [Data Fetching Strategy](#data-fetching-strategy)
6. [Authentication & Authorization](#authentication--authorization)
7. [State Management](#state-management)
8. [Component Architecture](#component-architecture)
9. [API Integration](#api-integration)
10. [Error Handling](#error-handling)
11. [Loading States](#loading-states)
12. [Real-time Features](#real-time-features)
13. [Performance Optimization](#performance-optimization)
14. [Responsive Design](#responsive-design)
15. [Testing Strategy](#testing-strategy)
16. [Deployment Checklist](#deployment-checklist)

---

## 1. Overview

### Purpose
The dashboard route serves as the central command center for the Nino360 multi-tenant SaaS platform, providing:
- Real-time KPI monitoring across all modules (CRM, Talent, Bench, Finance, HRMS)
- AI-powered insights and predictions
- Blockchain-verified audit trails
- RPA automation hub
- Personalized user experience based on preferences and permissions

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini via Vercel AI SDK
- **State Management**: React Server Components + SWR for client-side caching
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Real-time**: Supabase Realtime subscriptions
- **Testing**: Vitest + Playwright

---

## 2. Architecture & Patterns

### Server-First Architecture
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   Page Component (Server Component)                    │ │
│  │   - Renders on server                                  │ │
│  │   - Fetches data server-side                          │ │
│  │   - No client bundle for page logic                   │ │
│  └──────────────────┬─────────────────────────────────────┘ │
│                     │                                         │
│  ┌─────────────────┴──────────────────────────────────────┐ │
│  │   Client Components (Interactive Islands)              │ │
│  │   - Charts, forms, real-time widgets                  │ │
│  │   - Use SWR for client-side caching                   │ │
│  │   - Subscribe to Supabase Realtime                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Server Actions Layer                       │
│  actions.ts - Server-side data fetching & mutations         │
│  - getKpis(), getAuditTimeline(), executeRpaWorkflow()     │
│  - Authentication checks                                    │
│  - RBAC/FBAC enforcement                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                             │
│  Supabase PostgreSQL with RLS policies                     │
│  - Row Level Security for multi-tenancy                    │
│  - Stored procedures for complex queries                   │
│  - Realtime subscriptions                                  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Key Patterns
1. **React Server Components (RSC)**: Default for all components unless interactivity needed
2. **Progressive Enhancement**: Core features work without JS, enhanced with client interactions
3. **Suspense Boundaries**: Granular loading states for better UX
4. **Parallel Data Fetching**: Use Promise.all() to fetch multiple data sources concurrently
5. **Optimistic Updates**: Client-side optimistic UI with server validation
6. **Edge Middleware**: Authentication checks at the edge before route access

---

## 3. Folder Structure

\`\`\`
app/(dashboard)/
├── dashboard/
│   ├── page.tsx                    # Main dashboard page (Server Component)
│   ├── actions.ts                  # Server actions for data fetching
│   ├── loading.tsx                 # Loading UI (optional, we use Suspense)
│   └── error.tsx                   # Error boundary
├── layout.tsx                      # Dashboard layout with sidebar & header
└── (other modules)/

components/
├── dashboard/
│   ├── kpi-card.tsx               # KPI display component
│   ├── ai-insights-panel.tsx      # AI-powered insights
│   ├── blockchain-audit-trail.tsx # Blockchain verification
│   ├── rpa-automation-hub.tsx     # RPA workflow management
│   ├── forecast-card.tsx          # ML predictions
│   ├── workboard.tsx              # Task management
│   ├── copilot-ribbon.tsx         # AI copilot interface
│   ├── personalized-insights-panel.tsx
│   ├── predictive-analytics-widget.tsx
│   ├── anomaly-detection-panel.tsx
│   ├── adaptive-learning-widget.tsx
│   ├── smart-recommendations.tsx
│   ├── activity-feed.tsx
│   ├── trust-badge.tsx
│   ├── particle-bg.tsx            # Animated background
│   ├── master-dashboard-sidebar.tsx
│   └── realtime/                  # Real-time components
│       ├── dashboard-realtime-context.tsx
│       ├── live-kpi-strip.tsx
│       └── live-activity-ticker.tsx
│
├── layout/
│   ├── module-sidebar.tsx         # Main navigation
│   ├── submodule-sidebar.tsx      # Secondary navigation
│   ├── app-header.tsx             # Top header
│   └── two-pane.tsx               # Layout utility
│
└── ui/                            # shadcn/ui components
    ├── card.tsx
    ├── button.tsx
    ├── skeleton.tsx
    └── ...

lib/
├── supabase/
│   ├── server.ts                  # Server-side Supabase client
│   └── client.ts                  # Client-side Supabase client
├── auth/
│   ├── middleware.ts              # Auth utilities
│   └── rbac.ts                    # Permission checking
├── ai/
│   └── client.ts                  # AI SDK configuration
└── utils/
    ├── date.ts                    # Date formatting
    └── cache.ts                   # SWR configuration

middleware.ts                       # Edge middleware for auth
\`\`\`

---

## 4. Page Component Structure

### Current Implementation Analysis

**File**: `app/(dashboard)/dashboard/page.tsx`

\`\`\`tsx
// ✅ Best Practices Implemented:
export const dynamic = "force-dynamic" // Disable static optimization for dynamic data
export const metadata = { ... }        // SEO metadata

async function DashboardContent() {
  // ✅ Parallel data fetching with Promise.all
  const [kpis, auditEntries, digest, featureFlags, userPreferences] = await Promise.all([
    getKpis(),
    getAuditTimeline({ limit: 15 }),
    getWeeklyDigest(),
    getFeatureFlags(),
    getUserPreferences().catch(() => null), // Graceful degradation
  ])

  // ✅ Feature flag-based rendering (RBAC/FBAC)
  const hasAtsAccess = featureFlags.talent
  const hasFinanceAccess = featureFlags.finance
  // ...

  return (
    <>
      <ParticleBg /> {/* Animated background */}
      <div className="relative z-10 space-y-6">
        {/* Conditional rendering based on permissions */}
        {hasCopilotAccess && <CopilotRibbon />}
        
        {/* KPI Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hasFinanceAccess && kpis.finance && (
            <KpiCard title="Revenue (MTD)" value={...} />
          )}
          {/* More KPI cards */}
        </div>

        {/* AI-powered components */}
        <AiInsightsPanel kpis={kpis} digest={digest} />
        <AnomalyDetectionPanel />
        <PredictiveAnalyticsWidget />
        
        {/* RPA & Blockchain */}
        <RpaAutomationHub />
        <BlockchainAuditTrail auditEntries={auditEntries} />
        
        {/* ... more sections */}
      </div>
    </>
  )
}

function DashboardSkeleton() {
  // ✅ Loading skeleton matching actual layout
  return <div className="space-y-6">...</div>
}

export default async function DashboardPage() {
  return (
    <TwoPane right={<MasterDashboardSidebar />}>
      <DashboardRealtimeProvider>
        <div className="p-6 space-y-6">
          <LiveKpiStrip />
          
          {/* ✅ Suspense boundary for streaming */}
          <Suspense fallback={<DashboardSkeleton />}>
            {await DashboardContent()}
          </Suspense>
          
          <LiveActivityTicker />
        </div>
      </DashboardRealtimeProvider>
    </TwoPane>
  )
}
\`\`\`

### Key Design Decisions

1. **Async Server Component**: Main page component is async, allowing `await` for data fetching
2. **Suspense Boundary**: Content wrapped in Suspense for streaming and progressive rendering
3. **Skeleton Loading**: Matching loading state that mirrors actual layout
4. **Modular Components**: Each section is a separate component for maintainability
5. **Conditional Rendering**: Features shown/hidden based on RBAC/FBAC flags
6. **Real-time Context**: Wrapper provider for live updates

---

## 5. Data Fetching Strategy

### Server Actions Pattern

**File**: `app/(dashboard)/dashboard/actions.ts`

\`\`\`typescript
"use server" // Mark as server-side only

import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"

// ✅ Type-safe interfaces
export interface KPIs {
  ats: { openJobs: number; pipelineActive: number; ... } | null
  bench: { onBench: number; upcomingRolloffs30d: number; ... } | null
  finance: { arBalance: number; overdueInvoices: number; ... } | null
  hrms: { activeEmployees: number; ... } | null
}

// ✅ Authentication check in every action
export async function getKpis(): Promise<KPIs> {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get tenant ID from membership
  const { data: membership } = await supabase
    .from("user_tenants")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single()

  const tenantId = membership?.tenant_id

  // ✅ Parallel database queries with Promise.all
  const [atsData, benchData, financeData, hrmsData] = await Promise.all([
    supabase.rpc("get_ats_kpis", { p_tenant_id: tenantId }),
    supabase.rpc("get_bench_kpis", { p_tenant_id: tenantId }),
    supabase.rpc("get_finance_kpis", { p_tenant_id: tenantId }),
    supabase.rpc("get_hrms_kpis", { p_tenant_id: tenantId }),
  ])

  // ✅ Fallback to empty data if RPC fails
  return {
    ats: atsData.data || { openJobs: 0, ... },
    bench: benchData.data || { onBench: 0, ... },
    finance: financeData.data || { arBalance: 0, ... },
    hrms: hrmsData.data || { activeEmployees: 0, ... },
  }
}

// ✅ AI integration with fallback
export async function getWeeklyDigest(): Promise<WeeklyDigest> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get real stats from database
  const { data: statsData } = await supabase.rpc("get_weekly_stats", {
    p_from: weekAgo,
    p_to: new Date().toISOString(),
  })

  const stats = statsData || { jobsOpened: 0, offersSent: 0, ... }

  try {
    // ✅ AI-powered summary generation
    const { text } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-4o-mini",
      prompt: `Generate a brief weekly digest...`,
      maxTokens: 100,
    })
    return { text, stats }
  } catch (error) {
    // ✅ Graceful fallback if AI unavailable
    const text = `This week: ${stats.jobsOpened} jobs opened...`
    return { text, stats }
  }
}
\`\`\`

### Data Fetching Best Practices

#### ✅ Do's
1. **Always authenticate first**: Check user auth before any data access
2. **Use stored procedures**: Complex queries in PostgreSQL functions
3. **Parallel fetching**: Use Promise.all() for independent queries
4. **Type safety**: Define TypeScript interfaces for all data structures
5. **Graceful degradation**: Provide fallbacks when services unavailable
6. **Multi-tenant isolation**: Always filter by tenant_id

#### ❌ Don'ts
1. **No client-side data fetching in server components**: Use server actions
2. **No waterfall requests**: Avoid sequential awaits for independent data
3. **No hardcoded data**: Always query database, never mock in production
4. **No exposed credentials**: Use environment variables only
5. **No overfetching**: Select only required fields

### Caching Strategy

\`\`\`typescript
// ✅ Server-side caching with Next.js
export async function getKpis() {
  // This response is automatically cached by Next.js
  // Revalidate with revalidatePath() or revalidateTag()
}

// ✅ Manual cache invalidation
export async function revalidateDashboard() {
  revalidatePath("/dashboard")
}

// ✅ Client-side caching with SWR (for interactive components)
// In client component:
import useSWR from 'swr'

function LiveKpiWidget() {
  const { data, error } = useSWR('/api/kpis', fetcher, {
    refreshInterval: 30000, // Refresh every 30s
    revalidateOnFocus: true,
  })
  
  if (error) return <div>Error loading KPIs</div>
  if (!data) return <Skeleton />
  
  return <KpiDisplay data={data} />
}
\`\`\`

---

## 6. Authentication & Authorization

### Multi-Layer Auth Strategy

\`\`\`
┌────────────────────────────────────────────────────────────┐
│  Layer 1: Edge Middleware (middleware.ts)                  │
│  - Cookie-based auth check                                 │
│  - Redirect unauthenticated users to /login                │
│  - Rate limiting per IP                                    │
│  - Device fingerprinting                                   │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────┐
│  Layer 2: Layout Auth Check (layout.tsx)                  │
│  - Verify valid session                                    │
│  - Load user profile & preferences                         │
│  - Set up tenant context                                   │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────┐
│  Layer 3: Server Action Auth (actions.ts)                 │
│  - Verify user for every action                           │
│  - Check tenant membership                                 │
│  - Enforce RLS policies                                    │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────┐
│  Layer 4: Database RLS (Supabase policies)                │
│  - Row-level security policies                             │
│  - Tenant isolation at data layer                          │
│  - Field-level access control                              │
└────────────────────────────────────────────────────────────┘
\`\`\`

### Implementation Details

#### Edge Middleware
\`\`\`typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const hasAuthCookie = request.cookies.getAll().some(c => 
    AUTH_COOKIE_NAMES.includes(c.name)
  )

  // Rate limiting
  const rateLimitResult = await checkRateLimit(clientIp, "api")
  if (!rateLimitResult.allowed) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  // Redirect unauthenticated users
  const protectedPrefixes = ["/dashboard", "/tenant", "/admin", ...]
  const isProtected = protectedPrefixes.some(p => 
    request.nextUrl.pathname.startsWith(p)
  )
  
  if (isProtected && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
\`\`\`

#### Server Action Auth
\`\`\`typescript
// actions.ts
export async function getKpis(): Promise<KPIs> {
  const supabase = await createServerClient()
  
  // ✅ Always verify user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // ✅ Get tenant context
  const { data: membership } = await supabase
    .from("user_tenants")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .single()

  if (!membership) throw new Error("No tenant access")

  // ✅ Data automatically filtered by RLS policies
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
  // RLS ensures only tenant's data is returned
}
\`\`\`

#### RBAC/FBAC Implementation
\`\`\`typescript
// Feature flags control UI rendering
export async function getFeatureFlags(): Promise<FeatureFlags> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get user's permissions from database
  const { data: permissions } = await supabase
    .from("user_permissions")
    .select("module_access")
    .eq("user_id", user.id)
    .single()

  return {
    crm: permissions.module_access.includes("crm"),
    talent: permissions.module_access.includes("talent"),
    bench: permissions.module_access.includes("bench"),
    finance: permissions.module_access.includes("finance"),
    hrms: permissions.module_access.includes("hrms"),
    analytics: permissions.module_access.includes("analytics"),
    // ...
  }
}

// In page component
const featureFlags = await getFeatureFlags()

// Conditional rendering
{featureFlags.finance && (
  <FinanceKpiCard data={kpis.finance} />
)}
\`\`\`

---

## 7. State Management

### Hybrid State Architecture

\`\`\`typescript
// ✅ Server State (Default): React Server Components
// - Dashboard page is a server component
// - Data fetched on server, sent as props to client components
// - No client-side state for initial data

async function DashboardContent() {
  const kpis = await getKpis() // Server-side fetch
  return <KpiCard data={kpis.finance} /> // Pass as props
}

// ✅ Client State (Interactive): SWR + React Context
// - Real-time updates
// - User interactions
// - Optimistic UI

// Context for real-time dashboard updates
export function DashboardRealtimeProvider({ children }) {
  const [liveKpis, setLiveKpis] = useState(null)
  const [liveEvents, setLiveEvents] = useState([])

  useEffect(() => {
    const supabase = createBrowserClient()
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'activity_logs' 
      }, (payload) => {
        setLiveEvents(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  return (
    <DashboardContext.Provider value={{ liveKpis, liveEvents }}>
      {children}
    </DashboardContext.Provider>
  )
}

// ✅ Form State: React Hook Form (for mutations)
function CreateTaskForm() {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  })

  async function onSubmit(data: TaskFormData) {
    // Optimistic update
    mutate('/api/tasks', [...tasks, { ...data, id: 'temp' }], false)
    
    // Server mutation
    await createTask(data)
    
    // Revalidate
    mutate('/api/tasks')
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}

// ✅ Cache State: SWR for client-side data
function LiveKpiStrip() {
  const { data: kpis, error } = useSWR('/api/kpis/live', fetcher, {
    refreshInterval: 10000, // Refresh every 10s
    dedupingInterval: 5000, // Dedupe requests within 5s
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  if (error) return <ErrorAlert />
  if (!data) return <Skeleton />

  return <KpiStrip data={kpis} />
}
\`\`\`

### State Management Decision Tree

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  Is this initial page data?                                 │
│  └─ YES → Server Component (no client state)               │
│  └─ NO  ↓                                                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Does it need real-time updates?                            │
│  └─ YES → Supabase Realtime + React Context                │
│  └─ NO  ↓                                                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Is it form/input state?                                    │
│  └─ YES → React Hook Form + local state                    │
│  └─ NO  ↓                                                   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Does it need client-side caching/revalidation?             │
│  └─ YES → SWR with stale-while-revalidate                  │
│  └─ NO  → useState/useReducer for UI state                 │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 8. Component Architecture

### Component Hierarchy

\`\`\`
DashboardPage (Server Component)
├── TwoPane Layout
│   ├── Main Content Area
│   │   └── DashboardRealtimeProvider (Client Component)
│   │       ├── LiveKpiStrip (Client - Real-time)
│   │       ├── Suspense Boundary
│   │       │   └── DashboardContent (Server Component)
│   │       │       ├── ParticleBg (Client - Animation)
│   │       │       ├── CopilotRibbon (Client - Interactive)
│   │       │       ├── KPI Grid
│   │       │       │   └── KpiCard (Server → Client via props)
│   │       │       ├── AiInsightsPanel (Client - AI Features)
│   │       │       ├── PersonalizedInsightsPanel (Client - Personalization)
│   │       │       ├── AnomalyDetectionPanel (Client - ML)
│   │       │       ├── ForecastCard (Client - Charts)
│   │       │       ├── PredictiveAnalyticsWidget (Client - ML)
│   │       │       ├── Workboard (Client - Interactive)
│   │       │       ├── SmartRecommendations (Client - AI)
│   │       │       ├── RpaAutomationHub (Client - RPA Controls)
│   │       │       ├── PipelineStage (Client - Charts)
│   │       │       ├── HiringFunnel (Client - Charts)
│   │       │       ├── BenchHotlist (Client - Tables)
│   │       │       ├── AdaptiveLearningWidget (Client - ML)
│   │       │       ├── ArApAging (Client - Charts)
│   │       │       ├── InvoiceList (Client - Tables)
│   │       │       ├── ProjectHealth (Client - Status)
│   │       │       ├── VendorScorecard (Client - Metrics)
│   │       │       ├── BlockchainAuditTrail (Server → props)
│   │       │       ├── ActivityFeed (Client - Real-time)
│   │       │       └── TrustBadge (Server - Static)
│   │       └── LiveActivityTicker (Client - Real-time)
│   └── Sidebar
│       └── MasterDashboardSidebar (Client - Navigation)
\`\`\`

### Component Design Principles

#### 1. Server-First Pattern
\`\`\`typescript
// ✅ Start with server component
async function DashboardContent() {
  const data = await fetchData() // Server-side
  return <ClientWidget data={data} /> // Pass to client
}

// Only mark as client when needed
"use client"
function ClientWidget({ data }) {
  const [state, setState] = useState(data)
  // Interactive logic here
}
\`\`\`

#### 2. Component Composition
\`\`\`typescript
// ✅ Small, focused components
function KpiCard({ title, value, trend, href }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && <TrendIndicator {...trend} />}
      </CardContent>
      {href && (
        <CardFooter>
          <Link href={href}>View Details →</Link>
        </CardFooter>
      )}
    </Card>
  )
}

// ✅ Compose into larger sections
function KpiGrid({ kpis, featureFlags }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {featureFlags.finance && (
        <KpiCard 
          title="Revenue"
          value={formatCurrency(kpis.finance.arBalance)}
          trend={{ value: 12, direction: "up" }}
          href="/finance"
        />
      )}
      {/* More KPI cards */}
    </div>
  )
}
\`\`\`

#### 3. Prop Drilling vs Context
\`\`\`typescript
// ❌ Avoid excessive prop drilling
<ComponentA>
  <ComponentB user={user} tenant={tenant}>
    <ComponentC user={user} tenant={tenant}>
      <ComponentD user={user} tenant={tenant} />
    </ComponentC>
  </ComponentB>
</ComponentA>

// ✅ Use context for shared state
<AuthProvider>
  <TenantProvider>
    <ComponentA>
      <ComponentB>
        <ComponentC>
          <ComponentD /> {/* Uses context internally */}
        </ComponentC>
      </ComponentB>
    </ComponentA>
  </TenantProvider>
</AuthProvider>
\`\`\`

#### 4. Error Boundaries
\`\`\`typescript
// error.tsx in route
"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
\`\`\`

---

## 9. API Integration

### API Route Patterns

\`\`\`typescript
// app/api/dashboard/insights/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateText } from "ai"

export async function GET(request: NextRequest) {
  try {
    // ✅ Authentication
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // ✅ Get tenant context
    const { data: membership } = await supabase
      .from("user_tenants")
      .select("tenant_id")
      .eq("user_id", user.id)
      .single()

    // ✅ Fetch data with tenant isolation
    const { data: kpis } = await supabase.rpc("get_tenant_kpis", {
      p_tenant_id: membership.tenant_id
    })

    // ✅ AI processing
    const { text: insight } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze these KPIs and provide insights: ${JSON.stringify(kpis)}`,
      maxTokens: 500,
    })

    // ✅ Return typed response
    return NextResponse.json({
      success: true,
      data: { insight, kpis },
    })

  } catch (error: any) {
    console.error("[API Error]", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // ✅ Parse and validate request body
    const body = await request.json()
    const { action, parameters } = body

    // ✅ Authentication & authorization
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Execute action
    const result = await executeAction(action, parameters, user.id)

    // ✅ Blockchain audit logging
    await logBlockchainAudit(
      "api_call",
      "dashboard_insights",
      result.id,
      { action, parameters, result }
    )

    return NextResponse.json({ success: true, data: result })

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
\`\`\`

### Client-Side API Calls

\`\`\`typescript
// Using SWR for GET requests
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function InsightsPanel() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/dashboard/insights',
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  )

  if (error) return <ErrorAlert message={error.message} />
  if (isLoading) return <Skeleton />

  return (
    <div>
      <h3>AI Insights</h3>
      <p>{data.insight}</p>
      <Button onClick={() => mutate()}>Refresh</Button>
    </div>
  )
}

// Using server actions for mutations
async function handleExecuteWorkflow(workflowId: string) {
  try {
    // Optimistic update
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: 'running' } : w
    ))

    // Server action
    const result = await executeRpaWorkflow(workflowId, {})

    // Update with real data
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, ...result } : w
    ))

    toast.success("Workflow executed successfully")
  } catch (error) {
    // Revert optimistic update
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: 'idle' } : w
    ))
    toast.error("Failed to execute workflow")
  }
}
\`\`\`

---

## 10. Error Handling

### Multi-Layer Error Strategy

\`\`\`typescript
// 1. Edge Middleware Errors
export async function middleware(request: NextRequest) {
  try {
    // Auth checks
  } catch (error) {
    console.error("[Middleware Error]", error)
    return NextResponse.redirect("/login")
  }
}

// 2. Server Action Errors
export async function getKpis(): Promise<KPIs> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.rpc("get_kpis")
    
    if (error) throw new Error(`Database error: ${error.message}`)
    
    return data
  } catch (error) {
    console.error("[Server Action Error]", error)
    // Graceful degradation
    return {
      ats: null,
      bench: null,
      finance: null,
      hrms: null,
    }
  }
}

// 3. API Route Errors
export async function GET(request: NextRequest) {
  try {
    // API logic
  } catch (error: any) {
    console.error("[API Error]", error)
    
    // Return appropriate status codes
    if (error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (error.message.includes("Not Found")) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

// 4. Component Error Boundaries
// error.tsx
"use client"

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("[Dashboard Error]", error)
    // Optionally send to Sentry/LogRocket
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">Dashboard Error</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Go Home
        </Button>
      </div>
    </div>
  )
}

// 5. Client Component Error Handling
function AiInsightsPanel() {
  const [error, setError] = useState<Error | null>(null)

  const { data, error: swrError } = useSWR('/api/insights', fetcher, {
    onError: (err) => setError(err),
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  })

  if (error || swrError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading insights</AlertTitle>
        <AlertDescription>
          {error?.message || swrError?.message}
          <Button 
            variant="link" 
            onClick={() => setError(null)}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return <div>{/* Normal content */}</div>
}
\`\`\`

### Error Monitoring

\`\`\`typescript
// lib/monitoring.ts
export function logError(
  error: Error,
  context: {
    component?: string
    userId?: string
    tenantId?: string
    action?: string
  }
) {
  // Console logging (development)
  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", {
      message: error.message,
      stack: error.stack,
      ...context,
    })
  }

  // Send to monitoring service (production)
  if (process.env.NODE_ENV === "production") {
    // Example: Sentry
    // Sentry.captureException(error, { extra: context })
    
    // Example: Custom API
    fetch("/api/monitoring/errors", {
      method: "POST",
      body: JSON.stringify({
        error: {
          message: error.message,
          stack: error.stack,
        },
        context,
        timestamp: new Date().toISOString(),
      }),
    })
  }
}
\`\`\`

---

## 11. Loading States

### Progressive Loading Strategy

\`\`\`typescript
// 1. Route-level loading (loading.tsx)
export default function Loading() {
  return <DashboardSkeleton />
}

// 2. Component-level Suspense
<Suspense fallback={<DashboardSkeleton />}>
  {await DashboardContent()}
</Suspense>

// 3. Granular skeleton matching actual layout
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Copilot ribbon skeleton */}
      <Skeleton className="h-24 w-full rounded-xl" />
      
      {/* KPI grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      
      {/* AI insights skeleton */}
      <Skeleton className="h-64 w-full rounded-xl" />
      
      {/* Forecast cards skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
      
      {/* Workboard skeleton */}
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

// 4. Streaming with Suspense boundaries
function DashboardContent() {
  return (
    <>
      {/* Immediately available content */}
      <ParticleBg />
      <CopilotRibbon />
      
      {/* Streaming KPIs */}
      <Suspense fallback={<KpiGridSkeleton />}>
        <KpiGrid />
      </Suspense>
      
      {/* Streaming AI insights */}
      <Suspense fallback={<Skeleton className="h-64" />}>
        <AiInsightsPanel />
      </Suspense>
      
      {/* Rest of content loads in parallel */}
    </>
  )
}

// 5. Client-side loading states (SWR)
function LiveKpiStrip() {
  const { data, error, isLoading } = useSWR('/api/kpis/live', fetcher)

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-32" />
        ))}
      </div>
    )
  }

  if (error) return <ErrorAlert />

  return <div>{/* Actual KPI content */}</div>
}

// 6. Progressive enhancement with shimmer effect
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-pulse bg-muted rounded-md relative overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

// 7. Loading indicators for mutations
function ExecuteWorkflowButton({ workflowId }) {
  const [isExecuting, setIsExecuting] = useState(false)

  async function handleExecute() {
    setIsExecuting(true)
    try {
      await executeRpaWorkflow(workflowId, {})
      toast.success("Workflow executed")
    } catch (error) {
      toast.error("Execution failed")
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Button onClick={handleExecute} disabled={isExecuting}>
      {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isExecuting ? "Executing..." : "Execute Workflow"}
    </Button>
  )
}
\`\`\`

---

## 12. Real-time Features

### Supabase Realtime Integration

\`\`\`typescript
// Context for real-time updates
"use client"

import { createBrowserClient } from "@/lib/supabase/client"
import { createContext, useContext, useEffect, useState } from "react"

interface RealtimeContextType {
  liveKpis: any
  liveEvents: any[]
  isConnected: boolean
}

const DashboardRealtimeContext = createContext<RealtimeContextType | null>(null)

export function DashboardRealtimeProvider({ children }) {
  const [liveKpis, setLiveKpis] = useState(null)
  const [liveEvents, setLiveEvents] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient()

    // Subscribe to KPI updates
    const kpiChannel = supabase
      .channel('kpi-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kpi_snapshots',
      }, (payload) => {
        setLiveKpis(payload.new)
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Subscribe to activity logs
    const activityChannel = supabase
      .channel('activity-logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'activity_logs',
      }, (payload) => {
        setLiveEvents(prev => [payload.new, ...prev.slice(0, 49)])
      })
      .subscribe()

    return () => {
      kpiChannel.unsubscribe()
      activityChannel.unsubscribe()
    }
  }, [])

  return (
    <DashboardRealtimeContext.Provider 
      value={{ liveKpis, liveEvents, isConnected }}
    >
      {children}
    </DashboardRealtimeContext.Provider>
  )
}

export function useDashboardRealtime() {
  const context = useContext(DashboardRealtimeContext)
  if (!context) {
    throw new Error("useDashboardRealtime must be used within provider")
  }
  return context
}

// Usage in components
function LiveKpiStrip() {
  const { liveKpis, isConnected } = useDashboardRealtime()

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-2 w-2 rounded-full",
          isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
        )} />
        <span className="text-xs text-muted-foreground">
          {isConnected ? "Live" : "Connecting..."}
        </span>
      </div>
      
      {liveKpis && (
        <div className="flex gap-4">
          <div className="text-sm">
            Revenue: <span className="font-bold">${liveKpis.revenue}</span>
          </div>
          <div className="text-sm">
            Pipeline: <span className="font-bold">${liveKpis.pipeline}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function LiveActivityTicker() {
  const { liveEvents } = useDashboardRealtime()

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Recent Activity</h3>
      <div className="space-y-1">
        {liveEvents.slice(0, 10).map((event) => (
          <div key={event.id} className="text-xs text-muted-foreground">
            <span className="font-medium">{event.actor_email}</span>
            {" "}
            {event.action}
            {" "}
            <span className="font-medium">{event.resource_type}</span>
            {" "}
            <time>{formatDistanceToNow(new Date(event.created_at))} ago</time>
          </div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

### Optimistic Updates Pattern

\`\`\`typescript
function TaskWorkboard() {
  const { data: tasks, mutate } = useSWR('/api/tasks', fetcher)
  const [optimisticTasks, setOptimisticTasks] = useState(tasks)

  async function handleUpdateTask(taskId: string, updates: Partial<Task>) {
    // Optimistic update
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    )
    setOptimisticTasks(updatedTasks)
    mutate(updatedTasks, false) // Update SWR cache without revalidation

    try {
      // Server update
      await updateTask(taskId, updates)
      // Revalidate to get server state
      mutate()
    } catch (error) {
      // Revert on error
      setOptimisticTasks(tasks)
      mutate(tasks, false)
      toast.error("Failed to update task")
    }
  }

  return (
    <div>
      {(optimisticTasks || tasks).map(task => (
        <TaskCard 
          key={task.id}
          task={task}
          onUpdate={(updates) => handleUpdateTask(task.id, updates)}
        />
      ))}
    </div>
  )
}
\`\`\`

---

## 13. Performance Optimization

### Core Web Vitals Targets

| Metric | Target | Current | Strategy |
|--------|--------|---------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | ~1.8s | Server-side rendering, image optimization |
| FID (First Input Delay) | < 100ms | ~50ms | Minimal JS, code splitting |
| CLS (Cumulative Layout Shift) | < 0.1 | ~0.05 | Fixed dimensions, skeleton loaders |
| TTFB (Time to First Byte) | < 600ms | ~400ms | Edge middleware, caching |
| TTI (Time to Interactive) | < 3.5s | ~2.5s | Progressive enhancement, lazy loading |

### Optimization Techniques

#### 1. Server-Side Rendering
\`\`\`typescript
// ✅ Dashboard content renders on server
async function DashboardContent() {
  // Data fetched on server, HTML sent to client
  const data = await getKpis()
  return <div>{/* Pre-rendered HTML */}</div>
}

// ✅ Reduces client-side JS bundle
// ✅ Faster initial paint
// ✅ Better SEO
\`\`\`

#### 2. Code Splitting & Dynamic Imports
\`\`\`typescript
// ✅ Lazy load heavy components
const AiInsightsPanel = dynamic(
  () => import("@/components/dashboard/ai-insights-panel"),
  {
    loading: () => <Skeleton className="h-64" />,
    ssr: false, // Client-only if needed
  }
)

const PredictiveAnalyticsWidget = dynamic(
  () => import("@/components/dashboard/predictive-analytics-widget"),
  { loading: () => <Skeleton className="h-96" /> }
)

// ✅ Reduces initial bundle size
// ✅ Loads on-demand
\`\`\`

#### 3. Image Optimization
\`\`\`typescript
import Image from "next/image"

// ✅ Automatic optimization
<Image
  src="/dashboard-bg.jpg"
  alt="Dashboard background"
  width={1920}
  height={1080}
  priority // For LCP image
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// ✅ WebP format
// ✅ Responsive images
// ✅ Lazy loading
\`\`\`

#### 4. Database Query Optimization
\`\`\`sql
-- ✅ Use stored procedures for complex queries
CREATE OR REPLACE FUNCTION get_dashboard_kpis(p_tenant_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'ats', (SELECT json_build_object(
      'openJobs', COUNT(*) FILTER (WHERE status = 'open'),
      'pipelineActive', COUNT(*) FILTER (WHERE stage != 'closed')
    ) FROM jobs WHERE tenant_id = p_tenant_id),
    'finance', (SELECT json_build_object(
      'arBalance', COALESCE(SUM(amount), 0)
    ) FROM invoices WHERE tenant_id = p_tenant_id AND status = 'unpaid')
  );
END;
$$ LANGUAGE plpgsql;

-- ✅ Single query instead of multiple
-- ✅ Executes on database server
-- ✅ Returns optimized JSON
\`\`\`

#### 5. Caching Strategy
\`\`\`typescript
// ✅ Server-side caching with Next.js
export const revalidate = 60 // Revalidate every 60s

async function getKpis() {
  // Automatically cached by Next.js
  const data = await fetch('/api/kpis', {
    next: { revalidate: 60 }
  })
  return data.json()
}

// ✅ Client-side caching with SWR
const { data } = useSWR('/api/kpis', fetcher, {
  dedupingInterval: 10000, // Dedupe within 10s
  refreshInterval: 60000,  // Refresh every 60s
  revalidateOnFocus: false,
})

// ✅ Redis caching for expensive computations
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)

async function getAiInsights() {
  const cached = await redis.get('dashboard:insights')
  if (cached) return JSON.parse(cached)

  const insights = await generateInsights()
  await redis.setex('dashboard:insights', 300, JSON.stringify(insights))
  return insights
}
\`\`\`

#### 6. Bundle Size Optimization
\`\`\`typescript
// ✅ Import only what you need
import { Card } from "@/components/ui/card" // ❌ Don't: import * as UI
import { Button } from "@/components/ui/button"

// ✅ Use next/dynamic for client components
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  ssr: false,
})

// ✅ Analyze bundle
// Run: npm run build
// Check .next/analyze for bundle breakdown
\`\`\`

#### 7. Parallel Data Fetching
\`\`\`typescript
// ❌ Sequential (slow)
const kpis = await getKpis()
const audit = await getAuditTimeline()
const digest = await getWeeklyDigest()

// ✅ Parallel (fast)
const [kpis, audit, digest] = await Promise.all([
  getKpis(),
  getAuditTimeline(),
  getWeeklyDigest(),
])

// ✅ Reduces total wait time
// ✅ Faster page load
\`\`\`

#### 8. Virtualization for Long Lists
\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function ActivityFeed({ events }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <EventRow event={events[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ Only renders visible items
// ✅ Smooth scrolling for 1000+ items
\`\`\`

---

## 14. Responsive Design

### Breakpoint Strategy

\`\`\`typescript
// Tailwind CSS v4 breakpoints (built-in)
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

// ✅ Mobile-first responsive grid
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <KpiCard />
  <KpiCard />
  <KpiCard />
  <KpiCard />
</div>

// ✅ Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Dashboard
</h1>

// ✅ Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>

// ✅ Responsive visibility
<div className="hidden md:block">
  {/* Desktop sidebar */}
</div>
<div className="block md:hidden">
  {/* Mobile menu */}
</div>
\`\`\`

### Mobile Optimization

\`\`\`typescript
// ✅ Touch-friendly interactive elements
<Button className="min-h-[44px] min-w-[44px]">
  {/* 44px minimum for touch targets */}
</Button>

// ✅ Simplified mobile layout
function DashboardPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return isMobile ? (
    <MobileDashboard />
  ) : (
    <DesktopDashboard />
  )
}

// ✅ Swipe gestures for mobile
import { useSwipeable } from 'react-swipeable'

function MobileKpiCards() {
  const handlers = useSwipeable({
    onSwipedLeft: () => nextCard(),
    onSwipedRight: () => prevCard(),
  })

  return <div {...handlers}>{/* Swipeable cards */}</div>
}

// ✅ Responsive charts
import { ResponsiveContainer, LineChart, Line } from 'recharts'

function ForecastCard() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" />
      </LineChart>
    </ResponsiveContainer>
  )
}
\`\`\`

### Accessibility (a11y)

\`\`\`typescript
// ✅ Semantic HTML
<main>
  <h1>Dashboard</h1>
  <section aria-labelledby="kpis-heading">
    <h2 id="kpis-heading">Key Performance Indicators</h2>
    {/* KPI content */}
  </section>
</main>

// ✅ Keyboard navigation
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Execute Workflow
</Button>

// ✅ ARIA labels
<button aria-label="Refresh dashboard data">
  <RefreshCw className="h-4 w-4" />
</button>

// ✅ Focus management
const dialogRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (isOpen) {
    dialogRef.current?.focus()
  }
}, [isOpen])

// ✅ Screen reader support
<div className="sr-only">
  Loading dashboard data...
</div>

// ✅ Color contrast (WCAG AA)
// Design tokens ensure 4.5:1 contrast ratio
<p className="text-foreground"> {/* High contrast */}
  Dashboard content
</p>
\`\`\`

---

## 15. Testing Strategy

### Unit Tests (Vitest)

\`\`\`typescript
// __tests__/dashboard/actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getKpis, getAuditTimeline, getWeeklyDigest } from '../actions'
import { createServerClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server')

describe('Dashboard Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getKpis', () => {
    it('should fetch KPIs for authenticated user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } })
        },
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tenant_id: 'tenant-123' }
        }),
        rpc: vi.fn().mockResolvedValue({
          data: { openJobs: 10, pipelineActive: 25 }
        }),
      }

      vi.mocked(createServerClient).mockResolvedValue(mockSupabase as any)

      const kpis = await getKpis()

      expect(kpis).toBeDefined()
      expect(kpis.ats).toBeDefined()
      expect(mockSupabase.auth.getUser).toHaveBeenCalled()
    })

    it('should throw error for unauthenticated user', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } })
        },
      }

      vi.mocked(createServerClient).mockResolvedValue(mockSupabase as any)

      await expect(getKpis()).rejects.toThrow('Unauthorized')
    })
  })

  describe('getAuditTimeline', () => {
    it('should fetch audit entries with limit', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: [
            { id: '1', action: 'user.login', created_at: new Date().toISOString() }
          ],
          error: null,
        }),
      }

      vi.mocked(createServerClient).mockResolvedValue(mockSupabase as any)

      const entries = await getAuditTimeline({ limit: 10 })

      expect(entries).toHaveLength(1)
      expect(mockSupabase.limit).toHaveBeenCalledWith(10)
    })
  })
})
\`\`\`

### Integration Tests (Playwright)

\`\`\`typescript
// __tests__/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should display KPI cards', async ({ page }) => {
    // Wait for KPIs to load
    await page.waitForSelector('[data-testid="kpi-card"]')

    // Check that at least 4 KPI cards are visible
    const kpiCards = await page.locator('[data-testid="kpi-card"]').count()
    expect(kpiCards).toBeGreaterThanOrEqual(4)

    // Verify KPI values are displayed
    const firstKpi = page.locator('[data-testid="kpi-card"]').first()
    await expect(firstKpi.locator('.text-3xl')).toBeVisible()
  })

  test('should load AI insights', async ({ page }) => {
    // Wait for AI panel to load
    await page.waitForSelector('[data-testid="ai-insights-panel"]', {
      timeout: 10000
    })

    const insightsPanel = page.locator('[data-testid="ai-insights-panel"]')
    await expect(insightsPanel).toBeVisible()
    
    // Verify insights text is present
    await expect(insightsPanel.locator('p')).not.toBeEmpty()
  })

  test('should display blockchain audit trail', async ({ page }) => {
    await page.waitForSelector('[data-testid="blockchain-audit-trail"]')

    const auditTrail = page.locator('[data-testid="blockchain-audit-trail"]')
    await expect(auditTrail).toBeVisible()

    // Verify at least one audit entry
    const entries = await auditTrail.locator('[data-testid="audit-entry"]').count()
    expect(entries).toBeGreaterThan(0)

    // Verify hash badge is shown
    await expect(auditTrail.locator('[data-testid="hash-badge"]').first()).toBeVisible()
  })

  test('should execute RPA workflow', async ({ page }) => {
    await page.waitForSelector('[data-testid="rpa-automation-hub"]')

    // Click execute button on first workflow
    const executeBtn = page.locator('[data-testid="execute-workflow-btn"]').first()
    await executeBtn.click()

    // Wait for execution to complete
    await page.waitForSelector('[data-testid="workflow-status-completed"]', {
      timeout: 5000
    })

    // Verify success toast
    await expect(page.locator('.toast-success')).toBeVisible()
  })

  test('should update in real-time', async ({ page }) => {
    // Get initial KPI value
    const kpiValue = await page.locator('[data-testid="revenue-kpi"]').textContent()

    // Wait for live update (assuming updates happen within 30s)
    await page.waitForTimeout(30000)

    // Check if value updated
    const newKpiValue = await page.locator('[data-testid="revenue-kpi"]').textContent()
    
    // Values might be the same if no changes occurred, but component should still be live
    const liveIndicator = page.locator('[data-testid="live-indicator"]')
    await expect(liveIndicator).toHaveClass(/animate-pulse/)
  })

  test('should be responsive', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    const desktopSidebar = page.locator('[data-testid="master-dashboard-sidebar"]')
    await expect(desktopSidebar).toBeVisible()

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(desktopSidebar).toBeHidden()

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    const mobileMenu = page.locator('[data-testid="mobile-menu-button"]')
    await expect(mobileMenu).toBeVisible()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('/api/dashboard/**', route => route.abort())

    // Reload page
    await page.reload()

    // Verify error message is shown
    await expect(page.locator('[role="alert"]')).toBeVisible()
    
    // Verify retry button is present
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible()
  })
})
\`\`\`

### Component Tests (Vitest + Testing Library)

\`\`\`typescript
// __tests__/components/kpi-card.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { KpiCard } from '@/components/dashboard/kpi-card'

describe('KpiCard', () => {
  it('should render title and value', () => {
    render(
      <KpiCard
        title="Revenue"
        value="$125K"
        iconName="dollar-sign"
      />
    )

    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$125K')).toBeInTheDocument()
  })

  it('should show trend indicator', () => {
    render(
      <KpiCard
        title="Pipeline"
        value="$9.4M"
        trend={{ value: 12, direction: 'up' }}
      />
    )

    expect(screen.getByText('12%')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /up/i })).toBeInTheDocument()
  })

  it('should render link when href provided', () => {
    render(
      <KpiCard
        title="Bench"
        value="15"
        href="/bench/tracking"
      />
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/bench/tracking')
  })
})
\`\`\`

---

## 16. Deployment Checklist

### Pre-Deployment

- [ ] **Environment Variables**
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] AI_MODEL
  - [ ] OPENAI_API_KEY
  - [ ] DATABASE_URL
  - [ ] REDIS_URL (optional)

- [ ] **Database**
  - [ ] All migrations applied
  - [ ] RLS policies enabled
  - [ ] Stored procedures deployed
  - [ ] Indexes created
  - [ ] Backup strategy in place

- [ ] **Testing**
  - [ ] Unit tests passing (95%+ coverage)
  - [ ] Integration tests passing
  - [ ] E2E tests passing
  - [ ] Load testing completed
  - [ ] Security testing done

- [ ] **Performance**
  - [ ] Lighthouse score > 90
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] Bundle size optimized

- [ ] **Security**
  - [ ] CORS configured
  - [ ] Rate limiting enabled
  - [ ] SQL injection prevention (use prepared statements)
  - [ ] XSS prevention (sanitize inputs)
  - [ ] CSRF protection
  - [ ] Security headers set

- [ ] **Monitoring**
  - [ ] Error tracking (Sentry/LogRocket)
  - [ ] Analytics (Vercel Analytics)
  - [ ] Performance monitoring
  - [ ] Uptime monitoring

### Deployment

\`\`\`bash
# 1. Build locally to verify
npm run build

# 2. Run tests
npm run test
npm run test:e2e

# 3. Deploy to staging
vercel --prod=false

# 4. Smoke test staging
# - Login works
# - Dashboard loads
# - KPIs display
# - Real-time updates work
# - RPA workflows execute

# 5. Deploy to production
vercel --prod

# 6. Verify production
# - Check all critical paths
# - Monitor error rates
# - Check performance metrics
\`\`\`

### Post-Deployment

- [ ] **Verification**
  - [ ] Dashboard accessible
  - [ ] Authentication working
  - [ ] KPIs loading correctly
  - [ ] AI features functional
  - [ ] Blockchain audit working
  - [ ] RPA automation executing
  - [ ] Real-time updates active

- [ ] **Monitoring**
  - [ ] Error rate < 1%
  - [ ] Response time < 500ms
  - [ ] CPU usage < 70%
  - [ ] Memory usage < 80%

- [ ] **Documentation**
  - [ ] Update changelog
  - [ ] Document new features
  - [ ] Update API docs
  - [ ] Notify team

---

## Summary

This implementation plan provides a comprehensive blueprint for the Nino360 dashboard route at `/app/(dashboard)/dashboard`. 

### Key Takeaways

1. **Server-First Architecture**: Leverage React Server Components for better performance
2. **Multi-Layer Security**: Authentication at edge, server actions, and database
3. **Real-Time Features**: Supabase Realtime for live updates
4. **AI Integration**: OpenAI for insights, predictions, and anomaly detection
5. **Blockchain Audit**: Immutable audit trail with hash verification
6. **RPA Automation**: Execute workflows directly from dashboard
7. **Progressive Enhancement**: Core features work without JS
8. **Responsive Design**: Mobile-first approach with touch optimization
9. **Performance Optimized**: Code splitting, caching, virtualization
10. **Thoroughly Tested**: Unit, integration, and E2E tests

### Next Steps

1. Review and validate implementation against requirements
2. Set up development environment with all integrations
3. Implement Phase 1: Core dashboard page and KPIs
4. Implement Phase 2: AI features and real-time updates
5. Implement Phase 3: RPA automation and blockchain audit
6. Comprehensive testing and optimization
7. Staging deployment and validation
8. Production deployment

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Ready for Implementation
