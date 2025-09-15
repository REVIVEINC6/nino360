"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModuleDetailSheet } from "./module-detail-sheet"
import { TenantAssignmentModal } from "./tenant-assignment-modal"
import { MoreHorizontal, Eye, Edit, Users, Trash2, Copy, AlertCircle } from "lucide-react"
import type { Module } from "@/lib/types/modules"
import { useRouter } from "next/navigation"

interface ModulesTableProps {
  modules: Module[]
  loading: boolean
  selectedModules: string[]
  onSelectionChange: (selected: string[]) => void
  onUpdate: (moduleId: string, updates: Partial<Module>) => Promise<void>
  onDelete: (moduleId: string) => Promise<void>
  onToggleStatus: (moduleId: string, enabled: boolean) => Promise<void>
}

export function ModulesTable({
  modules,
  loading,
  selectedModules,
  onSelectionChange,
  onUpdate,
  onDelete,
  onToggleStatus,
}: ModulesTableProps) {
  const router = useRouter()
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(modules.map((m) => m.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectModule = (moduleId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedModules, moduleId])
    } else {
      onSelectionChange(selectedModules.filter((id) => id !== moduleId))
    }
  }

  const handleViewDetails = (module: Module) => {
    setSelectedModule(module)
    setDetailSheetOpen(true)
  }

  const handleAssignTenants = (module: Module) => {
    setSelectedModule(module)
    setAssignmentModalOpen(true)
  }

  const handleCloneModule = async (module: Module) => {
    const clonedModule = {
      ...module,
      name: `${module.name} (Copy)`,
      id: `${module.id}-copy-${Date.now()}`,
      status: "beta" as const,
      activeTenants: 0,
    }
    await onUpdate(clonedModule.id, clonedModule)
  }

  const getStatusBadge = (status: Module["status"]) => {
    const variants = {
      live: { variant: "default" as const, label: "Live", color: "bg-green-500" },
      beta: { variant: "secondary" as const, label: "Beta", color: "bg-orange-500" },
      deprecated: { variant: "destructive" as const, label: "Deprecated", color: "bg-red-500" },
      "coming-soon": { variant: "outline" as const, label: "Coming Soon", color: "bg-blue-500" },
    }

    const config = variants[status]
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getTierBadge = (tier: Module["tier"]) => {
    const variants = {
      free: { variant: "outline" as const, label: "Free" },
      pro: { variant: "default" as const, label: "Pro" },
      enterprise: { variant: "secondary" as const, label: "Enterprise" },
      custom: { variant: "destructive" as const, label: "Custom" },
    }

    const config = variants[tier]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Modules...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Modules Directory</CardTitle>
          <CardDescription>Manage all system modules, their status, and tenant assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedModules.length === modules.length && modules.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Tenants</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={(checked) => handleSelectModule(module.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">{module.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-medium">{module.name}</div>
                        <div className="text-sm text-muted-foreground">{module.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(module.status)}
                      <Switch
                        checked={module.status === "live"}
                        onCheckedChange={(checked) => onToggleStatus(module.id, checked)}
                        size="sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(module.tier)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={module.usageScore} className="w-16 h-2" />
                      <span className="text-sm text-muted-foreground">{module.usageScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{module.activeTenants.toLocaleString()}</div>
                      <div className="text-muted-foreground">of {module.totalTenants.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{module.version}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(module)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/modules/${module.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Module
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignTenants(module)}>
                          <Users className="mr-2 h-4 w-4" />
                          Assign Tenants
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleCloneModule(module)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Clone Module
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(module.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {modules.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No modules found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new module</p>
              <Button>Create First Module</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <ModuleDetailSheet
        module={selectedModule}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onUpdate={onUpdate}
      />

      {/* Tenant Assignment Modal */}
      <TenantAssignmentModal module={selectedModule} open={assignmentModalOpen} onOpenChange={setAssignmentModalOpen} />
    </>
  )
}
