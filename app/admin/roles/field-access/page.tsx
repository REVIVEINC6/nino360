"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Shield, Search, Save, RefreshCw, Plus, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Role {
  id: string
  name: string
  description: string
  scope: string
  field_permissions: Record<string, any>
}

interface FieldDefinition {
  id: string
  module: string
  table_name: string
  field_name: string
  field_type: string
  sensitivity_level: number
  is_pii: boolean
  is_financial: boolean
  compliance_tags: string[]
  description: string
  current_access?: string
  recommended_access?: string
}

interface FieldAccess {
  role: Role
  field_access: FieldDefinition[]
  grouped_access: Record<string, Record<string, FieldDefinition[]>>
}

const ACCESS_LEVELS = [
  { value: "none", label: "None", color: "bg-gray-500", description: "No access to this field" },
  { value: "read", label: "Read", color: "bg-blue-500", description: "Can view field value" },
  { value: "read_write", label: "Read/Write", color: "bg-green-500", description: "Can view and modify field value" },
  { value: "admin", label: "Admin", color: "bg-purple-500", description: "Full administrative access" },
]

const SENSITIVITY_COLORS = {
  1: "bg-green-100 text-green-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-orange-100 text-orange-800",
  4: "bg-red-100 text-red-800",
  5: "bg-red-200 text-red-900",
}

export default function FieldAccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const roleId = searchParams.get("role_id")

  // State management
  const [fieldAccess, setFieldAccess] = useState<FieldAccess | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnlySensitive, setShowOnlySensitive] = useState(false)
  const [showOnlyPII, setShowOnlyPII] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({})
  const [createFieldDialogOpen, setCreateFieldDialogOpen] = useState(false)

  // Fetch field access data
  const fetchFieldAccess = async () => {
    if (!roleId) return

    try {
      setLoading(true)
      const params = new URLSearchParams({ role_id: roleId })
      if (selectedModule !== "all") {
        params.append("module", selectedModule)
      }

      const response = await fetch(`/api/admin/roles/field-access?${params}`)
      const data = await response.json()

      if (response.ok) {
        setFieldAccess(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch field access data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (roleId) {
      fetchFieldAccess()
    }
  }, [roleId, selectedModule])

  // Handle access level change
  const handleAccessChange = (fieldKey: string, newAccess: string) => {
    setPendingChanges((prev) => ({
      ...prev,
      [fieldKey]: newAccess,
    }))
  }

  // Save changes
  const saveChanges = async () => {
    if (!roleId || Object.keys(pendingChanges).length === 0) return

    try {
      setSaving(true)

      // Build updated field permissions
      const updatedFieldPermissions = { ...fieldAccess?.role.field_permissions }

      Object.entries(pendingChanges).forEach(([fieldKey, accessLevel]) => {
        const [module, tableName, fieldName] = fieldKey.split(".")

        if (!updatedFieldPermissions[module]) {
          updatedFieldPermissions[module] = {}
        }
        if (!updatedFieldPermissions[module][tableName]) {
          updatedFieldPermissions[module][tableName] = {}
        }

        updatedFieldPermissions[module][tableName][fieldName] = accessLevel
      })

      const response = await fetch("/api/admin/roles/field-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: roleId,
          field_permissions: updatedFieldPermissions,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Field access permissions updated successfully",
        })
        setPendingChanges({})
        fetchFieldAccess()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update field permissions",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Filter fields based on search and filters
  const filteredFields = fieldAccess?.field_access.filter((field) => {
    const matchesSearch =
      !searchQuery ||
      field.field_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.table_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSensitive = !showOnlySensitive || field.sensitivity_level >= 4
    const matchesPII = !showOnlyPII || field.is_pii

    return matchesSearch && matchesSensitive && matchesPII
  })

  const getAccessLevelInfo = (level: string) => {
    return ACCESS_LEVELS.find((al) => al.value === level) || ACCESS_LEVELS[0]
  }

  const getFieldKey = (field: FieldDefinition) => {
    return `${field.module}.${field.table_name}.${field.field_name}`
  }

  const getCurrentAccess = (field: FieldDefinition) => {
    const fieldKey = getFieldKey(field)
    return pendingChanges[fieldKey] || field.current_access || "none"
  }

  if (!roleId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Role Selected</h2>
          <p className="text-muted-foreground mb-4">Please select a role to configure field access permissions.</p>
          <Button onClick={() => router.push("/admin/roles")}>Go to Roles</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Field-Based Access Control</h1>
          <p className="text-muted-foreground">
            Configure granular field-level permissions for <span className="font-medium">{fieldAccess?.role.name}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchFieldAccess} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={createFieldDialogOpen} onOpenChange={setCreateFieldDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Field Definition</DialogTitle>
                <DialogDescription>Define a new field for access control configuration.</DialogDescription>
              </DialogHeader>
              {/* Field creation form would go here */}
            </DialogContent>
          </Dialog>
          <Button
            onClick={saveChanges}
            disabled={saving || Object.keys(pendingChanges).length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes {Object.keys(pendingChanges).length > 0 && `(${Object.keys(pendingChanges).length})`}
          </Button>
        </div>
      </div>

      {/* Pending Changes Alert */}
      {Object.keys(pendingChanges).length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You have {Object.keys(pendingChanges).length} unsaved changes. Click "Save Changes" to apply them.
          </AlertDescription>
        </Alert>
      )}

      {/* Role Information */}
      {fieldAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{fieldAccess.role.name}</span>
              <Badge variant="outline">{fieldAccess.role.scope}</Badge>
            </CardTitle>
            <CardDescription>{fieldAccess.role.description}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="hrms">HRMS</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="talent">Talent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch id="sensitive" checked={showOnlySensitive} onCheckedChange={setShowOnlySensitive} />
              <Label htmlFor="sensitive">High Sensitivity Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="pii" checked={showOnlyPII} onCheckedChange={setShowOnlyPII} />
              <Label htmlFor="pii">PII Fields Only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Levels Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Access Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {ACCESS_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${level.color}`} />
                <span className="text-sm font-medium">{level.label}</span>
                <span className="text-xs text-muted-foreground">- {level.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Field Access Table */}
      <Card>
        <CardHeader>
          <CardTitle>Field Permissions</CardTitle>
          <CardDescription>
            Configure access levels for individual fields. Changes are highlighted and must be saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading field access data...</div>
          ) : !filteredFields || filteredFields.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Fields Found</h3>
              <p className="text-muted-foreground">No fields match your current filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sensitivity</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Current Access</TableHead>
                  <TableHead>Recommended</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFields.map((field) => {
                  const fieldKey = getFieldKey(field)
                  const currentAccess = getCurrentAccess(field)
                  const hasChanges = pendingChanges[fieldKey] !== undefined
                  const accessInfo = getAccessLevelInfo(currentAccess)
                  const recommendedInfo = getAccessLevelInfo(field.recommended_access || "none")

                  return (
                    <TableRow key={fieldKey} className={hasChanges ? "bg-yellow-50" : ""}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{field.field_name}</div>
                          <div className="text-xs text-muted-foreground">{field.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{field.module}</Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{field.table_name}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{field.field_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={SENSITIVITY_COLORS[field.sensitivity_level as keyof typeof SENSITIVITY_COLORS]}
                          >
                            Level {field.sensitivity_level}
                          </Badge>
                          {field.is_pii && <Badge variant="destructive">PII</Badge>}
                          {field.is_financial && <Badge className="bg-green-100 text-green-800">Financial</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {field.compliance_tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${accessInfo.color}`} />
                          <span className={`text-sm ${hasChanges ? "font-medium" : ""}`}>{accessInfo.label}</span>
                          {hasChanges && <Badge variant="outline">Changed</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${recommendedInfo.color}`} />
                          <span className="text-sm">{recommendedInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select value={currentAccess} onValueChange={(value) => handleAccessChange(fieldKey, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ACCESS_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${level.color}`} />
                                  <span>{level.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
