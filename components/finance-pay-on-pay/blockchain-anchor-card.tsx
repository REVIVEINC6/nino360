"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ExternalLink, CheckCircle2, Clock } from "lucide-react"

interface BlockchainAnchor {
  merkle_root: string
  transaction_hash: string
  chain_id: string
  block_number: number
  status: string
  confirmations: number
  artifact_cid?: string
  zk_proof_cid?: string
}

interface BlockchainAnchorCardProps {
  anchor?: BlockchainAnchor
  onVerify?: () => void
}

export function BlockchainAnchorCard({ anchor, onVerify }: BlockchainAnchorCardProps) {
  if (!anchor) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Blockchain Anchor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Not yet anchored to blockchain</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-400" />
            Blockchain Anchor
          </CardTitle>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Merkle Root</p>
          <code className="text-xs bg-background/50 px-2 py-1 rounded block overflow-x-auto">{anchor.merkle_root}</code>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-background/50 px-2 py-1 rounded flex-1 overflow-x-auto">
              {anchor.transaction_hash}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://polygonscan.com/tx/${anchor.transaction_hash}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Chain</p>
            <p className="text-sm font-medium">{anchor.chain_id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Block</p>
            <p className="text-sm font-medium">#{anchor.block_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Confirmations</p>
            <p className="text-sm font-medium">{anchor.confirmations}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {anchor.status}
            </Badge>
          </div>
        </div>

        {anchor.artifact_cid && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Artifact CID</p>
            <code className="text-xs bg-background/50 px-2 py-1 rounded block overflow-x-auto">
              {anchor.artifact_cid}
            </code>
          </div>
        )}

        {anchor.zk_proof_cid && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">ZK-Proof CID</p>
            <code className="text-xs bg-background/50 px-2 py-1 rounded block overflow-x-auto">
              {anchor.zk_proof_cid}
            </code>
          </div>
        )}

        <Button variant="outline" className="w-full bg-transparent" onClick={onVerify}>
          <Shield className="h-4 w-4 mr-2" />
          Verify On-Chain
        </Button>
      </CardContent>
    </Card>
  )
}
