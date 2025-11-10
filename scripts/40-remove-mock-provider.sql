-- Migration: 40-remove-mock-provider.sql
-- Purpose: Remove 'mock' payment provider rows and tighten CHECK constraints to only allow 'stripe'
-- WARNING: Review and BACKUP your database before running these commands.

BEGIN;

-- 1) Inspect how many rows currently use 'mock'
SELECT count(*) AS subscriptions_with_mock FROM bill.subscriptions WHERE provider = 'mock';
SELECT count(*) AS invoices_with_mock FROM bill.invoices WHERE provider = 'mock';

-- 2) Update any rows using 'mock' to an explicit provider value.
-- Decide whether to map 'mock' -> 'stripe', NULL, or a placeholder. Here we map to 'stripe'.
UPDATE bill.subscriptions SET provider = 'stripe' WHERE provider = 'mock';
UPDATE bill.invoices SET provider = 'stripe' WHERE provider = 'mock';

-- 3) Fix CHECK constraints on provider columns.
-- Postgres CHECK constraints often have system-generated names. We look them up and then drop/add an explicit constraint.

-- Find constraint name for bill.subscriptions referencing provider
DO $$
DECLARE
  conname TEXT;
BEGIN
  SELECT conname INTO conname
  FROM pg_constraint
  WHERE conrelid = 'bill.subscriptions'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) ILIKE '%provider%';

  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE bill.subscriptions DROP CONSTRAINT %I', conname);
  END IF;

  EXECUTE 'ALTER TABLE bill.subscriptions ADD CONSTRAINT chk_bill_subscriptions_provider CHECK (provider IN (''stripe''));';
END$$;

-- Find constraint name for bill.invoices referencing provider
DO $$
DECLARE
  conname TEXT;
BEGIN
  SELECT conname INTO conname
  FROM pg_constraint
  WHERE conrelid = 'bill.invoices'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) ILIKE '%provider%';

  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE bill.invoices DROP CONSTRAINT %I', conname);
  END IF;

  EXECUTE 'ALTER TABLE bill.invoices ADD CONSTRAINT chk_bill_invoices_provider CHECK (provider IN (''stripe''));';
END$$;

COMMIT;

-- Notes:
-- - If you prefer to set provider=NULL instead of mapping to 'stripe', change the UPDATE statements accordingly.
-- - Run the SELECT queries first to verify row counts, then run the UPDATE/ALTER bits.
-- - If your DB is managed by Supabase migrations (SQL files in a migrations folder), add this script to your migration set and run via your CI or supabase CLI.
