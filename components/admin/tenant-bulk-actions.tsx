"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Play, Pause, Trash2, Download, Mail, Shield, Settings, ChevronDown, X, CheckCircle } from "lucide-react"

interface TenantBulkActionsProps {
  selectedCount: number
  onAction: (action: string) => void
  onClear: () => void
}

const bulkActions = [
  {
    id: "activate",
    label: "Activate Tenants",
    icon: Play,
    description: "Activate selected tenants",
    color: "text-green-600",
  },
  {
    id: "suspend",
    label: "Suspend Tenants",
    icon: Pause,
    description: "Suspend selected tenants",
    color: "text-yellow-600",
  },
  {
    id: "delete",
    label: "Delete Tenants",
    icon: Trash2,
    description: "Permanently delete selected tenants",
    color: "text-red-600",
  },
  {
    id: "export",
    label: "Export Data",
    icon: Download,
    description: "Export tenant data",
    color: "text-blue-600",
  },
  {
    id: "email",
    label: "Send Email",
    icon: Mail,
    description: "Send bulk email to tenants",
    color: "text-purple-600",
  },
  {
    id: "reset-password",
    label: "Reset Passwords",
    icon: Shield,
    description: "Reset passwords for selected tenants",
    color: "text-orange-600",
  },
  {
    id: "configure",
    label: "Bulk Configure",
    icon: Settings,
    description: "Apply bulk configuration changes",
    color: "text-indigo-600",
  },
]

export function TenantBulkActions({ selectedCount, onAction, onClear }: TenantBulkActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-900">
                      {selectedCount} tenant{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Bulk Actions Available
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700">Choose an action to apply to all selected tenants</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction("activate")}
                  className="bg-white/80 hover:bg-green-50 border-green-200 text-green-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction("suspend")}
                  className="bg-white/80 hover:bg-yellow-50 border-yellow-200 text-yellow-700"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction("export")}
                  className="bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="bg-white/80">
                    More Actions
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {bulkActions.slice(3).map((action) => {
                    const IconComponent = action.icon
                    return (
                      <DropdownMenuItem key={action.id} onClick={() => onAction(action.id)} className="cursor-pointer">
                        <IconComponent className={`h-4 w-4 mr-2 ${action.color}`} />
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-xs text-gray-500">{action.description}</div>
                        </div>
                      </DropdownMenuItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAction("delete")}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium">Delete Tenants</div>
                      <div className="text-xs text-gray-500">Permanently remove selected tenants</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Selection */}
              <Button size="sm" variant="ghost" onClick={onClear} className="text-gray-600 hover:text-gray-900">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {/* Expanded Actions */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-blue-200"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {bulkActions.map((action) => {
                  const IconComponent = action.icon
                  return (
                    <Button
                      key={action.id}
                      size="sm"
                      variant="outline"
                      onClick={() => onAction(action.id)}
                      className="justify-start bg-white/80 hover:bg-white"
                    >
                      <IconComponent className={`h-4 w-4 mr-2 ${action.color}`} />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
