"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  Briefcase,
  DollarSign,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Vendor {
  id: string
  name: string
  legalName: string
  vendorCode: string
  email: string
  phone: string
  website: string
  industry: string
  businessType: string
  status: "active" | "inactive" | "suspended" | "blacklisted"
  rating: number
  totalJobs: number
  activeJobs: number
  totalSpent: number
  paymentTerms: string
  location: string
  certifications: string[]
  lastActivity: string
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    filterVendors()
  }, [vendors, searchTerm, statusFilter, industryFilter])

  const fetchVendors = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      const mockVendors: Vendor[] = [
        {
          id: "1",
          name: "TechStaff Solutions",
          legalName: "TechStaff Solutions LLC",
          vendorCode: "VEN-001",
          email: "contact@techstaff.com",
          phone: "+1-555-1001",
          website: "https://techstaff.com",
          industry: "IT Staffing",
          businessType: "LLC",
          status: "active",
          rating: 4.5,
          totalJobs: 45,
          activeJobs: 8,
          totalSpent: 2450000,
          paymentTerms: "Net 30",
          location: "San Francisco, CA",
          certifications: ["ISO 9001", "SOC 2", "Minority Owned"],
          lastActivity: "2024-01-15",
        },
        {
          id: "2",
          name: "Global IT Resources",
          legalName: "Global IT Resources Inc.",
          vendorCode: "VEN-002",
          email: "info@globalit.com",
          phone: "+1-555-1002",
          website: "https://globalit.com",
          industry: "IT Services",
          businessType: "Corporation",
          status: "active",
          rating: 4.2,
          totalJobs: 32,
          activeJobs: 5,
          totalSpent: 1890000,
          paymentTerms: "Net 15",
          location: "New York, NY",
          certifications: ["ISO 27001", "CMMI Level 3"],
          lastActivity: "2024-01-12",
        },
        {
          id: "3",
          name: "Creative Design Hub",
          legalName: "Creative Design Hub Ltd.",
          vendorCode: "VEN-003",
          email: "hello@designhub.com",
          phone: "+1-555-1003",
          website: "https://designhub.com",
          industry: "Design Services",
          businessType: "Limited",
          status: "active",
          rating: 4.7,
          totalJobs: 28,
          activeJobs: 3,
          totalSpent: 890000,
          paymentTerms: "Net 30",
          location: "Austin, TX",
          certifications: ["Women Owned", "Small Business"],
          lastActivity: "2024-01-10",
        },
        {
          id: "4",
          name: "DataPro Consulting",
          legalName: "DataPro Consulting Corp.",
          vendorCode: "VEN-004",
          email: "contact@datapro.com",
          phone: "+1-555-1004",
          website: "https://datapro.com",
          industry: "Data Analytics",
          businessType: "Corporation",
          status: "inactive",
          rating: 4.3,
          totalJobs: 18,
          activeJobs: 0,
          totalSpent: 650000,
          paymentTerms: "Net 45",
          location: "Seattle, WA",
          certifications: ["ISO 9001", "Data Privacy Certified"],
          lastActivity: "2023-12-20",
        },
        {
          id: "5",
          name: "CloudTech Partners",
          legalName: "CloudTech Partners LLC",
          vendorCode: "VEN-005",
          email: "partners@cloudtech.com",
          phone: "+1-555-1005",
          website: "https://cloudtech.com",
          industry: "Cloud Services",
          businessType: "LLC",
          status: "suspended",
          rating: 3.8,
          totalJobs: 12,
          activeJobs: 0,
          totalSpent: 420000,
          paymentTerms: "Net 30",
          location: "Denver, CO",
          certifications: ["AWS Partner", "Azure Certified"],
          lastActivity: "2023-11-15",
        },
      ]
      setVendors(mockVendors)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterVendors = () => {
    let filtered = vendors

    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((vendor) => vendor.status === statusFilter)
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter((vendor) => vendor.industry === industryFilter)
    }

    setFilteredVendors(filtered)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      suspended: { color: "bg-yellow-100 text-yellow-800", label: "Suspended" },
      blacklisted: { color: "bg-red-100 text-red-800", label: "Blacklisted" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getVendorInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage your vendor relationships and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input id="vendorName" placeholder="Enter vendor name" />
                </div>
                <div>
                  <Label htmlFor="legalName">Legal Name</Label>
                  <Input id="legalName" placeholder="Enter legal name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="vendor@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1-555-0000" />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://vendor.com" />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it-staffing">IT Staffing</SelectItem>
                      <SelectItem value="it-services">IT Services</SelectItem>
                      <SelectItem value="design-services">Design Services</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="cloud-services">Cloud Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net-15">Net 15</SelectItem>
                      <SelectItem value="net-30">Net 30</SelectItem>
                      <SelectItem value="net-45">Net 45</SelectItem>
                      <SelectItem value="net-60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter vendor description" />
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Add Vendor</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">
              {vendors.filter((v) => v.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.reduce((sum, v) => sum + v.activeJobs, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(vendors.reduce((sum, v) => sum + v.totalSpent, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="blacklisted">Blacklisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="IT Staffing">IT Staffing</SelectItem>
                <SelectItem value="IT Services">IT Services</SelectItem>
                <SelectItem value="Design Services">Design Services</SelectItem>
                <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                <SelectItem value="Cloud Services">Cloud Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/generic-placeholder-icon.png?height=48&width=48`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getVendorInitials(vendor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.vendorCode}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Vendor
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {getStatusBadge(vendor.status)}
                <div className="flex items-center space-x-1">
                  {renderStars(vendor.rating)}
                  <span className="text-sm text-gray-600 ml-1">({vendor.rating})</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  {vendor.industry}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {vendor.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {vendor.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {vendor.phone}
                </div>
                {vendor.website && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      {vendor.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{vendor.totalJobs}</div>
                  <div className="text-xs text-gray-600">Total Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{vendor.activeJobs}</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{formatCurrency(vendor.totalSpent / 1000)}K</div>
                  <div className="text-xs text-gray-600">Spent</div>
                </div>
              </div>

              {vendor.certifications.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1">
                    {vendor.certifications.slice(0, 2).map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {vendor.certifications.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{vendor.certifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                <span>Payment: {vendor.paymentTerms}</span>
                <span>Last activity: {vendor.lastActivity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No vendors found matching your criteria</p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add First Vendor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
