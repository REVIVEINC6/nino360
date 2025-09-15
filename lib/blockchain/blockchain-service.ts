export type BlockchainTxStatus = "pending" | "confirmed" | "failed"

export type BlockchainTransaction = {
  id: string
  status: BlockchainTxStatus
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

const txStore = new Map<string, BlockchainTransaction>()

function genId() {
  try {
    // @ts-ignore
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  } catch {}
  return `tx_${Math.random().toString(36).slice(2)}`
}

async function simulateNetwork(ms = 50) {
  return new Promise((res) => setTimeout(res, ms))
}

export const blockchain = {
  async submitTransaction(payload: Record<string, unknown>): Promise<BlockchainTransaction> {
    const now = new Date().toISOString()
    const id = genId()
    const tx: BlockchainTransaction = {
      id,
      status: "pending",
      metadata: payload,
      createdAt: now,
      updatedAt: now,
    }
    txStore.set(id, tx)
    // Simulate confirmation
    await simulateNetwork()
    tx.status = "confirmed"
    tx.updatedAt = new Date().toISOString()
    txStore.set(id, tx)
    return tx
  },

  async getTransactionStatus(id: string): Promise<BlockchainTxStatus> {
    const tx = txStore.get(id)
    if (!tx) throw new Error(`Transaction not found: ${id}`)
    return tx.status
  },

  async recordEvent(event: string, data?: Record<string, unknown>): Promise<{ txId: string; status: BlockchainTxStatus }> {
    const tx = await this.submitTransaction({ event, ...data })
    return { txId: tx.id, status: tx.status }
  },
}

// Alias to support different import styles
export const blockchainService = blockchain
export default blockchain
