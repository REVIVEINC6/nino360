"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Target,
  Sparkles,
  Bot,
  Plus,
  X,
  Globe,
  Linkedin,
  Twitter,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Users,
  Eye,
  ExternalLink,
  ChevronRight,
  Brain,
} from "lucide-react"

interface LeadFormData {
  // Contact Information
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string

  // Company Information
  companyName: string
  companyWebsite: string
  companySize: string
  industry: string
  companyAddress: string

  // Lead Details
  leadSource: string
  leadStatus: string
  priority: string
  estimatedValue: string
  expectedCloseDate: string

  // Additional Information
  notes: string
  tags: string[]
  socialProfiles: {
    linkedin: string
    twitter: string
  }
}

const initialFormData: LeadFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  companyName: "",
  companyWebsite: "",
  companySize: "",
  industry: "",
  companyAddress: "",
  leadSource: "",
  leadStatus: "new",
  priority: "medium",
  estimatedValue: "",
  expectedCloseDate: "",
  notes: "",
  tags: [],
  socialProfiles: {
    linkedin: "",
    twitter: "",
  },
}

const leadSources = [
  "Website",
  "Social Media",
  "Email Campaign",
  "Cold Outreach",
  "Referral",
  "Trade Show",
  "Webinar",
  "Content Marketing",
  "Paid Advertising",
  "Partner",
  "Other",
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Real Estate",
  "Consulting",
  "Marketing",
  "Legal",
  "Non-profit",
  "Government",
  "Other",
]

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
]

const priorities = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
]

const leadStatuses = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contacted", color: "bg-purple-100 text-purple-800" },
  { value: "qualified", label: "Qualified", color: "bg-green-100 text-green-800" },
  { value: "proposal", label: "Proposal", color: "bg-orange-100 text-orange-800" },
  { value: "negotiation", label: "Negotiation", color: "bg-red-100 text-red-800" },
  { value: "closed-won", label: "Closed Won", color: "bg-emerald-100 text-emerald-800" },
  { value: "closed-lost", label: "Closed Lost", color: "bg-gray-100 text-gray-800" },
]

const suggestedTags = [
  "Enterprise",
  "SMB",
  "Decision Maker",
  "Influencer",
  "High Value",
  "Quick Win",
  "Long Term",
  "Competitor",
  "Warm Lead",
  "Cold Lead",
  "Referral",
  "Inbound",
  "Outbound",
]

const aiInsights = [
  {
    type: "company",
    title: "Company Analysis",
    description: "AI-powered company insights and recommendations",
    suggestions: [
      "Company shows strong growth indicators",
      "Recent funding round suggests expansion plans",
      "Technology stack aligns with our solutions",
    ],
  },
  {
    type: "contact",
    title: "Contact Intelligence",
    description: "Social media and professional background analysis",
    suggestions: [
      "Active on LinkedIn with industry engagement",
      "Previously worked at companies using similar solutions",
      "Likely decision maker based on role and tenure",
    ],
  },
  {
    type: "timing",
    title: "Timing Analysis",
    description: "Best time to reach out and follow up",
    suggestions: [
      "Best contact time: Tuesday-Thursday 2-4 PM",
      "Company fiscal year ends in Q4",
      "Recent job posting suggests immediate need",
    ],
  },
]

const recentLeads = [
  {
    id: "L001",
    name: "Sarah Johnson",
    company: "TechCorp Solutions",
    status: "qualified",
    value: "$450,000",
    created: "2 hours ago",
  },
  {
    id: "L002",
    name: "Michael Chen",
    company: "DataFlow Inc",
    status: "contacted",
    value: "$280,000",
    created: "5 hours ago",
  },
  {
    id: "L003",
    name: "Lisa Rodriguez",
    company: "CloudTech Ltd",
    status: "new",
    value: "$125,000",
    created: "1 day ago",
  },
]

export default function NewLeadPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LeadFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [showAiInsights, setShowAiInsights] = useState(false)
  const [showRecentLeads, setShowRecentLeads] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [formProgress, setFormProgress] = useState(0)
  const [duplicateCheck, setDuplicateCheck] = useState<any>(null)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty) return

    const autoSaveTimer = setTimeout(() => {
      handleSaveAsDraft()
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer)
  }, [formData, isDirty, autoSaveEnabled])

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ["firstName", "lastName", "email", "companyName", "leadSource"]
    const optionalFields = ["phone", "jobTitle", "companyWebsite", "industry", "estimatedValue"]

    const completedRequired = requiredFields.filter((field) => formData[field as keyof LeadFormData]).length
    const completedOptional = optionalFields.filter((field) => formData[field as keyof LeadFormData]).length

    const progress = (completedRequired / requiredFields.length) * 70 + (completedOptional / optionalFields.length) * 30
    setFormProgress(Math.round(progress))
  }, [formData])

  // Handle form field changes
  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsDirty(true)

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Trigger duplicate check for email
    if (field === "email" && value) {
      checkForDuplicates(value)
    }
  }

  // Handle nested object changes
  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent] as Record<string, any>),
        [field]: value,
      },
    }))
    setIsDirty(true)
  }

  // Handle tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
      setIsDirty(true)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
    setIsDirty(true)
  }

  const addSuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setIsDirty(true)
    }
  }

  // AI suggestions based on company name
  const generateAiSuggestions = async () => {
    if (!formData.companyName) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name to get AI suggestions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setShowAiSuggestions(true)

    try {
      // Simulate AI API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const suggestions = [
        `${formData.companyName} is likely in the ${industries[Math.floor(Math.random() * industries.length)]} industry`,
        `Estimated company size: ${companySizes[Math.floor(Math.random() * companySizes.length)]}`,
        `Recommended priority: High (based on company profile)`,
        `Suggested tags: Enterprise, Decision Maker, High Value`,
        `Best contact time: Tuesday-Thursday 2-4 PM`,
        `Recent company news suggests expansion plans`,
      ]
      setAiSuggestions(suggestions)

      // Auto-fill some fields based on AI suggestions
      if (!formData.industry) {
        const suggestedIndustry = industries[Math.floor(Math.random() * industries.length)]
        setFormData((prev) => ({ ...prev, industry: suggestedIndustry }))
      }

      if (!formData.companySize) {
        const suggestedSize = companySizes[Math.floor(Math.random() * companySizes.length)]
        setFormData((prev) => ({ ...prev, companySize: suggestedSize }))
      }

      toast({
        title: "AI Analysis Complete",
        description: "Smart suggestions have been generated for your lead.",
      })
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: "Unable to generate suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Check for duplicate leads
  const checkForDuplicates = async (email: string) => {
    if (!email || !email.includes("@")) return

    try {
      // Simulate API call to check duplicates
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate finding a duplicate (20% chance)
      if (Math.random() < 0.2) {
        const duplicate = {
          id: "L001",
          name: "John Doe",
          company: "Existing Corp",
          email: email,
          status: "contacted",
          created: "2 days ago",
        }
        setDuplicateCheck(duplicate)
        setShowDuplicateDialog(true)
      }
    } catch (error) {
      console.error("Duplicate check failed:", error)
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    const requiredFields = ["firstName", "lastName", "email", "companyName", "leadSource"]

    for (const field of requiredFields) {
      if (!formData[field as keyof LeadFormData]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Phone validation (if provided)
    if (formData.phone && formData.phone.length < 10) {
      errors.phone = "Please enter a valid phone number"
    }

    // Website validation (if provided)
    if (formData.companyWebsite && !formData.companyWebsite.includes(".")) {
      errors.companyWebsite = "Please enter a valid website URL"
    }

    // Value validation (if provided)
    if (formData.estimatedValue && isNaN(Number(formData.estimatedValue))) {
      errors.estimatedValue = "Please enter a valid number"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create lead ID
      const leadId = `L${Date.now().toString().slice(-6)}`

      toast({
        title: "Lead Created Successfully!",
        description: `${formData.firstName} ${formData.lastName} from ${formData.companyName} has been added to your pipeline.`,
      })

      // Clear form
      setFormData(initialFormData)
      setIsDirty(false)
      setLastSaved(new Date())

      // Navigate back to CRM dashboard
      router.push("/crm/leads")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle save as draft
  const handleSaveAsDraft = async () => {
    setIsSaving(true)

    try {
      // Simulate saving draft
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setLastSaved(new Date())
      setIsDirty(false)

      toast({
        title: "Draft Saved",
        description: "Lead information has been saved as draft.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle template loading
  const loadTemplate = (templateName: string) => {
    const templates = {
      "Enterprise Lead": {
        ...initialFormData,
        companySize: "1000+ employees",
        priority: "high",
        estimatedValue: "500000",
        tags: ["Enterprise", "High Value", "Decision Maker"],
      },
      "SMB Lead": {
        ...initialFormData,
        companySize: "11-50 employees",
        priority: "medium",
        estimatedValue: "50000",
        tags: ["SMB", "Quick Win"],
      },
      "Startup Lead": {
        ...initialFormData,
        companySize: "1-10 employees",
        priority: "low",
        estimatedValue: "25000",
        tags: ["Startup", "Long Term"],
      },
    }

    const template = templates[templateName as keyof typeof templates]
    if (template) {
      setFormData(template)
      setIsDirty(true)
      setShowTemplates(false)
      toast({
        title: "Template Loaded",
        description: `${templateName} template has been applied.`,
      })
    }
  }

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    if (fileExtension === "csv") {
      handleCSVImport(file)
    } else if (fileExtension === "xlsx") {
      handleXLSXImport(file)
    } else {
      toast({
        title: "Invalid File Format",
        description: "Please upload a CSV or XLSX file.",
        variant: "destructive",
      })
    }
  }

  // Handle CSV import
  const handleCSVImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        if (lines.length < 2) {
          throw new Error("CSV file must contain at least one data row")
        }

        const firstDataRow = lines[1].split(",").map((cell) => cell.trim().replace(/"/g, ""))
        const importedData: Partial<LeadFormData> = {}

        // Map CSV columns to form fields
        headers.forEach((header, index) => {
          const value = firstDataRow[index] || ""
          const normalizedHeader = header.toLowerCase().replace(/\s+/g, "")

          switch (normalizedHeader) {
            case "firstname":
            case "first_name":
              importedData.firstName = value
              break
            case "lastname":
            case "last_name":
              importedData.lastName = value
              break
            case "email":
            case "emailaddress":
            case "email_address":
              importedData.email = value
              break
            case "phone":
            case "phonenumber":
            case "phone_number":
              importedData.phone = value
              break
            case "jobtitle":
            case "job_title":
            case "title":
              importedData.jobTitle = value
              break
            case "company":
            case "companyname":
            case "company_name":
              importedData.companyName = value
              break
            case "website":
            case "companywebsite":
            case "company_website":
              importedData.companyWebsite = value
              break
            case "industry":
              if (industries.includes(value)) {
                importedData.industry = value
              }
              break
            case "companysize":
            case "company_size":
              if (companySizes.includes(value)) {
                importedData.companySize = value
              }
              break
            case "address":
            case "companyaddress":
            case "company_address":
              importedData.companyAddress = value
              break
            case "source":
            case "leadsource":
            case "lead_source":
              if (leadSources.includes(value)) {
                importedData.leadSource = value
              }
              break
            case "status":
            case "leadstatus":
            case "lead_status":
              const statusValue = leadStatuses.find((s) => s.label.toLowerCase() === value.toLowerCase())?.value
              if (statusValue) {
                importedData.leadStatus = statusValue
              }
              break
            case "priority":
              const priorityValue = priorities.find((p) => p.label.toLowerCase() === value.toLowerCase())?.value
              if (priorityValue) {
                importedData.priority = priorityValue
              }
              break
            case "value":
            case "estimatedvalue":
            case "estimated_value":
              if (!isNaN(Number(value))) {
                importedData.estimatedValue = value
              }
              break
            case "closedate":
            case "expectedclosedate":
            case "expected_close_date":
              // Try to parse date in various formats
              const date = new Date(value)
              if (!isNaN(date.getTime())) {
                importedData.expectedCloseDate = date.toISOString().split("T")[0]
              }
              break
            case "notes":
            case "description":
              importedData.notes = value
              break
            case "linkedin":
              if (!importedData.socialProfiles) importedData.socialProfiles = { linkedin: "", twitter: "" }
              importedData.socialProfiles.linkedin = value
              break
            case "twitter":
              if (!importedData.socialProfiles) importedData.socialProfiles = { linkedin: "", twitter: "" }
              importedData.socialProfiles.twitter = value
              break
            case "tags":
              if (value) {
                importedData.tags = value
                  .split(";")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag)
              }
              break
          }
        })

        // Validate required fields
        if (!importedData.firstName || !importedData.lastName || !importedData.email || !importedData.companyName) {
          throw new Error("CSV must contain at least: First Name, Last Name, Email, and Company Name")
        }

        setFormData({ ...initialFormData, ...importedData })
        setIsDirty(true)
        setShowImportDialog(false)

        toast({
          title: "CSV Data Imported",
          description: `Lead data for ${importedData.firstName} ${importedData.lastName} has been imported successfully.`,
        })
      } catch (error) {
        toast({
          title: "CSV Import Error",
          description: error instanceof Error ? error.message : "Invalid CSV format. Please check your data.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // Handle XLSX import
  const handleXLSXImport = async (file: File) => {
    try {
      // For XLSX files, we'll simulate the parsing since we can't import xlsx library in this environment
      // In a real implementation, you would use a library like 'xlsx' or 'exceljs'

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          // Simulate XLSX parsing - in reality you'd use: XLSX.read(e.target.result, {type: 'binary'})
          // For demo purposes, we'll create sample data
          const simulatedData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1-555-0123",
            jobTitle: "Sales Director",
            companyName: "Example Corp",
            companyWebsite: "https://example.com",
            industry: "Technology",
            companySize: "201-500 employees",
            companyAddress: "123 Business St, City, State 12345",
            leadSource: "Website",
            leadStatus: "new",
            priority: "high",
            estimatedValue: "75000",
            expectedCloseDate: new Date().toISOString().split("T")[0],
            notes: "Imported from XLSX file",
            tags: ["Enterprise", "High Value"],
            socialProfiles: {
              linkedin: "https://linkedin.com/in/johndoe",
              twitter: "https://twitter.com/johndoe",
            },
          }

          setFormData({ ...initialFormData, ...simulatedData })
          setIsDirty(true)
          setShowImportDialog(false)

          toast({
            title: "XLSX Data Imported",
            description: `Lead data has been imported from Excel file successfully.`,
          })
        } catch (error) {
          toast({
            title: "XLSX Import Error",
            description: "Failed to parse Excel file. Please ensure it's a valid XLSX format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (error) {
      toast({
        title: "XLSX Import Error",
        description: "Failed to read Excel file. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle export
  const handleExport = (format: "csv" | "xlsx" = "csv") => {
    if (format === "csv") {
      exportToCSV()
    } else {
      exportToXLSX()
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Job Title",
      "Company Name",
      "Company Website",
      "Industry",
      "Company Size",
      "Company Address",
      "Lead Source",
      "Lead Status",
      "Priority",
      "Estimated Value",
      "Expected Close Date",
      "Notes",
      "LinkedIn",
      "Twitter",
      "Tags",
    ]

    const statusLabel = leadStatuses.find((s) => s.value === formData.leadStatus)?.label || formData.leadStatus
    const priorityLabel = priorities.find((p) => p.value === formData.priority)?.label || formData.priority

    const row = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.jobTitle,
      formData.companyName,
      formData.companyWebsite,
      formData.industry,
      formData.companySize,
      formData.companyAddress,
      formData.leadSource,
      statusLabel,
      priorityLabel,
      formData.estimatedValue,
      formData.expectedCloseDate,
      formData.notes,
      formData.socialProfiles.linkedin,
      formData.socialProfiles.twitter,
      formData.tags.join(";"),
    ]

    const csvContent = [
      headers.map((header) => `"${header}"`).join(","),
      row.map((field) => `"${field || ""}"`).join(","),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `lead-draft-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "CSV Exported",
      description: "Lead draft has been exported as CSV file.",
    })
  }

  // Export to XLSX (simulated)
  const exportToXLSX = () => {
    // In a real implementation, you would use a library like 'xlsx' to create proper XLSX files
    // For now, we'll create a CSV and suggest the user can open it in Excel
    exportToCSV()

    toast({
      title: "Excel Export",
      description: "CSV file exported. You can open this file in Excel and save as XLSX format.",
    })
  }

  // Handle clear form
  const handleClearForm = () => {
    if (isDirty) {
      if (confirm("Are you sure you want to clear all form data? Unsaved changes will be lost.")) {
        setFormData(initialFormData)
        setIsDirty(false)
        setValidationErrors({})
        toast({
          title: "Form Cleared",
          description: "All form data has been cleared.",
        })
      }
    } else {
      setFormData(initialFormData)
      setValidationErrors({})
    }
  }

  // Handle navigation with unsaved changes
  const handleNavigation = (path: string) => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Do you want to save before leaving?")) {
        handleSaveAsDraft().then(() => {
          router.push(path)
        })
      } else if (confirm("Are you sure you want to leave without saving?")) {
        router.push(path)
      }
    } else {
      router.push(path)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation("/crm/leads")}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <motion.h1
                className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Create New Lead
              </motion.h1>
              <motion.div
                className="flex items-center gap-4 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-muted-foreground">Add a new prospect to your sales pipeline</p>
                <div className="flex items-center gap-2">
                  <Progress value={formProgress} className="w-20 h-2" />
                  <span className="text-xs text-muted-foreground">{formProgress}%</span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastSaved && (
              <div className="text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
            >
              <Clock className={`mr-2 h-4 w-4 ${autoSaveEnabled ? "text-green-500" : "text-gray-400"}`} />
              Auto-save {autoSaveEnabled ? "On" : "Off"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowTemplates(true)}
              className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
            >
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isSaving || !isDirty}
              className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
            >
              {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Draft
            </Button>

            <Button
              onClick={generateAiSuggestions}
              variant="outline"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 hover:from-purple-500/20 hover:to-blue-500/20"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              AI Assist
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>Personal details of the lead</CardDescription>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowImportDialog(true)}
                      className="bg-white/50"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter first name"
                        className={`bg-white/50 border-white/20 ${validationErrors.firstName ? "border-red-500" : ""}`}
                      />
                      {validationErrors.firstName && (
                        <p className="text-sm text-red-500">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter last name"
                        className={`bg-white/50 border-white/20 ${validationErrors.lastName ? "border-red-500" : ""}`}
                      />
                      {validationErrors.lastName && <p className="text-sm text-red-500">{validationErrors.lastName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter email address"
                          className={`pl-10 bg-white/50 border-white/20 ${validationErrors.email ? "border-red-500" : ""}`}
                        />
                      </div>
                      {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter phone number"
                          className={`pl-10 bg-white/50 border-white/20 ${validationErrors.phone ? "border-red-500" : ""}`}
                        />
                      </div>
                      {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                        placeholder="Enter job title"
                        className="bg-white/50 border-white/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Company Information</CardTitle>
                        <CardDescription>Details about the lead's organization</CardDescription>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAiInsights(true)}
                      className="bg-white/50"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      AI Insights
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Enter company name"
                        className={`bg-white/50 border-white/20 ${validationErrors.companyName ? "border-red-500" : ""}`}
                      />
                      {validationErrors.companyName && (
                        <p className="text-sm text-red-500">{validationErrors.companyName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyWebsite"
                          value={formData.companyWebsite}
                          onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                          placeholder="https://company.com"
                          className={`pl-10 bg-white/50 border-white/20 ${validationErrors.companyWebsite ? "border-red-500" : ""}`}
                        />
                      </div>
                      {validationErrors.companyWebsite && (
                        <p className="text-sm text-red-500">{validationErrors.companyWebsite}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) => handleInputChange("companySize", value)}
                      >
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="companyAddress">Company Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyAddress"
                          value={formData.companyAddress}
                          onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                          placeholder="Enter company address"
                          className="pl-10 bg-white/50 border-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lead Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Lead Details</CardTitle>
                        <CardDescription>Sales pipeline and opportunity information</CardDescription>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRecentLeads(true)}
                      className="bg-white/50"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Recent Leads
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="leadSource">Lead Source *</Label>
                      <Select
                        value={formData.leadSource}
                        onValueChange={(value) => handleInputChange("leadSource", value)}
                      >
                        <SelectTrigger
                          className={`bg-white/50 border-white/20 ${validationErrors.leadSource ? "border-red-500" : ""}`}
                        >
                          <SelectValue placeholder="Select lead source" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadSources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors.leadSource && (
                        <p className="text-sm text-red-500">{validationErrors.leadSource}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadStatus">Lead Status</Label>
                      <Select
                        value={formData.leadStatus}
                        onValueChange={(value) => handleInputChange("leadStatus", value)}
                      >
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select lead status" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <Badge className={status.color}>{status.label}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center gap-2">
                                <Badge className={priority.color}>{priority.label}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedValue">Estimated Value</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="estimatedValue"
                          type="number"
                          value={formData.estimatedValue}
                          onChange={(e) => handleInputChange("estimatedValue", e.target.value)}
                          placeholder="Enter estimated value"
                          className={`pl-10 bg-white/50 border-white/20 ${validationErrors.estimatedValue ? "border-red-500" : ""}`}
                        />
                      </div>
                      {validationErrors.estimatedValue && (
                        <p className="text-sm text-red-500">{validationErrors.estimatedValue}</p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="expectedCloseDate"
                          type="date"
                          value={formData.expectedCloseDate}
                          onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                          className="pl-10 bg-white/50 border-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Social Profiles</CardTitle>
                  <CardDescription>Connect with the lead on social platforms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn Profile</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          value={formData.socialProfiles.linkedin}
                          onChange={(e) => handleNestedChange("socialProfiles", "linkedin", e.target.value)}
                          placeholder="LinkedIn profile URL"
                          className="pl-10 bg-white/50 border-white/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter Profile</Label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="twitter"
                          value={formData.socialProfiles.twitter}
                          onChange={(e) => handleNestedChange("socialProfiles", "twitter", e.target.value)}
                          placeholder="Twitter profile URL"
                          className="pl-10 bg-white/50 border-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tags and Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Additional Information</CardTitle>
                      <CardDescription>Tags and notes for better organization</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport("csv")}
                          className="bg-white/50"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export CSV
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearForm}
                        className="bg-white/50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tags */}
                  <div className="space-y-3">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="bg-white/50 border-white/20"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Suggested Tags */}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Suggested Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter((tag) => !formData.tags.includes(tag))
                          .slice(0, 8)
                          .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addSuggestedTag(tag)}
                              className="h-7 text-xs bg-white/50"
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Add any additional notes about this lead..."
                      rows={4}
                      className="bg-white/50 border-white/20"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Suggestions */}
            {showAiSuggestions && aiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-xl rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-purple-800">AI Suggestions</CardTitle>
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAiSuggestions(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>AI-powered insights based on the provided information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {aiSuggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 bg-white/60 rounded-lg border border-purple-200/50 text-sm">
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-end gap-4 pt-6"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => handleNavigation("/crm/leads")}
                className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Lead
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </div>

      {/* Templates Sheet */}
      <Sheet open={showTemplates} onOpenChange={setShowTemplates}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Lead Templates</SheetTitle>
            <SheetDescription>Choose from pre-configured lead templates to speed up data entry</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {["Enterprise Lead", "SMB Lead", "Startup Lead"].map((template) => (
              <Card
                key={template}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => loadTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{template}</CardTitle>
                  <CardDescription>
                    {template === "Enterprise Lead" && "Large company with high-value potential"}
                    {template === "SMB Lead" && "Small to medium business opportunity"}
                    {template === "Startup Lead" && "Early-stage company with growth potential"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {template === "Enterprise Lead" && (
                        <>
                          <Badge variant="outline">High Value</Badge>
                          <Badge variant="outline">Enterprise</Badge>
                        </>
                      )}
                      {template === "SMB Lead" && (
                        <>
                          <Badge variant="outline">SMB</Badge>
                          <Badge variant="outline">Quick Win</Badge>
                        </>
                      )}
                      {template === "Startup Lead" && (
                        <>
                          <Badge variant="outline">Startup</Badge>
                          <Badge variant="outline">Long Term</Badge>
                        </>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* AI Insights Sheet */}
      <Sheet open={showAiInsights} onOpenChange={setShowAiInsights}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              AI Company Insights
            </SheetTitle>
            <SheetDescription>AI-powered analysis and recommendations for your lead</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {insight.type === "company" && <Building2 className="h-5 w-5" />}
                    {insight.type === "contact" && <User className="h-5 w-5" />}
                    {insight.type === "timing" && <Clock className="h-5 w-5" />}
                    {insight.title}
                  </CardTitle>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {insight.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Recent Leads Sheet */}
      <Sheet open={showRecentLeads} onOpenChange={setShowRecentLeads}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Recent Leads</SheetTitle>
            <SheetDescription>View recently created leads for reference</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {recentLeads.map((lead) => (
              <Card
                key={lead.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/crm/leads/${lead.id}`)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{lead.status}</Badge>
                        <span className="text-sm font-medium">{lead.value}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{lead.created}</p>
                      <ExternalLink className="h-4 w-4 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Lead Data</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file with lead information to auto-fill the form.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">Click to upload or drag and drop</span>
                  <span className="mt-1 block text-xs text-gray-500">CSV or XLSX files only</span>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="sr-only"
                  onChange={handleImport}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Expected CSV Format:</h4>
              <div className="text-xs text-blue-800 space-y-1">
                <p>
                  <strong>Required columns:</strong> First Name, Last Name, Email, Company Name
                </p>
                <p>
                  <strong>Optional columns:</strong> Phone, Job Title, Website, Industry, Company Size, Address, Lead
                  Source, Status, Priority, Estimated Value, Expected Close Date, Notes, LinkedIn, Twitter, Tags
                </p>
                <p>
                  <strong>Tags format:</strong> Separate multiple tags with semicolons (;)
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Duplicate Check Dialog */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Potential Duplicate Found
            </DialogTitle>
            <DialogDescription>
              We found a similar lead in your database. Would you like to review it before creating a new one?
            </DialogDescription>
          </DialogHeader>
          {duplicateCheck && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{duplicateCheck.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Company:</span>
                      <span>{duplicateCheck.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{duplicateCheck.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant="outline">{duplicateCheck.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Created:</span>
                      <span>{duplicateCheck.created}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>
                  Continue Creating
                </Button>
                <Button onClick={() => router.push(`/crm/leads/${duplicateCheck.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Existing Lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
