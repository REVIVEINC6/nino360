"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HelpCircle,
  Plus,
  Search,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  FileText,
  Zap,
  TrendingUp,
  Users,
  Calendar,
  Send,
  Paperclip,
  Star,
  Eye,
} from "lucide-react"

interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  submittedBy: {
    name: string
    email: string
    avatar?: string
    department: string
  }
  assignedTo?: {
    name: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
  responses: number
  tags: string[]
}

const mockTickets: Ticket[] = [
  {
    id: "HD-001",
    title: "Unable to access payroll system",
    description:
      "I'm getting an error when trying to log into the payroll system. The page keeps loading but never opens.",
    status: "open",
    priority: "high",
    category: "Technical Support",
    submittedBy: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
      department: "Finance",
    },
    assignedTo: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    responses: 3,
    tags: ["payroll", "login", "urgent"],
  },
  {
    id: "HD-002",
    title: "Request for additional vacation days",
    description:
      "I would like to request 2 additional vacation days for a family emergency. Please let me know the process.",
    status: "in-progress",
    priority: "medium",
    category: "HR Request",
    submittedBy: {
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Engineering",
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    responses: 1,
    tags: ["vacation", "emergency", "hr"],
  },
  {
    id: "HD-003",
    title: "New employee onboarding checklist",
    description:
      "Can someone provide me with the complete onboarding checklist for new hires? I need it for next week's orientation.",
    status: "resolved",
    priority: "low",
    category: "Information Request",
    submittedBy: {
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "HR",
    },
    assignedTo: {
      name: "Lisa Wong",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    responses: 2,
    tags: ["onboarding", "checklist", "orientation"],
  },
  {
    id: "HD-004",
    title: "Benefits enrollment deadline extension",
    description:
      "I missed the benefits enrollment deadline due to being on medical leave. Can this be extended for my case?",
    status: "open",
    priority: "urgent",
    category: "Benefits",
    submittedBy: {
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      department: "Operations",
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    responses: 0,
    tags: ["benefits", "deadline", "medical-leave"],
  },
]

export default function HelpDeskPage() {
  const [tickets, setTickets] = useState(mockTickets)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newTicketTitle, setNewTicketTitle] = useState("")
  const [newTicketDescription, setNewTicketDescription] = useState("")
  const [newTicketCategory, setNewTicketCategory] = useState("")
  const [newTicketPriority, setNewTicketPriority] = useState("medium")

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "in-progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "urgent":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const handleCreateTicket = () => {
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) return

    const newTicket: Ticket = {
      id: `HD-${String(tickets.length + 1).padStart(3, "0")}`,
      title: newTicketTitle,
      description: newTicketDescription,
      status: "open",
      priority: newTicketPriority as Ticket["priority"],
      category: newTicketCategory || "General",
      submittedBy: {
        name: "Current User",
        email: "user@company.com",
        department: "Your Department",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: 0,
      tags: [],
    }

    setTickets([newTicket, ...tickets])
    setNewTicketTitle("")
    setNewTicketDescription("")
    setNewTicketCategory("")
    setNewTicketPriority("medium")
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    avgResponseTime: "2.5 hours",
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help Desk</h1>
          <p className="text-muted-foreground">Employee support and ticketing system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Knowledge Base
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">Response time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">All Tickets</TabsTrigger>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {ticket.id}
                        </Badge>
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(ticket.status)}`} />
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority.toUpperCase()}</Badge>
                        <Badge variant="secondary">{ticket.category}</Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <p className="text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.submittedBy.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {ticket.submittedBy.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{ticket.submittedBy.name}</span>
                          <span>•</span>
                          <span>{ticket.submittedBy.department}</span>
                        </div>

                        {ticket.assignedTo && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Assigned to {ticket.assignedTo.name}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.responses} responses</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Updated {formatTimeAgo(ticket.updatedAt)}</span>
                        </div>
                      </div>

                      {ticket.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {ticket.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Ticket</CardTitle>
              <CardDescription>Submit a new support request or inquiry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newTicketCategory} onValueChange={setNewTicketCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical Support">Technical Support</SelectItem>
                      <SelectItem value="HR Request">HR Request</SelectItem>
                      <SelectItem value="Benefits">Benefits</SelectItem>
                      <SelectItem value="Information Request">Information Request</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Access Request">Access Request</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newTicketPriority} onValueChange={setNewTicketPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Provide detailed information about your request or issue"
                  value={newTicketDescription}
                  onChange={(e) => setNewTicketDescription(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach Files
                </Button>
                <span className="text-sm text-muted-foreground">
                  You can attach screenshots, documents, or other relevant files
                </span>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleCreateTicket}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Find answers to common questions and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Search Knowledge Base */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search knowledge base..." className="pl-9" />
                </div>

                {/* Popular Articles */}
                <div>
                  <h3 className="font-semibold mb-3">Popular Articles</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <h4 className="font-medium">How to reset your password</h4>
                        <p className="text-sm text-muted-foreground">Step-by-step guide to password recovery</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>1.2k views</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <h4 className="font-medium">Submitting time-off requests</h4>
                        <p className="text-sm text-muted-foreground">How to request vacation and sick leave</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>856 views</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <h4 className="font-medium">Benefits enrollment guide</h4>
                        <p className="text-sm text-muted-foreground">Complete guide to selecting your benefits</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>743 views</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <h4 className="font-medium">Accessing payroll information</h4>
                        <p className="text-sm text-muted-foreground">View pay stubs and tax documents</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>621 views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Browse by Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">HR Policies</h4>
                      <p className="text-sm text-muted-foreground">23 articles</p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">IT Support</h4>
                      <p className="text-sm text-muted-foreground">18 articles</p>
                    </div>

                    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">Time & Attendance</h4>
                      <p className="text-sm text-muted-foreground">15 articles</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
