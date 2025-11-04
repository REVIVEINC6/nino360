export interface AllocationSuggestionInput {
  runId: string
  clientInvoiceId: string
}

export interface AllocationSuggestion {
  allocations: Array<{ vendor_id: string; percentage: number; reasoning: string }>
  confidence: number
  reasoning: string
  provenance: Array<{ doc_id: string; score: number; excerpt: string }>
}

// Deterministic mock suggestion for dev
export async function suggestAllocations(input: AllocationSuggestionInput): Promise<AllocationSuggestion> {
  const seed = hashCode(input.runId + ":" + input.clientInvoiceId)
  const pct = 50 + (seed % 41) // 50..90
  const a = Math.min(95, pct)
  const b = 100 - a
  return {
    allocations: [
      { vendor_id: "vendor_primary", percentage: a, reasoning: "Primary mapping by historical linkage" },
      { vendor_id: "vendor_secondary", percentage: b, reasoning: "Remainder allocation by split policy" },
    ],
    confidence: 0.75 + ((seed % 20) / 100),
    reasoning: "Derived from prior runs with similar invoice patterns and vendor performance",
    provenance: [
      { doc_id: "inv:sample", score: 0.91, excerpt: "Invoice INV-123 matched job J-42 with vendor_primary" },
      { doc_id: "rule:direct-pass", score: 0.78, excerpt: "Direct pass-through rule at priority 1" },
    ],
  }
}

function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return Math.abs(h)
}
