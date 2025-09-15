"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Globe,
  Building2,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Brain,
  Sparkles,
  Edit,
  Save,
  Plus,
  Download,
  Upload,
  ExternalLink,
  Linkedin,
  Twitter,
  Activity,
  Target,
  Lightbulb,
  Users,
  BarChart3,
  PhoneCall,
  CalendarIcon,
  FileImage,
  Share,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Mock lead data - In production, this would come from your API
const mockLead = {
  id: "L001",
  companyName: "TechCorp Solutions",
  contactName: "Sarah Johnson",
  title: "VP of Engineering",
  email: "sarah.johnson@techcorp.com",
  phone: "+1 (555) 123-4567",
  source: "Website",
  status: "Active",
  stage: "Qualified",
  owner: "John Smith",
  createdAt: "2024-01-15",
  lastActivity: "2024-01-20",
  score: 92,
  value: "$450,000",
  avatar: "/placeholder.svg?height=64&width=64&text=SJ",
  company: {
    size: "500-1000",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "techcorp.com",
    description: "Leading technology solutions provider specializing in enterprise software and cloud infrastructure.",
    employees: 750,
    revenue: "$50M-100M",
    founded: "2015",
  },
  contact: {
    linkedin: "https://linkedin.com/in/sarahjohnson",
    twitter: "https://twitter.com/sarahjtech",
    department: "Engineering",
    reportingTo: "CTO",
    yearsAtCompany: 3,
    previousCompanies: ["Google", "Microsoft"],
  },
  aiInsights: {
    priority: "High",
    nextAction: "Schedule demo call",
    probability: 85,
    riskFactors: [],
    recommendations: [
      "Focus on scalability benefits in your pitch",
      "Mention integration with their existing AWS infrastructure",
      "Highlight cost savings compared to their current solution",
    ],
    sentiment: "Positive",
    engagementScore: 8.5,
    buyingSignals: [
      "Requested technical documentation",
      "Asked about pricing tiers",
      "Inquired about implementation timeline",
    ],
  },
  activities: [
    {
      id: 1,
      type: "email",
      title: "Follow-up email sent",
      description: "Sent technical documentation and pricing information",
      timestamp: "2024-01-20 14:30",
      user: "John Smith",
    },
    {
      id: 2,
      type: "call",
      title: "Discovery call completed",
      description: "45-minute call discussing requirements and pain points",
      timestamp: "2024-01-18 10:00",
      user: "John Smith",
    },
    {
      id: 3,
      type: "meeting",
      title: "Demo scheduled",
      description: "Product demo scheduled for next Tuesday",
      timestamp: "2024-01-17 16:15",
      user: "John Smith",
    },
    {
      id: 4,
      type: "note",
      title: "Lead qualification",
      description: "Qualified lead based on budget, authority, need, and timeline",
      timestamp: "2024-01-16 09:30",
      user: "John Smith",
    },
    {
      id: 5,
      type: "form",
      title: "Contact form submitted",
      description: "Initial inquiry through website contact form",
      timestamp: "2024-01-15 11:45",
      user: "System",
    },
  ],
  notes: [
    {
      id: 1,
      content:
        "Very interested in our enterprise package. Mentioned they're currently using a competitor but facing scalability issues.",
      timestamp: "2024-01-18 10:30",
      user: "John Smith",
    },
    {
      id: 2,
      content:
        "Budget approved for Q1. Decision maker confirmed. Timeline is aggressive - they want to implement by March.",
      timestamp: "2024-01-17 15:20",
      user: "John Smith",
    },
  ],
  documents: [
    {
      id: 1,
      name: "Technical Requirements.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedAt: "2024-01-18",
      uploadedBy: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Current Architecture Diagram.png",
      type: "image",
      size: "1.8 MB",
      uploadedAt: "2024-01-17",
      uploadedBy: "Sarah Johnson",
    },
    {
      id: 3,
      name: "Proposal_TechCorp_v2.pdf",
      type: "pdf",
      size: "3.2 MB",
      uploadedAt: "2024-01-16",
      uploadedBy: "John Smith",
    },
  ],
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState(mockLead)
  const [isEditing, setIsEditing] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [activeTab, setActiveTab] = useState("summary")

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "qualified":
        return "bg-green-100 text-green-800 border-green-200"
      case "converted":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "lost":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "call":
        return <Phone className="h-4 w-4 text-green-500" />
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "note":
        return <FileText className="h-4 w-4 text-orange-500" />
      case "form":
        return <Globe className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSaveNote = () => {
    if (!newNote.trim()) return

    const note = {
      id: lead.notes.length + 1,
      content: newNote,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      user: "Current User",
    }

    setLead((prev) => ({
      ...prev,
      notes: [note, ...prev.notes],
    }))

    setNewNote("")
    toast({
      title: "Note Added",
      description: "Your note has been saved successfully.",
    })
  }

  const handleStageUpdate = (newStage: string) => {
    setLead((prev) => ({
      ...prev,
      stage: newStage,
    }))

    toast({
      title: "Stage Updated",
      description: `Lead stage updated to ${newStage}`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="bg-white/60 backdrop-blur-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={lead.avatar || "/placeholder.svg"} alt={lead.contactName} />
                <AvatarFallback className="text-lg">
                  {lead.contactName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {lead.contactName}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {lead.title} at {lead.companyName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>
                  <Badge className={getPriorityColor(lead.aiInsights.priority)}>
                    {lead.aiInsights.priority} Priority
                  </Badge>
                  <Badge variant="outline">Score: {lead.score}</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
              <PhoneCall className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "" : "bg-white/60 backdrop-blur-sm"}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card className="bg-white/60 backdrop-blur-sm border-white/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lead Score</p>
                  <p className="text-2xl font-bold text-green-600">{lead.score}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={lead.score} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Potential Value</p>
                  <p className="text-2xl font-bold text-blue-600">{lead.value}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Estimated deal size</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Probability</p>
                  <p className="text-2xl font-bold text-purple-600">{lead.aiInsights.probability}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">AI-powered prediction</p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Score</p>
                  <p className="text-2xl font-bold text-orange-600">{lead.aiInsights.engagementScore}/10</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on interactions</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-white/60 backdrop-blur-sm">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Lead Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Phone</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lead.phone}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Source</Label>
                        <Badge variant="outline" className="mt-1">
                          {lead.source}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Owner</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lead.owner}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Created</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lead.createdAt}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Last Activity</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Activity className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{lead.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Stage</Label>
                      {isEditing ? (
                        <Select value={lead.stage} onValueChange={handleStageUpdate}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`${getStageColor(lead.stage)} mt-1`}>{lead.stage}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      AI Quick Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50/80 rounded-lg border border-blue-200/50">
                      <h4 className="font-semibold text-blue-900 mb-2">Next Best Action</h4>
                      <p className="text-sm text-blue-800">{lead.aiInsights.nextAction}</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Buying Signals</Label>
                        <div className="mt-2 space-y-1">
                          {lead.aiInsights.buyingSignals.map((signal, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{signal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Sentiment Analysis</Label>
                        <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                          {lead.aiInsights.sentiment}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Details
                  </CardTitle>
                  <CardDescription>{lead.company.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Industry</Label>
                      <p className="text-sm mt-1">{lead.company.industry}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Size</Label>
                      <p className="text-sm mt-1">{lead.company.employees} employees</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Revenue</Label>
                      <p className="text-sm mt-1">{lead.company.revenue}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Founded</Label>
                      <p className="text-sm mt-1">{lead.company.founded}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Location</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{lead.company.location}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Website</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a
                          href={`https://${lead.company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {lead.company.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Department</Label>
                      <p className="text-sm mt-1">{lead.contact.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Reports To</Label>
                      <p className="text-sm mt-1">{lead.contact.reportingTo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Years at Company</Label>
                      <p className="text-sm mt-1">{lead.contact.yearsAtCompany} years</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">LinkedIn</Label>
                      <a
                        href={lead.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 mt-1 text-sm text-blue-600 hover:underline"
                      >
                        <Linkedin className="h-4 w-4" />
                        View Profile
                      </a>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Twitter</Label>
                      <a
                        href={lead.contact.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 mt-1 text-sm text-blue-600 hover:underline"
                      >
                        <Twitter className="h-4 w-4" />
                        View Profile
                      </a>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Previous Companies</Label>
                      <div className="mt-1 space-y-1">
                        {lead.contact.previousCompanies.map((company, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Timeline
                  </CardTitle>
                  <CardDescription>Complete history of interactions with this lead</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {lead.activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 p-4 rounded-lg bg-white/50 border border-gray-200/50"
                        >
                          <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm">{activity.title}</h4>
                              <span className="text-xs text-gray-500">{activity.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.user}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {activity.type}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes & Comments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="new-note">Add New Note</Label>
                    <Textarea
                      id="new-note"
                      placeholder="Add your notes about this lead..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="bg-white/80"
                    />
                    <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                  <Separator />
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {lead.notes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg bg-white/50 border border-gray-200/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{note.user}</span>
                            <span className="text-xs text-gray-500">{note.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{note.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents & Files
                  </CardTitle>
                  <CardDescription>Proposals, contracts, and other shared documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-white/60">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                    <Button variant="outline" className="bg-white/60">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Document
                    </Button>
                  </div>
                  <Separator />
                  <div className="grid gap-4">
                    {lead.documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/50 border border-gray-200/50 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            {doc.type === "pdf" ? (
                              <FileText className="h-5 w-5 text-blue-600" />
                            ) : (
                              <FileImage className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{doc.name}</h4>
                            <p className="text-xs text-gray-500">
                              {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>Smart suggestions to optimize your approach</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lead.aiInsights.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/80 border border-blue-200/50"
                      >
                        <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-blue-800">{rec}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      Predictive Analytics
                    </CardTitle>
                    <CardDescription>AI-powered insights and predictions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Conversion Probability</Label>
                        <span className="text-sm font-bold text-purple-600">{lead.aiInsights.probability}%</span>
                      </div>
                      <Progress value={lead.aiInsights.probability} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Engagement Score</Label>
                        <span className="text-sm font-bold text-orange-600">{lead.aiInsights.engagementScore}/10</span>
                      </div>
                      <Progress value={lead.aiInsights.engagementScore * 10} className="h-2" />
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-500 mb-3 block">Risk Assessment</Label>
                      {lead.aiInsights.riskFactors.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          No significant risk factors identified
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {lead.aiInsights.riskFactors.map((risk, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              {risk}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
