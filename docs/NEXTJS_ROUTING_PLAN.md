# Next.js Routing & Configuration Plan for Nino360

## Executive Summary

This document provides a comprehensive routing and configuration plan for the Nino360 platform, with specific focus on the `/app/(dashboard)/hrms` path structure. It analyzes the current implementation, identifies best practices, and provides recommendations for maintaining scalable, maintainable navigation.

## Table of Contents

1. [Current Routing Architecture](#current-routing-architecture)
2. [Route Group Analysis](#route-group-analysis)
3. [HRMS Module Routing Structure](#hrms-module-routing-structure)
4. [Routing Patterns & Best Practices](#routing-patterns--best-practices)
5. [Navigation Flow](#navigation-flow)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Scalability Recommendations](#scalability-recommendations)
8. [Testing & Validation](#testing--validation)

---

## 1. Current Routing Architecture

### 1.1 Overview

Nino360 uses Next.js 14+ App Router with the following architectural patterns:

\`\`\`
app/
├── (auth)/                    # Route group for authentication
│   ├── signin/
│   └── signup/
├── (dashboard)/               # Route group for authenticated dashboard
│   ├── layout.tsx            # Shared dashboard layout
│   ├── admin/                # Admin module
│   ├── crm/                  # CRM module
│   ├── hrms/                 # HRMS module ⭐
│   ├── finance/              # Finance module
│   ├── projects/             # Projects module
│   └── ...
└── (vendor)/                  # Route group for vendor portal
    └── ...
\`\`\`

### 1.2 Route Groups Explained

**Route groups** (folders wrapped in parentheses like `(dashboard)`) are a Next.js feature that:
- Organize routes without affecting the URL structure
- Allow multiple layouts for different sections
- Enable logical grouping of related routes

**Example:**
- File: `app/(dashboard)/hrms/employees/page.tsx`
- URL: `/hrms/employees` (the `(dashboard)` is omitted from the URL)

---

## 2. Route Group Analysis

### 2.1 Dashboard Route Group Structure

\`\`\`typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <KeyboardShortcuts />
      <ModuleSidebar />           // Left sidebar with module icons
      <SubmoduleSidebar />        // Secondary sidebar with submodule links
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />             // Top header with search, notifications
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
\`\`\`

**Key Features:**
- ✅ Shared layout for all dashboard routes
- ✅ Consistent navigation structure
- ✅ Error boundary for graceful error handling
- ✅ Responsive design with overflow handling

### 2.2 Authentication Protection

\`\`\`typescript
// middleware.ts
const protectedPaths = [
  "/dashboard",
  "/admin",
  "/tenant",
  "/crm",
  "/talent",
  "/bench",
  "/vms",
  "/finance",
  "/projects",
  "/reports",
  "/settings",
  "/hrms",  // HRMS is protected
]

const isProtectedPath = protectedPaths.some((path) => 
  request.nextUrl.pathname.startsWith(path)
)

if (isProtectedPath && !user) {
  // Redirect to signin
  const url = request.nextUrl.clone()
  url.pathname = "/login"
  return NextResponse.redirect(url)
}
\`\`\`

**Security Features:**
- ✅ Middleware-level authentication check
- ✅ Automatic redirect to signin for unauthenticated users
- ✅ Session refresh on each request
- ✅ Cookie-based authentication with Supabase

---

## 3. HRMS Module Routing Structure

### 3.1 Current HRMS Routes

\`\`\`
app/(dashboard)/hrms/
├── layout.tsx                 # HRMS-specific layout with tabs
├── page.tsx                   # Root redirect to /hrms/dashboard
├── dashboard/
│   └── page.tsx              # Main HRMS dashboard
├── employees/
│   ├── page.tsx              # Employee directory
│   ├── loading.tsx           # Loading state
│   └── actions.ts            # Server actions
├── assignments/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── attendance/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── timesheets/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── immigration/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── i9-compliance/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── documents/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── helpdesk/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── onboarding/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── offboarding/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── performance/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── compensation/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── benefits/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── compliance/
│   ├── page.tsx
│   └── actions.ts
└── analytics/
    ├── page.tsx
    ├── loading.tsx
    └── actions.ts
\`\`\`

### 3.2 HRMS Layout Implementation

\`\`\`typescript
// app/(dashboard)/hrms/layout.tsx
export default function HRMSLayout({ children }: { children: React.ReactNode }) {
  const tabs = [
    { name: "Dashboard", href: "/hrms/dashboard", icon: Building2 },
    { name: "Employees", href: "/hrms/employees", icon: Users },
    { name: "Assignments", href: "/hrms/assignments", icon: Calendar },
    { name: "Attendance", href: "/hrms/attendance", icon: Clock },
    { name: "Timesheets", href: "/hrms/timesheets", icon: FileText },
    { name: "Immigration", href: "/hrms/immigration", icon: Plane },
    { name: "I-9 Compliance", href: "/hrms/i9-compliance", icon: Shield },
    { name: "Documents", href: "/hrms/documents", icon: FileText },
    { name: "Help Desk", href: "/hrms/helpdesk", icon: Ticket },
    { name: "Performance", href: "/hrms/performance", icon: TrendingUp },
    { name: "Compensation", href: "/hrms/compensation", icon: DollarSign },
    { name: "Benefits", href: "/hrms/benefits", icon: Award },
    { name: "Settings", href: "/hrms/settings", icon: Settings },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium 
                         border-b-2 border-transparent hover:border-primary 
                         whitespace-nowrap"
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  )
}
\`\`\`

**Layout Features:**
- ✅ Horizontal tab navigation for HRMS submodules
- ✅ Icon + text labels for clarity
- ✅ Overflow handling for responsive design
- ✅ Active state indication via border
- ✅ Consistent spacing and typography

### 3.3 Root Redirect Pattern

\`\`\`typescript
// app/(dashboard)/hrms/page.tsx
import { redirect } from 'next/navigation'

export default function HRMSPage() {
  redirect("/hrms/dashboard")
}
\`\`\`

**Purpose:**
- Ensures `/hrms` always redirects to `/hrms/dashboard`
- Prevents empty state when accessing root module path
- Consistent with other modules (admin, tenant, settings)

---

## 4. Routing Patterns & Best Practices

### 4.1 File Naming Conventions

| File Type | Purpose | Example |
|-----------|---------|---------|
| `page.tsx` | Route page component | `app/(dashboard)/hrms/employees/page.tsx` |
| `layout.tsx` | Shared layout for nested routes | `app/(dashboard)/hrms/layout.tsx` |
| `loading.tsx` | Loading UI (Suspense boundary) | `app/(dashboard)/hrms/employees/loading.tsx` |
| `error.tsx` | Error UI (Error boundary) | `app/(dashboard)/hrms/error.tsx` |
| `not-found.tsx` | 404 UI | `app/(dashboard)/hrms/not-found.tsx` |
| `actions.ts` | Server actions | `app/(dashboard)/hrms/employees/actions.ts` |

### 4.2 Route Organization Best Practices

#### ✅ DO: Flat Structure for Simple Routes

\`\`\`
hrms/
├── employees/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
├── attendance/
│   ├── page.tsx
│   ├── loading.tsx
│   └── actions.ts
\`\`\`

**Benefits:**
- Easy to navigate
- Clear file purpose
- Minimal nesting

#### ✅ DO: Nested Structure for Complex Features

\`\`\`
hrms/
├── employees/
│   ├── page.tsx              # Employee list
│   ├── [id]/
│   │   ├── page.tsx          # Employee detail
│   │   ├── edit/
│   │   │   └── page.tsx      # Edit employee
│   │   └── documents/
│   │       └── page.tsx      # Employee documents
\`\`\`

**Benefits:**
- Logical hierarchy
- Clear parent-child relationships
- Scoped layouts and loading states

#### ❌ DON'T: Over-nest Routes

\`\`\`
❌ BAD:
hrms/
├── management/
│   ├── employees/
│   │   ├── directory/
│   │   │   ├── list/
│   │   │   │   └── page.tsx  # Too deep!
\`\`\`

**Problems:**
- Confusing URL structure
- Difficult to maintain
- Unnecessary complexity

### 4.3 Dynamic Routes

#### Single Dynamic Segment

\`\`\`typescript
// app/(dashboard)/hrms/employees/[id]/page.tsx
export default async function EmployeeDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const employee = await getEmployee(params.id)
  return <EmployeeDetail employee={employee} />
}
\`\`\`

**URL Examples:**
- `/hrms/employees/123`
- `/hrms/employees/emp-456`

#### Multiple Dynamic Segments

\`\`\`typescript
// app/(dashboard)/hrms/employees/[id]/documents/[docId]/page.tsx
export default async function EmployeeDocumentPage({ 
  params 
}: { 
  params: { id: string; docId: string } 
}) {
  const document = await getEmployeeDocument(params.id, params.docId)
  return <DocumentViewer document={document} />
}
\`\`\`

**URL Examples:**
- `/hrms/employees/123/documents/doc-789`

#### Catch-all Routes

\`\`\`typescript
// app/(dashboard)/hrms/[...slug]/page.tsx
export default function CatchAllPage({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  // Handle any unmatched routes
  return <NotFound />
}
\`\`\`

**URL Examples:**
- `/hrms/any/path/here` → `params.slug = ['any', 'path', 'here']`

### 4.4 Parallel Routes (Advanced)

\`\`\`
hrms/
├── employees/
│   ├── @list/
│   │   └── page.tsx          # Employee list slot
│   ├── @detail/
│   │   └── page.tsx          # Employee detail slot
│   ├── layout.tsx            # Renders both slots
│   └── page.tsx
\`\`\`

**Use Cases:**
- Split views (list + detail)
- Modal overlays
- Conditional rendering

### 4.5 Intercepting Routes (Advanced)

\`\`\`
hrms/
├── employees/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
├── (..)employees/
│   └── [id]/
│       └── page.tsx          # Intercepts when navigating from same level
\`\`\`

**Use Cases:**
- Modal overlays that preserve background
- Photo galleries
- Quick previews

---

## 5. Navigation Flow

### 5.1 Navigation Hierarchy

\`\`\`mermaid
graph TD
    A[Dashboard Layout]  B[Module Sidebar]
    A  C[Submodule Sidebar]
    A  D[App Header]
    A  E[Main Content]
    
    B  F[HRMS Module]
    F  G[HRMS Layout]
    G  H[HRMS Tabs]
    G  I[HRMS Content]
    
    H  J[Dashboard]
    H  K[Employees]
    H  L[Attendance]
    H  M[Performance]
    H  N[Compensation]
    H  O[Benefits]
    H  P[Analytics]
\`\`\`

### 5.2 URL Mapping

| URL Path | File Path | Component |
|----------|-----------|-----------|
| `/hrms` | `app/(dashboard)/hrms/page.tsx` | Redirects to `/hrms/dashboard` |
| `/hrms/dashboard` | `app/(dashboard)/hrms/dashboard/page.tsx` | HRMS Dashboard |
| `/hrms/employees` | `app/(dashboard)/hrms/employees/page.tsx` | Employee Directory |
| `/hrms/employees/123` | `app/(dashboard)/hrms/employees/[id]/page.tsx` | Employee Detail |
| `/hrms/performance` | `app/(dashboard)/hrms/performance/page.tsx` | Performance Management |
| `/hrms/compensation` | `app/(dashboard)/hrms/compensation/page.tsx` | Compensation Management |
| `/hrms/benefits` | `app/(dashboard)/hrms/benefits/page.tsx` | Benefits Management |
| `/hrms/analytics` | `app/(dashboard)/hrms/analytics/page.tsx` | HR Analytics |

### 5.3 Navigation Components

#### Module Sidebar (Left)

\`\`\`typescript
// components/layout/module-sidebar.tsx
const modules = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "HRMS", href: "/hrms", icon: Building2 },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Projects", href: "/projects", icon: Briefcase },
]
\`\`\`

#### Submodule Sidebar (Secondary)

\`\`\`typescript
// components/layout/submodule-sidebar.tsx
// Dynamically shows submodules based on current module
// For HRMS: Shows Employees, Attendance, Performance, etc.
\`\`\`

#### HRMS Tabs (Horizontal)

\`\`\`typescript
// app/(dashboard)/hrms/layout.tsx
// Horizontal tab navigation within HRMS module
\`\`\`

---

## 6. Common Issues & Solutions

### 6.1 Issue: Route Not Found (404)

**Symptoms:**
- Accessing `/hrms/employees` returns 404
- Page exists but doesn't render

**Common Causes:**
1. Missing `page.tsx` file
2. Incorrect file naming (e.g., `Page.tsx` instead of `page.tsx`)
3. File in wrong directory

**Solution:**
\`\`\`bash
# Verify file exists
ls app/(dashboard)/hrms/employees/page.tsx

# Check file naming (must be lowercase)
# ✅ page.tsx
# ❌ Page.tsx
# ❌ index.tsx
\`\`\`

### 6.2 Issue: Infinite Redirect Loop

**Symptoms:**
- Browser shows "Too many redirects" error
- Page keeps reloading

**Common Causes:**
1. Redirect in `page.tsx` points to itself
2. Middleware redirects to a route that redirects back

**Solution:**
\`\`\`typescript
// ❌ BAD: Redirects to itself
// app/(dashboard)/hrms/page.tsx
export default function HRMSPage() {
  redirect("/hrms")  // Creates infinite loop!
}

// ✅ GOOD: Redirects to different route
export default function HRMSPage() {
  redirect("/hrms/dashboard")
}
\`\`\`

### 6.3 Issue: Layout Not Applied

**Symptoms:**
- Page renders without expected layout
- Missing sidebar or header

**Common Causes:**
1. `layout.tsx` in wrong directory
2. Route group not properly configured

**Solution:**
\`\`\`
✅ CORRECT:
app/(dashboard)/
├── layout.tsx          # Applies to all dashboard routes
├── hrms/
│   ├── layout.tsx      # Applies to all HRMS routes
│   └── employees/
│       └── page.tsx    # Gets both layouts

❌ INCORRECT:
app/
├── dashboard/
│   ├── layout.tsx      # Only applies to /dashboard/*
│   └── hrms/           # Not in route group!
│       └── page.tsx
\`\`\`

### 6.4 Issue: Dynamic Route Not Matching

**Symptoms:**
- `/hrms/employees/123` returns 404
- Dynamic segment not captured

**Common Causes:**
1. Incorrect folder naming
2. Missing brackets in folder name

**Solution:**
\`\`\`
❌ INCORRECT:
hrms/employees/id/page.tsx

✅ CORRECT:
hrms/employees/[id]/page.tsx
\`\`\`

### 6.5 Issue: Server Actions Not Working

**Symptoms:**
- Form submission fails
- Server action returns error

**Common Causes:**
1. Missing `"use server"` directive
2. Action not exported
3. Action in wrong file location

**Solution:**
\`\`\`typescript
// ✅ CORRECT: actions.ts
"use server"

export async function createEmployee(data: FormData) {
  // Server-side logic
}

// ❌ INCORRECT: Missing "use server"
export async function createEmployee(data: FormData) {
  // Won't work as server action
}
\`\`\`

---

## 7. Scalability Recommendations

### 7.1 Module Organization

As the HRMS module grows, consider organizing by feature domain:

\`\`\`
hrms/
├── (core)/                    # Core HR functions
│   ├── employees/
│   ├── attendance/
│   └── timesheets/
├── (talent)/                  # Talent management
│   ├── performance/
│   ├── onboarding/
│   └── offboarding/
├── (compensation)/            # Compensation & benefits
│   ├── compensation/
│   └── benefits/
├── (compliance)/              # Compliance & legal
│   ├── i9-compliance/
│   ├── immigration/
│   └── documents/
└── (analytics)/               # Analytics & reporting
    ├── analytics/
    └── reports/
\`\`\`

**Benefits:**
- Logical grouping by domain
- Easier to navigate large codebases
- Clear ownership boundaries
- Supports team specialization

### 7.2 Shared Components

Create a shared components directory for HRMS:

\`\`\`
components/hrms/
├── employees/
│   ├── employee-card.tsx
│   ├── employee-table.tsx
│   └── employee-form.tsx
├── performance/
│   ├── review-form.tsx
│   └── goal-tracker.tsx
├── compensation/
│   ├── salary-calculator.tsx
│   └── comp-letter.tsx
└── shared/
    ├── status-badge.tsx
    ├── date-picker.tsx
    └── currency-input.tsx
\`\`\`

### 7.3 API Route Organization

\`\`\`
app/api/
├── hrms/
│   ├── employees/
│   │   ├── route.ts          # GET /api/hrms/employees
│   │   └── [id]/
│   │       └── route.ts      # GET /api/hrms/employees/:id
│   ├── attendance/
│   │   └── route.ts
│   └── performance/
│       └── route.ts
\`\`\`

### 7.4 Type Safety

Create shared types for HRMS:

\`\`\`typescript
// types/hrms.ts
export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  // ...
}

export interface PerformanceReview {
  id: string
  employeeId: string
  reviewerId: string
  rating: number
  // ...
}

export interface CompensationChange {
  id: string
  employeeId: string
  oldSalary: number
  newSalary: number
  effectiveDate: string
  // ...
}
\`\`\`

### 7.5 Loading States

Implement consistent loading patterns:

\`\`\`typescript
// app/(dashboard)/hrms/employees/loading.tsx
export default function EmployeesLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
\`\`\`

### 7.6 Error Handling

Implement error boundaries at appropriate levels:

\`\`\`typescript
// app/(dashboard)/hrms/error.tsx
"use client"

export default function HRMSError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  )
}
\`\`\`

---

## 8. Testing & Validation

### 8.1 Route Testing Checklist

- [ ] All routes accessible via direct URL
- [ ] Navigation between routes works correctly
- [ ] Back/forward browser buttons work
- [ ] Deep linking works (e.g., `/hrms/employees/123`)
- [ ] Redirects work as expected
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Authentication protection works
- [ ] Breadcrumbs update correctly
- [ ] Active tab/link highlighting works

### 8.2 Manual Testing Script

\`\`\`bash
# Test root redirect
curl http://localhost:3000/hrms
# Should redirect to /hrms/dashboard

# Test protected route without auth
curl http://localhost:3000/hrms/employees
# Should redirect to /signin

# Test dynamic route
curl http://localhost:3000/hrms/employees/123
# Should return employee detail page

# Test 404 handling
curl http://localhost:3000/hrms/nonexistent
# Should return 404 page
\`\`\`

### 8.3 Automated Testing

\`\`\`typescript
// __tests__/hrms-routing.test.ts
import { render, screen } from "@testing-library/react"
import { useRouter } from 'next/navigation'

describe("HRMS Routing", () => {
  it("redirects /hrms to /hrms/dashboard", () => {
    // Test redirect logic
  })

  it("renders employee list at /hrms/employees", () => {
    // Test employee list page
  })

  it("renders employee detail at /hrms/employees/:id", () => {
    // Test dynamic route
  })
})
\`\`\`

---

## 9. Migration Guide

### 9.1 Adding a New HRMS Submodule

**Step 1: Create Directory Structure**

\`\`\`bash
mkdir -p app/(dashboard)/hrms/new-module
touch app/(dashboard)/hrms/new-module/page.tsx
touch app/(dashboard)/hrms/new-module/loading.tsx
touch app/(dashboard)/hrms/new-module/actions.ts
\`\`\`

**Step 2: Create Page Component**

\`\`\`typescript
// app/(dashboard)/hrms/new-module/page.tsx
export default async function NewModulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Module</h1>
        <p className="text-muted-foreground">Module description</p>
      </div>
      {/* Module content */}
    </div>
  )
}
\`\`\`

**Step 3: Add Loading State**

\`\`\`typescript
// app/(dashboard)/hrms/new-module/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function NewModuleLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
\`\`\`

**Step 4: Update HRMS Layout**

\`\`\`typescript
// app/(dashboard)/hrms/layout.tsx
const tabs = [
  // ... existing tabs
  { name: "New Module", href: "/hrms/new-module", icon: NewIcon },
]
\`\`\`

**Step 5: Update Middleware (if needed)**

\`\`\`typescript
// middleware.ts
// HRMS routes are already protected via "/hrms" prefix
// No changes needed unless adding special auth logic
\`\`\`

### 9.2 Adding Dynamic Routes

**Step 1: Create Dynamic Segment**

\`\`\`bash
mkdir -p app/(dashboard)/hrms/employees/[id]
touch app/(dashboard)/hrms/employees/[id]/page.tsx
\`\`\`

**Step 2: Implement Page**

\`\`\`typescript
// app/(dashboard)/hrms/employees/[id]/page.tsx
export default async function EmployeeDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const employee = await getEmployee(params.id)
  
  if (!employee) {
    notFound()
  }

  return <EmployeeDetail employee={employee} />
}
\`\`\`

**Step 3: Add Navigation**

\`\`\`typescript
// components/hrms/employees/employee-table.tsx
import Link from "next/link"

<Link href={`/hrms/employees/${employee.id}`}>
  {employee.name}
</Link>
\`\`\`

---

## 10. Performance Optimization

### 10.1 Route Prefetching

Next.js automatically prefetches routes when using `<Link>`:

\`\`\`typescript
// ✅ Automatic prefetching
<Link href="/hrms/employees">Employees</Link>

// ❌ No prefetching
<a href="/hrms/employees">Employees</a>
\`\`\`

### 10.2 Loading Optimization

Use `loading.tsx` for instant loading states:

\`\`\`typescript
// app/(dashboard)/hrms/employees/loading.tsx
export default function Loading() {
  return <EmployeesSkeleton />
}
\`\`\`

### 10.3 Parallel Data Fetching

\`\`\`typescript
// Fetch data in parallel
const [employees, departments, locations] = await Promise.all([
  getEmployees(),
  getDepartments(),
  getLocations(),
])
\`\`\`

### 10.4 Route Segment Config

\`\`\`typescript
// app/(dashboard)/hrms/employees/page.tsx
export const dynamic = "force-dynamic" // or "force-static"
export const revalidate = 3600 // Revalidate every hour
\`\`\`

---

## 11. Security Considerations

### 11.1 Route Protection

All HRMS routes are protected via middleware:

\`\`\`typescript
// middleware.ts
const protectedPaths = ["/hrms"]
\`\`\`

### 11.2 RBAC Integration

\`\`\`typescript
// app/(dashboard)/hrms/compensation/page.tsx
import { checkPermission } from "@/lib/rbac"

export default async function CompensationPage() {
  const hasAccess = await checkPermission("hrms.compensation.read")
  
  if (!hasAccess) {
    return <AccessDenied />
  }

  // Render page
}
\`\`\`

### 11.3 Data Masking

\`\`\`typescript
// Mask sensitive data based on permissions
const employee = await getEmployee(id)
const maskedEmployee = await maskFields(employee, ["ssn", "salary"])
\`\`\`

---

## 12. Troubleshooting Guide

### 12.1 Route Not Rendering

**Check:**
1. File named `page.tsx` (lowercase)
2. File in correct directory
3. Component exported as default
4. No syntax errors

### 12.2 Layout Not Applied

**Check:**
1. `layout.tsx` in parent directory
2. Route group properly configured
3. Layout exports default component

### 12.3 Redirect Loop

**Check:**
1. Redirect target is different from source
2. No circular redirects in middleware
3. Authentication logic correct

### 12.4 Dynamic Route 404

**Check:**
1. Folder named with brackets: `[id]`
2. `page.tsx` exists in dynamic folder
3. Parameter name matches in component

---

## 13. Future Enhancements

### 13.1 Planned Features

- [ ] Modal routes for quick actions
- [ ] Parallel routes for split views
- [ ] Intercepting routes for overlays
- [ ] Route groups for feature flags
- [ ] A/B testing routes

### 13.2 Performance Improvements

- [ ] Implement route-level code splitting
- [ ] Add route prefetching strategies
- [ ] Optimize bundle sizes per route
- [ ] Implement progressive enhancement

### 13.3 Developer Experience

- [ ] Auto-generate route documentation
- [ ] Route visualization tool
- [ ] Type-safe route helpers
- [ ] Route testing utilities

---

## 14. Conclusion

The Nino360 routing architecture follows Next.js best practices with:

✅ **Clear Organization**: Route groups for logical separation  
✅ **Consistent Patterns**: Standardized file naming and structure  
✅ **Security**: Middleware-level authentication protection  
✅ **Performance**: Automatic prefetching and optimization  
✅ **Scalability**: Modular structure supports growth  
✅ **Maintainability**: Clear conventions and documentation  

The `/app/(dashboard)/hrms` path correctly maps to the HRMS dashboard with proper authentication, layout nesting, and navigation structure. All submodules follow consistent patterns for easy maintenance and extension.

---

## Appendix A: Quick Reference

### Route Patterns

| Pattern | Example | Use Case |
|---------|---------|----------|
| Static | `hrms/employees/page.tsx` | Fixed route |
| Dynamic | `hrms/employees/[id]/page.tsx` | Variable segment |
| Catch-all | `hrms/[...slug]/page.tsx` | Multiple segments |
| Optional catch-all | `hrms/[[...slug]]/page.tsx` | Optional segments |
| Route group | `(dashboard)/hrms/page.tsx` | Organize without URL |
| Parallel | `@modal/page.tsx` | Multiple slots |
| Intercepting | `(..)employees/page.tsx` | Intercept navigation |

### File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared UI |
| `loading.tsx` | Loading UI |
| `error.tsx` | Error UI |
| `not-found.tsx` | 404 UI |
| `template.tsx` | Re-rendered layout |
| `default.tsx` | Parallel route fallback |

### Navigation APIs

\`\`\`typescript
// Client-side navigation
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from "next/link"

// Server-side navigation
import { redirect, notFound } from 'next/navigation'
\`\`\`

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained By:** Nino360 Engineering Team
