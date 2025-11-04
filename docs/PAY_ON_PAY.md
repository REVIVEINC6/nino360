# Pay-on-Pay (Client → Vendor Linkage)

This module links client receipts to vendor payouts, anchors settlement batches on-chain (Merkle root + artifact CID), and supports MPC/TSS signing. It includes AI-assisted allocation suggestions with provenance.

Key pieces delivered in this iteration:
- DB schema (see scripts/55-finance-pay-on-pay.sql)
- Solidity contract skeleton: contracts/settlement-anchor
- Merkle utilities: lib/crypto/merkle.ts
- API routes: /api/pay-on-pay/* (create run, suggest, anchor, verify, execute, webhooks)
- UI: pages under /finance/pay-on-pay (list and run detail), components in components/finance-pay-on-pay
- AI stub: lib/ai/payOnPay.ts
- Smoke test: __tests__/e2e/pay-on-pay.spec.ts (basic anchor flow, mocked)

Dev quick start:
1) Apply SQL (if not already applied by setup): scripts/55-finance-pay-on-pay.sql
2) Create a settlement run via UI or POST /api/pay-on-pay/settlements
3) Add items and payouts (stubbed in UI/actions)
4) Anchor via Run Detail page or POST /api/pay-on-pay/anchor/:id
5) Verify via GET /api/pay-on-pay/verify-anchor/:root?runId=:id

Notes:
- Anchoring and TSS flows are mocked for local dev.
- Webhooks run on Edge runtime with signature header placeholders.
- Replace stubbed merkle root calculation in actions with lib/crypto/merkle utilities for production use.
