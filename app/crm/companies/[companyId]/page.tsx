"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCompanies } from "@/hooks/use-companies"
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Users,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Pin,
  Edit,
  Share,
  MoreHorizontal,
  Bot,
  Target,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download,
  Plus,
  MessageSquare,
  Video,
  Sparkles,
  Loader2,
  Shield,
  Zap,
} from "lucide-react"
import { useParams } from "next/navigation"

export default function CompanyProfilePage() {
  const params = useParams()
  const { toast } = useToast()
  const { getCompany, getAIInsights, updateCompany } = useCompanies()
  const [company, setCompany] = useState<any>(null)
  const [aiInsights, setAIInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true)
        const companyData = await getCompany(params.companyId as string)
        setCompany(companyData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load company data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.companyId) {
      fetchCompanyData()
    }
  }, [params.companyId, getCompany, toast])

  const handleGetAIInsights = async () => {
    if (!company) return

    try {
      setLoadingInsights(true)
      const insights = await getAIInsights(company.id)
      setAIInsights(insights)
      setActiveTab("ai-copilot")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI insights",
        variant: "destructive",
      })
    } finally {
      setLoadingInsights(false)
    }
  }

  const handleTogglePin = async () => {
    if (!company) return

    try {
      await updateCompany(company.id, { is_pinned: !company.is_pinned })
      setCompany({ ...company, is_pinned: !company.is_pinned })
      toast({
        title: "Success",
        description: `Company ${company.is_pinned ? "unpinned" : "pinned"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "customer":
        return "bg-green-100 text-green-800 border-green-200"
      case "prospect":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "strategic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "partner":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading company profile...</span>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600">The requested company could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarImage src={company.logo_url || "/placeholder.svg"} alt={company.name} />
              <AvatarFallback className="text-2xl font-bold">
                {company.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                {company.is_pinned && <Pin className="h-5 w-5 text-yellow-500" />}
                <Badge className={getStatusColor(company.status)}>{company.status}</Badge>
                {company.blockchain_verified && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {company.rpa_automation_enabled && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Zap className="h-3 w-3 mr-1" />
                    RPA Enabled
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 max-w-2xl">{company.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {company.industry}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {company.employee_count} employees
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {company.revenue_range} revenue
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {company.hq_city}, {company.hq_country}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleTogglePin}>
              <Pin className="mr-2 h-4 w-4" />
              {company.is_pinned ? "Unpin" : "Pin"}
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500"
              onClick={handleGetAIInsights}
              disabled={loadingInsights}
            >
              {loadingInsights ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              AI Insights
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${company.total_value?.toLocaleString() || "0"}</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{company.deal_count || 0}</div>
              <div className="text-sm text-gray-600">Active Deals</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{company.contact_count || 0}</div>
              <div className="text-sm text-gray-600">Contacts</div>
            </CardContent>
          </Card>
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getEngagementColor(company.engagement_score || 0)}`}>
                {company.engagement_score || 0}%
              </div>
              <div className="text-sm text-gray-600">Engagement</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="engagements">Engagements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai-copilot">AI Copilot</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Founded</label>
                    <p className="text-sm">{company.founded_year || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ticker</label>
                    <p className="text-sm">{company.ticker_symbol || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CEO</label>
                    <p className="text-sm">{company.ceo_name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ownership</label>
                    <Badge variant="outline">{company.ownership_type || "N/A"}</Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-600">Headquarters</label>
                  <p className="text-sm">
                    {company.headquarters_address || `${company.hq_city}, ${company.hq_country}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {company.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {company.linkedin_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://${company.linkedin_url}`} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {company.phone && (
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  )}
                  {company.email && (
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Health */}
            <Card>
              <CardHeader>
                <CardTitle>Account Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Engagement Score</span>
                    <span className={`text-sm font-bold ${getEngagementColor(company.engagement_score || 0)}`}>
                      {company.engagement_score || 0}%
                    </span>
                  </div>
                  <Progress value={company.engagement_score || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Deal Velocity</span>
                    <span className="text-sm font-bold text-green-600">High</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Relationship Depth</span>
                    <span className="text-sm font-bold text-blue-600">Strong</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Active contract through 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multiple stakeholder relationships</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Renewal discussion needed</span>
                  </div>
                  {company.blockchain_verified && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Blockchain verified account</span>
                    </div>
                  )}
                  {company.rpa_automation_enabled && (
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>RPA automation active</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.company_engagements?.slice(0, 3).map((engagement: any) => (
                  <div key={engagement.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="p-2 rounded-full bg-blue-100">
                      {engagement.engagement_type === "meeting" && <Video className="h-4 w-4 text-blue-600" />}
                      {engagement.engagement_type === "call" && <Phone className="h-4 w-4 text-blue-600" />}
                      {engagement.engagement_type === "email" && <Mail className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{engagement.title}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(engagement.engagement_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{engagement.description}</p>
                      {engagement.next_action && (
                        <p className="text-sm text-blue-600 mt-1">Next: {engagement.next_action}</p>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent engagements recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Office Locations</CardTitle>
              <CardDescription>All company locations and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.company_locations?.map((location: any, index: number) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg capitalize">{location.location_type}</h3>
                        <p className="text-gray-600 mt-1">{location.address}</p>
                        {location.city && location.country && (
                          <p className="text-gray-600">
                            {location.city}, {location.country}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          {location.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {location.phone}
                            </div>
                          )}
                          {location.employee_count && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {location.employee_count} employees
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {location.is_primary ? "Primary" : "Branch"}
                      </Badge>
                    </div>
                  </motion.div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No locations recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Key Contacts</CardTitle>
                  <CardDescription>Decision makers and stakeholders</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {company.company_contacts?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.company_contacts.map((contact: any, index: number) => (
                      <motion.tr
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={contact.avatar_url || "/placeholder.svg"} alt={contact.name} />
                              <AvatarFallback>
                                {contact.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-gray-500">{contact.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {contact.title}
                          </Badge>
                        </TableCell>
                        <TableCell>{contact.department || "N/A"}</TableCell>
                        <TableCell>
                          {contact.last_contact_date
                            ? new Date(contact.last_contact_date).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`text-sm font-medium ${getEngagementColor(contact.engagement_score || 0)}`}>
                              {contact.engagement_score || 0}%
                            </div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  (contact.engagement_score || 0) >= 80
                                    ? "bg-green-500"
                                    : (contact.engagement_score || 0) >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${contact.engagement_score || 0}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No contacts recorded</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Opportunities</CardTitle>
                  <CardDescription>Current deals and pipeline</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Opportunity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {company.company_opportunities?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Close Date</TableHead>
                      <TableHead>Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.company_opportunities.map((opportunity: any, index: number) => (
                      <motion.tr
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TableCell>
                          <div className="font-medium">{opportunity.name}</div>
                          {opportunity.description && (
                            <div className="text-sm text-gray-500 mt-1">{opportunity.description}</div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${opportunity.value?.toLocaleString() || "0"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${
                              opportunity.stage === "closed_won"
                                ? "bg-green-100 text-green-800"
                                : opportunity.stage === "negotiation"
                                  ? "bg-orange-100 text-orange-800"
                                  : opportunity.stage === "proposal"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {opportunity.stage?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{opportunity.probability || 0}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  (opportunity.probability || 0) >= 80
                                    ? "bg-green-500"
                                    : (opportunity.probability || 0) >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${opportunity.probability || 0}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {opportunity.expected_close_date
                            ? new Date(opportunity.expected_close_date).toLocaleDateString()
                            : "TBD"}
                        </TableCell>
                        <TableCell>{opportunity.owner_name || "Unassigned"}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No opportunities recorded</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Opportunity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagements" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Engagement History</CardTitle>
                  <CardDescription>All interactions and touchpoints</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.company_engagements?.map((engagement: any, index: number) => (
                  <motion.div
                    key={engagement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        {engagement.engagement_type === "meeting" && <Video className="h-4 w-4 text-blue-600" />}
                        {engagement.engagement_type === "call" && <Phone className="h-4 w-4 text-blue-600" />}
                        {engagement.engagement_type === "email" && <Mail className="h-4 w-4 text-blue-600" />}
                        {engagement.engagement_type === "demo" && <MessageSquare className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{engagement.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(engagement.engagement_date).toLocaleDateString()}
                          </div>
                        </div>
                        {engagement.description && (
                          <p className="text-sm text-gray-600 mt-1">{engagement.description}</p>
                        )}
                        {engagement.participants && engagement.participants.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Participants:</strong> {engagement.participants.join(", ")}
                          </p>
                        )}
                        {engagement.outcome && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Outcome:</strong> {engagement.outcome}
                          </p>
                        )}
                        {engagement.next_action && (
                          <p className="text-sm text-blue-600 mt-1">
                            <strong>Next Action:</strong> {engagement.next_action}
                          </p>
                        )}
                        {engagement.sentiment && (
                          <Badge
                            className={`mt-2 ${
                              engagement.sentiment === "positive"
                                ? "bg-green-100 text-green-800"
                                : engagement.sentiment === "negative"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {engagement.sentiment} sentiment
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No engagements recorded</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Log First Engagement
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents & Files</CardTitle>
                  <CardDescription>Contracts, proposals, and shared documents</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {company.company_documents?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {company.company_documents.map((document: any, index: number) => (
                      <motion.tr
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{document.name}</span>
                            {document.blockchain_hash && (
                              <Shield className="h-3 w-3 text-green-500" role="img" aria-label="Blockchain verified" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {document.document_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : "N/A"}
                        </TableCell>
                        <TableCell>{new Date(document.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${
                              document.status === "signed"
                                ? "bg-green-100 text-green-800"
                                : document.status === "under_review"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : document.status === "approved"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {document.status?.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No documents uploaded</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-copilot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                AI Sales Copilot
              </CardTitle>
              <CardDescription>
                Advanced AI insights powered by machine learning and predictive analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingInsights ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  <span className="ml-2 text-gray-600">Generating AI insights...</span>
                </div>
              ) : aiInsights ? (
                <div className="space-y-6">
                  {/* Expansion Probability */}
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        Expansion Opportunity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-700 mb-2">{aiInsights.expansionProbability}%</div>
                      <p className="text-green-600 mb-4">Probability of successful expansion</p>
                      <div className="space-y-2">
                        {aiInsights.nextBestActions?.map((action: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Churn Risk */}
                  <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Churn Risk Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-700 mb-2">{aiInsights.churnRisk}%</div>
                      <p className="text-red-600 mb-4">Risk of customer churn</p>
                      <div className="space-y-2">
                        {aiInsights.stakeholderRecommendations?.map((rec: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-red-500" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Renewal Prediction */}
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Renewal Prediction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-700 mb-2">
                        {aiInsights.renewalPrediction?.probability}%
                      </div>
                      <p className="text-blue-600 mb-2">Renewal probability</p>
                      <p className="text-sm text-blue-600 mb-4">
                        Expected timeline: {aiInsights.renewalPrediction?.timeline}
                      </p>
                      <div className="space-y-2">
                        {aiInsights.renewalPrediction?.factors?.map((factor: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resource Optimization */}
                  {aiInsights.potentialSavings && (
                    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-purple-600" />
                          Resource Optimization
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-700 mb-2">
                          ${aiInsights.potentialSavings.toLocaleString()}
                        </div>
                        <p className="text-purple-600 mb-4">Potential annual savings</p>
                        <div className="space-y-2">
                          {aiInsights.recommendations?.map((rec: any, index: number) => (
                            <div key={index} className="p-3 bg-white rounded-lg border">
                              <div className="font-medium">{rec.action}</div>
                              <div className="text-sm text-gray-600">{rec.reason}</div>
                              <div className="text-sm font-medium text-green-600">
                                Savings: ${rec.expectedSavings.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* AI Chat Interface */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Ask AI About This Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="justify-start bg-transparent">
                            What's the expansion potential?
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start bg-transparent">
                            Who should I contact next?
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start bg-transparent">
                            What's the renewal timeline?
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start bg-transparent">
                            Show competitive threats
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ask anything about this account..."
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI Insights Ready</h3>
                  <p className="text-gray-600 mb-4">
                    Click "AI Insights" to generate intelligent recommendations for this account.
                  </p>
                  <Button onClick={handleGetAIInsights} disabled={loadingInsights}>
                    {loadingInsights ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate AI Insights
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
