import { ethers } from "ethers"

// Smart contract ABI for audit trail
const AUDIT_CONTRACT_ABI = [
  "function recordAction(string memory action, string memory resourceId, bytes32 dataHash) external",
  "function getAuditRecord(uint256 recordId) external view returns (string memory, string memory, bytes32, uint256, address)",
  "function getRecordCount() external view returns (uint256)",
]

export class BlockchainAuditTrail {
  private provider: ethers.JsonRpcProvider
  private contract: ethers.Contract
  private wallet: ethers.Wallet

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL!)
    this.wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY!, this.provider)
    this.contract = new ethers.Contract(process.env.AUDIT_CONTRACT_ADDRESS!, AUDIT_CONTRACT_ABI, this.wallet)
  }

  async recordAuditAction(action: string, resourceId: string, data: Record<string, any>): Promise<string> {
    try {
      // Create hash of the data for immutable storage
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data)))

      // Record on blockchain
      const tx = await this.contract.recordAction(action, resourceId, dataHash)
      const receipt = await tx.wait()

      return receipt.hash
    } catch (error) {
      console.error("Blockchain audit recording failed:", error)
      throw error
    }
  }

  async verifyAuditRecord(recordId: number): Promise<boolean> {
    try {
      const record = await this.contract.getAuditRecord(recordId)
      return record.length > 0
    } catch (error) {
      console.error("Blockchain verification failed:", error)
      return false
    }
  }

  async getAuditHistory(limit = 100): Promise<any[]> {
    try {
      const recordCount = await this.contract.getRecordCount()
      const records = []

      const start = Math.max(0, Number(recordCount) - limit)
      for (let i = start; i < Number(recordCount); i++) {
        const record = await this.contract.getAuditRecord(i)
        records.push({
          id: i,
          action: record[0],
          resourceId: record[1],
          dataHash: record[2],
          timestamp: Number(record[3]),
          recorder: record[4],
        })
      }

      return records
    } catch (error) {
      console.error("Error fetching audit history:", error)
      return []
    }
  }
}

export const blockchainAudit = new BlockchainAuditTrail()
