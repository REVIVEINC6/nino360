0003_rls_and_api_helpers.sql

Description:
- Adds a search-vector trigger for `contacts` (contacts_set_search_vector).
- Enables Row Level Security on `contacts` and creates a tenant isolation policy using `current_setting('jwt.claims.tenant_id')::uuid`.
- Adds an example seed for `roles`, `role_permissions`, and `field_permissions` (minimal, idempotent inserts).
- Adds a `notify_contacts_change` trigger to emit `pg_notify('contacts_changes', ...)` on CONTACTS change events.

Usage:
- Run migrations with your usual migration tool (psql, supabase migrations, or your migration runner).
