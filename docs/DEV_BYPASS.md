# Development RBAC/Admin Bypass

To ease local development while RBAC and seed data are in flux, you can enable dev-only bypasses. These bypasses are ignored in production and require the user to be authenticated.

- RBAC_BYPASS=1
  - Location: lib/rbac/server.ts
  - Effect: hasPermission/hasRole and require* guards return success for any authenticated user in non-production.
  - Scope: Applies to CRM, HRMS, etc. pages/actions that use the shared RBAC helpers.

- ADMIN_BYPASS=1
  - Location: app/(dashboard)/admin/actions/*
  - Effect: Admin server actions treat the user as authorized in non-production. Actions still return structured errors on other failures.

Safety and notes:
- These bypasses only activate when NODE_ENV !== "production".
- RBAC_BYPASS additionally requires the user to be authenticated (logged in); it does not grant anonymous access.
- Some server actions still require a valid tenant/profile context (e.g., crm dashboard analytics). If your dev user lacks a tenant, certain analytics queries may return empty or error. Seed a tenant/profile to fully exercise those pages.
- Always unset these variables in staging/production environments.
