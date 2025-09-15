"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  Shield,
  FileText,
  X,
  Edit,
  Save,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

interface Tenant {
  id: string
  name: string
  domain: string
  logo?: string
  status: "active" | "trial" | "suspended" | "inactive"
  plan: "starter" | "professional" | "enterprise"
  users: number
  revenue: number
  createdAt: string
  lastActive: string
  location: string
  modules: string[]
  health: number
  growth: number
  contact: {
    name: string
    email: string
    phone: string
  }
}

interface TenantDetailSheetProps {
  tenant: Tenant | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, data: Partial<Tenant>) => Promise<void>
}

const modulesList = [
  { id: "crm", name: "CRM", description: "Customer Relationship Management" },
  { id: "hrms", name: "HRMS", description: "Human Resource Management" },
  { id: "talent", name: "Talent", description: "Talent Acquisition" },
  { id: "finance", name: "Finance", description: "Financial Management" },
  { id: "admin", name: "Admin", description: "Administration Tools" },
]

export function TenantDetailSheet({ tenant, isOpen, onClose, onUpdate }: TenantDetailSheetProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<Tenant>>({})

  useEffect(() => {
    if (tenant) {
      setFormData(tenant)
    }
  }, [tenant])

  const handleSave = async () => {
    if (!tenant) return

    setLoading(true)
    try {
      await onUpdate(tenant.id, formData)
      setEditMode(false)
      toast({
        title: "Tenant Updated",
        description: "Tenant information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update tenant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleModuleToggle = (moduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules?.includes(moduleId)
        ? prev.modules.filter((id) => id !== moduleId)
        : [...(prev.modules || []), moduleId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trial":
        return "bg-blue-100 text-blue-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "starter":
        return "bg-blue-100 text-blue-800"
      case "professional":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!isOpen || !tenant) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end">
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        className="bg-white h-full w-full max-w-4xl shadow-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={tenant.logo || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">{tenant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{tenant.name}</h2>
                <p className="text-sm text-gray-600">{tenant.domain}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(tenant.status)}>{tenant.status}</Badge>
                  <Badge className={getPlanColor(tenant.plan)}>{tenant.plan}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)} disabled={loading}>
                {editMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {editMode ? "View Mode" : "Edit Mode"}
              </Button>
              {editMode && (
                <Button size="sm" onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b px-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-xl font-semibold">{tenant.users}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Revenue</p>
                          <p className="text-xl font-semibold">{formatCurrency(tenant.revenue)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100">
                          <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Health Score</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-semibold">{tenant.health}%</p>
                            {tenant.growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-100">
                          <Building2 className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Modules Active</p>
                          <p className="text-xl font-semibold">{tenant.modules.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Health Score Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Health Score Breakdown</CardTitle>
                    <CardDescription>Detailed analysis of tenant health metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>User Engagement</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Feature Adoption</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Support Satisfaction</span>
                        <span>91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Payment History</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editMode ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Contact Name</Label>
                          <Input
                            value={formData.contact?.name || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                contact: { ...prev.contact!, name: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={formData.contact?.email || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                contact: { ...prev.contact!, email: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={formData.contact?.phone || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                contact: { ...prev.contact!, phone: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={formData.location || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Users className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Contact Person</p>
                              <p className="font-medium">{tenant.contact.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">{tenant.contact.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium">{tenant.contact.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-medium">{tenant.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium">{formatDate(tenant.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Last Active</p>
                        <p className="font-medium">{formatDate(tenant.lastActive)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">User Management</CardTitle>
                    <CardDescription>Manage users and their permissions for this tenant</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                      <p className="text-gray-600 mb-4">
                        View and manage all users associated with this tenant account.
                      </p>
                      <Button>View All Users</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Module Configuration</CardTitle>
                    <CardDescription>Enable or disable modules for this tenant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {modulesList.map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                        <Switch
                          checked={formData.modules?.includes(module.id) || false}
                          onCheckedChange={() => handleModuleToggle(module.id)}
                          disabled={!editMode}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Billing Information</CardTitle>
                    <CardDescription>Subscription details and billing history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Billing Management</h3>
                      <p className="text-gray-600 mb-4">
                        View subscription details, billing history, and payment methods.
                      </p>
                      <Button>View Billing Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Compliance Status</CardTitle>
                    <CardDescription>Regulatory compliance and security certifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Compliance Center</h3>
                      <p className="text-gray-600 mb-4">
                        Track compliance status, certifications, and regulatory requirements.
                      </p>
                      <Button>View Compliance Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Audit Trail</CardTitle>
                    <CardDescription>Complete history of changes and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Logs</h3>
                      <p className="text-gray-600 mb-4">
                        View detailed audit trail of all tenant activities and configuration changes.
                      </p>
                      <Button>View Audit Logs</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
