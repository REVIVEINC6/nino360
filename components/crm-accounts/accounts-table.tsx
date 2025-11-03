"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BlockchainBadge } from "@/components/shared/blockchain-badge"
import Link from "next/link"

interface AccountsTableProps {
  accounts: any[]
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "customer":
        return "bg-green-100 text-green-700 border-green-200"
      case "prospect":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "active":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            All Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="p-3 text-left text-sm font-medium">Account Name</th>
                    <th className="p-3 text-left text-sm font-medium">Industry</th>
                    <th className="p-3 text-left text-sm font-medium">Size</th>
                    <th className="p-3 text-left text-sm font-medium">Owner</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Verification</th>
                    <th className="p-3 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                        No accounts found. Create your first account to get started.
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account, index) => (
                      <motion.tr
                        key={account.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                              {account.name?.charAt(0) || "A"}
                            </div>
                            <div>
                              <div className="font-medium">{account.name}</div>
                              {account.domain && <div className="text-xs text-muted-foreground">{account.domain}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{account.industry || "—"}</td>
                        <td className="p-3 text-sm">{account.size || "—"}</td>
                        <td className="p-3 text-sm">{account.owner?.full_name || account.owner?.email || "—"}</td>
                        <td className="p-3">
                          <Badge variant="outline" className={getStatusColor(account.status)}>
                            {account.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <BlockchainBadge verified={true} hash={account.id} />
                        </td>
                        <td className="p-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card">
                              <DropdownMenuItem asChild>
                                <Link href={`/crm/accounts/${account.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Account
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
