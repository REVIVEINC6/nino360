-- Pay-on-Pay schema extensions (dev scaffold)

-- settlement_runs
-- id uuid pk, tenant_id uuid, run_number text, run_date date, status text,
-- totals, anchor fields, timestamps

-- settlement_items
-- payout_instructions
-- blockchain_anchors
-- ai_suggestions
-- settlement_disputes

-- NOTE: This is a placeholder for migration content. Implement these in Supabase migrations or SQL scripts.

-- Example RPCs (stubs)
-- create or replace function generate_settlement_run_number(p_tenant_id uuid) returns text as $$
-- begin
--   return 'RUN-' || extract(epoch from now())::bigint::text;
-- end;
-- $$ language plpgsql stable;

-- create or replace function calculate_merkle_leaf(p_item_id uuid) returns text as $$
-- declare
--   payload text;
-- begin
--   -- Serialize item fields deterministically and hash (pseudo)
--   -- select to_jsonb(si) into payload from settlement_items si where id = p_item_id;
--   return encode(digest(coalesce(payload, ''), 'sha256'), 'hex');
-- end;
-- $$ language plpgsql stable;
