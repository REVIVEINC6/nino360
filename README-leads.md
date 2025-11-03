# Nino360 Leads Module (v0)

This adds a production-ready scaffold for multi-tenant Leads with AI-assisted parsing, enrichment, FLAC, and audit anchoring.

## Quickstart

1. ENV

Create `.env.local` and `.env` with:

\`\`\`
NEXT_PUBLIC_API_BASE=https://api.example.com
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_PUBLIC_KEY=...
REDIS_URL=redis://:password@localhost:6379
OPENAI_API_KEY=... # optional
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
DOMAIN_EMAIL_FROM=postmaster@yourdomain.com
BLOCKCHAIN_PROVIDER_API_KEY=... # optional
\`\`\`

2. Database

Apply migrations from `db/migrations` to your Supabase Postgres.

3. Edge Functions

- Deploy functions under `supabase/functions` via Supabase CLI.

4. Worker

- `pnpm i` then `pnpm ts-node workers/lead-worker/src/index.ts` (scaffold prints self-test).

5. Frontend

- Run dev: `pnpm run dev`

## Security & RLS

- Strict tenant isolation via RLS using `jwt.claims.tenant_id`.
- RBAC & FLAC enforced via `field_permissions` and middleware utilities in `lib/security/flac.ts`.

## Notes

- LinkedIn connector is OAuth-only scaffolding; you must register an app and provide creds.
- Email validation defaults to MX check only; SMTP probing must be opt-in per tenant.
- Blockchain anchoring stores hashes in DB by default; adapters can be added for chains.
