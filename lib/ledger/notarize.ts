"use server"

import { createServerClient } from "@/lib/supabase/server"
import { sha256Hex } from "@/lib/hash"

export async function notarizeHash(hash: string, objectType: string, objectId: string) {
  const supabase = await createServerClient()

  // Insert ledger proof
  const { data, error } = await supabase
    .from("ledger_proofs")
    .insert({
      object_type: objectType,
      object_id: objectId,
      hash,
      block: Math.floor(Date.now() / 1000), // stub block number
      notarized_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] notarizeHash error:", error)
    throw new Error("Failed to create ledger proof")
  }

  return data
}

export async function verifyHash(hash: string, objectType: string, objectId: string) {
  const supabase = await createServerClient()

  // Get ledger proof
  const { data, error } = await supabase
    .from("ledger_proofs")
    .select("*")
    .eq("object_type", objectType)
    .eq("object_id", objectId)
    .eq("hash", hash)
    .single()

  if (error || !data) {
    return { verified: false, error: "Proof not found" }
  }

  return {
    verified: true,
    proof: data,
  }
}

export async function computeFileHash(fileBuffer: Buffer): Promise<string> {
  return sha256Hex(fileBuffer.toString("base64"))
}
