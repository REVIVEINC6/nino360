// Simple SHA-256 Merkle tree utilities for server-side usage
// Note: This is a minimal implementation suitable for anchoring batches.
// It provides deterministic JSON serialization, leaf hashing, tree root, and inclusion proofs.

import crypto from "crypto"

export type Hex = string

// Deterministic JSON stringify (sorted keys)
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  const entries = keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
  return `{${entries.join(",")}}`
}

export function sha256Hex(input: string | Uint8Array): Hex {
  return crypto.createHash("sha256").update(input).digest("hex")
}

// Hash a leaf object using deterministic serialization
export function hashLeaf(obj: unknown): Hex {
  const enc = new TextEncoder()
  return sha256Hex(enc.encode(stableStringify(obj)))
}

// Pairwise hash of two hex hashes (sorted to be commutative)
export function hashPair(a: Hex, b: Hex): Hex {
  if (!a) return b
  if (!b) return a
  const [x, y] = a <= b ? [a, b] : [b, a]
  const xb = hexToBytes(x)
  const yb = hexToBytes(y)
  const bytes = new Uint8Array(xb.length + yb.length)
  bytes.set(xb, 0)
  bytes.set(yb, xb.length)
  return sha256Hex(bytes)
}

export function merkleRoot(leaves: Hex[]): Hex {
  if (leaves.length === 0) return ""
  let level = leaves.slice()
  while (level.length > 1) {
    const next: Hex[] = []
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i]
      const right = level[i + 1] ?? level[i] // duplicate last for odd count
      next.push(hashPair(left, right))
    }
    level = next
  }
  return level[0]
}

export interface MerkleProofNode {
  position: "left" | "right"
  hash: Hex
}

export function buildProof(leaves: Hex[], index: number): MerkleProofNode[] {
  if (index < 0 || index >= leaves.length) return []
  let level = leaves.slice()
  let idx = index
  const proof: MerkleProofNode[] = []
  while (level.length > 1) {
    const isRight = idx % 2 === 1
    const pairIndex = isRight ? idx - 1 : idx + 1
    const sibling = level[pairIndex] ?? level[idx]
    proof.push({ position: isRight ? "left" : "right", hash: sibling })

    // Build next level
    const next: Hex[] = []
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i]
      const right = level[i + 1] ?? level[i]
      next.push(hashPair(left, right))
    }
    level = next
    idx = Math.floor(idx / 2)
  }
  return proof
}

export function verifyProof(leaf: Hex, proof: MerkleProofNode[], root: Hex): boolean {
  let hash = leaf
  for (const node of proof) {
    hash = node.position === "left" ? hashPair(node.hash, hash) : hashPair(hash, node.hash)
  }
  return hash === root
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string length")
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes
}
