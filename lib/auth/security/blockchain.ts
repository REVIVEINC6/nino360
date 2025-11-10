import { createHash } from "crypto"
import { createServerClient } from "@/lib/supabase/server"

export interface BlockchainBlock {
  index: number
  timestamp: string
  data: any
  previousHash: string
  hash: string
  nonce: number
}

export async function createBlockchainEntry(
  data: any,
  type: "audit_log" | "security_event" | "permission_change",
): Promise<string> {
  const supabase = await createServerClient()

  // Get the last block
  const { data: lastBlock } = await supabase
    .from("blockchain_ledger")
    .select("*")
    .order("block_index", { ascending: false })
    .limit(1)
    .single()

  const index = lastBlock ? lastBlock.block_index + 1 : 0
  const previousHash = lastBlock ? lastBlock.block_hash : "0"

  // Create new block
  const block: BlockchainBlock = {
    index,
    timestamp: new Date().toISOString(),
    data,
    previousHash,
    hash: "",
    nonce: 0,
  }

  // Mine the block (proof of work)
  block.hash = mineBlock(block)

  // Store in blockchain ledger
  await supabase.from("blockchain_ledger").insert({
    block_index: block.index,
    block_timestamp: block.timestamp,
    block_data: block.data,
    previous_hash: block.previousHash,
    block_hash: block.hash,
    nonce: block.nonce,
    data_type: type,
  })

  return block.hash
}

function mineBlock(block: BlockchainBlock, difficulty = 4): string {
  const target = "0".repeat(difficulty)

  while (true) {
    const hash = calculateHash(block)

    if (hash.substring(0, difficulty) === target) {
      return hash
    }

    block.nonce++
  }
}

function calculateHash(block: BlockchainBlock): string {
  const data = `${block.index}${block.timestamp}${JSON.stringify(block.data)}${block.previousHash}${block.nonce}`
  return createHash("sha256").update(data).digest("hex")
}

export async function verifyBlockchainIntegrity(): Promise<boolean> {
  const supabase = await createServerClient()

  const { data: blocks } = await supabase
    .from("blockchain_ledger")
    .select("*")
    .order("block_index", { ascending: true })

  if (!blocks || blocks.length === 0) return true

  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i]
    const previousBlock = blocks[i - 1]

    // Verify hash
    const block: BlockchainBlock = {
      index: currentBlock.block_index,
      timestamp: currentBlock.block_timestamp,
      data: currentBlock.block_data,
      previousHash: currentBlock.previous_hash,
      hash: currentBlock.block_hash,
      nonce: currentBlock.nonce,
    }

    const calculatedHash = calculateHash(block)

    if (calculatedHash !== currentBlock.block_hash) {
      console.error("[v0] Blockchain integrity violation: Invalid hash at block", i)
      return false
    }

    // Verify chain
    if (currentBlock.previous_hash !== previousBlock.block_hash) {
      console.error("[v0] Blockchain integrity violation: Broken chain at block", i)
      return false
    }
  }

  return true
}

export async function getBlockchainAuditTrail(
  dataType?: "audit_log" | "security_event" | "permission_change",
  startDate?: Date,
  endDate?: Date,
) {
  const supabase = await createServerClient()

  let query = supabase.from("blockchain_ledger").select("*").order("block_index", { ascending: false })

  if (dataType) {
    query = query.eq("data_type", dataType)
  }

  if (startDate) {
    query = query.gte("block_timestamp", startDate.toISOString())
  }

  if (endDate) {
    query = query.lte("block_timestamp", endDate.toISOString())
  }

  const { data, error } = await query

  if (error) throw error

  return data
}
