"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  Building2,
  MapPin,
  Star,
  MessageSquare,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  StickyNote,
  History,
  X,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react"

interface Contact {
  id: number
  name: string
  title: string
  company: string
  email: string
  phone: string
  location: string
  lastContact: string
  contactMethod: string
  status: "active" | "warm" | "prospect" | "inactive"
  rating: number
  avatar: string
  notes: string
  website?: string
  linkedin?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: "John Smith",
    title: "VP of Engineering",
    company: "TechCorp Inc.",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    lastContact: "2024-01-15",
    contactMethod: "Email",
    status: "active",
    rating: 5,
    avatar: "/placeholder.svg?height=32&width=32&text=JS",
    notes: "Key decision maker, very responsive",
    website: "https://techcorp.com",
    linkedin: "https://linkedin.com/in/johnsmith",
    tags: ["Decision Maker", "Technical"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "CTO",
    company: "DataFlow Solutions",
    email: "sarah.j@dataflow.com",
    phone: "+1 (555) 234-5678",
    location: "Austin, TX",
    lastContact: "2024-01-14",
    contactMethod: "Phone",
    status: "active",
    rating: 4,
    avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    notes: "Technical evaluator, prefers detailed demos",
    website: "https://dataflow.com",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    tags: ["Technical", "Evaluator"],
    createdAt: "2024-01-02",
    updatedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Mike Chen",
    title: "Product Manager",
    company: "CloudTech Ltd.",
    email: "mike.chen@cloudtech.com",
    phone: "+1 (555) 345-6789",
    location: "Seattle, WA",
    lastContact: "2024-01-13",
    contactMethod: "LinkedIn",
    status: "prospect",
    rating: 3,
    avatar: "/placeholder.svg?height=32&width=32&text=MC",
    notes: "Interested in integration capabilities",
    website: "https://cloudtech.com",
    linkedin: "https://linkedin.com/in/mikechen",
    tags: ["Product", "Integration"],
    createdAt: "2024-01-03",
    updatedAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    title: "Director of Operations",
    company: "InnovateTech Solutions",
    email: "emily.r@innovatetech.com",
    phone: "+1 (555) 456-7890",
    location: "Boston, MA",
    lastContact: "2024-01-12",
    contactMethod: "Meeting",
    status: "warm",
    rating: 4,
    avatar: "/placeholder.svg?height=32&width=32&text=ER",
    notes: "Budget owner, looking for Q2 implementation",
    website: "https://innovatetech.com",
    linkedin: "https://linkedin.com/in/emilyrodriguez",
    tags: ["Budget Owner", "Operations"],
    createdAt: "2024-01-04",
    updatedAt: "2024-01-12",
  },
]

const contactSources = [
  { name: "LinkedIn", count: 156, percentage: 40 },
  { name: "Email", count: 117, percentage: 30 },
  { name: "Phone", count: 78, percentage: 20 },
  { name: "Events", count: 39, percentage: 10 },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [sortField, setSortField] = useState<keyof Contact>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showContactSheet, setShowContactSheet] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const { toast } = useToast()

  // Form states
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    status: "prospect",
    rating: 3,
    notes: "",
    website: "",
    linkedin: "",
  })

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeEnabled) return

    const interval = setInterval(() => {
      setContacts((prev) =>
        prev.map((contact) => ({
          ...contact,
          lastContact: Math.random() > 0.95 ? new Date().toISOString().split("T")[0] : contact.lastContact,
          updatedAt: new Date().toISOString(),
        })),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [realTimeEnabled])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "warm":
        return "bg-yellow-100 text-yellow-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case "Email":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "Phone":
        return <Phone className="h-4 w-4 text-green-500" />
      case "LinkedIn":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "Meeting":
        return <Calendar className="h-4 w-4 text-orange-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} ${
          interactive ? "cursor-pointer hover:text-yellow-400" : ""
        }`}
        onClick={interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined}
      />
    ))
  }

  const handleSort = (field: keyof Contact) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const filteredContacts = sortedContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || contact.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleSelectContact = (contactId: number) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id))
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update contacts with fresh data
      setContacts((prev) =>
        prev.map((contact) => ({
          ...contact,
          updatedAt: new Date().toISOString(),
        })),
      )

      toast({
        title: "Contacts Refreshed",
        description: "Contact data has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh contact data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const contact: Contact = {
        ...(newContact as Contact),
        id: Math.max(...contacts.map((c) => c.id)) + 1,
        avatar: `/placeholder.svg?height=32&width=32&text=${newContact.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}`,
        lastContact: new Date().toISOString().split("T")[0],
        contactMethod: "Email",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      }

      setContacts((prev) => [...prev, contact])
      setShowAddDialog(false)
      setNewContact({
        name: "",
        title: "",
        company: "",
        email: "",
        phone: "",
        location: "",
        status: "prospect",
        rating: 3,
        notes: "",
        website: "",
        linkedin: "",
      })

      toast({
        title: "Contact Added",
        description: `${contact.name} has been added to your contacts.`,
      })
    } catch (error) {
      toast({
        title: "Add Contact Failed",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditContact = async () => {
    if (!selectedContact) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id ? { ...selectedContact, updatedAt: new Date().toISOString() } : contact,
        ),
      )

      setShowEditDialog(false)
      setSelectedContact(null)

      toast({
        title: "Contact Updated",
        description: `${selectedContact.name} has been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteContact = async (contactId: number) => {
    const contact = contacts.find((c) => c.id === contactId)
    if (!contact) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setContacts((prev) => prev.filter((c) => c.id !== contactId))
      setSelectedContacts((prev) => prev.filter((id) => id !== contactId))

      toast({
        title: "Contact Deleted",
        description: `${contact.name} has been removed from your contacts.`,
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCall = (contact: Contact) => {
    // Simulate making a call
    toast({
      title: "Calling...",
      description: `Initiating call to ${contact.name} at ${contact.phone}`,
    })

    // Update last contact
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id ? { ...c, lastContact: new Date().toISOString().split("T")[0], contactMethod: "Phone" } : c,
      ),
    )
  }

  const handleEmail = (contact: Contact) => {
    // Simulate opening email client
    const subject = encodeURIComponent(`Follow up - ${contact.company}`)
    const body = encodeURIComponent(
      `Hi ${contact.name.split(" ")[0]},\n\nI wanted to follow up on our previous conversation...\n\nBest regards`,
    )

    window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`)

    // Update last contact
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id ? { ...c, lastContact: new Date().toISOString().split("T")[0], contactMethod: "Email" } : c,
      ),
    )

    toast({
      title: "Email Opened",
      description: `Email client opened for ${contact.name}`,
    })
  }

  const handleScheduleMeeting = (contact: Contact) => {
    // Simulate scheduling a meeting
    toast({
      title: "Meeting Scheduled",
      description: `Meeting request sent to ${contact.name}`,
    })

    // Update last contact
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id
          ? { ...c, lastContact: new Date().toISOString().split("T")[0], contactMethod: "Meeting" }
          : c,
      ),
    )
  }

  const handleAddNote = (contact: Contact) => {
    const note = prompt(`Add a note for ${contact.name}:`)
    if (note) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id
            ? { ...c, notes: c.notes ? `${c.notes}\n\n${new Date().toLocaleDateString()}: ${note}` : note }
            : c,
        ),
      )

      toast({
        title: "Note Added",
        description: `Note added for ${contact.name}`,
      })
    }
  }

  const handleViewProfile = (contact: Contact) => {
    setSelectedContact(contact)
    setShowContactSheet(true)
  }

  const handleViewHistory = (contact: Contact) => {
    toast({
      title: "Contact History",
      description: `Viewing interaction history for ${contact.name}`,
    })
  }

  const handleBulkAction = async (action: string) => {
    if (selectedContacts.length === 0) {
      toast({
        title: "No Contacts Selected",
        description: "Please select contacts to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      switch (action) {
        case "delete":
          setContacts((prev) => prev.filter((c) => !selectedContacts.includes(c.id)))
          toast({
            title: "Contacts Deleted",
            description: `${selectedContacts.length} contacts have been deleted.`,
          })
          break
        case "export":
          const selectedData = contacts.filter((c) => selectedContacts.includes(c.id))
          const dataStr = JSON.stringify(selectedData, null, 2)
          const dataBlob = new Blob([dataStr], { type: "application/json" })
          const url = URL.createObjectURL(dataBlob)
          const link = document.createElement("a")
          link.href = url
          link.download = `contacts-${new Date().toISOString().split("T")[0]}.json`
          link.click()
          toast({
            title: "Export Complete",
            description: `${selectedContacts.length} contacts exported successfully.`,
          })
          break
        case "update-status":
          const newStatus = prompt("Enter new status (active, warm, prospect, inactive):")
          if (newStatus && ["active", "warm", "prospect", "inactive"].includes(newStatus)) {
            setContacts((prev) =>
              prev.map((c) => (selectedContacts.includes(c.id) ? { ...c, status: newStatus as Contact["status"] } : c)),
            )
            toast({
              title: "Status Updated",
              description: `${selectedContacts.length} contacts updated to ${newStatus}.`,
            })
          }
          break
      }

      setSelectedContacts([])
    } catch (error) {
      toast({
        title: "Bulk Action Failed",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportAll = () => {
    const dataStr = JSON.stringify(contacts, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `all-contacts-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    toast({
      title: "Export Complete",
      description: `All ${contacts.length} contacts exported successfully.`,
    })
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,.csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            if (Array.isArray(data)) {
              setContacts((prev) => [
                ...prev,
                ...data.map((item, index) => ({
                  ...item,
                  id: Math.max(...prev.map((c) => c.id)) + index + 1,
                })),
              ])
              toast({
                title: "Import Successful",
                description: `${data.length} contacts imported successfully.`,
              })
            }
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Invalid file format. Please check your file.",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleUpdateRating = (contactId: number, rating: number) => {
    setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, rating } : c)))

    toast({
      title: "Rating Updated",
      description: `Contact rating updated to ${rating} stars.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">People database with relationship mapping and contact history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setRealTimeEnabled(!realTimeEnabled)}>
            <div className={`mr-2 h-2 w-2 rounded-full ${realTimeEnabled ? "bg-green-500" : "bg-gray-400"}`} />
            Real-time {realTimeEnabled ? "On" : "Off"}
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>Create a new contact in your database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newContact.name || ""}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newContact.title || ""}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="VP of Engineering"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newContact.company || ""}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, company: e.target.value }))}
                      placeholder="TechCorp Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email || ""}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="john@techcorp.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newContact.phone || ""}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newContact.location || ""}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newContact.status}
                      onValueChange={(value) =>
                        setNewContact((prev) => ({ ...prev, status: value as Contact["status"] }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <div className="flex items-center gap-1 pt-2">
                      {renderStars(newContact.rating || 3, true, (rating) =>
                        setNewContact((prev) => ({ ...prev, rating })),
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newContact.website || ""}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://techcorp.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newContact.notes || ""}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Key decision maker, very responsive..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddContact} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Contact"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => (window.location.href = "/crm/contacts")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(contacts.length * 0.02)} this month</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("active")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter((c) => c.status === "active").length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((contacts.filter((c) => c.status === "active").length / contacts.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(contacts.reduce((sum, c) => sum + c.rating, 0) / contacts.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedContacts.length} contacts selected</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedContacts([])}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("update-status")}>
                  Update Status
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        {/* Contact Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactSources.map((source) => (
              <div
                key={source.name}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => toast({ title: "Filter Applied", description: `Showing contacts from ${source.name}` })}
              >
                <div className="flex items-center gap-2">
                  {getContactMethodIcon(source.name)}
                  <span className="text-sm font-medium">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{source.count}</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Contact Directory</CardTitle>
              <CardDescription>Manage your professional network and relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">
                        Contact
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("company")}>
                      <div className="flex items-center gap-1">
                        Company
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("lastContact")}>
                      <div className="flex items-center gap-1">
                        Last Contact
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("rating")}>
                      <div className="flex items-center gap-1">
                        Rating
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectContact(contact.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                            <AvatarFallback>
                              {contact.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className="font-medium cursor-pointer hover:text-blue-600"
                              onClick={() => handleViewProfile(contact)}
                            >
                              {contact.name}
                            </div>
                            <div className="text-sm text-muted-foreground">{contact.title}</div>
                            <div className="text-xs text-muted-foreground">{contact.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => contact.website && window.open(contact.website, "_blank")}
                          >
                            {contact.company}
                          </span>
                          {contact.website && <ExternalLink className="h-3 w-3 text-muted-foreground ml-1" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {contact.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{contact.lastContact}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getContactMethodIcon(contact.contactMethod)}
                          <span className="text-sm">{contact.contactMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(contact.rating, true, (rating) => handleUpdateRating(contact.id, rating))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleCall(contact)} title="Call">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEmail(contact)} title="Email">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(contact)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScheduleMeeting(contact)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddNote(contact)}>
                                <StickyNote className="mr-2 h-4 w-4" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewHistory(contact)}>
                                <History className="mr-2 h-4 w-4" />
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedContact(contact)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Contact
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteContact(contact.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredContacts.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No contacts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || selectedStatus !== "all"
                      ? "Try adjusting your search or filters."
                      : "Get started by adding your first contact."}
                  </p>
                  {!searchTerm && selectedStatus === "all" && (
                    <div className="mt-6">
                      <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Contact
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Detail Sheet */}
      <Sheet open={showContactSheet} onOpenChange={setShowContactSheet}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          {selectedContact && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} alt={selectedContact.name} />
                    <AvatarFallback className="text-lg">
                      {selectedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">{selectedContact.name}</SheetTitle>
                    <SheetDescription className="text-base">
                      {selectedContact.title} at {selectedContact.company}
                    </SheetDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(selectedContact.status)}>{selectedContact.status}</Badge>
                      <div className="flex items-center gap-1">{renderStars(selectedContact.rating)}</div>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedContact.email}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleEmail(selectedContact)}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedContact.phone}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCall(selectedContact)}>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedContact.location}</span>
                    </div>
                    {selectedContact.website && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span
                          className="text-sm cursor-pointer hover:text-blue-600"
                          onClick={() => window.open(selectedContact.website, "_blank")}
                        >
                          {selectedContact.website}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    {selectedContact.linkedin && (
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span
                          className="text-sm cursor-pointer hover:text-blue-600"
                          onClick={() => window.open(selectedContact.linkedin, "_blank")}
                        >
                          LinkedIn Profile
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.notes || "No notes available."}</p>
                  </div>
                </div>

                {/* Tags */}
                {selectedContact.tags && selectedContact.tags.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      {getContactMethodIcon(selectedContact.contactMethod)}
                      <span>
                        Last contacted via {selectedContact.contactMethod.toLowerCase()} on{" "}
                        {selectedContact.lastContact}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created on {new Date(selectedContact.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Edit className="h-4 w-4" />
                      <span>Last updated on {new Date(selectedContact.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={() => handleCall(selectedContact)} className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button onClick={() => handleEmail(selectedContact)} className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button onClick={() => handleScheduleMeeting(selectedContact)} className="flex-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Meeting
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowContactSheet(false)
                      setShowEditDialog(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact information.</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedContact.name}
                    onChange={(e) => setSelectedContact((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedContact.title}
                    onChange={(e) => setSelectedContact((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={selectedContact.company}
                    onChange={(e) => setSelectedContact((prev) => (prev ? { ...prev, company: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedContact.email}
                    onChange={(e) => setSelectedContact((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedContact.phone}
                    onChange={(e) => setSelectedContact((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={selectedContact.location}
                    onChange={(e) =>
                      setSelectedContact((prev) => (prev ? { ...prev, location: e.target.value } : null))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedContact.status}
                    onValueChange={(value) =>
                      setSelectedContact((prev) => (prev ? { ...prev, status: value as Contact["status"] } : null))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rating">Rating</Label>
                  <div className="flex items-center gap-1 pt-2">
                    {renderStars(selectedContact.rating, true, (rating) =>
                      setSelectedContact((prev) => (prev ? { ...prev, rating } : null)),
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  value={selectedContact.website || ""}
                  onChange={(e) => setSelectedContact((prev) => (prev ? { ...prev, website: e.target.value } : null))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedContact.notes}
                  onChange={(e) => setSelectedContact((prev) => (prev ? { ...prev, notes: e.target.value } : null))}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditContact} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
