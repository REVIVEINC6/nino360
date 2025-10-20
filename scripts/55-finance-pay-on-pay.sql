-- =====================================================================================
-- Nino360 HRMS: Pay-on-Pay Settlement System with Blockchain Anchoring & MPC/TSS
-- =====================================================================================
-- Features:
-- 1. Client receipt → vendor payout linkage (split, net, reroute)
-- 2. Blockchain anchoring (Merkle roots on L2/rollup)
-- 3. MPC/TSS multi-party custody for payout signing
-- 4. ZK-proofs for sum correctness (optional)
-- 5. AI orchestration for allocation suggestions & anomaly detection
-- 6. Privacy-preserving (PII minimized, only hashes on-chain)
-- 7. Compliance (PCI/GDPR/tax) with audit trails
-- =====================================================================================

-- =====================================================================================
-- 1. SETTLEMENT RUNS (with blockchain anchoring)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.settlement_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_number text NOT NULL, -- e.g., "SR-2025-001"
  run_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Linkage rules
  linkage_policy jsonb NOT NULL DEFAULT '{"type": "auto", "rules": []}', -- auto, manual, hybrid
  
  -- Financial summary
  total_client_receipts numeric(15,2) NOT NULL DEFAULT 0,
  total_vendor_payouts numeric(15,2) NOT NULL DEFAULT 0,
  total_fees numeric(15,2) NOT NULL DEFAULT 0,
  total_taxes numeric(15,2) NOT NULL DEFAULT 0,
  net_amount numeric(15,2) NOT NULL DEFAULT 0,
  
  -- Blockchain anchoring
  anchor_root text, -- Merkle root hash
  anchor_tx text, -- Blockchain transaction hash
  artifact_cid text, -- IPFS/S3 CID for encrypted batch payload
  zk_proof_cid text, -- Optional ZK-proof CID
  anchor_status text DEFAULT 'pending' CHECK (anchor_status IN ('pending', 'anchored', 'failed')),
  anchored_at timestamptz,
  
  -- Metadata
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  completed_at timestamptz,
  notes text,
  metadata jsonb DEFAULT '{}',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(tenant_id, run_number)
);

CREATE INDEX idx_settlement_runs_tenant ON finance.settlement_runs(tenant_id);
CREATE INDEX idx_settlement_runs_status ON finance.settlement_runs(status);
CREATE INDEX idx_settlement_runs_date ON finance.settlement_runs(run_date);
CREATE INDEX idx_settlement_runs_anchor_tx ON finance.settlement_runs(anchor_tx) WHERE anchor_tx IS NOT NULL;

-- =====================================================================================
-- 2. LINKAGE RULES (client → vendor mapping)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.linkage_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN ('direct', 'split', 'net', 'reroute')),
  priority int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  
  -- Matching criteria
  client_id uuid, -- Optional: specific client
  vendor_id uuid, -- Optional: specific vendor
  project_id uuid, -- Optional: specific project
  invoice_pattern text, -- Regex pattern for invoice matching
  
  -- Allocation logic
  allocation_method text NOT NULL CHECK (allocation_method IN ('percentage', 'fixed_amount', 'formula')),
  allocation_config jsonb NOT NULL DEFAULT '{}', -- {percentage: 80, vendors: [{id, share}]}
  
  -- Conditions
  conditions jsonb DEFAULT '{}', -- {min_amount, max_amount, date_range, etc.}
  
  -- AI suggestions
  ai_suggested boolean DEFAULT false,
  ai_confidence numeric(3,2), -- 0.00 to 1.00
  ai_reasoning text,
  
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_linkage_rules_tenant ON finance.linkage_rules(tenant_id);
CREATE INDEX idx_linkage_rules_active ON finance.linkage_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_linkage_rules_priority ON finance.linkage_rules(priority DESC);

-- =====================================================================================
-- 3. SETTLEMENT ITEMS (individual linkages)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.settlement_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_id uuid NOT NULL REFERENCES finance.settlement_runs(id) ON DELETE CASCADE,
  
  -- Client side
  client_invoice_id uuid, -- Reference to client invoice
  client_receipt_id uuid, -- Reference to client payment receipt
  client_amount numeric(15,2) NOT NULL,
  client_currency text NOT NULL DEFAULT 'USD',
  
  -- Vendor side
  vendor_id uuid NOT NULL,
  vendor_bill_id uuid, -- Reference to vendor bill
  vendor_payout_id uuid, -- Reference to payout instruction
  vendor_amount numeric(15,2) NOT NULL,
  vendor_currency text NOT NULL DEFAULT 'USD',
  
  -- Linkage
  linkage_rule_id uuid REFERENCES finance.linkage_rules(id),
  linkage_type text NOT NULL CHECK (linkage_type IN ('direct', 'split', 'net', 'reroute')),
  allocation_percentage numeric(5,2), -- For split allocations
  
  -- Fees & taxes
  fee_amount numeric(15,2) DEFAULT 0,
  tax_amount numeric(15,2) DEFAULT 0,
  
  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'failed', 'disputed')),
  
  -- Verification
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  verification_notes text,
  
  -- Merkle proof
  merkle_leaf_hash text, -- Hash of this item for Merkle tree
  merkle_path jsonb, -- Path to root for verification
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_settlement_items_run ON finance.settlement_items(run_id);
CREATE INDEX idx_settlement_items_tenant ON finance.settlement_items(tenant_id);
CREATE INDEX idx_settlement_items_vendor ON finance.settlement_items(vendor_id);
CREATE INDEX idx_settlement_items_status ON finance.settlement_items(status);

-- =====================================================================================
-- 4. PAYOUT INSTRUCTIONS (with MPC/TSS signing)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.payout_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_id uuid NOT NULL REFERENCES finance.settlement_runs(id) ON DELETE CASCADE,
  
  -- Payee details
  vendor_id uuid NOT NULL,
  vendor_name text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('bank_transfer', 'ach', 'wire', 'check', 'crypto')),
  payment_details jsonb NOT NULL, -- {account_number, routing, etc.} - encrypted
  
  -- Amount
  amount numeric(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  
  -- MPC/TSS signing
  tss_request_id text, -- Request ID from MPC/TSS service
  signed_payload_hash text, -- Hash of signed payload
  signed_by_meta jsonb, -- {participants: [{id, signature, timestamp}]}
  custody_policy_id uuid, -- Reference to custody policy
  signature_threshold int DEFAULT 2, -- e.g., 2-of-3 multisig
  
  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signing', 'signed', 'submitted', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Provider integration
  provider text, -- stripe, razorpay, bank_api, etc.
  provider_payout_id text, -- External payout ID
  provider_status text,
  provider_response jsonb,
  
  -- Timestamps
  signed_at timestamptz,
  submitted_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payout_instructions_run ON finance.payout_instructions(run_id);
CREATE INDEX idx_payout_instructions_tenant ON finance.payout_instructions(tenant_id);
CREATE INDEX idx_payout_instructions_vendor ON finance.payout_instructions(vendor_id);
CREATE INDEX idx_payout_instructions_status ON finance.payout_instructions(status);
CREATE INDEX idx_payout_instructions_tss ON finance.payout_instructions(tss_request_id) WHERE tss_request_id IS NOT NULL;

-- =====================================================================================
-- 5. CUSTODY POLICIES (MPC/TSS configuration)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.custody_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  policy_name text NOT NULL,
  policy_type text NOT NULL CHECK (policy_type IN ('mpc', 'tss', 'multisig', 'hsm')),
  
  -- Threshold configuration
  threshold int NOT NULL DEFAULT 2, -- e.g., 2-of-3
  total_participants int NOT NULL DEFAULT 3,
  
  -- Participants
  participants jsonb NOT NULL, -- [{id, name, role, public_key}]
  
  -- Limits
  daily_limit numeric(15,2),
  per_transaction_limit numeric(15,2),
  
  -- Provider
  provider text, -- fireblocks, qredo, zengo, custom
  provider_config jsonb, -- API keys, endpoints, etc. - encrypted
  
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_custody_policies_tenant ON finance.custody_policies(tenant_id);
CREATE INDEX idx_custody_policies_active ON finance.custody_policies(is_active) WHERE is_active = true;

-- =====================================================================================
-- 6. BLOCKCHAIN ANCHORS (on-chain verification)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.blockchain_anchors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_id uuid REFERENCES finance.settlement_runs(id) ON DELETE CASCADE,
  
  -- Merkle tree
  merkle_root text NOT NULL,
  merkle_tree jsonb, -- Full tree structure for verification
  leaf_count int NOT NULL,
  
  -- Blockchain details
  chain_id text NOT NULL, -- polygon, base, ethereum, etc.
  contract_address text NOT NULL,
  transaction_hash text NOT NULL,
  block_number bigint,
  block_timestamp timestamptz,
  
  -- Artifact storage
  artifact_cid text, -- IPFS/S3 CID for encrypted batch
  artifact_url text,
  artifact_hash text, -- SHA-256 of artifact
  
  -- ZK-proof (optional)
  zk_proof_cid text,
  zk_proof_type text, -- groth16, plonk, stark
  zk_circuit_id text,
  
  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'confirmed', 'failed')),
  confirmations int DEFAULT 0,
  
  -- Gas & costs
  gas_used bigint,
  gas_price numeric(30,0), -- in wei
  transaction_cost numeric(18,8), -- in native token
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_blockchain_anchors_tenant ON finance.blockchain_anchors(tenant_id);
CREATE INDEX idx_blockchain_anchors_run ON finance.blockchain_anchors(run_id);
CREATE INDEX idx_blockchain_anchors_tx ON finance.blockchain_anchors(transaction_hash);
CREATE INDEX idx_blockchain_anchors_root ON finance.blockchain_anchors(merkle_root);

-- =====================================================================================
-- 7. AI SUGGESTIONS (allocation & anomaly detection)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.ai_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_id uuid REFERENCES finance.settlement_runs(id) ON DELETE CASCADE,
  
  suggestion_type text NOT NULL CHECK (suggestion_type IN ('allocation', 'anomaly', 'dispute_draft', 'optimization')),
  
  -- Input context
  input_data jsonb NOT NULL,
  
  -- AI output
  suggestion jsonb NOT NULL,
  confidence numeric(3,2) NOT NULL, -- 0.00 to 1.00
  reasoning text,
  
  -- Provenance
  model_name text NOT NULL,
  model_version text,
  embedding_ids text[], -- For RAG retrieval
  source_doc_ids text[], -- Source documents used
  
  -- User action
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'modified')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  review_notes text,
  
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_suggestions_tenant ON finance.ai_suggestions(tenant_id);
CREATE INDEX idx_ai_suggestions_run ON finance.ai_suggestions(run_id);
CREATE INDEX idx_ai_suggestions_type ON finance.ai_suggestions(suggestion_type);
CREATE INDEX idx_ai_suggestions_status ON finance.ai_suggestions(status);

-- =====================================================================================
-- 8. DISPUTE RECORDS
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.settlement_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_id uuid NOT NULL REFERENCES finance.settlement_runs(id) ON DELETE CASCADE,
  item_id uuid REFERENCES finance.settlement_items(id) ON DELETE CASCADE,
  
  dispute_type text NOT NULL CHECK (dispute_type IN ('amount_mismatch', 'missing_linkage', 'duplicate', 'fraud', 'other')),
  
  -- Parties
  raised_by uuid NOT NULL REFERENCES auth.users(id),
  assigned_to uuid REFERENCES auth.users(id),
  
  -- Details
  description text NOT NULL,
  expected_amount numeric(15,2),
  actual_amount numeric(15,2),
  evidence_cids text[], -- IPFS CIDs for evidence documents
  
  -- Status
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'escalated', 'closed')),
  resolution text,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  
  -- Blockchain anchor
  dispute_anchor_tx text, -- On-chain dispute flag
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_settlement_disputes_tenant ON finance.settlement_disputes(tenant_id);
CREATE INDEX idx_settlement_disputes_run ON finance.settlement_disputes(run_id);
CREATE INDEX idx_settlement_disputes_status ON finance.settlement_disputes(status);

-- =====================================================================================
-- 9. AUDIT EVENTS (append-only with Merkle chaining)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.settlement_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_id uuid REFERENCES finance.settlement_runs(id) ON DELETE CASCADE,
  
  event_type text NOT NULL,
  actor_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  
  -- Merkle chaining
  prev_hash text,
  event_hash text NOT NULL,
  merkle_leaf_hash text,
  merkle_path jsonb,
  
  -- Data
  payload jsonb NOT NULL,
  artifact_cid text,
  
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_settlement_audit_events_tenant ON finance.settlement_audit_events(tenant_id);
CREATE INDEX idx_settlement_audit_events_run ON finance.settlement_audit_events(run_id);
CREATE INDEX idx_settlement_audit_events_timestamp ON finance.settlement_audit_events(timestamp);
CREATE INDEX idx_settlement_audit_events_hash ON finance.settlement_audit_events(event_hash);

-- =====================================================================================
-- 10. TENANT ENCRYPTION KEYS (KMS references)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS tenant_security.encryption_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  key_type text NOT NULL CHECK (key_type IN ('data', 'artifact', 'pii', 'backup')),
  key_id text NOT NULL, -- KMS key ID (never store raw keys!)
  key_provider text NOT NULL, -- aws_kms, gcp_kms, azure_kv, hashicorp_vault
  
  -- Rotation
  version int NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  rotated_at timestamptz,
  next_rotation_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(tenant_id, key_type, version)
);

CREATE INDEX idx_encryption_keys_tenant ON tenant_security.encryption_keys(tenant_id);
CREATE INDEX idx_encryption_keys_active ON tenant_security.encryption_keys(is_active) WHERE is_active = true;

-- =====================================================================================
-- 11. VERIFIABLE CREDENTIALS (vendor KYC)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS finance.verifiable_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL,
  
  credential_type text NOT NULL CHECK (credential_type IN ('kyc', 'kyb', 'tax_id', 'bank_verification')),
  
  -- W3C VC format
  vc_cid text NOT NULL, -- IPFS CID for credential
  issuer_did text NOT NULL, -- DID of issuer
  subject_did text, -- DID of vendor
  
  -- Status
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspended')),
  issued_at timestamptz NOT NULL,
  expires_at timestamptz,
  revoked_at timestamptz,
  
  -- Verification
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_verifiable_credentials_tenant ON finance.verifiable_credentials(tenant_id);
CREATE INDEX idx_verifiable_credentials_vendor ON finance.verifiable_credentials(vendor_id);
CREATE INDEX idx_verifiable_credentials_status ON finance.verifiable_credentials(status);

-- =====================================================================================
-- 12. RLS POLICIES
-- =====================================================================================

ALTER TABLE finance.settlement_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.linkage_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.settlement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.payout_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.custody_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.blockchain_anchors ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.settlement_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.settlement_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_security.encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.verifiable_credentials ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY settlement_runs_tenant_isolation ON finance.settlement_runs
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY linkage_rules_tenant_isolation ON finance.linkage_rules
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY settlement_items_tenant_isolation ON finance.settlement_items
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY payout_instructions_tenant_isolation ON finance.payout_instructions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY custody_policies_tenant_isolation ON finance.custody_policies
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY blockchain_anchors_tenant_isolation ON finance.blockchain_anchors
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY ai_suggestions_tenant_isolation ON finance.ai_suggestions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY settlement_disputes_tenant_isolation ON finance.settlement_disputes
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY settlement_audit_events_tenant_isolation ON finance.settlement_audit_events
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY encryption_keys_tenant_isolation ON tenant_security.encryption_keys
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY verifiable_credentials_tenant_isolation ON finance.verifiable_credentials
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- =====================================================================================
-- 13. UTILITY FUNCTIONS
-- =====================================================================================

-- Generate settlement run number
CREATE OR REPLACE FUNCTION finance.generate_settlement_run_number(p_tenant_id uuid)
RETURNS text AS $$
DECLARE
  v_year text;
  v_count int;
  v_number text;
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::text;
  
  SELECT COUNT(*) + 1 INTO v_count
  FROM finance.settlement_runs
  WHERE tenant_id = p_tenant_id
    AND EXTRACT(YEAR FROM run_date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  v_number := 'SR-' || v_year || '-' || LPAD(v_count::text, 3, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Calculate Merkle leaf hash
CREATE OR REPLACE FUNCTION finance.calculate_merkle_leaf(p_item_id uuid)
RETURNS text AS $$
DECLARE
  v_data jsonb;
  v_hash text;
BEGIN
  SELECT jsonb_build_object(
    'id', id,
    'client_amount', client_amount,
    'vendor_amount', vendor_amount,
    'vendor_id', vendor_id,
    'timestamp', created_at
  ) INTO v_data
  FROM finance.settlement_items
  WHERE id = p_item_id;
  
  v_hash := encode(digest(v_data::text, 'sha256'), 'hex');
  
  RETURN v_hash;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================================
-- 14. SEED DATA
-- =====================================================================================

-- Insert default custody policy
INSERT INTO finance.custody_policies (tenant_id, policy_name, policy_type, threshold, total_participants, participants)
SELECT 
  id,
  'Default 2-of-3 MPC Policy',
  'mpc',
  2,
  3,
  '[
    {"id": "participant_1", "name": "Tenant Treasury", "role": "owner", "public_key": "0x..."},
    {"id": "participant_2", "name": "Nino Custody", "role": "custodian", "public_key": "0x..."},
    {"id": "participant_3", "name": "Third-Party Auditor", "role": "auditor", "public_key": "0x..."}
  ]'::jsonb
FROM tenants
WHERE NOT EXISTS (
  SELECT 1 FROM finance.custody_policies WHERE tenant_id = tenants.id
)
LIMIT 1;

-- Insert default linkage rules
INSERT INTO finance.linkage_rules (tenant_id, rule_name, rule_type, priority, allocation_method, allocation_config)
SELECT 
  id,
  'Direct Pass-Through',
  'direct',
  1,
  'percentage',
  '{"percentage": 100}'::jsonb
FROM tenants
WHERE NOT EXISTS (
  SELECT 1 FROM finance.linkage_rules WHERE tenant_id = tenants.id
)
LIMIT 1;
